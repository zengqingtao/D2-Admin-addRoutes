<template>
  <div>
    <el-dialog class="complete-order-component" title="创建订单" width="90%" :visible.sync="visible" @close="close">
        <el-form v-model="order">
            <!-- 选择类型 -->
            <div class="flex mb3">
                <div style="width:100px;display:inline-block;text-align:right">选择类型：</div>
                <el-radio class="radio" v-model="order.type" label="reserve">预约医生</el-radio>
                <el-radio class="radio" v-model="order.type" label="split">个性化</el-radio>
                <!--<el-radio class="radio" v-model="order.type" label="expect">专家会诊</el-radio>-->
                <!--<el-radio class="radio" v-model="order.type" label="operation">住院安排</el-radio>-->
                <!--<el-radio class="radio" v-model="order.type" label="other">其他</el-radio>-->
            </div>

            <div v-show="order.type === 'reserve'" class="mt20">
                <doctorscheduling :hideoperate="true" @setAttendance="setAttendance"></doctorscheduling>
                <p></p>
                <el-form ref="form" :model="order" label-width="100px">
                    <el-form-item label="预约单号">{{ number }}</el-form-item>
                    <el-form-item label="诊疗费(元)">
                        <el-input v-model="order.amount" type="number" style="width:300px"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div v-show="order.type !== 'reserve'" class="mt20">
                <el-form ref="form" :model="order" label-width="100px">
                    <el-form-item label="预约单号">{{ number }}</el-form-item>
                    <el-form-item label="服务类型">
                        <el-select v-model="product_type_id">
                            <el-option v-for="(v, i) in productTypeOptions" :key="i" :label="v.name"
                                       :value="v.id"></el-option>
                        </el-select>
                        <el-select v-model="order.serve_type_id" v-if="product_type_id">
                            <el-option v-for="(v, i) in serveTypeOptions" :key="i" :label="v.name"
                                       :value="v.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="订单金额(元)">
                        <el-input v-model="order.amount" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item label="订单标题">
                        <el-input v-model="order.title" style="width:300px"></el-input>
                    </el-form-item>
                    <el-form-item label="订单详情">
                        <el-input style="width: 100%;" v-model="order.remark" type="textarea"></el-input>
                    </el-form-item>
                </el-form>
            </div>

            <div class="center mt3">
                <el-button type="primary" class="mr3" @click="onSubmit">确定</el-button>
                <el-button type="default" @click="close">取消</el-button>
            </div>
        </el-form>
    </el-dialog>
  </div>
</template>
<script>
import doctorscheduling from '@/components/lianhe/doctorscheduling'
import { getTypes } from '@/api/neworder'
import { getAttendanceDoctor } from '@/api/orders'
import { Message } from 'element-ui'
export default {
  props: ['id', 'number', 'patient'],
  components: {
    doctorscheduling
  },
  data() {
    return {
      order: {
        type: 'reserve',
        attendance_id: null,
        amount: null,
        title: '',
        remark: null,
        price: 0,
        serve_type_id: null,
      },
      product_type_id: null,
      allServeTypeOptions: [],
      serveTypeOptions: [],
      productTypeOptions: [],
      doctors: [],
      visible: false
    }
  },
  watch: {
    'order.type'(val) {
      this.order.title = this.patient.full_name
      if (val !== 'reserve') {
        return this.order.amount = 5000
      }
      this.order.amount = 0
    },
    product_type_id(val, oldVal) {
      if (val) {
        this.order.serve_type_id = null
        this.selectOptions(val)
      }
    },
    'order.attendance_id'(val) {
      if (val) {
        this.fetchDoctor()
      }
    },
  },
  computed: {
  },
  methods: {
    handleCompleteOrder (order) {
      this.visible = true
      this.order.title = order.patient.full_name
    },
    fetchTypes () {
      getTypes().then(response => {
        this.allServeTypeOptions = response.data.serve_types
        this.productTypeOptions = response.data.product_types
      })
    },
    selectOptions(val) {
      let selected = this.allServeTypeOptions.filter(i => i.product_type_id === val)
      this.serveTypeOptions = selected
    },
    close() {
      this.visible = false
    },
    selectDate(data) {
      console.log(data)
    },
    setAttendance (val) {
      this.order.attendance_id = val
      this.fetchDoctor()
    },
    onSubmit() {
      if (this.order.type === 'reserve') {
        if (!this.order.attendance_id) {
          Message.error('请选择预约时间!')
          return null
        }
      } else if (!this.order.amount || !this.order.remark || !this.order.serve_type_id) {
        Message.error('请选择完善信息!')
        return null
      }
      this.visible = false
      this.$emit('completeOrder', this.order)
    },
    fetchDoctor () {
      if (!this.order.attendance_id) {
        return
      }
      // 获取医生价格
      getAttendanceDoctor({ 'attendance_id': this.order.attendance_id }).then(response => {
        this.order.amount = response.data.price
      })
    }
  },
  created() {
    this.fetchTypes()
  }
}
</script>