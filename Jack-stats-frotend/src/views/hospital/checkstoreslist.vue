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
      <el-table-column align="center" prop="id" label="序号"></el-table-column>
      <el-table-column align="center" prop="code" label="编号"></el-table-column>
      <el-table-column align="center" prop="name" label="名称"></el-table-column>
      <el-table-column align="center" prop="organization_name" label="检查机构"></el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleHide(scope.row)">删除</el-button>
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

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="30%" center :close-on-click-modal="false">
      <el-form ref="hospitalForm" :model="checkStoresForm" label-width="30%">
        <el-form-item label="名称">
          <el-input v-model="checkStoresForm.name" placeholder="请输入检查名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input  v-model="checkStoresForm.code" placeholder="编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="检查机构">
          <el-select v-model="checkStoresForm.organization_id" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
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
import { getCheckStoresList, getCheckStores, setCheckStores, getOrganizationsList } from '@/api/hospital'
import { Message } from 'element-ui'
import { hideCheckstore } from '@/api/hidedel'
export default {
  name: 'checkstoreslist',
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
      options: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      checkStoresForm: {
        id: '',
        name: '',
        code: '',
        source: '',
        organization_id: ''
      }
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
    this.fetchOrganizations()
  },
  methods: {
    handleHide (row) {
      this.$confirm('确认删除此检查门店？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideCheckstore({check_store_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    parseOption (source) {
      for (var i in this.options) {
        if (this.options[i].value === source) {
          return this.options[i].label
        }
      }
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.checkStoresForm = {
        id: '',
        name: '',
        code: '',
        source: '',
        organization_id: ''
      }
      this.dialogFormTitle = '新增检查机构'
    },
    handleEdit (row) {
      this.checkStoresForm.id = row.id
      this.checkStoresForm.name = row.name
      this.checkStoresForm.code = row.code
      this.checkStoresForm.organization_id = row.organization_id
      this.checkStoresForm.source = row.source
      this.dialogFormTitle = '修改检查机构'
      this.dialogFormVisible = true
    },
    submitSet () {
      if (this.checkStoresForm.name.length === 0) {
        Message.error('名称不能为空')
        return
      }
      if (this.checkStoresForm.organization_id.length === 0) {
        Message.error('检查机构不能为空')
        return
      }

      setCheckStores(this.checkStoresForm).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogFormVisible = false
        if (this.checkStoresForm.id === '') {
          Message.info('新增成功')
        } else {
          Message.info('修改成功')
        }
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
      getCheckStoresList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    },
    fetchOrganizations () {
      getOrganizationsList().then(response => {
        this.options = response.data.list
      })
    }
  }
}
</script>
