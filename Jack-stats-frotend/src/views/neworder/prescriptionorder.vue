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
              <span>咨询费</span>
            </div>
            <div>
              <el-input-number v-model="form.consult_fee" :min="0" :max="10" label="描述文字"></el-input-number>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row class="mt20">
        <el-col :span="11">
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

        <el-col :span="11" :offset="1">
          <el-card>
            <div slot="header" class="clearfix">
              <span>开药类型</span>
            </div>
            <div>
              <el-radio-group v-model="form.type" @change="handleClear">
                <el-radio label="z">中药饮片</el-radio>
                <el-radio label="h">西药/中成药/其他</el-radio>
              </el-radio-group>
            </div>
            <div v-if="form.type == 'z'">
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
            
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-row style="margin-top:20px">
      <el-col>
        <el-card>
          <div slot="header" class="clearfix">
            <span>开药单</span>
            <el-button @click="handleMedicine()" type="primary" size="mini" round>添加</el-button>
            <el-button round type="success" size="mini" @click="handleCommonPrescriptionOrder()">常用处方</el-button>
            <el-button round type="warning" size="mini" @click="handlePrescriptionHistory()">历史处方</el-button>
          </div>
          <div>
            <el-table :data="items" class="mb3" show-summary :summary-method="getSummaries" fit>
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
                      <pre v-if="row.type == 'h'">{{ row.frequency }}，一次{{ row.amount }}{{ row.dose_unit }}，{{ row.dosage_time }}，{{ row.usage }}</pre>
                      <pre v-if="row.type == 'z'">制作方法：{{ row.usage ? row.usage : '无' }}</pre>
                  </template>
              </el-table-column>
              <el-table-column label="药品编号" min-width="150" prop="code"></el-table-column>
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
          </div>
        </el-card>
      </el-col>

      <el-col v-if="form.type === 'z'" style="margin-top:20px">
        <el-card>
          <el-form :model="form">
            <el-form-item label="剂数：">
                <el-input-number v-model="form.medication_amount" controls-position="right" :min="isAgent?3:1"
                                 :max='99'></el-input-number>
            </el-form-item>
            <el-form-item label="煎服方法：">
                <el-input type="textarea" :autosize="{ minRows: 2,}" v-model="form.medication_methods" :rows='2'
                          placeholder="请填写煎服方法"></el-input>
            </el-form-item>
            <el-form-item label="处方备注：">
                <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="使用方法：">
                <el-select v-model="form.usage" filterable placeholder="请选择使用方法">
                    <el-option v-for="item in herbsDose" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-row style="margin-top:20px">
      <el-col>
        <el-card>
          <div class="center">
            <el-button type="primary" @click="handleSaveOrder">保存订单</el-button>
            <el-button type="primary" @click="handleSaveCommonOrder">保存为我的常用常用处方</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 选择就诊人 -->
    <selectpatient ref="selectpatient" @changePatient="selectPati"></selectpatient>
    <medicine ref="medicine" @handleEditMedicine="handleEditMedicine"></medicine>
    <editmedicine ref="editmedicine" @handleAddOrSetMedicine="handleAddOrSetMedicine"></editmedicine>

    <commonprescriptionorder ref="commonprescriptionorder" @addCommonToOrder="addCommonToOrder" @commonDetail="commonDetail"></commonprescriptionorder>
    <commonprescriptionorderdetail ref="commonprescriptionorderdetail"></commonprescriptionorderdetail>

    <prescriptionhistory ref="prescriptionhistory" @addHistoryToOrder="addHistoryToOrder" @historyDetail="historyDetail"></prescriptionhistory>
    <prescriptionhistorydetail ref="prescriptionhistorydetail"></prescriptionhistorydetail>
  </d2-container>
</template>
<script>
import { doseUnit, extractWay, wjType, gfType, herbsDose, usage, frequency, herbsUsage, dosageTime, dangerHerb, dangerCombination } from '@/data/data'
import selectpatient from '@/components/lianhe/selectpatient'
import medicine from '@/components/lianhe/medicine'
import editmedicine from '@/components/lianhe/editmedicine'
import commonprescriptionorder from '@/components/lianhe/commonprescriptionorder'
import commonprescriptionorderdetail from '@/components/lianhe/commonprescriptionorderdetail'
import prescriptionhistory from '@/components/lianhe/prescriptionhistory'
import prescriptionhistorydetail from '@/components/lianhe/prescriptionhistorydetail'
import { addPrescriptionOrder, getICDList } from '@/api/neworder'
import { getCommonPrescriptionOrder, setCommonPrescriptionOrder } from '@/api/hospital'
import { getPrescriptionOrderItems } from '@/api/orders'
import { Message } from 'element-ui'
export default {
  components: {
    selectpatient,
    medicine,
    editmedicine,
    commonprescriptionorder,
    commonprescriptionorderdetail,
    prescriptionhistory,
    prescriptionhistorydetail
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
      form: {
        patient_id: '',
        diagnosis: '',
        extract_way: '',
        wj_type: '',
        gf_type: '',
        type: 'z',
        medication_amount: 1,
        medication_methods: '',
        remark: '',
        consult_fee: 0,
        usage: '',
        is_sign: false,
        items: [],
      },
      icds: [],
      items: [],
      hItems: [], // 西药
      zItems: [], // 中药
      patient: {
        full_name: '-',
        phone: '-',
        identification_number: '-',
        id: '-',
        age: '-',
        card: '-',
      },
      id: null,
      // 未乘以剂数，除去邮费及代煎费的小计
      itemsAmount: 0,
      // 判断是否用户点击中西药切换
      isClick: true,
      source: '',
      dialogVisible: false,
      extractVisible: false,
      agentVisible: false,
      drug_names: '',
      extractWay,
      wjType,
      gfType,
      herbsDose,
      dangerHerb,
      dangerCombination,
      isBtnLoading: false,
      medicine_ids: [],
      medicineIndex: -1,
      sources: [],
      totalAmount: 0
    }
  },
  methods: {
    addHistoryToOrder (id) {
      getPrescriptionOrderItems({ 'order_id': id }).then(response => {
        var tmp = this.getMedicineIds()
        response.data.items.forEach(i => {
          if (tmp.indexOf(i.medicine_id) < 0) {
            i.id = ''
            this.handleAddOrSetMedicine(i)
          }
        })
        this.getICDLibraries('', response.data.diagnosis)
      })
    },
    addCommonToOrder (id) {
      getCommonPrescriptionOrder({id: id}).then(response => {
        var tmp = this.getMedicineIds()
        response.data.items.forEach(i => {
          if (tmp.indexOf(i.id) < 0) {
            this.handleAddOrSetMedicine(i)
          }
        })
        this.getICDLibraries('', response.data.diagnosis)
      })
    },
    handleSaveCommonOrder () {
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
      this.form.amount = this.totalAmount
      setCommonPrescriptionOrder(this.form).then(response => {
        if (response.code === 1) {
          Message.info('保存常用处方成功')
        } else {
          Message.info(response.msg)
        }
      })
    },
    handleCommonPrescriptionOrder () {
      this.$refs.commonprescriptionorder.showCommon(this.form.type)
    },
    commonDetail (id) {
      this.$refs.commonprescriptionorderdetail.commonDetail(id)
    },
    handlePrescriptionHistory () {
      if (this.form.patient_id == '') {
        Message.error('请先选择就诊人')
        return
      }
      this.$refs.prescriptionhistory.showHistory(this.form.patient_id)
    },
    historyDetail (order) {
      this.$refs.prescriptionhistorydetail.historyDetail(order)
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
      if (this.form.type === 'h') {
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
    handleSaveOrder () {
      if (this.form.patient_id === '') {
        Message.error('先选择就诊人')
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
      addPrescriptionOrder(this.form).then(response => {
        if (response.code === 1) {
          Message.info('开药单成功')
        } else {
          Message.info(response.msg)
        }
      })
    },
    handleDelete (index, item) {
      this.items.splice(index, 1)
      this.form.items.forEach((v, i) => {
        if (v.medicine_id === item.medicine_id) {
          this.form.items.splice(i, 1)
        }
      })
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
    getICDLibraries (search) {
      getICDList({ search: search }).then(response => {
        this.icds = response.data.list
      })
    },
    handleExtract (val) {
      if (val === '代煎') {
        this.source = 'km'
      } else {
        this.source = ''
      }
    }
  }
}
</script>
<style scoped>
.form-item{padding:8px 0;}
</style>
