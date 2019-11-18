<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-select v-model="listQuery.status" placeholder="请选择订单状态">
        <el-option label="全部" value=""></el-option>
        <el-option
          v-for="item in serveOrderStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.search" style="width: 180px;margin-left: 10px;margin-right:20px;" placeholder="输入姓名/手机/诊疗卡号搜索" clearable></el-input>
      <el-date-picker
        v-model="listQuery.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column prop="number" label="订单号" align="center" width="90"></el-table-column>
      <el-table-column prop="type_name" label="服务类型" align="center"width="120"></el-table-column>
      <el-table-column prop="patient_name" label="姓名" align="center" min-width="90"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" width="100"></el-table-column>
      <el-table-column prop="card" label="诊疗卡" align="center" width="90"></el-table-column>
      <el-table-column prop="identification_number" label="身份证号" align="center"width="140"></el-table-column>
      <el-table-column prop="name" label="服务名称" align="center"width="140"></el-table-column>
      <el-table-column prop="admin_name" label="创建者" align="center"min-width="100"></el-table-column>
      <el-table-column prop="amount" label="订单价格" align="center" width="120"></el-table-column>
      <el-table-column prop="status" label="状态" align="center" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.status | parseServeOrderStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" align="center" width="100"></el-table-column>
      <el-table-column prop="hospital_name" label="来源机构" align="center"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="success" v-if="scope.row.status == 'pay'" @click="handlePay(scope.row.id)">支付</el-button> -->
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">查看</el-button>
          <el-button size="mini" type="warning" @click="handleHide(scope.row)">隐藏</el-button>
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

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="80%" center :close-on-click-modal="false">
      <el-card class="server-follow-detail pl4 py4">
        <el-row>
          <p class="h1 bold">订单基本信息</p>
          <ul class="order-info flex flex-wrap justify-between">
              <li class="order-info-item">
                  <span class="tags">姓名：</span>
                  <span class="text">{{ form.patient_name }}</span>
              </li>
              <li class="order-info-item">
                  <span class="tags">年龄：</span>
                  <span class="text">{{ form.age }}</span>
              </li>
              <li class="order-info-item">
                  <span class="tags">诊疗卡号：</span>
                  <span class="text">{{ form.card }}</span>
              </li>
              <li class="order-info-item">
                  <span class="tags">订单号：</span>
                  <span class="text">{{ form.number }}</span>
              </li>
              <li class="order-info-item">
                  <span class="tags">提交时间：</span>
                  <span class="text">{{ form.created_at }}</span>
              </li>
              <li class="order-info-item">
                  <span class="tags">手机号码：</span>
                  <span class="text">{{ form.phone }}</span>
              </li>
              <li class="order-info-item">
                  <span class="tags">身份证号：</span>
                  <span class="text">{{ form.identification_number }}</span>
              </li>
              <li class="order-info-item">
                  <span class="tags">订单状态：</span>
                  <span class="text">{{ form.status | parseOrderStatus }}</span>
              </li>
              <li class="order-info-item">
                  <span class="tags">支付金额：</span>
                  <span class="text">{{ form.amount ? form.amount : 0 }}元</span>
              </li>
          </ul>
        </el-row>
        <el-row>
          <p class="h1 bold">订单详细信息</p>
          <ul class="order-detail flex flex-wrap justify-between">
              <li class="order-detail-item">
                  <span class="tags">服务名称：</span>
                  <span class="text">{{ form.name }}</span>
              </li>
              <li class="order-detail-item">
                  <span class="tags">服务类型：</span>
                  <span class="text">{{ form.type_name }}</span>
              </li>
              <li class="order-detail-item">
                  <span class="tags">简介：</span>
                  <span class="text">{{ form.summary }}</span>
              </li>
          </ul>
        </el-row>
      </el-card>
    </el-dialog>
    <paynow ref="paynow" @handleRefresh="handleRefresh"></paynow>
  </d2-container>
</template>

<script>
import { getServeList, getServeType } from '@/api/orders'
import { hideServeOrder } from '@/api/hidedel'
import paynow from '@/components/lianhe/paynow'
import { serveOrderStatusOptions } from '@/data/data'
export default {
  name: 'servelist',
  components: {
    paynow
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      serveOptions: [],
      serveOrderStatusOptions: serveOrderStatusOptions,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'status': '',
        'date': ['', '']
      },
      form: {},
      dialogFormTitle: '',
      dialogFormVisible: false
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.status'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.date'(val) {
      this.listQuery.page = 1
      this.listQuery.date[0] = this.listQuery.date[0].format('YYYY-MM-DD')
      this.listQuery.date[1] = this.listQuery.date[1].format('YYYY-MM-DD')
      this.fetchData()
    }
  },
  methods: {
    handleHide (row) {
      this.$confirm('确认隐藏此订单？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideServeOrder({order_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleRefresh() {
      this.fetchData()
    },
    handlePay (order_id) {
      this.$refs.paynow.handlePayNow(order_id, 'App\\Models\\ServeOrder')
    },
    handleEdit (row) {
      this.dialogFormTitle = '服务详情'
      this.dialogFormVisible = true
      this.form = row
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
      getServeList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
      getServeType().then(response => {
        for (var i in response.data) {
          this.serveOptions.push({ 'label': response.data[i].name, 'value': response.data[i].id })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.h1{font-weight:800;font-size:1.1rem;}
.order-info-item,.order-detail-item{width: 33.3%;float:left;font-size:1rem;padding:5px 0;}
</style>
