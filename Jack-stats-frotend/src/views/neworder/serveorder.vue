<template>
  <d2-container>
  <el-card>
      <div class="form-title center mb3 h1">就诊人信息</div>
      <el-form ref="form" label-width="120px" :model="form">
        <el-form-item label="就诊人：">
          <el-button @click="selectPatient" size="mini" type="success">选择</el-button>
        </el-form-item>
        <el-row type="flex" justify="left">
          <el-col :span="12">
            <el-form-item label="姓名：">
              <div v-html="patient.full_name"></div>
            </el-form-item>

            <el-form-item label="年龄：">
              <div v-html="patient.age"></div>
            </el-form-item>

            <el-form-item label="手机号码：">
              <div v-html="patient.phone"></div>
            </el-form-item>
          </el-col>

          <el-col :span="12">
            <el-form-item label="身份证号：">
              <div v-html="patient.identification_number"></div>
            </el-form-item>
            <el-form-item label="诊疗卡号：">
              <div v-html="patient.card"></div>
            </el-form-item>
            <el-form-item label="其他">
              <el-button size="mini" type="primary" @click="handleCommonServeOrder()">我的常用服务单</el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="left">
          <el-form-item label="服务名称：">
            <el-input v-model="form.name">
            </el-input>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="left">
          <el-form-item label="价格：">
            <el-input-number controls-position="right" :min="0" v-model="form.amount">
            </el-input-number>
          </el-form-item>
        </el-row>
        <el-row type="flex" justify="left">
          <el-form-item label="服务类型：">
            <el-select v-model="product_type_id">
              <el-option v-for="(v, i) in productTypeOptions" :key="i" :label="v.name"
                     :value="v.id"></el-option>
            </el-select>
            <el-select v-model="form.serve_type_id" v-if="product_type_id">
              <el-option v-for="(v, i) in serveTypeOptions" :key="i" :label="v.name"
                     :value="v.id"></el-option>
            </el-select>
          </el-form-item>
        </el-row>
        <el-row justify="left">
          <el-form-item label="简介：">
            <el-input type="textarea" :autosize="{ minRows: 2 }" placeholder="请输入内容"
                  v-model="form.summary"></el-input>
          </el-form-item>
        </el-row>

        <el-row type="flex" justify="center">
          <el-button type="primary" class="right" @click="onSubmit" :loading="loading">提交订单</el-button>
          <el-button type="primary" @click="handleSaveCommonOrder">保存为我的常用服务订单</el-button>
        </el-row>
      </el-form>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" width="30%">
      <span class="order-create">创建订单成功</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">关闭</el-button>
        <el-button type="primary" @click="handleCheck">查看订单</el-button>
      </span>
    </el-dialog>
    <!-- 选择就诊人 -->
    <selectpatient ref="selectpatient" @changePatient="selectPati"></selectpatient>
    <commonserveorder ref="commonserveorder" @addCommonToOrder="addCommonToOrder" @commonDetail="commonDetail"></commonserveorder>
    <commonserveorderdetail ref="commonserveorderdetail"></commonserveorderdetail>
  </d2-container>
</template>
<script>
import selectpatient from '@/components/lianhe/selectpatient'
import { getTypes, addServeOrder } from '@/api/neworder'
import { setCommonServeOrder, getCommonServeOrder } from '@/api/hospital'
import commonserveorder from '@/components/lianhe/commonserveorder'
import commonserveorderdetail from '@/components/lianhe/commonserveorderdetail'
import { Message } from 'element-ui'
export default {
  components: {
    selectpatient,
    commonserveorder,
    commonserveorderdetail
  },
  data() {
    return {
      form: {
        name: '',
        patient_id: '',
        amount: 0,
        summary: '',
        serve_type_id: null,
      },
      patient: {
        full_name: '-',
        phone: '-',
        identification_number: '-',
        id: '-',
        card: '-',
        age: '-',
      },
      dialogVisible: false,
      id: '',
      loading: false,
      hasSave: false,
      product_type_id: null,
      allServeTypeOptions: [],
      serveTypeOptions: [],
      productTypeOptions: [],
      tempType: null,
      props: {
        value: 'id',
        label: 'name',
      },
      isBtnLoading: false
    }
  },
  watch: {
    '$store.state.keypress.keyCode'(val) {
      if (!val) return
      if (!this.preventDialogEnter()) return
      val = val.split('|')
      if (~~val[0] === 13) {
        this.onSubmit()
      }
    },
    product_type_id(val, oldVal) {
      if (val && oldVal !== val) {
        this.form.serve_type_id = null
        this.selectOptions(val)
      }
    },
    'form.serve_type_id'(val) {
      if (val) {
        let temp = this.allServeTypeOptions.find(i => i.id === val)
        this.form.amount = temp ? temp.price : 0
      }
    },
  },
  methods: {
    handleSaveCommonOrder () {
      if (this.form.name.length === 0) {
        Message.error('先填写服务名称')
        return
      }
      if (this.product_type_id === null || this.product_type_id < 0) {
        Message.error('先选择服务类型')
        return
      }
      this.isBtnLoading = true
      // 接口
      setCommonServeOrder(this.form).then(response => {
        Message.success('保存通用服务订单成功')
      })
    },
    handleCommonServeOrder () {
      this.$refs.commonserveorder.showCommon()
    },
    commonDetail (id) {
      this.$refs.commonserveorderdetail.commonDetail(id)
    },
    addCommonToOrder (id) {
      getCommonServeOrder({id: id}).then(response => {
        this.product_type_id = response.data.product_type_id
        this.form.name = response.data.name
        this.form.summary = response.data.summary
        this.tempType = response.data.serve_type_id
      }).finally(() => {
        this.form.serve_type_id = this.tempType
      })
    },
    selectOptions(val) {
      let selected = this.allServeTypeOptions.filter(i => i.product_type_id === val)
      this.serveTypeOptions = selected
    },
    showHistory() {
      this.$refs.util.showHistory()
    },
    showMyCommon() {
      this.$refs.util.showMyCommon()
    },
    refreshServeOrder() {
      this.$store.dispatch('getServe')
    },
    preventDialogEnter() {
      return !this.$refs.selectpatient.dialogVisible
    },
    closeReserve(res) {
      this.resetForm()
      this.dialogVisible = true
      this.id = res.id
      this.type = res.type
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
    onSubmit() {
      if (this.form.name.length === 0) {
        Message.error('先填写服务名称')
        return
      }
      if (this.patient.full_name === '-') {
        Message.error('先选择就诊人')
        return
      }
      if (this.product_type_id === null || this.product_type_id < 0) {
        Message.error('先选择服务类型')
        return
      }
      this.isBtnLoading = true
      // 接口
      addServeOrder(this.form).then(response => {
        Message.success('创建服务订单成功')
        this.form = {
          name: '',
          patient_id: '',
          amount: 0,
          summary: '',
          serve_type_id: null,
        }
        this.patient = {
          full_name: '-',
          phone: '-',
          identification_number: '-',
          id: '-',
          card: '-',
          age: '-',
        }
      })
    },
    resetForm() {
      this.patient.full_name = '-'
      this.patient.phone = '-'
      this.patient.identification_number = '-'
      this.patient.id = '-'
      this.patient.card = '-'
      this.patient.age = '-'
      this.form.patient_id = ''
      this.form.name = ''
      this.form.type = ''
      this.form.treatment = ''
      this.form.amount = 0
      this.form.summary = ''
    },
    handleClose() {
      this.dialogVisible = false
      this.resetForm()
    },
    handleCheck() {
      this.dialogVisible = false
      this.$router.push({
        name: 'ServeOrder.Show',
        params: {
          id: this.id,
        },
      })
    },
    fetchTypes () {
      getTypes().then(response => {
        this.allServeTypeOptions = response.data.serve_types
        this.productTypeOptions = response.data.product_types
      })
    }
  },
  created() {
    this.fetchTypes()
  },
}
</script>
<style lang="scss">
</style>

