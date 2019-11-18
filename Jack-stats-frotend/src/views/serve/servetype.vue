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
      <el-table-column align="center" prop="name" label="服务类型"></el-table-column>
      <el-table-column align="center" label="产品类型">
        <template slot-scope="scope">
          <span>{{ parseProductType(scope.row.product_type_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="index" label="渠道指数"></el-table-column>
      <el-table-column align="center" prop="order_index" label="开单指数"></el-table-column>
      <el-table-column align="center" prop="cost_index" label="成本指数"></el-table-column>
      <el-table-column align="center" prop="clinic_index" label="诊所指数"></el-table-column>
      <el-table-column align="center" prop="platform_rate" label="平台费率"></el-table-column>
      <el-table-column align="center" prop="price" label="价格"></el-table-column>
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
          <el-input v-model="form.name" style="width: 80%;" placeholder="服务类型名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="产品类型">
          <el-select v-model="form.product_type_id" placeholder="请选择产品类型">
            <el-option v-for="item in productTypeList" :value="item.id" :label="item.name" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!--<el-form-item label="渠道指数">-->
          <!--<el-input v-model="form.index" style="width: 80%;" placeholder="0" clearable readonly></el-input>-->
        <!--</el-form-item>-->
        <el-form-item label="邀新用户指数">
          <el-input v-model="form.user_index" style="width: 80%;" placeholder="0" clearable></el-input>
        </el-form-item>
        <el-form-item label="邀新医生指数">
          <el-input v-model="form.employee_index" style="width: 80%;" placeholder="0" clearable></el-input>
        </el-form-item>
        <el-form-item label="开单指数">
          <el-input v-model="form.order_index" style="width: 80%;" placeholder="0" clearable></el-input>
        </el-form-item>
        <el-form-item label="成本指数">
          <el-input v-model="form.cost_index" style="width: 80%;" placeholder="0" clearable></el-input>
        </el-form-item>
        <el-form-item label="诊所指数">
          <el-input v-model="form.clinic_index" style="width: 80%;" placeholder="0" clearable></el-input>
        </el-form-item>
        <el-form-item label="平台费率">
          <el-input v-model="form.platform_rate" style="width: 80%;" placeholder="0" clearable></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" style="width: 80%;" placeholder="价格" clearable></el-input>
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
import { getProductTypeList, setServeType, getServeTypeList } from '@/api/hospital'
import { Message } from 'element-ui'
import { hideServeType } from '@/api/hidedel'
export default {
  name: 'producttypelist',
  data () {
    return {
      productTypeList: [],
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
        index: '',
        order_index: '',
        cost_index: '',
        clinic_index: '',
        user_index: '',
        employee_index: '',
        platform_rate: '',
        price: '',
        product_type_id: '',
      }
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'form.user_index'(val) {
      let num1 = val ? parseFloat(val) : 0.00;
      let num2 = this.form.employee_index ? parseFloat(this.form.employee_index) : 0.00;
      this.form.index = num1 + num2 ;
    },
    'form.employee_index'(val) {
      let num1 = val ? parseFloat(val) : 0.00;
      let num2 = this.form.user_index ? parseFloat(this.form.user_index) : 0.00;
      this.form.index = num1 + num2 ;
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
        hideServeType({type_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    parseProductType (val) {
      let item = this.productTypeList.find((v, i) => {
        return v.id === val
      })
      if (item) {
        return item.name
      } else {
        return ''
      }
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.form = {
        id: '',
        name: '',
        index: '',
        order_index: '',
        cost_index: '',
        clinic_index: '',
        platform_rate: '',
        user_index: '',
        employee_index: '',
        price: '',
        product_type_id: '',
      }
      this.dialogFormTitle = '新增产品类型'
    },
    handleEdit (row) {
      this.form = row
      this.dialogFormTitle = '修改产品类型'
      this.dialogFormVisible = true
    },
    submitSet () {
      if (this.form.name.length === 0) {
        Message.error('名称不能为空')
        return
      }
      if (this.form.product_type_id.length === 0) {
        Message.error('名称不能为空')
        return
      }

      let sum = Number(this.form.index) + Number(this.form.order_index) + Number(this.form.cost_index) + Number(this.form.clinic_index) + Number(this.form.platform_rate)

      if (sum > 0 && sum > 100) {
        Message.error('所有指数和平台费率的总和应该是100')
        return
      }

      setServeType(this.form).then(response => {
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
        this.productTypeList = response.data
        this.listLoading = false
      })
      getServeTypeList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
