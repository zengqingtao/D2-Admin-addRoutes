<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-select v-model="listQuery.status" placeholder="请选择订单状态">
        <el-option label="全部" value=""></el-option>
        <el-option
          v-for="item in examinationOrderStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="listQuery.checkstore" placeholder="请选择检查机构">
        <el-option label="全部" value=""></el-option>
        <el-option :label="item.label" :value="item.value" v-for="item in checkstoreOptions"></el-option>
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
      <el-table-column prop="patient_name" label="姓名" align="center" min-width="90"></el-table-column>
      <el-table-column prop="created_at" label="创建时间" align="center" width="100"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" width="100"></el-table-column>
      <el-table-column prop="card" label="诊疗卡" align="center" width="90"></el-table-column>
      <el-table-column prop="identification_number" label="身份证号" align="center"width="140"></el-table-column>
      <el-table-column prop="admin_name" label="创建者" align="center"min-width="100"></el-table-column>
      <el-table-column prop="amount" label="订单价格" align="center" width="120"></el-table-column>
      <el-table-column prop="channel" label="支付方式" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.source_organization_id > 0 && scope.row.status == 'paid'">第三方机构支付</span>
          <span v-if="scope.row.source_organization_id <= 0">{{ scope.row.channel | parsePayChannel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="organization_name" label="检查机构" align="center"></el-table-column>
      <el-table-column prop="source_organization_name" label="来源机构" align="center"></el-table-column>
      <!-- <el-table-column prop="delivery" label="配送方式" align="center" width="90"></el-table-column> -->
      <el-table-column prop="status" label="状态" align="center" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.status | parseExaminationOrderStatus }}</span>
        </template>
      </el-table-column>
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
      <el-card class="order-check-project-detail">
        <p class="h1">检查项目订单详情</p>
        <ul class="list-reset flex flex-wrap info-group px4 mb3">
            <li class="col-4 pr3 pb3">
                <span class="title">订单号：</span>
                <span class="cont">{{ order.number }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">美年订单号：</span>
                <span class="cont">{{ order.serviceNumber }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">美年检查号：</span>
                <span class="cont">{{ order.resource_id }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">姓名：</span>
                <span class="cont">{{ order.patient_name }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">年龄：</span>
                <span class="cont">{{ order.age }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">手机：</span>
                <span class="cont">{{ order.phone }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">性别：</span>
                <span class="cont">{{ order.sex }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">诊疗卡：</span>
                <span class="cont">{{ order.card }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">证件类型：</span>
                <span class="cont">{{ order.papers_trans }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">身份证号：</span>
                <span class="cont">{{ order.identification_number }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">其他证件：</span>
                <span class="cont">{{ order.papers }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">关联订单：</span>
                <span class="cont">{{ order.order ? order.number : '无' }}</span>
            </li>
            <li class="col-4 pr3 pb3">
                <span class="title">创建时间：</span>
                <span class="cont">{{ order.created_at ? order.created_at : ''}}</span>
            </li>
        </ul>
        <div class="mb2">
          <span class="h1">临床诊断:</span> 
          <!-- <el-input type="textarea" v-model="order.diagnosis"></el-input> -->
          <el-select
            v-model="order.diagnosis"
            multiple
            filterable
            remote
            reserve-keyword
            disabled
            placeholder="请输入关键词"
            :remote-method="getICDLibraries">
            <el-option
              v-for="item in icds"
              :key="item.id"
              :label="item.fjbname"
              :value="item.id">
            </el-option>
          </el-select>
        </div>
        <div class="mb2">
          <span class="h1">既往病史:</span>{{order.history_disease}} 
          <!-- <el-input type="textarea" v-model="order.history_disease"></el-input> -->
        </div>
        <div class="mb2">
          <span class="h1">病理及体征:</span>{{order.pathological_signs}}
          <!-- <el-input type="textarea" v-model="order.pathological_signs"></el-input>  -->
        </div>
        <div class="mb2">
          <span class="h1">相关检查结果:</span>{{order.relation_result}}
          <!-- <el-input type="textarea" v-model="order.relation_result"></el-input>  -->
        </div>
        <div class="mb2">
          <p class="h1">检查单：
            <!-- <el-button type="primary" v-if="order.status == 'pay'" @click="handleExaminationList">添加</el-button> -->
          </p>
          <el-table :data="orderItems" show-summary :summary-method="getSummaries">
            <el-table-column prop="name" align="center" label="名称" min-width="120"></el-table-column>
            <el-table-column prop="code" align="center" label="检验号" width="110"></el-table-column>
            <el-table-column prop="sample" align="center" label="标本类型" width="100"></el-table-column>
            <el-table-column prop="type" align="center" label="类型" width="120"></el-table-column>
            <el-table-column label="项目详情" align="center" min-width="150">
                <template slot-scope="scope">
                    <div v-html="scope.row.detail"></div>
                </template>
            </el-table-column>
            <el-table-column prop="date" align="center" label="检查日期" width="130"></el-table-column>
            <el-table-column prop="organization_name" align="center" label="检查机构" width="130"></el-table-column>
            <el-table-column prop="time_period" align="center" label="时间段" width="120">
              <template slot-scope="scope">{{ scope.row.time_period | parseTimePeriod }}</template>
            </el-table-column>
            <el-table-column prop="checkstore_name" align="center" label="检查门店" width="120"></el-table-column>
            <el-table-column prop="price" align="center" label="零售价" width="150"></el-table-column>
            <!-- <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <div v-if="order.status != 'paid' && order.status != 'cancelled'">
                    <el-button size="small" @click="handleOrderItem(scope.$index, scope.row)" type="primary">编辑
                    </el-button>
                    <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="danger">删除
                    </el-button>
                </div>
              </template>
            </el-table-column> -->
          </el-table>
       <!--    <div class="center mt20">
            <el-button type="primary" v-if="order.status != 'paid' && order.status != 'cancelled'" @click="handleSaveOrderItems">保存</el-button>
          </div> -->
        </div>
      </el-card>
    </el-dialog>
    <examination ref="examination" @handleAddExamination="handleAddExamination"></examination>
    <timeperiod ref="timeperiod" @handleSetTimeperiod="handleSetTimeperiod"></timeperiod>
    <paynow ref="paynow" @handleRefresh="handleRefresh"></paynow>
  </d2-container>
</template>
<script>
import { getExaminationList, getExamOrderItems, setExaminationOrder } from '@/api/orders'
import { getCheckStoresList } from '@/api/hospital'
import { channelOptions, examinationOrderStatusOptions } from '@/data/data'
import examination from '@/components/lianhe/examination'
import timeperiod from '@/components/lianhe/timeperiod'
import { Message } from 'element-ui'
import paynow from '@/components/lianhe/paynow'
import { hideExaminationOrder } from '@/api/hidedel'
import { getICDList } from '@/api/neworder'
export default {
  name: 'examinationorderlist',
  components: {
    examination,
    timeperiod,
    paynow
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      examinationOrderStatusOptions: examinationOrderStatusOptions,
      checkstoreOptions: [],
      icds: [],
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'status': '',
        'checkstore': '',
        'date': ['', '']
      },
      order: {},
      orderItems: [],
      item: {},
      itemIndex: 0,
      dialogFormTitle: '',
      dialogFormVisible: false,
      dialogItemVisible: false
    }
  },
  created () {
    this.fetchData()
    getCheckStoresList({ 'page': 1, 'limit': 100 }).then(response => {
      for (var i in response.data.list) {
        this.checkstoreOptions.push({ 'label': response.data.list[i].name, 'value': response.data.list[i].code })
      }
    })
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
        hideExaminationOrder({order_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleRefresh() {
      this.fetchData()
    },
    handlePay (order_id) {
      this.$refs.paynow.handlePayNow(order_id, 'App\\Models\\ExaminationOrder')
    },
    handleEdit (row) {
      this.dialogFormTitle = '检查单详情'
      this.order = row
      getExamOrderItems({ 'order_id': row.id }).then(response => {
        this.order.diagnosis = response.data.diagnosis
        this.orderItems = response.data.items
        this.getICDLibraries('', this.order.diagnosis)
      })
      this.dialogFormVisible = true
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
    handleExaminationList () {
      var tmp = []
      for (var i in this.orderItems) {
        tmp.push(this.orderItems[i].examination_id)
      }
      this.$refs.examination.handleExaminationList(tmp)
    },
    handleSetTimeperiod (item) {
      this.orderItems[this.itemIndex] = item
    },
    handleDelete (index, item) {
      this.orderItems.splice(index, 1)
      this.handleOrderAmount()
    },
    handleAddExamination (item) {
      this.orderItems.push(item)
      this.handleOrderAmount()
    },
    handleOrderAmount () {
      var tmp = 0
      for (var i in this.orderItems) {
        tmp += parseFloat(this.orderItems[i].price)
      }
      this.order.amount = parseFloat(tmp).toFixed(2)
    },
    getSummaries (param) {
      const {columns} = param
      var sums = []
      sums[columns.length - 1] = '总额：' + this.order.amount + '元'
      return sums
    },
    handleOrderItem (index, item) {
      this.item = item
      this.itemIndex = index
      this.$refs.timeperiod.handleTimeperiod(item, 'examination')
    },
    handleSaveOrderItems () {
      this.order.items = this.orderItems
      setExaminationOrder(this.order).then(response => {
        Message.info('修改成功')
        this.dialogFormVisible = false
        this.fetchData()
      })
    },
    getICDLibraries (search, diagnosis) {
      getICDList({ search: search, icds: diagnosis ? diagnosis.join(',') : '' }).then(response => {
        this.icds = response.data.list
      })
    },
    fetchData () {
      this.listLoading = true
      getExaminationList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.h1{font-weight:800;font-size:1.1rem;}
.list-reset{display:block;overflow:hidden;font-size:1rem;}
.pb3{width: 33.3%;float:left;font-size:1rem;padding:5px 0;}
.mb2{display:block;font-size:1rem;padding: 10px 0;}
</style>
