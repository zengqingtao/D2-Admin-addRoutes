<template>
  <div>
  	<el-dialog title="健康档案" :visible.sync="dialogHealthVisible" width="80%" center :close-on-click-modal="false">
      <el-card>
        <el-form :inline="true">
          <div>
            <el-tag type="primary" style="font-size: 18px; margin-bottom: 10px">基本信息</el-tag>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <el-row>
              <el-col :span="8">
                  <div class="grid-content bg-purple">
                      <el-form-item label="就诊人姓名:" label-width="180px">
                          {{ patient.full_name }}
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                      <el-form-item label="性别:" label-width="180px">
                          {{ patient.sex }}
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="8">
                  <div class="grid-content bg-purple">
                      <el-form-item label="出生年月:" label-width="180px">
                          {{ patient.birth_year }}
                      </el-form-item>
                  </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                      <el-form-item label="年龄:" label-width="180px">
                          {{ patient.age }}
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                      <el-form-item label="联系电话:" label-width="180px">
                          {{ patient.phone }}
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                      <el-form-item label="证件类型:" label-width="180px">
                          {{ patient.papers_type | parsePapersType }}
                      </el-form-item>
                  </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                      <el-form-item label="身份证:" label-width="180px">
                          {{ patient.identification_number }}
                      </el-form-item>
                  </div>
              </el-col>
              <el-col :span="8">
                  <div class="grid-content bg-purple-light">
                      <el-form-item label="其他证件:" label-width="180px">
                          {{ patient.papers }}
                      </el-form-item>
                  </div>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                  <div class="grid-content bg-purple-light">
                      <el-form-item label="所在地区：" label-width="180px">
                          {{ patient.districts_name }}
                      </el-form-item>
                  </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-tag type="primary" style="font-size: 18px; margin-bottom: 10px">医疗信息</el-tag>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="身高:" label-width="180px">
                            {{ patient.height }}cm
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="体重:" label-width="180px">
                            {{ patient.weight }}kg
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="血型:" label-width="180px">
                            {{ patient.blood_type }}
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="RH阴性:" label-width="180px">
                            {{ patient.RH === 1 ? '是' : '否' }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="历史最高血压：" label-width="180px">
                            {{ patient.lower_blood }} - {{ patient.higher_blood }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="测量时间：" label-width="180px">
                            {{ patient.check_time }}
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="腰围：" label-width="180px">
                            {{ patient.lower_waistline }} - {{ patient.higher_waistline }}cm
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="臀围：" label-width="180px">
                            {{ patient.lower_hipline }} - {{ patient.higher_hipline }}cm
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="期望体重：" label-width="180px">
                            {{ patient.expected_weight }}kg
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="药物过敏：" label-width="180px">
                            {{ patient.medicine_allergy }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="食物或接触物过敏：" label-width="180px">
                            {{ patient.allergy }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="特殊人群标签：" label-width="180px">
                            {{ patient.special_people }}
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="目前疾病：" label-width="180px">
                            {{ patient.current_disease}}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="目前用药：" label-width="180px">
                            {{ patient.current_medicine }}
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>
          </div>
          <div>
            <el-tag type="primary" style="font-size: 18px; margin-bottom: 10px">其他信息</el-tag>
            <hr style="height:1px;border:none;border-top:1px solid #555555;"/>
            <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="婚姻状态：" label-width="180px">
                            {{ patient.marital_status }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="生育状态：" label-width="180px">
                            {{ patient.fertility_status }}
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="手术或外伤：" label-width="180px">
                            {{ patient.injury }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="家族病史：" label-width="180px">
                            {{ patient.family_disease }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="个人习惯：" label-width="180px">
                            {{ patient.habit }}
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="医疗保险：" label-width="180px">
                            {{ patient.medicare }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="社保地区：" label-width="180px">
                            {{ patient.insurance_district }}
                        </el-form-item>
                    </div>
                </el-col>
                <el-col :span="8">
                    <div class="grid-content bg-purple-light">
                        <el-form-item label="商业保险公司：" label-width="180px">
                            {{ patient.insurance_company }}
                        </el-form-item>
                    </div>
                </el-col>
              </el-row>
            </div>
          </el-form>
      </el-card>
    </el-dialog>


    <!--病例-->
    <el-dialog title="历史病例" :visible.sync="dialogOrderListVisible" width="80%" center :close-on-click-modal="false">
      <el-table :data="ordersList"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
        <el-table-column align="center" prop="full_name" label="就诊医生"></el-table-column>
        <el-table-column align="center" prop="created_at" label="提交时间"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleOrderDetail(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-dialog>

    <!--诊断详情-->
    <el-dialog title="诊断详情" :visible.sync="dialogOrderVisible" width="80%" center :close-on-click-modal="false">
      <div class="history-medical-records">
        <div class="flex items-center justify-between">
            <p class="h1 bold" v-if="medical_record">诊断信息</p>
        </div>
        <ul class="tab-ul">
            <li class="tab-ul-item">
                <span class="tags">提交时间：</span>
                <span class="content">{{ medical_record.created_at }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">主诉：</span>
                <span class="content">{{ medical_record.primary }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">现病史：</span>
                <span class="content">{{ medical_record.cur_disease }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">既往史：</span>
                <span class="content">{{ medical_record.history_disease }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">个人史：</span>
                <span class="content">{{ medical_record.history_other }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">家族史：</span>
                <span class="content">{{ medical_record.family_disease }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">过敏史：</span>
                <span class="content">{{ medical_record.history_allergy }}</span>
            </li>
            <div>
                <p class="h1 bold">体格检查</p>
            </div>
            <li class="tab-ul-item">
                <span class="tags">体重：</span>
                <span class="content">{{ medical_record.weight }} kg</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">身高：</span>
                <span class="content">{{ medical_record.height }} cm</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">体温 T：</span>
                <span class="content">{{ medical_record.temperature }} ℃</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">呼吸频率 RR：</span>
                <span class="content">{{ medical_record.respiratory_rate }} 次/分(BPM)</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">心率 HB：</span>
                <span class="content">{{ medical_record.pluse_rate }} 次/分(BPM)</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">血样饱和度 SaO2：</span>
                <span class="content">{{ medical_record.blood_oxygen }} %</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">血压 BP：</span>
                <span class="content">收缩压/舒张压 {{ medical_record.blood_pressure }} mmHg</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">末次月经时间：</span>
                <span class="content">{{ medical_record.last_emmenia_date }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags"></span>
                <span class="content">{{ medical_record.other_medicine }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">诊断：</span>
                <span class="content">{{ medical_record.treatment }}</span>
            </li>
        </ul>

        <p class="h1 mt4 bold">开药单</p>
        <el-table :data="prescriptionOrder.items">
            <el-table-column prop="drug_name" label="药品名称" min-width="120"></el-table-column>
            <el-table-column prop="type_trans" label="类型" min-width="60"></el-table-column>
            <el-table-column prop="specifications" label="规格" min-width="80"></el-table-column>
            <el-table-column prop="dosage_form" label="剂型" min-width="100"></el-table-column>
            <el-table-column prop="price" label="零售价" min-width="80"></el-table-column>
            <el-table-column prop="amount" label="总量" min-width="80"></el-table-column>
            <el-table-column label="小计" min-width="100">
                <template slot-scope="{$index, row}">
                    {{ (row.price * row.amount).toFixed(2) }}元
                </template>
            </el-table-column>
            <el-table-column prop="usage_info" label="用法" min-width="150"></el-table-column>
        </el-table>

        <ul class="tab-ul" v-if="prescriptionOrder.type === 'z'">
            <li class="tab-ul-item">
                <span class="tags">剂数：</span>
                <span class="content">{{ prescriptionOrder.medication_amount }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">煎作方式：</span>
                <span class="content">{{ prescriptionOrder.extract_way }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">煎服方法：</span>
                <span class="content">{{ prescriptionOrder.medication_methods }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">处方备注：</span>
                <span class="content">{{ prescriptionOrder.remark }}</span>
            </li>
            <li class="tab-ul-item">
                <span class="tags">使用方法：</span>
                <span class="content">{{ prescriptionOrder.usage }}</span>
            </li>

        </ul>

        <p class="h1 mt4 bold">检查单/治疗项目</p>
        <el-table :data="examinationOrder.items">
            <el-table-column align="center" prop="name" label="名称" min-width="100">
            </el-table-column>
            <el-table-column align="center" prop="code" label="检验号" width="120">
            </el-table-column>
            <el-table-column align="center" prop="sample" label="标本类型" width="100">
            </el-table-column>
            <el-table-column align="center" prop="type" label="类型" width="100">
            </el-table-column>
            <el-table-column align="center" label="项目详情" min-width="100">
                <template slot-scope="scope">
                    <span>{{ scope.row.detail }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="source" label="检查地点" width="110">
              <template slot-scope="scope">
                    <span>{{ scope.row.source | parseCheckStoresOptions }}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="price" label="零售价" width="100">
            </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getPatientsOrdersList, getPatientsOrder } from '@/api/personnel'
import { papersTypeOptions, checkStoresOptions } from '@/data/data'
export default {
  name: 'health',
  data () {
    return {
      listLoading: false,
      order: {},
      ordersList: [],
      dialogHealthVisible: false,
      dialogOrderListVisible: false,
      dialogOrderVisible: false,
      prescriptionOrder: [],
      examinationOrder: [],
      medical_record: {}
    }
  },
  props: {
    patient: {
      type: Object,
      default: function () {
        return {}
      }
    },
    patient_id: {
      type: String,
      default: ''
    }
  },
  filters: {
    parsePapersType (val) {
      for (var i in papersTypeOptions) {
        if (val === papersTypeOptions[i].value) {
          return papersTypeOptions[i].label
        }
      }
    },
    parseCheckStoresOptions (val) {
      for (var i in checkStoresOptions) {
        if (val === checkStoresOptions[i].value) {
          return checkStoresOptions[i].label
        }
      }
    }
  },
  methods: {
    handleHealth (row) {
      this.patient = row
      this.dialogHealthVisible = true
    },
    handleOrders (patient_id) {
      getPatientsOrdersList({ page: 1, limit: 20, patient_id: patient_id, status: 'finished,visited' }).then(response => {
        this.ordersList = response.data.list
      })
      this.dialogOrderListVisible = true
    },
    handleOrderDetail (row) {
      this.dialogOrderVisible = true
      getPatientsOrder({ order_id: row.id }).then(response => {
        if (response.code === 1) {
          this.prescriptionOrder = response.data.prescription_order
          this.examinationOrder = response.data.examination_order
          this.medical_record = response.data.medical_record
        }
      })
    }
  }
}
</script>
