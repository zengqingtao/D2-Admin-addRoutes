<template>
  <d2-container>
    <div>
      <el-row>
        <el-col :span="11">
          <el-card>
            <div slot="header" class="clearfix">
              <span>就诊人信息</span>
            </div>
            <div>
              <el-form ref="form" label-width="120px" :model="form">
                <el-row type="flex" justify="left">
                  <el-button @click="selectPatient" size="mini" type="success">选择</el-button>
                </el-row>
                <el-row type="flex" justify="left">
                    <el-col :span="12">
                      <div class="form-item">姓名：{{ patient.full_name }}</div>
                      <div class="form-item">年龄：{{ patient.age }}</div>
                      <div class="form-item">手机号码：{{ patient.phone }}</div>
                    </el-col>

                    <el-col :span="12">
                      <div class="form-item">身份证号：{{ patient.identification_number }}</div>
                      <div class="form-item">诊疗卡号：{{ patient.card }}</div>
                    </el-col>
                </el-row>
              </el-form>
            </div>
          </el-card>
        </el-col>

        <el-col :span="11" :offset="1">
          <el-card>
            <div slot="header" class="clearfix">
              <span>临床诊断</span>
            </div>
            <div>
              <!-- <el-input v-model="form.diagnosis" type="textarea"></el-input> -->
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
          </el-card>
        </el-col>
      </el-row>

      <el-row class="mt20">
        <el-col>
          <el-card>
            <div slot="header" class="clearfix">
              <span>其他</span>
            </div>
            <div>
              <el-form>
                <el-form-item label="病理及体征：">
                    <el-input v-model="form.pathological_signs" type="textarea" style="width:600px"></el-input>
                </el-form-item>
                <el-form-item label="相关检查结果：">
                    <el-input v-model="form.relation_result" type="textarea" style="width:600px"></el-input>
                </el-form-item>
              </el-form>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="mt20">
        <el-col>
          <el-card>
            <div slot="header" class="clearfix">
              <span>治疗项目</span>
              <el-button round size="mini" type="success" @click="handleTreatmentList">添加治疗项目</el-button>
              <el-button round size="mini" type="primary" @click="handleCommonTreatmentOrder(1)">通用治疗项目</el-button>
              <el-button round size="mini" type="default" @click="handleCommonTreatmentOrder(2)">我的常用治疗项目</el-button>
              <el-button round type="warning" size="mini" @click="handleTreatmentHistory()">历史治疗单</el-button>
            </div>
            <div>
              <el-table :data="form.items">
                <el-table-column prop="name" align="center" label="项目名称" min-width="120"></el-table-column>
                <el-table-column prop="code" align="center" label="检验号" min-width="110"></el-table-column>
                <el-table-column prop="sample" align="center" label="样本类型" min-width="100"></el-table-column>
                <el-table-column prop="type" align="center" label="类型" width="120"></el-table-column>
                <el-table-column label="项目详情" align="center" min-width="150">
                    <template slot-scope="scope">
                      {{ scope.row.detail }}
                    </template>
                </el-table-column>
                <el-table-column prop="time_period" align="center" label="时间段" width="120">
                  <template slot-scope="scope">{{ scope.row.time_period | parseTimePeriod }}</template>
                </el-table-column>
                <el-table-column prop="count" align="center" label="次数" width="150"></el-table-column>
                <el-table-column prop="organization_name" align="center" width="130" label="检查机构">
                </el-table-column>
                <el-table-column prop="checkstore_name" align="center" width="130" label="检查门店">
                </el-table-column>
                <el-table-column prop="price" align="center" label="零售价" min-width="120"></el-table-column>
                <el-table-column label="操作" align="center" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" @click="handleOrderItem(scope.$index, scope.row)" type="primary">编辑
                        </el-button>
                        <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="danger">删除
                        </el-button>
                    </template>
                </el-table-column>
              </el-table>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row style="margin-top:20px">
        <el-col>
          <el-card>
            <div class="center">
              <el-button type="primary" @click="handleSaveOrder">保存订单</el-button>
              <el-button type="primary" @click="handleSaveCommonOrder">保存为我的常用治疗订单</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 选择就诊人 -->
    <selectpatient ref="selectpatient" @changePatient="selectPati"></selectpatient>
    <treatment ref="treatment" @handleAddTreatment="handleAddTreatment"></treatment>
    <timeperiod ref="timeperiod" @handleSetTimeperiod="handleSetTimeperiod"></timeperiod>

    <commontreatmentorder ref="commontreatmentorder" @addCommonToOrder="addCommonToOrder" @commonDetail="commonDetail"></commontreatmentorder>
    <commontreatmentorderdetail ref="commontreatmentorderdetail"></commontreatmentorderdetail>

    <treatmenthistory ref="treatmenthistory" @addHistoryToOrder="addHistoryToOrder" @historyDetail="historyDetail"></treatmenthistory>
    <treatmenthistorydetail ref="treatmenthistorydetail"></treatmenthistorydetail>
  </d2-container>
</template>
<script>
import selectpatient from '@/components/lianhe/selectpatient'
import treatment from '@/components/lianhe/treatment'
import timeperiod from '@/components/lianhe/timeperiod'
import { addTreatmentOrder, getICDList } from '@/api/neworder'
import { Message } from 'element-ui'
import commontreatmentorder from '@/components/lianhe/commontreatmentorder'
import commontreatmentorderdetail from '@/components/lianhe/commontreatmentorderdetail'
import treatmenthistory from '@/components/lianhe/treatmenthistory'
import treatmenthistorydetail from '@/components/lianhe/treatmenthistorydetail'
import { getCommonTreatment, setCommonTreatment } from '@/api/hospital'
import { getTreatmentOrderItems } from '@/api/orders'
export default {
  components: {
    selectpatient,
    treatment,
    timeperiod,
    commontreatmentorder,
    commontreatmentorderdetail,
    treatmenthistory,
    treatmenthistorydetail
  },
  data () {
    return {
      patient: {
        full_name: '-',
        phone: '-',
        identification_number: '-',
        id: '-',
        card: '-',
        age: '-',
      },
      form: {
        patient_id: '',
        items: [],
        diagnosis: '',
        history_disease: '',
        pathological_signs: '',
        relation_result: '',
      },
      icds: [],
      temp: {
        shop_code: null,
        date: null,
        time_period: null,
      },
      dialogVisible: false,
      id: '',
      isBtnLoading: false,
      hasSave: false,
      ignore: false,
      itemIndex: 0,
      item: {}
    }
  },
  methods: {
    addHistoryToOrder (id) {
      var tmp = []
      for (var i in this.form.items) {
        tmp.push(this.form.items[i].treatment_id)
      }
      getTreatmentOrderItems({order_id: id}).then(response => {
        var items = response.data.items
        for (var i in items) {
          if (tmp.indexOf(items[i].examination_id) < 0) {
            items[i].time_period = ''
            items[i].shop_code = ''
            items[i].checkstore_name = ''
            items[i].date = ''
            items[i].treatment_order_id = ''
            items[i].count = 1
            this.form.items.push(items[i])
          }
        }
        this.getICDLibraries('', response.data.diagnosis)
      })
    },
    commonDetail (id) {
      this.$refs.commontreatmentorderdetail.commonDetail(id)
    },
    addCommonToOrder (id) {
      var tmp = []
      for (var i in this.form.items) {
        tmp.push(this.form.items[i].treatment_id)
      }
      getCommonTreatment({id: id}).then(response => {
        var items = response.data.items
        for (var i in items) {
          if (tmp.indexOf(items[i].examination_id) < 0) {
            items[i].time_period = ''
            items[i].shop_code = ''
            items[i].checkstore_name = ''
            items[i].date = ''
            items[i].treatment_order_id = ''
            items[i].count = 1
            this.form.items.push(items[i])
          }
        }
      })
    },
    handleSaveCommonOrder () {
      if (this.form.diagnosis === '' || this.form.pathological_signs === '' || this.form.relation_result === '') {
        Message.error('请完善诊断信息')
        return
      }
      if (this.form.items.length === 0) {
        Message.error('请添加治疗项目')
        return 
      }
      setCommonTreatment(this.form).then(response => {
        if (response.code === 1) {
          Message.info('保存通用治疗订单成功')
        } else {
          Message.error(response.msg)
        }
      })
    },
    handleCommonTreatmentOrder (type) {
      this.$refs.commontreatmentorder.showCommon(type)
    },
    handleTreatmentHistory () {
      if (this.form.patient_id == '') {
        Message.error('请先选择就诊人')
        return
      }
      this.$refs.treatmenthistory.showHistory(this.form.patient_id)
    },
    historyDetail (order) {
      this.$refs.treatmenthistorydetail.historyDetail(order)
    },
    selectPatient() {
      this.$refs.selectpatient.dialogVisible = true
    },
    selectPati(val) {
      this.patient.full_name = val.full_name
      this.patient.phone = val.phone
      this.patient.identification_number = val.identification_number
      this.patient.id = val.id
      this.patient.card = val.card
      this.patient.age = val.age
      this.form.patient_id = val.id
    },
    handleTreatmentList () {
      var tmp = []
      for (var i in this.form.items) {
        tmp.push(this.form.items[i].treatment_id)
      }
      this.$refs.treatment.handleTreatmentList(tmp)
    },
    handleSetTimeperiod (item) {
      this.form.items[this.itemIndex] = item
    },
    handleSetTimeperiod (item) {
      this.form.items[this.itemIndex] = item
    },
    handleDelete (index, item) {
      this.form.items.splice(index, 1)
      this.handleOrderAmount()
    },
    handleAddTreatment (item) {
      this.form.items.push(item)
      this.handleOrderAmount()
    },
    handleOrderAmount () {
      var tmp = 0
      for (var i in this.form.items) {
        tmp += parseFloat(this.form.items[i].price)
      }
      this.form.amount = parseFloat(tmp).toFixed(2)
    },
    getSummaries () {
      var sums = []
      sums[0] = '总额：' + this.form.amount + '元'
      return sums
    },
    handleOrderItem (index, item) {
      this.item = item
      this.itemIndex = index
      this.$refs.timeperiod.handleTimeperiod(item, 'treatment')
    },
    resetForm () {
      this.form = {
        patient_id: '',
        items: [],
        diagnosis: '',
        history_disease: '',
        pathological_signs: '',
        relation_result: '',
        amount: 0
      }
      this.patient = {
        full_name: '-',
        phone: '-',
        identification_number: '-',
        id: '-',
        card: '-',
        age: '-',
      }
    },
    getICDLibraries (search) {
      getICDList({ search: search }).then(response => {
        this.icds = response.data.list
      })
    },
    handleSaveOrder () {
      if (this.form.patient_id === '') {
        Message.error('请完善就诊人信息')
        return
      }
      if (this.form.diagnosis === '' || this.form.pathological_signs === '' || this.form.relation_result === '') {
        Message.error('请完善诊断信息')
        return
      }
      if (this.form.items.length === 0) {
        Message.error('请添加治疗项目')
        return 
      }
      addTreatmentOrder(this.form).then(response => {
        if (response.code === 1) {
          Message.info('创建订单成功')
          this.resetForm()
        } else {
          Message.error(response.msg)
        }
      })
    }
  }
}
</script>
<style scoped>
.form-item{padding:8px 0;}
</style>
