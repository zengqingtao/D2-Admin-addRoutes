<template>
  <d2-container>
    <div class="new-module-order">
      <el-card>
        <div class="form-title center mb3 h1" style="margin-bottom:20px">就诊人信息</div>
        <el-form ref="form" label-width="120px" :model="form">
          <el-row>
            <el-col :span="10">
              <el-form-item label="就诊人：">
                <el-button @click="selectPatient" size="mini" type="primary">选择</el-button>
              </el-form-item>
              <el-form-item label="姓名：">
                <div v-html="patient.full_name"></div>
              </el-form-item>
              <el-form-item label="年龄：">
                <div v-html="patient.age"></div>
              </el-form-item>
              <el-form-item label="手机号码：">
                <div v-html="patient.phone"></div>
              </el-form-item>
              <el-form-item label="身份证号：">
                <div v-html="patient.identification_number"></div>
              </el-form-item>
              <el-form-item label="诊疗卡号：">
                <div v-html="patient.card"></div>
              </el-form-item>
              <el-form-item label="初/复诊：">
                <el-radio-group v-model="form.diagnosis">
                  <el-radio label="first">初诊</el-radio>
                  <el-radio label="repeat">复诊</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="确诊疾病：">
                <el-input type="textarea" :autosize="{ minRows: 3 }" v-model="form.disease"
                      placeholder="请输入确诊疾病"></el-input>
              </el-form-item>
              <el-form-item label="病情描述：">
                <el-input type="textarea" :autosize="{ minRows: 3 }" v-model="form.description"
                      placeholder="请对确诊疾病进行描述"></el-input>
              </el-form-item>
            </el-col>
            <!-- 右侧图片上传 -->
            <el-col :span="14">
              <el-form-item label="既往病历：">
                <uploadimg v-model="form.medical_record" :max="9"></uploadimg>
              </el-form-item>
              <el-form-item label="检验报告单：">
                <uploadimg v-model="form.medical_checklist" :max="9"></uploadimg>
              </el-form-item>
              <el-form-item label="影像报告单：">
                <uploadimg v-model="form.medical_photo" :max="9"></uploadimg>
              </el-form-item>
              <el-form-item label="病症部位拍照：">
                <uploadimg v-model="form.medical_part" :max="9"></uploadimg>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" justify="center">
            <el-form-item label="选择订单分类：">
              <el-radio-group v-model="form.type">
                <el-radio class="radio" label="split">分诊服务（由威尔全科医生为您推荐医生）</el-radio>
                <el-radio class="radio" label="reserve">预约专家（只能预约出诊的医生，如该医生没有出诊，请选择分诊服务，让全科医生为您分诊）
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-row>

          <el-row type="flex" justify="center">
            <el-button type="primary" class="right" @click="onSubmit" :loading="loading">提交订单</el-button>
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

      <!-- 预约医生 -->
      <el-dialog :visible.sync="reserveDialog" width="90%">
        <doctorscheduling @close="closeReserve" @saveOrder="saveOrder"></doctorscheduling>
      </el-dialog>
      <!-- 选择就诊人 -->
      <selectpatient ref="selectpatient" @changePatient="selectPati"></selectpatient>
    </div>
  </d2-container>
</template>
<script>
import selectpatient from '@/components/lianhe/selectpatient'
import doctorscheduling from '@/components/lianhe/doctorscheduling'
import uploadimg from '@/components/lianhe/uploadimg'
import { addOrder } from '@/api/neworder'
import { Message } from 'element-ui'
export default {
  components: {
    selectpatient,
    doctorscheduling,
    uploadimg
  },
  data() {
    return {
      form: {
        patient_id: '',
        disease: '',
        diagnosis: '',
        description: '',
        type: 'split',
        medical_record: [],
        medical_checklist: [],
        medical_photo: [],
        medical_part: [],
        attendance_id: '',
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
      reserveDialog: false,
      id: '',
      type: '',
      loading: false
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
    }
  },
  methods: {
    preventDialogEnter() {
      return !this.$refs.patientDialog.dialogVisible
    },
    closeReserve(res) {
      this.reserveDialog = false
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
      if (this.loading) {
        return
      }
      if (!this.form.patient_id || !this.form.diagnosis || !this.form.description) {
        Message.error('请完善信息')
        return
      }
      if (this.form.type === 'reserve') {
        this.reserveDialog = true
        return
      }
      this.saveOrder()
    },
    saveOrder (attendance_id) {
      if (attendance_id !== undefined) {
        this.form.attendance_id = attendance_id
        this.reserveDialog = false 
      }
      // 提交订单
      addOrder(this.form).then(response => {
        if (response.code === 1) {
          Message.info('创建订单成功')
          this.resetForm()
        } else {
          Message.error(response.msg)
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
      this.form.diagnosis = ''
      this.form.disease = ''
      this.form.description = ''
      this.form.type = 'split'
      this.form.medical_record = []
      this.form.medical_part = []
      this.form.medical_photo = []
      this.form.medical_checklist = []
    },
    handleClose() {
      this.dialogVisible = false
      this.resetForm()
    },
    handleCheck() {
      let path = null
      this.dialogVisible = false
      if (this.type === 'reserve') {
        path = 'Reservation.Show'
      } else {
        path = 'Split.Show'
      }
      this.$router.push({
        name: path,
        params: {
          id: this.id,
        },
      })
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePictureCardPreview(file) {
    }
  },
  mounted() {
  },
}
</script>
