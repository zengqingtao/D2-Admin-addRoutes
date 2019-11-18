<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="RP:" width="90%">

      <el-table
              :data="medicines"
              element-loading-text="拼命加载中"
              stripe>
          <el-table-column prop="drug_name" label="名称" min-width="100"></el-table-column>
          <el-table-column prop="brand" label="品牌" min-width="100"></el-table-column>
          <el-table-column prop="specifications" label="规格"></el-table-column>
          <el-table-column prop="dose_unit" label="单位"></el-table-column>
          <el-table-column prop="dosage_and_administration" label="用法参考"></el-table-column>
          <el-table-column prop="price" label="零售价"></el-table-column>
          <el-table-column prop="count" label="库存">
              <template slot-scope="{$index, row}">{{ row.count === -1 ? '∞' : row.count }}</template>
          </el-table-column>
      </el-table>

      <el-form :inline="true" label-width="80px" class="mt20" v-if="row.type === 'h'">
        <el-form-item label="每次剂量">
          <el-input v-model="row.sig"></el-input>
        </el-form-item>
        <el-form-item label="剂量单位">
          <el-select v-model="row.dose_unit" filterable allow-create placeholder="请选择单位">
            <el-option v-for="item in doseUnit" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="频次">
          <el-select v-model="row.frequency" filterable allow-create placeholder="请选择频次">
            <el-option v-for="item in frequency" :key="item.value" :label="item.value"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="天数">
          <el-input-number
            v-model="row.days"
            controls-position="right"
            :min="1"
            :max="99"></el-input-number>
        </el-form-item>
        <el-form-item label="用药时间">
          <el-select v-model="row.dosage_time" filterable allow-create placeholder="请选择用药时间">
              <el-option v-for="item in dosageTime" :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="用法">
          <el-select v-model="row.usage" filterable allow-create placeholder="请选择用法">
              <el-option v-for="item in usage" :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="总量（件)">
          <el-input-number v-model="row.amount" controls-position="right" :min="1"
                                   :max="parseInt(row.count)"></el-input-number>
        </el-form-item>
      </el-form>

      <div style="margin: 20px;"></div>

      <el-form :inline="true" label-width="80px" v-if="row.type === 'z'">
          <el-form-item label="制作方法">
              <el-select v-model="row.usage" filterable allow-create clearable placeholder="请选择用法">
                  <el-option v-for="item in herbsUsage" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="总量">
              <el-input-number v-model="row.amount" controls-position="right" :min="1"  :max="parseInt(row.count)"></el-input-number>
          </el-form-item>
          <el-form-item label="单位：">
              {{ row.dose_unit }}
          </el-form-item>
      </el-form>

      <el-row class="center" style="margin-top: 20px">
          <el-button type="primary" class="center" @click="onSubmit">确认</el-button>
      </el-row>

    </el-dialog>
  </div>
</template>
<script>
import { doseUnit, extractWay, wjType, gfType, herbsDose, usage, frequency, herbsUsage, dosageTime } from '@/data/data'
import { Message } from 'element-ui'
export default{
  name: 'editmedicine',
  data () {
    return {
      medicine: {},
      dialogVisible: false,
      medicines: [],
      row: {},
      doseUnit: doseUnit,
      extractWay: extractWay,
      wjType: wjType,
      gfType: gfType,
      herbsDose: herbsDose,
      usage: usage,
      frequency: frequency,
      herbsUsage: herbsUsage,
      dosageTime: dosageTime
    }
  },
  methods: {
    handleEditMedicine (medicine) {
      this.medicines = []
      this.row = medicine
      this.medicines.push(medicine)
      this.dialogVisible = true
    },
    onSubmit () {
      if (this.row.amount === undefined || this.row.amount <= 0) {
        Message.error('先选择总量')
        return
      }
      if (this.row.type === 'z') {
        if (this.row.usage === undefined || this.row.usage === '' ) {
          Message.error('先选择制作方法')
          return
        }  
      } else {
        if (this.row.sig === undefined || this.row.sig === '' ) {
          Message.error('先填写每日剂量')
          return
        }
        if (this.row.frequency === undefined || this.row.frequency === '' ) {
          Message.error('先填写频次')
          return
        }
        if (this.row.dose_unit === undefined || this.row.dose_unit === '' ) {
          Message.error('先选择剂量单位')
          return
        }
        if (this.row.dosage_time === undefined || this.row.dosage_time === '' ) {
          Message.error('先选择用药时间')
          return
        }
        if (this.row.usage === undefined || this.row.usage === '' ) {
          Message.error('先选择用法')
          return
        }
        if (this.row.days === undefined || this.row.days <= 0 ) {
          Message.error('先选择用药天数')
          return
        }
      }
      // 新增
      var tmp = {}
      if (this.row.medicine_id === undefined || this.row.medicine_id === '') {
        this.row.medicine_id = this.row.id
        this.row.id = ''
      }
      tmp = {'id': this.row.id, 'code': this.row.code, 'brand': this.row.band, 'out_code': this.row.out_code, 'out_price': this.row.out_price, 'drug_name': this.row.drug_name, 'is_rx': this.row.is_rx, 'type': this.row.type, 'specifications': this.row.specifications, 'generic_name': this.row.generic_name, 'approval_number': this.row.approval_number, 'dosage_form': this.row.dosage_form, 'dose_unit': this.row.dose_unit, 'price': this.row.price, 'source': this.row.source, 'days': this.row.days, 'amount': this.row.amount, 'sig': this.row.sig, 'frequency': this.row.frequency, 'dosage_time': this.row.dosage_time, 'usage': this.row.usage, 'medicine_id': this.row.medicine_id}
      this.$emit('handleAddOrSetMedicine', tmp)
      this.dialogVisible = false
    }
  }
}
</script>
