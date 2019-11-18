f<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-select v-model="listQuery.status" placeholder="请选择订单状态">
        <el-option label="全部" value=""></el-option>
        <el-option
          v-for="item in prescriptionOrderStatusOptions"
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
      <el-table-column prop="patient_name" label="姓名" align="center" min-width="90"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" width="100"></el-table-column>
      <el-table-column prop="card" label="诊疗卡" align="center" width="90"></el-table-column>
      <el-table-column prop="identification_number" label="身份证号" align="center"width="140"></el-table-column>
      <el-table-column prop="recipient" label="收件人" align="center"width="140"></el-table-column>
      <el-table-column prop="admin_name" label="创建者" align="center"min-width="100"></el-table-column>
      <el-table-column prop="total_amount" label="订单价格" align="center" width="120"></el-table-column>
      <el-table-column prop="channel" label="支付方式" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.source_organization_id > 0 && scope.row.status == 'paid'">第三方机构支付</span>
          <span v-if="scope.row.source_organization_id <= 0">{{ scope.row.channel | parsePayChannel }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="source_organization_name" label="来源机构" align="center"></el-table-column>
      <el-table-column prop="address" label="邮寄地址" align="center"></el-table-column>
      <!-- <el-table-column prop="delivery" label="配送方式" align="center" width="90"></el-table-column> -->
      <el-table-column prop="status" label="状态" align="center" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.status | parsePrescriptionOrderStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="创建时间" align="center" width="100"></el-table-column>
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
      <el-card class="order-prescription-order-detail">
        <p class="h1">药品订单详情</p>
        <ul class="list-reset flex flex-wrap info-group px4 mb3">
          <li class="col-4 pr3 pb3">
              <span class="title">处方单号：</span>
              <span class="cont">{{ form.number }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">关联订单号：</span>
              <span class="cont">{{ form.order ? form.number : '无' }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">诊疗卡号：</span>
              <span class="cont">{{ form.card }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">姓名：</span>
              <span class="cont">{{ form.patient_name }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">年龄：</span>
              <span class="cont">{{ form.age }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">手机号码：</span>
              <span class="cont">{{ form.phone }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">性别：</span>
              <span class="cont">{{ form.sex }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">证件类型：</span>
              <span class="cont">{{ form.papers }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">身份证号：</span>
              <span class="cont">{{ form.identification_number }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">其他证件：</span>
              <span class="cont">{{ form.papers }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">订单总价：</span>
              <span class="cont">{{ form.total_amount }}元</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">订单状态：</span>
              <span class="cont">{{ form.status | parsePrescriptionOrderStatus }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">订单创建时间：</span>
              <span class="cont">{{ form.created_at }}</span>
          </li>
          <li class="col-4 pr3 pb3">
              <span class="title">配送方式：</span>
              <span class="cont">{{ form.delivery }}</span>
          </li>
        </ul>
      </el-card>

      <el-card class="mt20">
        <div class="mb2">
          <span class="h1">临床诊断：</span>
          <!-- <el-input type="textarea" v-model="form.diagnosis"></el-input> -->
          <el-select
            v-model="form.diagnosis"
            multiple
            filterable
            remote
            reserve-keyword
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
          <span class="h1">咨询费：</span>
          <el-input-number v-model="form.consult_fee" :min="0" label="咨询费"></el-input-number>
        </div>
      </el-card>

      <el-card class="mt20">
        <el-row>
          <el-col>
            <div class="h2" style="margin-top: 20px">
              <span class="h1">开药类型：</span>
              <template style="margin-left: 20px">
                  <el-radio-group v-model="form.type" @change="handleClear">
                      <el-radio label="z">中药饮片</el-radio>
                      <el-radio label="h">西药/中成药/其他</el-radio>
                  </el-radio-group>
              </template>
              <el-button type="primary" style="float:right" @click="handleMedicine()">添加</el-button>
            </div>
          </el-col>
          <el-col v-if="form.type == 'z'">
            <div>
              <div class="h2"  style="margin-top: 20px">
                煎作方式：
                <el-select v-model="form.extract_way" filterable placeholder="请选择煎作方式" @change="handleExtract">
                    <el-option v-for="item in extractWay" :key="item.value" :label="item.value"
                               :value="item.value"></el-option>
                </el-select>
              </div>
              <div class="h2" v-if="wjVisible" style="margin-top: 20px">
                  选择丸剂：
                  <el-select v-model="form.wj_type" filterable placeholder="请选择丸剂">
                      <el-option v-for="item in wjType" :key="item.value" :label="item.label"
                                 :value="item.value"></el-option>
                  </el-select>
              </div>
              <div class="h2" v-if="gfVisible" style="margin-top: 20px">
                  选择膏方：
                  <el-select v-model="form.gf_type" filterable placeholder="请选择膏方">
                      <el-option v-for="item in gfType" :key="item.value" :label="item.label"
                                 :value="item.value"></el-option>
                  </el-select>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-table :data="items" class="mb3 mt20" show-summary :summary-method="getSummaries">
          <el-table-column prop="drug_name" label="药品名称" min-width="150"></el-table-column>
          <el-table-column prop="type" label="类型" min-width="80">
            <template slot-scope="scope">
              {{ scope.row.type | parseMedicineType }}
            </template>
          </el-table-column>
          <el-table-column prop="dosage_form" label="剂型" min-width="80"></el-table-column>
          <el-table-column prop="specifications" label="规格" min-width="80"></el-table-column>
          <el-table-column prop="price" label="零售价" min-width="100"></el-table-column>
          <el-table-column prop="amount" label="总量" min-width="100"></el-table-column>
          <el-table-column label="小计" min-width="100">
              <template slot-scope="{$index, row}">
                  {{ (row.price * row.amount).toFixed(form.type === 'z' ? 4 : 2) }}
              </template>
          </el-table-column>
          <el-table-column prop="usage_info" label="用法" min-width="180">
              <template slot-scope="{$index, row}">
                  <pre>制作方法：{{ (row.usage == '' ? '无' : row.usage) }} 用量：{{ row.amount }}{{ row.dose_unit }}</pre>
              </template>
          </el-table-column>
          <el-table-column label="药品编号" min-width="150">
              <template slot-scope="{$index, row}">
                  {{ row.out_code }}
              </template>
          </el-table-column>
          <el-table-column prop="source" label="来源" min-width="70">
            <template slot-scope="{$index, row}">
              {{ row.source | parseMedicineSource }}
            </template>
          </el-table-column>
          <el-table-column prop="control" label="操作" align="center" width="160px">
              <template slot-scope="{$index, row}">
                  <el-row>
                      <el-button type="danger" size="small" @click="handleDelete($index, row)">删除</el-button>
                      <el-button type="primary" size="small" @click="showModify($index, row)">编辑</el-button>
                  </el-row>
              </template>
          </el-table-column>
        </el-table>
        <div class="mt20">
          <el-form v-if="form.type === 'z'" label-width="90px">
            <el-form-item label="剂数" style:="margin-top: 10px">
                <el-input-number v-model="form.medication_amount" controls-position="right" :min="isAgent?3:1"
                                 :max='99'></el-input-number>
            </el-form-item>
            <el-form-item label="煎服方法">
                <el-input type="textarea" v-model="form.medication_methods" :rows='2' placeholder="请填写用药方法"></el-input>
            </el-form-item>
            <el-form-item label="处方备注">
                <el-input v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="使用方法">
                <el-select v-model="form.usage" filterable placeholder="请选择使用方法">
                    <el-option v-for="item in herbsDose" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
          </el-form>
        </div>
      </el-card>

      <el-card class="mt20">
        <div class="center">
          <el-button type="primary" @click="handleSaveOrder">保存订单</el-button>
        </div>
      </el-card>

    </el-dialog>
    <medicine ref="medicine" @handleEditMedicine="handleEditMedicine"></medicine>
    <editmedicine ref="editmedicine" @handleAddOrSetMedicine="handleAddOrSetMedicine"></editmedicine>
    <paynow ref="paynow" @handleRefresh="handleRefresh"></paynow>
  </d2-container>
</template>

<script>
import { getPrescriptionList, getPrescriptionOrderItems, setPrescriptionOrder } from '@/api/orders'
import { channelOptions, prescriptionOrderStatusOptions, doseUnit, extractWay, wjType, gfType, herbsDose, usage, frequency, herbsUsage, dosageTime } from '@/data/data'
import medicine from '@/components/lianhe/medicine'
import editmedicine from '@/components/lianhe/editmedicine'
import paynow from '@/components/lianhe/paynow'
import { Message } from 'element-ui'
import { hidePrescriptionOrder } from '@/api/hidedel'
import { getICDList } from '@/api/neworder'
export default {
  name: 'prescriptionorderlist',
  components: {
    medicine,
    editmedicine,
    paynow
  },
  computed: {
    wjVisible() {
      return this.form.extract_way === '丸剂'
    },
    gfVisible() {
      return this.form.extract_way === '膏方'
    },
    isAgent() {
      // 是否代煎
      return this.form.extract_way === '代煎'
    },
    agentAmount() {
      // 代煎费：每剂 5元
      return this.isAgent ? this.form.medication_amount * 5 : 0
    }
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      orderOptions: [],
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'status': '',
        'date': ['', '']
      },
      icds: [],
      doseUnit: doseUnit,
      extractWay: extractWay,
      wjType: wjType,
      gfType: gfType,
      herbsDose: herbsDose,
      usage: usage,
      frequency: frequency,
      herbsUsage: herbsUsage,
      dosageTime: dosageTime,
      form: {},
      items: [],
      hOrderItems: [],
      zOrderItems: [],
      dialogFormTitle: '',
      prescriptionOrderStatusOptions: prescriptionOrderStatusOptions,
      dialogFormVisible: false,
      source: '',
      medicine_ids: [],
      medicineIndex: -1,
      sources: [],
      totalAmount: 0
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
        hidePrescriptionOrder({order_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleRefresh() {
      this.fetchData()
    },
    handlePay (order_id) {
      this.$refs.paynow.handlePayNow(order_id, 'App\\Models\\PrescriptionOrder')
    },
    handleEdit (row) {
      this.dialogFormTitle = '药品详情'
      this.form = row
      this.dialogFormVisible = true
      this.items = []
      getPrescriptionOrderItems({ 'order_id': row.id }).then(response => {
        this.form = response.data
        this.handleClear(this.form.type)
        this.getICDLibraries('', this.form.diagnosis)
      })
    },
    handleClear (type) {
      for (var i in this.form.items) {
        if (this.form.items[i].type === type) {
          this.items.push(this.form.items[i])
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
    handleMedicine () {
      if (this.form.type === 'z' && this.form.extract_way === '') {
        Message.error('请先选择煎作方式')
        return
      }
      if (this.form.type === 'z' && this.items.length > 0) {
        this.source = this.items[0].source
      }
      if (this.form.type === 'z' && this.items.length === 0) {
        this.source = ''
      }
      this.medicineIndex = -1
      this.$refs.medicine.handleMedicine(this.getMedicineIds(), this.form.type, this.source)
    },
    handleEditMedicine (medicine) {
      this.$refs.editmedicine.handleEditMedicine(medicine)
    },
    handleAddOrSetMedicine (medicine) {
      if (medicine.medicine_id === undefined) {
        medicine.medicine_id = medicine.id
        delete medicine.id
      }
      if (this.medicineIndex === -1) {
        this.form.items.push(medicine)
      } else {
        this.items[this.medicineIndex] = medicine
        this.form.items.forEach((v, i) => {
          if (v.medicine_id === medicine.medicine_id) {
            this.form.items[i] = medicine
          }
        })
      }
      this.handleClear(medicine.type)
      this.handleUpdateMedicineSelected()
      this.getSources()
    },
    getMedicineIds () {
      var medicine_ids = []
      for (var i in this.form.items) {
        medicine_ids.push(this.form.items[i].medicine_id)
      }
      return medicine_ids
    },
    handleUpdateMedicineSelected () {
      this.$refs.medicine.handleUpdateSelected(this.getMedicineIds())
    },
    handleDelete (index, item) {
      this.items.splice(index, 1)
      this.form.items.forEach((v, i) => {
        if (v.medicine_id === item.medicine_id) {
          this.form.items.splice(i, 1)
        }
      })
      this.getSources()
    },
    showModify (index, item) {
      this.medicineIndex = index
      this.$refs.editmedicine.handleEditMedicine(item)
    },
    handleClear (val) {
      this.items = []
      for (var i in this.form.items) {
        if (this.form.items[i].type === val) {
          this.items.push(this.form.items[i])
        }
      }
      this.getSources()
    },
    getSummaries (param) {
      const {columns} = param
      const sums = []
      if (this.form.type === 'z' && this.form.medication_amount > 0 && this.form.extract_way === '代煎') {
        sums[columns.length - 3] = '代煎：' + (this.form.medication_amount * 5).toFixed(2) + '元'
      }
      sums[columns.length - 2] = '邮费：' + this.getPostage() + '元'
      sums[columns.length - 1] = '总计：' + this.totalAmount + '元'
      return sums
    },
    getSources () {
      this.sources = []
      let total = 0
      for (var i in this.items) {
        if (this.sources.indexOf(this.items[i].source) < 0) {
          this.sources.push(this.items[i].source)
        }
        // 总计
        if (this.form.type === 'z') {
          total += this.items[i].price * this.items[i].amount * this.form.medication_amount
        } else {
          total += this.items[i].price * this.items[i].amount
        }
      }
      total = Math.ceil((total * 100).toFixed(2))
      total /= 100
      total += this.getPostage()
      this.totalAmount = total.toFixed(2)
    },
    getPostage () {
      // 根据所有来源计算邮费
      let postage = 0
      if (this.form.type === 'h') {
        // 西药存在不同来源
        for (const i in this.sources) {
          if (this.sources[i] === 'qlk') {
            postage += 13
          } else if (this.sources[i] !== 'local' && this.sources[i] !== 'yf') {
            postage += 10
          }
        }
      } else if (this.sources[0] !== 'local' && this.sources[0] !== 'yf') {
        // 中药只有一个来源
        postage += 10
      }
      return postage
    },
    handleExtract (val) {
      if (val === '代煎') {
        this.source = 'km'
      } else {
        this.source = ''
      }
    },
    handleSaveOrder () {
      if (this.form.patient_id === '') {
        Message.error('先选择就诊人')
        return
      }
      if (this.form.items.length === 0) {
        Message.error('先开药')
        return 
      }
      if (this.form.items.length === 0) {
        Message.error('先开药')
        return 
      }
      var isZType = false
      for (var i in this.form.items) {
        if (this.form.items[i].type === 'z') {
          isZType = true
        }  
      }
      if (this.form.diagnosis.length === 0) {
        Message.error('先填写临床诊断')
        return 
      }
      if (isZType && this.form.extract_way.length === 0) {
        Message.error('先填写煎作方式')
        return 
      }
      if (isZType && this.form.medication_methods.length === 0) {
        Message.error('先填写煎服方法')
        return 
      }
      if (isZType && this.form.usage.length === 0) {
        Message.error('先填写使用方法')
        return 
      }
      setPrescriptionOrder(this.form).then(response => {
        if (response.code === 1) {
          Message.info('修改药单成功')
          this.dialogFormVisible = false
          this.fetchData()
        } else {
          Message.info(response.msg)
        }
      })
    },
    getICDLibraries (search, diagnosis) {
      getICDList({ search: search, icds: diagnosis ? diagnosis.join(',') : '' }).then(response => {
        this.icds = response.data.list
      })
    },
    fetchData () {
      this.listLoading = true
      getPrescriptionList(this.listQuery).then(response => {
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
