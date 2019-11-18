<template>
  <div>
    <el-dialog title="检查项目" :visible.sync="dialogFormVisible" width="80%" center :close-on-click-modal="false">
      <!-- header 查询条件 -->
      <div>
        <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="输入名称搜索" clearable></el-input>
        <el-select v-model="listQuery.organization_id" placeholder="请选择检查机构" @change="toggleCheckStoresOption(listQuery.organization_id)">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in organizationList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="listQuery.checkstores" placeholder="请选择门店" @change="handleCheckstoreChange">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in sourceCheckStoresList"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <el-select v-model="listQuery.type" placeholder="请选择检查类型">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="item in examinationsOptions"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>

      <!-- table表格 -->
      <el-table :data="list"
          v-loading="listLoading"
          element-loading-text="拼命加载中..."
          highlight-current-row
          stripe
          style="width: 100%">
        <el-table-column align="center" prop="code" label="编号"></el-table-column>
        <el-table-column align="center" prop="name" label="名称"></el-table-column>
        <el-table-column align="center" prop="sample" label="标本类型"></el-table-column>
        <el-table-column align="center" prop="type" label="类型"></el-table-column>
        <el-table-column align="center" prop="organization_name" label="机构"></el-table-column>
        <el-table-column align="center" prop="price" label="价格"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="handleAdd(scope.row)" v-if="selected.indexOf(scope.row.id) < 0">添加</el-button>
            <el-button size="mini" v-else disabled>已添加</el-button>
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
    </el-dialog>
  </div>
</template>
<script>
import { getExaminationsList, getOrganizationsList, getCheckStoresList } from '@/api/hospital'
import { examinationsOptions } from '@/data/data'
export default {
  name: 'examination',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'organization_id': '',
        'type': '',
        'checkstores': ''
      },
      shop_code: '',
      checkstore_name: '',
      checkStoresList: [],
      sourceCheckStoresList: [],
      organizationList: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      selected: []
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.organization_id'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.checkstores'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.type'(val) {
      this.listQuery.page = 1
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleExaminationList (selected) {
      if (selected === null) {
        selected = []
      }
      this.selected = selected
      this.dialogFormVisible = true
    },
    handleAdd (row) {
      this.selected.push(row.id)
      this.$emit('handleAddExamination', {'id': '', 'code': row.code, 'name': row.name, 'sample': row.sample, 'type': row.type, 'price': row.price, 'detail': row.detail, 'source': row.source, 'examination_id': row.id, 'examination_order_id': '', 'organization_id': row.organization_id, 'shop_code': this.listQuery.checkstores, 'date': '', 'time_period': '', 'organization_name': row.organization_name, 'checkstore_name': this.checkstore_name})
    },
    handleCheckstoreChange (val) {
      for (var i in this.sourceCheckStoresList) {
        if (val === this.sourceCheckStoresList[i].id) {
          this.shop_code = this.sourceCheckStoresList[i].code
          this.checkstore_name = this.sourceCheckStoresList[i].name
        }
      }
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
    toggleCheckStoresOption (organization_id) {
      this.sourceCheckStoresList = []
      if (organization_id === '') {
        return
      }
      for (var i in this.checkStoresList) {
        if (this.checkStoresList[i].organization_id === organization_id) {
          this.sourceCheckStoresList.push(this.checkStoresList[i])
        }
      }
      if (this.sourceCheckStoresList.length === 0) {
        this.listQuery.checkstores = ''
      }
    },
    fetchData () {
      this.examinationsOptions = examinationsOptions
      this.listLoading = true
      getExaminationsList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
      getCheckStoresList({ 'page': 1, 'limit': 500 }).then(response => {
        this.checkStoresList = response.data.list
        this.listLoading = false
      })
      getOrganizationsList({ 'page': 1, 'limit': 500 }).then(response => {
        this.organizationList = response.data.list
      })
    }
  }
}
</script>
