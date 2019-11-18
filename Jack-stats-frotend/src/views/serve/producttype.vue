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
      <el-table-column align="center" prop="name" label="产品类型"></el-table-column>
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
      <el-form ref="form" :model="form" label-width="30%">
        <el-form-item label="名称">
          <el-input v-model="form.name" style="width: 80%;" placeholder="产品类型名称" clearable></el-input>
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
import { getProductTypeList, setProductType } from '@/api/hospital'
import { Message } from 'element-ui'
import { hideProductType } from '@/api/hidedel'
export default {
  name: 'producttypelist',
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
      selectedOptions: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      form: {
        id: '',
        name: '',
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
  },
  methods: {
    handleHide (row) {
      this.$confirm('确认删除此服务项目？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideProductType({type_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.form = {
        id: '',
        name: ''
      }
      this.dialogFormTitle = '新增产品类型'
    },
    handleEdit (row) {
      this.form.id = row.id
      this.form.name = row.name
      this.dialogFormTitle = '修改产品类型'
      this.dialogFormVisible = true
    },
    submitSet () {
      if (this.form.name.length === 0) {
        Message.error('名称不能为空')
        return
      }

      setProductType(this.form).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogFormVisible = false
        if (this.form.id === '') {
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
      getProductTypeList(this.listQuery).then(response => {
        this.list = response.data
        this.listLoading = false
      })
    }
  }
}
</script>
