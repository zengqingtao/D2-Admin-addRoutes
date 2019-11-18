<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-input v-model="listQuery.search" style="width: 180px;margin-left: 10px;" placeholder="输入名称搜索" clearable></el-input>
      <el-select v-model="listQuery.status">
        <el-option label="全部审核状态" value=""></el-option>
        <el-option label="未审核" value="pending"></el-option>
        <el-option label="审核中" value="audit"></el-option>
        <el-option label="审核通过" value="success"></el-option>
        <el-option label="审核失败" value="fail"></el-option>
      </el-select>
      <el-select v-model="listQuery.authentication">
        <el-option label="全部认证状态" value=""></el-option>
        <el-option label="未认证" value="pending"></el-option>
        <el-option label="认证中" value="audit"></el-option>
        <el-option label="认证通过" value="success"></el-option>
        <el-option label="认证失败" value="fail"></el-option>
      </el-select>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="full_name" label="姓名"></el-table-column>
      <el-table-column align="center" prop="job_title" label="职称"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
      <el-table-column align="center" prop="hospital_name" label="医院科室"></el-table-column>
      <el-table-column align="center" prop="status" label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'pending' || scope.row.status == null">未审核</span>
          <span v-if="scope.row.status == 'audit'">审核中</span>
          <span v-if="scope.row.status == 'success'">审核通过</span>
          <span v-if="scope.row.status == 'fail'">审核失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="authentication" label="认证状态">
        <template slot-scope="scope">
          <span v-if="scope.row.authentication == 'pending' || scope.row.authentication == null">未认证</span>
          <span v-if="scope.row.authentication == 'auth'">认证中</span>
          <span v-if="scope.row.authentication == 'success'">认证通过</span>
          <span v-if="scope.row.authentication == 'fail'">认证失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row.id)">详情</el-button>
        </template>
      </el-table-column>

    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
        <el-pagination
          background 
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.page"
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin: -10px;">
        </el-pagination>
    </template>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="40%" center :close-on-click-modal="false">
      <el-form ref="form" :model="form">
        <el-form-item label="姓名">
          <span>{{ form.full_name }}</span>
        </el-form-item>
        <el-form-item label="身份证">
          <span>{{ form.identification_number ? form.identification_number : '无' }}</span>
        </el-form-item>
        <el-form-item label="职称">
          <span>{{ form.job_title ? form.job_title : '无' }}</span>
        </el-form-item>
        <el-form-item label="擅长">
          <span>{{ form.good_at ? form.good_at : '无' }}</span>
        </el-form-item>
        <el-form-item label="认证图片">
          <span>
            <a :href="form.picture" target="_blank">
              <img :src="form.picture" width="200px">
            </a>
          </span>
        </el-form-item>
        <el-table :data="hospitalSubject"
          element-loading-text="拼命加载中..."
          highlight-current-row>
          <el-table-column align="center" prop="hospital_name" label="医院"></el-table-column>
          <el-table-column align="center" prop="subject_name" label="科室"></el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <!-- <el-button @click="submitSetStatus('fail')" v-if="form.status != 'success'">审核失败</el-button>
        <el-button type="primary" @click="submitSetStatus('success')" v-if="form.status != 'success'">审核成功</el-button> -->
        <!-- <el-button @click="submitSet('fail')" v-if="form.status == 'success' && form.authentication != 'success'">认证失败</el-button>
        <el-button type="primary" @click="submitSet('success')" v-if="form.status == 'success' && form.authentication != 'success'">认证成功</el-button> -->
        <el-button @click="submitSet('fail')" v-if="form.authentication == 'auth'">认证失败</el-button>
        <el-button type="primary" @click="submitSet('success')" v-if="form.authentication == 'auth'">认证成功</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
import { getAuditingList, audit, getAudit } from '@/api/personnel'
import { Message } from 'element-ui'
export default {
  name: 'auditinglist',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'authentication': '',
        'status': ''
      },
      dialogFormTitle: '',
      dialogFormVisible: false,
      form: {},
      hospitalSubject: []
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.authentication'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.status'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    dialogFormVisible() {
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleEdit (id) {
      this.dialogFormTitle = '查看医生状态'
      this.dialogFormVisible = true
      getAudit({ doctor_id: id}).then(response => {
        this.form = response.data
        this.hospitalSubject = response.data.hospitalSubject
      }).catch((e) => {
        Message.error(e.msg)
      })
    },
    submitSet (authentication) {
      audit({ id: this.form.id, authentication: authentication}).then(response => {
        Message.info('更新成功')
        this.handleEdit(this.form.id)
        this.dialogFormVisible = false
      }).catch((e) => {
        Message.error(e.msg)
      })
    },
    submitSetStatus (status) {
      audit({ id: this.form.id, status: status}).then(response => {
        Message.info('更新成功')
        this.dialogFormVisible = false
      }).catch((e) => {
        Message.error(e.msg)
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      getAuditingList(this.listQuery).then(response => {
        this.total = parseInt(response.data.total)
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
