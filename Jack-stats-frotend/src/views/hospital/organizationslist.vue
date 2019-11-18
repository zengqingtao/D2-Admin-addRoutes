<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="输入名称搜索" clearable></el-input>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="hospital_id" label="机构ID"></el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
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
      <el-form ref="hospitalForm" :model="organizationForm" label-width="30%">
        <el-form-item label="名称">
          <el-input v-model="organizationForm.name" placeholder="请输入检查名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input  v-model="organizationForm.code" placeholder="编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="type">
            <el-option label="第三方" value="others"></el-option>
            <el-option label="本地" value="local"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院" v-if="type == 'local'">
          <el-select v-model="organizationForm.hospital_id"
            remote
            filterable
            placeholder="请输入关键词"
            :remote-method="searchHospital">
            <el-option
              v-for="item in hospitalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          PS：如果是属于平台合作的医院，请选择来源“本地”并选择医院（如威尔医院）；否则请选择来源“第三方”（如美年大健康）
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSet">确 定</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
import { getOrganizationsList, setOrganization, getHospitalOption, getHospital } from '@/api/hospital'
import { Message } from 'element-ui'

export default {
  name: 'organizationslist',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': ''
      },
      hospitalOptions: [],
      options: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      organizationForm: {
        id: '',
        name: '',
        code: '',
        source: '',
        hospital_id: ''
      },
      type: 'others'
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleCreate () {
      this.dialogFormVisible = true
      this.organizationForm = {
        id: '',
        name: '',
        code: '',
        source: '',
        hospital_id: ''
      }
      this.dialogFormTitle = '新增检查机构'
    },
    handleEdit (row) {
      this.organizationForm = row
      if (row.hospital_id > 0) {
        this.type = 'local'
        getHospital({ id: row.hospital_id }).then(response => {
          this.hospitalOptions = [{ 'label': response.data.name, 'value': response.data.id }]
        }).catch((e) => {
          Message.error(e.msg)
        })
      } else {
        this.type = 'others'
      }
      this.dialogFormTitle = '修改检查机构'
      this.dialogFormVisible = true
    },
    submitSet () {
      if (this.organizationForm.name.length === 0) {
        Message.error('名称不能为空')
        return
      }

      setOrganization(this.organizationForm).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogFormVisible = false
        if (this.organizationForm.id === '') {
          Message.info('新增成功')
        } else {
          Message.info('修改成功')
        }
      }).catch((e) => {
        Message.error(e.msg)
      })
    },
    searchHospital (val) {
      getHospitalOption({search: val}).then(response => {
        this.hospitalOptions = response.data
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
      getOrganizationsList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.total
        this.listLoading = false
      })
    }
  }
}
</script>
