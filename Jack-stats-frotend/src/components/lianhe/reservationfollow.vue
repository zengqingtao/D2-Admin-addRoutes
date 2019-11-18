<template>
  <div>
    <el-dialog title="服务跟进" :visible.sync="dialogFormVisible" width="95%" center :close-on-click-modal="false">
      <el-card class="server-follow-detail pl4 py4">
        <el-row>
            <p class="h1 bold">订单基本信息</p>
            <ul class="order-info flex flex-wrap justify-between">
                <li class="order-info-item">
                    <span class="tags">姓名：</span>
                    <span class="text">{{ form.patient_name }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">年龄：</span>
                    <span class="text">{{ form.age }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">诊疗卡号：</span>
                    <span class="text">{{ form.card }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">性别：</span>
                    <span class="text">{{ form.sex }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">订单号：</span>
                    <span class="text">{{ form.number }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">提交时间：</span>
                    <span class="text">{{ form.created_at }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">手机号码：</span>
                    <span class="text">{{ form.phone }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">证件类型：</span>
                    <span class="text">{{ form.papers_type | parsePapersType }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">身份证号：</span>
                    <span class="text">{{ form.identification_number }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">其他证件：</span>
                    <span class="text">{{ form.papers }}</span>
                </li>
                <li class="order-info-item">
                    <span class="tags">订单状态：</span>
                    <span class="text" style="font-weight:700;font-size:1.1rem;padding:.5rem;background:#fd941c;border-radius:5px;color:white;">{{ form.status | parseOrderStatus }}</span>
                </li>
                <li class="order-info-item" v-if="form.amount">
                    <span class="tags">订单类型：</span>
                    <span class="text">{{ type }}</span>
                </li>
                <li class="order-info-item flex" v-if="form.remark">
                    <span class="tags">备注信息：</span>
                    <span class="text">{{ form.remark }}</span>
                </li>
                <li class="order-info-item" v-if="form.amount">
                    <span class="tags">支付金额：</span>
                    <span class="text">{{ form.amount }}元</span>
                </li>
                <li class="order-info-item" v-if="form.attendance">
                    <span class="tags">预约医生：</span>
                    <span class="text">{{ form.attendance.hospital_name }} {{ form.attendance.subject_name }} {{ form.attendance.attendance_doctor }}</span>
                </li>
                <li class="order-info-item" v-if="form.attendance">
                    <span class="tags">预约时间：</span>
                    <span class="text">{{ form.attendance.date }} {{ form.attendance.time_period | parseTimePeriod }} {{ form.attendance.hour}}:00 ~ {{ parseInt(form.attendance.hour) + 1 }}:00</span>
                </li>
            </ul>
        </el-row>

        <el-row type="flex" justify="space-between" class="mt20">
            <el-col :span="4">
              <el-card>
                <div slot="header" class="clearfix">
                  <span class="service h1" style="width: 100%;">服务跟进信息</span>
                </div>
                <div class="order-records">
                  <div v-for="(item, key) in records" class="mb4">
                      <h3 class="mt0">{{ key }}</h3>
                      <div style="color:#67c200;margin-top:10px;" v-for="(v,i) in item" class="mb2" :class="{'content': active}" >{{ v.description }}<br><span v-if="v.status === 'paid'">支付时间:</span>
                          {{ v.created_at }}
                      </div>
                  </div>
                </div>
              </el-card>
            </el-col>

            <el-col :span="14" :offset="1">
              <el-card>
                <el-tabs v-model="tabName" type="card">
                    <el-tab-pane label="当前病情描述" name="current">
                        <el-form style="width: 97%;">
                            <ul class="tab-ul">
                                <li class="tab-ul-item">
                                    <span class="tags">初/复诊：</span>
                                    <span class="content">{{ form.diagnosis === 'first' ? '初诊' : '复诊' }}</span>
                                </li>
                                <li class="tab-ul-item">
                                    <span class="tags">确诊疾病：</span>
                                    <template v-if="is_save_medical">
                                        <el-input style="width: 100%;" type="textarea" :autosize="{ minRows: 2 }"v-model="new_remark.disease" class="content"></el-input>
                                    </template>
                                    <template v-else>
                                        <span>{{ new_remark.disease }}</span>
                                    </template>
                                </li>
                                <li class="tab-ul-item">
                                    <span class="tags">病情描述：</span>
                                    <template v-if="is_save_medical">
                                        <el-input style="width: 100%;" v-model="new_remark.description" class="content"
                                                  type="textarea" :rows="3"></el-input>
                                    </template>
                                    <template v-else>
                                        <span>{{ new_remark.description }}</span>
                                    </template>
                                </li>
                                <li class="tab-ul-item">
                                    <span class="tags">既往病历：</span>
                                    <span class="content">
                                        <a v-for="(v,i) in medical_record" :href="v.url" target="_blank">
                                            <img :src="v.url" alt="病历">
                                        </a>
                                    </span>
                                </li>
                                <li class="tab-ul-item">
                                    <span class="tags">检验报告单：</span>
                                    <span class="content">
                                        <a v-for="(v,i) in medical_checklist" :href="v.url" target="_blank">
                                            <img :src="v.url" alt="检查报告">
                                        </a>
                                    </span>
                                </li>
                                <li class="tab-ul-item">
                                    <span class="tags">影像报告单：</span>
                                    <span class="content">
                                        <a v-for="(v,i) in medical_photo" :href="v.url" target="_blank">
                                            <img :src="v.url" alt="诊断报告单">
                                        </a>
                                    </span>
                                </li>
                                <li class="tab-ul-item">
                                    <span class="tags">病症部位拍照：</span>
                                    <span class="content">
                                        <a v-for="(v,i) in medical_part" :href="v.url" target="_blank">
                                            <img :src="v.url" alt="病症报告">
                                        </a>
                                    </span>
                                </li>
                            </ul>
                            <!-- <div class="center" v-if="form.is_edit">
                                <el-button v-if="is_save_medical" @click="saveMedical" type="primary">保存</el-button>
                                <el-button v-else-if="is_save_medical == false && form.status != 'finished' && form.status != 'visited'" @click="is_save_medical = true" type="primary">修改</el-button>
                            </div> -->
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="健康档案" name="health">
                        <healthfiles :healthy="form.patient" :status="form.is_edit"
                                      :isService="form.is_service_permission"></healthfiles>
                    </el-tab-pane>

                    <el-tab-pane label="历史病历" name="history">
                        <el-button @click="onMedical" size="small" type="primary">
                            查看历史病历
                        </el-button>
                    </el-tab-pane>
                </el-tabs>
              </el-card>
            </el-col>

            <el-col :span="5" :offset="1">
              <el-card>
                <div slot="header" class="clearfix">
                  <span class="service h1" style="width: 242px;">操作界面</span>
                </div>
                <!-- 显示备注记录 -->
                <div>
                  <template v-if="form.status === 'processing' && form.role === 'staff.service' && !form.general_id">
                      <div class="record">备注沟通记录</div>
                      <div v-if="!currentContent">
                          <el-input type="textarea" :rows="5" v-model="new_remark.content"></el-input>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="onSave">
                                  保存
                              </el-button>
                          </div>
                      </div>
                      <div v-else-if="currentContent && is_save">
                          <el-input type="textarea" :rows="5" v-model="new_remark.content"></el-input>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="onSave">
                                  保存
                              </el-button>
                          </div>
                      </div>
                      <div v-else-if="currentContent && !is_save">
                          <span v-strtohtml v-html="currentContent.content"></span>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="is_save = true">
                                  修改
                              </el-button>
                          </div>
                      </div>
                      <div class="remark">
                          <el-button type="primary" size="small" @click="confirmSubmit">确认提交</el-button>
                      </div>
                  </template>
                  <template v-else-if="form.status === 'processing' && form.is_general_permission">
                      <div class="record">备注沟通记录</div>
                      <div v-if="!currentContent">
                          <el-input type="textarea" :rows="5" v-model="new_remark.content"></el-input>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="onSave">
                                  保存
                              </el-button>
                          </div>
                      </div>
                      <div v-else-if="currentContent && is_save">
                          <el-input type="textarea" :rows="5" v-model="new_remark.content"></el-input>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="onSave">
                                  保存
                              </el-button>
                          </div>
                      </div>
                      <div v-else-if="currentContent && !is_save">
                          <span v-strtohtml v-html="currentContent.content"></span>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="is_save = true">
                                  修改
                              </el-button>
                          </div>
                      </div>
                      <div class="remark">
                          <el-button type="primary" size="small" @click="confirmSubmit">确认提交</el-button>
                      </div>
                  </template>
                  <template v-if="form.status === 'waiting' && form.is_nurse_permission">
                      <div class="record">备注沟通记录</div>
                      <div v-if="!currentContent">
                          <el-input type="textarea" :rows="5" v-model="new_remark.content"></el-input>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="onSave">
                                  保存
                              </el-button>
                          </div>
                      </div>
                      <div v-else-if="currentContent && is_save">
                          <el-input type="textarea" :rows="5" v-model="new_remark.content"></el-input>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="onSave">
                                  保存
                              </el-button>
                          </div>
                      </div>
                      <div v-else-if="currentContent && !is_save">
                          <span v-strtohtml v-html="currentContent.content"></span>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="is_save = true">
                                  修改
                              </el-button>
                          </div>
                      </div>
                      <div class="remark">
                          <el-button type="primary" size="small" @click="confirmSubmit">确认提交</el-button>
                      </div>
                  </template>
                  <template v-if="form.status === 'followed' && form.is_doctor_permission">
                      <div class="remark">
                          <el-button type="primary" size="small" @click="confirmStatus">{{ editButtonText }}
                          </el-button>
                      </div>
                  </template>
                  <template v-if="form.status === 'finished' && (['root', 'manage', 'staff.service'].includes(form.role))">
                      <div class="record">备注回访记录</div>
                      <div v-if="!currentContent">
                          <el-input type="textarea" :rows="5" v-model="new_remark.content"></el-input>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="onSave">
                                  保存
                              </el-button>
                          </div>
                      </div>
                      <div v-else-if="currentContent && is_save">
                          <el-input type="textarea" :rows="5" v-model="new_remark.content"></el-input>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="onSave">
                                  保存
                              </el-button>
                          </div>
                      </div>
                      <div v-else-if="currentContent && !is_save">
                          <span v-strtohtml v-html="currentContent.content"></span>
                          <div class="save-remark right">
                              <el-button type="primary" size="small" @click="is_save = true">
                                  修改
                              </el-button>
                          </div>
                      </div>
                      <div class="remark">
                          <el-button type="primary" size="small" @click="confirmSubmit">确认提交</el-button>
                      </div>
                  </template>
                </div>
                <template v-if="form.status !== 'pay'">
                  <template v-if="form.status === 'pending' && form.role === 'staff.service' && !form.general_id">
                      <div class="remark">
                          <el-button type="primary" size="small" @click="editCurrent">
                              {{ editButtonText }}
                          </el-button>
                      </div>
                      <div class="mt2 mb2">与患者沟通，并完善补充患者没有提交的信息</div>
                  </template>
                  <template v-else-if="form.status === 'pending' && form.is_general_permission">
                      <div class="remark">
                          <el-button type="primary" size="small" @click="editCurrent">
                              {{ editButtonText }}
                          </el-button>
                      </div>
                      <div class="mt2 mb2">与患者沟通，并完善补充患者没有提交的信息</div>
                  </template>
                  <template v-if="form.status === 'follow' && form.is_nurse_permission">
                      <div class="remark">
                          <el-button type="primary" size="small" @click="confirmStatus">
                              {{ editButtonText }}
                          </el-button>
                      </div>
                      <div class="mt2 mb2">与患者沟通，并完善补充患者没有提交的信息</div>
                  </template>
                  <template v-if="form.status === 'waited' && form.is_doctor_permission">
                      <div class="remark">
                          <el-button type="primary" size="small" @click="confirmStatus">
                              {{ editButtonText }}
                          </el-button>
                      </div>
                      <div class="mt2 mb2">与患者沟通，并完善补充患者没有提交的信息</div>
                  </template>
                </template>
                <div class="record-item mb1" v-for="(v,i) in remarks" :key="v.id" v-if="remarks.length">
                    <div class="title bold" v-if="v && v.status">
                        {{ v.role | parseRole }}备注:<br>
                        ({{ v.full_name + '  ' + v.created_at }})
                    </div>
                    <div class="desc py2" v-if="v.status">
                      内容：{{ v.content }}
                    </div>
                </div>
              </el-card>  
            </el-col>
        </el-row>
      </el-card>
    </el-dialog>

  </div>
</template>
<script>
import { getFollowByOrderId, setOrder, setOrderRemark } from '@/api/orders'
import healthfiles from '@/components/lianhe/healthfiles'
import { Message } from 'element-ui'
export default {
  name: 'reservationfollow',
  components: {
    healthfiles
  },
  computed: {
    doctorHospital() {
      if (this.doctorHospitals.length && this.new_remark.doctor_id.length) {
        return this.doctorHospitals.find(i => i.id === this.new_remark.hospital_id).name
      }
      return null
    },
    editButtonText() {
      const lang = {
        pending: '开始沟通',
        processing: '沟通中',
        pay: '完善订单',
        paid: '分配护士',
        follow: '患者报到',
        following: '服务中',
        followed: '看诊结束',
        visited: '回访结束',
        waiting: '候诊中',
        waited: '开始看诊',
      }
      return lang[this.form.status]
    },
    type() {
      const lang = {
        'split': '分诊服务',
        'reserve': '预约挂号',
        'expect': '专家会诊',
        'operation': '住院安排',
        'other': '其他',
      }
      return lang[this.form.type]
    },
    active() {
      const lang = {
        pending: 0,
        processing: 1,
        pay: 2,
        paid: 2,
        follow: 2,
        following: 3,
        followed: 3,
        finished: 4,
        visited: 5,
      }
      return lang[this.form.status]
    },
    medical_checklist() {
      let arr = []
      for (let i = 0; i < this.form.images.length; i++) {
        if (this.form.images[i].type === 'medical_checklist') {
          arr.push(this.form.images[i])
        }
      }
      return arr
    },
    medical_part() {
      let arr = []
      for (let i = 0; i < this.form.images.length; i++) {
        if (this.form.images[i].type === 'medical_part') {
          arr.push(this.form.images[i])
        }
      }
      return arr
    },
    medical_photo() {
      let arr = []
      for (let i = 0; i < this.form.images.length; i++) {
        if (this.form.images[i].type === 'medical_photo') {
          arr.push(this.form.images[i])
        }
      }
      return arr
    },
    medical_record() {
      let arr = []
      for (let i = 0; i < this.form.images.length; i++) {
        if (this.form.images[i].type === 'medical_record') {
          arr.push(this.form.images[i])
        }
      }
      return arr
    }
  },
  filters: {
    orderType: function (val) {
      const type = {
        reserve: '预约挂号',
        expect: '专家会诊',
        operation: '住院安排',
        other: '其他',
      }
      if (val) {
        return type[val]
      }
      return null
    },
  },
  watch: {
    dialogFormVisible() {
      if (!this.dialogFormVisible) {
        this.$emit('handleRefresh')
      }
    }
  },
  data () {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        },
      },
      dialogFormVisible: false,
      order_id: '',
      form: {
        number: '',
        patient: [],
        status: '',
        status_trans: '',
        content: '',
        created_at: '',
        images: [],
        diagnosis: '',
        disease: '',
        description: '',
        type: '',
        remark: '',
        amount: '',
        role: '',
        general_id: null,
        id: '',
        is_edit: null,
        is_nurse_permission: false,
        is_doctor_permission: false,
        is_general_permission: false,
        is_service_permission: false
      },
      attendance: {
        able: [],
        created_at: '',
        date: '',
        hour: '',
        time_period: '',
      },
      new_remark: {
        content: null,
        order_id: '',
        status: '',
        disease: '',
        description: '',
      },
      remarks: [],
      records: [],
      tabName: 'current',
      general: {
        hospital_id: '',
        time: '',
      },
      general2: {
        hospital_id: '',
      },
      nurses: [],
      generalDoctor: [],
      selectedDoctors: [],
      nurseHospitals: [],
      doctorHospitals: [],
      is_show: false,
      is_assign: false,
      is_general: false,
      is_nurse: false,
      choice: null,
      currentContent: null,
      is_save: true,
      is_save_medical: false,
      medical_data: null,
      generalDoctorName: '',
      nurseName: '',
      nurseHospital: '',
      selectTime: ''
    }
  },
  methods: {
    handleFollow (order_id) {
      this.dialogFormVisible = true
      this.order_id = order_id
      getFollowByOrderId({ 'order_id': order_id }).then(response => {
        this.form = response.data.order
        if (this.form.status === 'finished') {
          this.form.is_edit = false
        } else {
          this.form.is_edit = true
        }
        this.form.images = []
        this.records = response.data.order_records
        this.remarks = response.data.order_remarks
        if (response.data.new_remark !== null) {
          this.currentContent = response.data.new_remark
          this.new_remark = response.data.new_remark
        }
        this.new_remark.general_id = null
        this.new_remark.nurse_id = null
        this.new_remark.order_id = response.data.order.id
        this.new_remark.status = response.data.order.status
        this.new_remark.disease = response.data.order.disease
        this.new_remark.description = response.data.order.description
      })
    },
    saveMedical () {
      this.form.disease = this.new_remark.disease
      this.form.description = this.new_remark.description
      setOrder(this.form).then(response => {
        this.handleFollow(this.order_id)
        this.is_save_medical = false
      })
    },
    handleWork () {
      this.dialogFormVisible = false
    },
    onMedical () {
      this.$emit('handleHealth', this.form.patient_id)
    },
    addSubmit(res) {
      this.new_remark.time = res.time
      this.new_remark.hospital_id = res.hospital_id
      this.new_remark.subjects_id = res.subjects_id
      this.new_remark.doctor_id = res.selectedDoctor_id
      this.selectedDoctors = res.selectedDoctors
      this.doctorHospitals = res.hospitals
      this.is_assign = false
    },
    assingDoctor() {
      this.is_assign = true
    },
    refreshSplit() {
      this.$store.dispatch('getSplit');
    },
    finishedOrder() {
      this.$confirm('请再次确认是否结束服务,就意味着提前结束该服务,确认后将无法撤销。', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editCurrent()
      }).catch(() => {
      })
    },
    confirmStatus() {
      this.$confirm('请认真检查是否完善信息,点击确认后,就跳转到下一步,就无法修改', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.editCurrent()
      }).catch(() => {
      })
    },
    general2Change(val) {
      if (this.new_remark.general_id && this.generalDoctor.length) {
        this.generalDoctorName = this.generalDoctor.find(i => i.id === this.new_remark.general_id).full_name
      }
    },
    generalChange(val) {
      if (this.new_remark.nurse_id && this.nurses.length) {
        this.nurseName = this.nurses.find(i => i.id === this.new_remark.nurse_id).full_name
        this.nurseHospital = this.nurses.find(i => i.id === this.new_remark.nurse_id).hospital_name
      }
    },
    editCurrent() {
      if (this.form.status === 'pending') {
        this.form.status = 'processing'
      } else if (this.form.status === 'follow') {
        this.form.status = 'waiting'
      } else if (this.form.status === 'followed') {
        this.form.status = 'finished'
      } else if (this.form.status === 'waited') {
        this.form.status = 'followed'
      }
      // 更新订单状态
      setOrder(this.form).then(response => {
        this.handleFollow(this.order_id)
      })
    },
    onSave() {
      // 更新订单状态
      this.form.remark = this.new_remark.content
      setOrderRemark({ 'order_id': this.form.id, 'remark': this.form.remark }).then(response => {
        Message.info('已保存')
        this.handleFollow(this.order_id)
      })
    },
    confirmSubmit() {
      this.$confirm('请认真检查是否完善信息,点击确认后,就跳转到下一步,就无法修改', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onSubmitRemark()
      }).catch(() => {
      })
    },
    confirmFinished() {
      this.$confirm('请再次确认是否结束服务,就意味着提前结束该服务,确认后将无法撤销。', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.onSubmitRemark()
      }).catch(() => {
      })
    },
    onSubmitRemark() {
      if (this.form.status === 'processing') {
        this.form.status = 'follow'
      } else if (this.form.status === 'following') {
        this.form.status = 'followed'
        this.form.hospital_id = this.new_remark.hospital_id
        this.form.doctor_id = this.new_remark.doctor_id
        this.form.subjects_id = this.new_remark.subjects_id
        this.form.time = this.new_remark.time
      } else if (this.form.status === 'followed') {
        this.form.status = 'finished'
      } else if (this.form.status === 'finished') {
        this.form.status = 'visited'
      } else if (this.form.status === 'paid') {
        this.form.status = 'follow'
        this.form.nurse_id = this.new_remark.nurse_id
      } else if (this.form.status === 'waiting') {
        this.form.status = 'waited'
      }
      this.form.remark = this.new_remark.content
      console.log(this.form)
      setOrder(this.form).then(response => {
        if (response.code !== 1) {
          Message.error(response.msg)
        } else {
          this.handleFollow(this.form.id)  
        }
      })
    }
  }
}
</script>
<style scope>
.order-info-item{width:50%;float:left;font-size:1rem;padding:5px 0;}
.tab-ul-item,.record-item{padding:5px 0;}
.tags,.content,.record-item{font-size:1rem;}
</style>
