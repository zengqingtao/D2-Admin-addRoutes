<template>
  <div>
    <el-row>
      <el-col :span="11">
        <el-card>
          <div slot="header" class="clearfix">
            <span>费用及开药</span>
          </div>
          <div>
            <div class="h2 mb2" v-if="form.number">单号：{{ form.number }}</div>
              <el-row type="flex" justify="left"  class="mt20">
                  咨询费：{{form.consult_fee}}
                  <!-- <el-input-number v-model="form.consult_fee" :min="0" :max="100" controls-position="right"></el-input-number> -->
              </el-row>
              <el-row type="flex" justify="left" class="mt20">
                  <el-col>临床诊断{{form.diagnosis}}
                    <!-- <el-input type="textarea" v-model="form.diagnosis" class="mt2"></el-input> -->
                  </el-col>
              </el-row>
              <el-row type="flex" justify="left">
                  <div class="h2 mt20">
                      开药类型
                      <template style="margin-left: 20px">
                          <el-radio-group v-model="form.type" @change="handleClear">
                              <el-radio label="z">中药饮片</el-radio>
                              <el-radio label="h">西药/中成药/其他</el-radio>
                          </el-radio-group>
                      </template>
                  </div>
              </el-row>
          </div>
        </el-card>
      </el-col>

      <el-col :offset="1" :span="11">
        <el-card>
          <div slot="header" class="clearfix" v-if="form.type === 'z'" >
            <span>中药使用事项</span>
          </div>
          <el-row type="flex" justify="left" v-if="form.type === 'z'">
            <div class="el-form-item__label">
                煎作方式{{form.extract_way}} {{form.wj_type}}  {{form.gf_type}}
                <!-- <el-select v-model="form.extract_way" filterable placeholder="请选择煎作方式" @change="handleExtract" style="width:120px;">
                    <el-option v-for="item in extractWay" :key="item.value" :label="item.value"
                               :value="item.value"></el-option>
                </el-select>
                <el-select v-model="form.wj_type" v-if="wjVisible"  filterable placeholder="请选择丸剂" style="width:120px;">
                    <el-option v-for="item in wjType" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
                <el-select v-model="form.gf_type" v-if="gfVisible"  filterable placeholder="请选择膏方" style="width:120px;">
                    <el-option v-for="item in gfType" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select> -->
            </div>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    
    <div class="pb3 mt20">
      <!-- <div class="center h2 pb2">
          <span class="h1">开药单</span>
          <el-button @click="handleMedicine()" type="primary" size="mini" v-if="isPay">添加</el-button>
      </div> -->
      <div class="center h2 pb2">
          <el-tag type="warning" v-if="warningVisible">请注意，你现在开的药品分散在不同药库，建议在同一张订单 尽量只开一个药库的药品</el-tag>
      </div>
      <el-table :data="items" show-summary :summary-method="getSummaries">
          <el-table-column prop="drug_name" label="药品名称" min-width="150"></el-table-column>
          <el-table-column prop="type" label="类型" min-width="100">
            <template slot-scope="{$index, row}">
              <span>{{ row.type | parseMedicineType }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="dosage_form" label="剂型" min-width="100"></el-table-column>
          <el-table-column prop="specifications" label="规格" min-width="100"></el-table-column>
          <el-table-column prop="price" label="零售价" min-width="100"></el-table-column>
          <el-table-column prop="amount" label="总量" min-width="100"></el-table-column>
          <el-table-column label="小计" min-width="100">
              <template slot-scope="{$index, row}">
                  {{ (row.price * row.amount).toFixed(form.type === 'z' ? 4 : 2) }}
              </template>
          </el-table-column>
          <el-table-column label="用法" min-width="180">
              <template slot-scope="{$index, row}">
                  <pre>制作方法：{{ (row.usage == '' ? '无' : row.usage) }} 用量：{{ row.amount }}</pre>
              </template>
          </el-table-column>
          <el-table-column label="药品编号" min-width="150">
              <template slot-scope="{$index, row}">
                  {{ row.code }}
              </template>
          </el-table-column>
          <el-table-column prop="source" label="来源" min-width="70">
            <template slot-scope="{$index, row}">
              <span>{{ row.source | parseMedicineSource }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="control" label="操作" align="center" width="160px" v-if="isPay">
              <template slot-scope="{$index, row}">
                  <el-row>
                      <el-button type="danger" size="small" @click="handleDelete($index, row)">删除</el-button>
                      <el-button type="primary" size="small" @click="showModify($index, row)">编辑</el-button>
                  </el-row>
              </template>
          </el-table-column>
      </el-table>
  </div>

  <el-form  class="mt20" :model="form" v-if="form.type === 'z'">
      <el-form-item label="剂数">
        <el-input-number v-model="form.medication_amount" controls-position="right" :min="isAgent?3:1" :max='99'></el-input-number>
      </el-form-item>
      <el-form-item label="煎服方法">
        <!-- <el-input type="textarea" :autosize="{ minRows: 2,}" v-model="form.medication_methods" :rows='2'
                    placeholder="请填写用药方法" ></el-input> -->
        {{form.medication_methods}}
      </el-form-item>
      <el-form-item label="处方备注">
        <!-- <el-input type="textarea" v-model="form.remark" ></el-input> -->
        {{form.remark}}
      </el-form-item>
      <el-form-item label="使用方法">
        <!-- <el-select v-model="form.usage" filterable placeholder="请选择使用方法">
          <el-option v-for="item in herbsDose" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
        </el-select> -->
        {{form.usage}}
      </el-form-item>
    </el-form>

    <!-- el-row>
      <el-col >
        <div class="center">
          <el-button type="primary" @click="handleSaveOrder">保存</el-button>
        </div>
      </el-col>
    </el-row> -->
  </div>
</template>
<script>
import { doseUnit, extractWay, wjType, gfType, herbsDose, usage, frequency, herbsUsage, dosageTime } from '@/data/data'
import { addPrescriptionOrder } from '@/api/neworder'
import { Message } from 'element-ui'
export default {
  name: 'prescriptioninfo',
  data () {
    return {
      isPay: true,
      wjVisible: false,
      gfVisible: false,
      warningVisible: false,
      extractWay: extractWay,
      wjType: wjType,
      gfType: gfType,
      herbsDose: herbsDose,
      form: {
        id: null,
        number: null,
        order_id: null,
        patient_id: '',
        diagnosis: '',
        extract_way: '',
        // extract_amount: 3,
        wj_type: '',
        gf_type: '',
        type: 'z',
        type_trans: '',
        status: '',
        medication_amount: 1,
        medication_methods: '',
        remark: '',
        usage: '',
        consult_fee: 0,
        is_sign: false,
        items: []
      },
      items: [],
      medicine_ids: [],
      medicineIndex: -1,
      sources: [],
      source: '',
      totalAmount: 0,
      isAgent: false,
      agentAmount: 0
    }
  },
  methods: {
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
      this.$emit('handleMedicine', this.getMedicineIds(), this.form.type, this.source)
    },
    handlePrescriptioninfo (prescriptioninfo, order) {
      if (prescriptioninfo === null) {
        this.form = {
          id: null,
          number: null,
          order_id: order.id,
          patient_id: order.patient_id,
          diagnosis: '',
          extract_way: '',
          wj_type: '',
          gf_type: '',
          type: 'z',
          status: '',
          medication_amount: 1,
          medication_methods: '',
          remark: '',
          usage: '',
          consult_fee: 0,
          is_sign: false,
          items: []
        }
      } else {
        this.form = prescriptioninfo
      }
      this.handleClear(this.form.type)  
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
    handleUpdateMedicineSelected () {
      this.$emit('handleUpdateMedicineSelected', this.getMedicineIds())
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
      addPrescriptionOrder(this.form).then(response => {
        if (response.code === 1) {
          Message.info('开药单成功')
        } else {
          Message.info(response.msg)
        }
      })
    },
    getMedicineIds () {
      var medicine_ids = []
      for (var i in this.form.items) {
        medicine_ids.push(this.form.items[i].medicine_id)
      }
      return medicine_ids
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
      this.$emit('handleEditMedicine', item)
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
      this.wjVisible = val === '丸剂'
      this.gfVisible = val === '膏方'
      this.isAgent = val === '代煎'
      this.agentAmount = (this.isAgent ? this.form.medication_amount * 5 : 0)
    }
  }
}
</script>
