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
              <span style="margin-right:20px;">检查项目</span>
              <el-button round type="success" size="mini" @click="handleExaminationList">添加检查项目</el-button>
              <el-button round type="primary" size="mini" @click="handleCommonExaminationOrder(1)">通用检查项目</el-button>
              <el-button round type="default" size="mini" @click="handleCommonExaminationOrder(2)">我的常用检查项目</el-button>
              <el-button round type="warning" size="mini" @click="handleExaminationHistory()">历史检查单</el-button>
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
              <el-button type="primary" @click="handleSaveCommonOrder">保存为我的常用检查订单</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 选择就诊人 -->
    <selectpatient ref="selectpatient" @changePatient="selectPati"></selectpatient>
    <examination ref="examination" @handleAddExamination="handleAddExamination"></examination>
    <timeperiod ref="timeperiod" @handleSetTimeperiod="handleSetTimeperiod"></timeperiod>

    <commonexaminationorder ref="commonexaminationorder" @addCommonToOrder="addCommonToOrder" @commonDetail="commonDetail"></commonexaminationorder>
    <commonexaminationorderdetail ref="commonexaminationorderdetail"></commonexaminationorderdetail>

    <examinationhistory ref="examinationhistory" @addHistoryToOrder="addHistoryToOrder" @historyDetail="historyDetail"></examinationhistory>
    <examinationhistorydetail ref="examinationhistorydetail"></examinationhistorydetail>
  </d2-container>
</template>
<script>
import selectpatient from '@/components/lianhe/selectpatient'
import examination from '@/components/lianhe/examination'
import timeperiod from '@/components/lianhe/timeperiod'
import commonexaminationorder from '@/components/lianhe/commonexaminationorder'
import commonexaminationorderdetail from '@/components/lianhe/commonexaminationorderdetail'
import examinationhistory from '@/components/lianhe/examinationhistory'
import examinationhistorydetail from '@/components/lianhe/examinationhistorydetail'
import { Message } from 'element-ui'
import { addExaminationOrder, getICDList } from '@/api/neworder'
import { getCommonExamination, setCommonExamination } from '@/api/hospital'
import { getExamOrderItems } from '@/api/orders'
export default {
  components: {
    selectpatient,
    examination,
    timeperiod,
    commonexaminationorder,
    commonexaminationorderdetail,
    examinationhistory,
    examinationhistorydetail
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
        amount: 0
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
        tmp.push(this.form.items[i].examination_id)
      }
      getExamOrderItems({order_id: id}).then(response => {
        var items = response.data.items
        for (var i in items) {
          if (tmp.indexOf(items[i].examination_id) < 0) {
            items[i].time_period = ''
            items[i].shop_code = ''
            items[i].checkstore_name = ''
            items[i].date = ''
            items[i].examination_order_id = ''
            this.form.items.push(items[i])
          }
        }
        this.getICDLibraries('', response.data.diagnosis)
      })
    },
    commonDetail (id) {
      this.$refs.commonexaminationorderdetail.commonDetail(id)
    },
    addCommonToOrder (id) {
      var tmp = []
      for (var i in this.form.items) {
        tmp.push(this.form.items[i].examination_id)
      }
      getCommonExamination({id: id}).then(response => {
        var items = response.data.items
        for (var i in items) {
          if (tmp.indexOf(items[i].examination_id) < 0) {
            items[i].time_period = ''
            items[i].shop_code = ''
            items[i].checkstore_name = ''
            items[i].date = ''
            items[i].examination_order_id = ''
            this.form.items.push(items[i])
          }
        }
        this.getICDLibraries('', response.data.diagnosis)
      })
    },
    handleSaveCommonOrder () {
      if (this.form.diagnosis === '' || this.form.pathological_signs === '' || this.form.relation_result === '') {
        Message.error('请完善诊断信息')
        return
      }
      if (this.form.items.length === 0) {
        Message.error('请添加检查项目')
        return 
      }
      setCommonExamination(this.form).then(response => {
        if (response.code === 1) {
          Message.info('保存通用检查订单成功')
        } else {
          Message.error(response.msg)
        }
      })
    },
    handleCommonExaminationOrder (type) {
      this.$refs.commonexaminationorder.showCommon(type)
    },
    handleExaminationHistory () {
      if (this.form.patient_id == '') {
        Message.error('请先选择就诊人')
        return
      }
      this.$refs.examinationhistory.showHistory(this.form.patient_id)
    },
    historyDetail (order) {
      this.$refs.examinationhistorydetail.historyDetail(order)
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
    handleExaminationList () {
      var tmp = []
      for (var i in this.form.items) {
        tmp.push(this.form.items[i].examination_id)
      }
      this.$refs.examination.handleExaminationList(tmp)
    },
    handleSetTimeperiod (item) {
      this.form.items[this.itemIndex] = item
    },
    handleDelete (index, item) {
      this.form.items.splice(index, 1)
      this.handleOrderAmount()
    },
    handleAddExamination (item) {
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
      this.$refs.timeperiod.handleTimeperiod(item, 'examination')
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
        Message.error('请添加检查项目')
        return 
      }
      addExaminationOrder(this.form).then(response => {
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
<style>
.form-item{padding:8px 0;}
</style>
