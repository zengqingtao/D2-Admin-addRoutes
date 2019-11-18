<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-input v-model="listQuery.search" style="width: 180px;margin-left: 10px;" placeholder="输入名称搜索" clearable></el-input>
      <el-select v-model="listQuery.status">
        <el-option label="全部审核状态" value=""></el-option>
        <el-option label="审核中" value="1"></el-option>
        <el-option label="审核通过" value="2"></el-option>
        <el-option label="审核失败" value="3"></el-option>
      </el-select>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="doctor_name" label="医生"></el-table-column>
      <el-table-column align="center" prop="doctor_phone" label="联系电话"></el-table-column>
      <el-table-column align="center" prop="hospital_name" label="申请医院"></el-table-column>
      <el-table-column align="center" label="医院科室">
        <template slot-scope="scope">
          {{ scope.row.p_subject_name }} - {{ scope.row.subject_name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="来源">
        <template slot-scope="scope">
          <span v-if="scope.row.is_from == '1'">手动申请</span>
          <span v-else>自动申请</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="authentication" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == '1'">审核中</span>
          <span v-if="scope.row.status == '2'">审核通过</span>
          <span v-if="scope.row.status == '3'">审核失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="remark" label="处理原因"></el-table-column>
      <el-table-column align="center" prop="created_at" label="申请时间"></el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="warning" v-if="scope.row.status == '1'" @click="handleFail(scope.row.id)">驳回</el-button>
          <el-button size="mini" type="success" v-if="scope.row.status == '1'" @click="handleSuccess(scope.row.id)">通过</el-button>
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

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="40%" center :close-on-click-modal="false" >
      <el-form ref="form" :model="form">
        <el-form-item label="姓名">
          <span>{{ form.doctor_name }}</span>
        </el-form-item>
        <el-form-item label="申请医院">
          <span>{{ form.hospital_name }}</span>
        </el-form-item>
        <el-form-item label="医院科室">
          <span>{{ form.p_subject_name }}-{{ form.subject_name }}</span>
        </el-form-item>
        <el-form-item label="驳回原因">
          <el-input type="text" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="default" @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="submitSetStatus('fail')" v-if="form.status != 'success'">提交</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
import { getAuditHospitalList, setAuditHospitalSuccess, setAuditHospitalFail } from '@/api/personnel'
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
    handleSuccess (id) {
      this.$confirm('确认审核通过？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setAuditHospitalSuccess({id: id}).then(response => {
          if (response.code == 1) {
            Message.success('已审核')
            this.fetchData()
          } else {
            Message.error(response.msg)
          }
        })
      })
    },
    handleFail (id) {
      this.$confirm('确认驳回？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        setAuditHospitalFail({id: id}).then(response => {
          if (response.code == 1) {
            Message.success('已驳回')
            this.fetchData()
          } else {
            Message.error(response.msg)
          }
        })
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
      getAuditHospitalList(this.listQuery).then(response => {
        this.total = parseInt(response.data.total)
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
