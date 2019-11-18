<template>
  <div>
    <el-form class="health-files-components">
        <div class="flex justify-between">
            <p class="h1">病历信息</p>
            <template>
                <span>
                    <el-button v-if="medical_record.patient_id" type="primary" @click="onMedical()">历史病历
                    </el-button>
                </span>
            </template>
        </div>
        <el-form-item label="主诉：">
            <span v-if="isDisabled">{{ medical_record.primary == '' ? '无特殊' : medical_record.primary }}</span>
            <el-input class="text-width" v-else type="textarea" :autosize="{ minRows: 2 }" v-model="medical_record.primary"></el-input>
        </el-form-item>
        <el-form-item label="现病史：">
            <span v-if="isDisabled">{{ medical_record.cur_disease == '' ? '无特殊' : medical_record.cur_disease }}</span>
            <el-input class="text-width" v-else type="textarea" :autosize="{ minRows: 2 }" v-model="medical_record.cur_disease"></el-input>
        </el-form-item>
        <el-form-item label="既往史：">
            <span v-if="isDisabled">{{ medical_record.history_disease == '' ? '无特殊' : medical_record.history_disease }}</span>
            <el-input class="text-width" v-else type="textarea" :autosize="{ minRows: 2 }" v-model="medical_record.history_disease"></el-input>
        </el-form-item>
        <el-form-item label="个人史：">
            <span v-if="isDisabled">{{ medical_record.history_other == '' ? '无特殊' : medical_record.history_other }}</span>
            <el-input class="text-width" v-else type="textarea" :autosize="{ minRows: 2 }" v-model="medical_record.history_other"></el-input>
        </el-form-item>
        <el-form-item label="家族史：">
            <span v-if="isDisabled">{{ medical_record.family_disease == '' ? '无特殊' : medical_record.family_disease }}</span>
            <el-input class="text-width" v-else type="textarea" :autosize="{ minRows: 2 }" v-model="medical_record.family_disease"></el-input>
        </el-form-item>
        <el-form-item label="过敏史：">
            <span v-if="isDisabled">{{ medical_record.history_allergy == '' ? '无特殊' : medical_record.history_allergy }}</span>
            <el-input class="text-width" v-else type="textarea" :autosize="{ minRows: 2 }" v-model="medical_record.history_allergy"></el-input>
        </el-form-item>
        <div>
            <p class="h1">体格检查</p>
        </div>
        <el-row class="mb2">
            <el-col :span="9">
                <el-form-item label="体重：">
                    <span v-if="isDisabled">{{ medical_record.height == '' ? '\\-\\' : medical_record.height }}</span>
                    <el-input class="col1-width" v-else v-model="medical_record.height">
                        <template slot="append">kg</template>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="身高：">
                    <span v-if="isDisabled">{{ medical_record.weight == '' ? '\\-\\' : medical_record.height }}</span>
                    <el-input class="col2-width" v-else v-model="medical_record.weight">
                        <template slot="append">cm</template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="血压 BP：">
            <span v-if="isDisabled">{{ medical_record.blood == '' ? '\\-\\' : medical_record.height }}</span>
            <div v-else>
                <el-col :span="8">
                    <el-input class="input1-width" v-model="medical_record.higher_blood">
                        <template slot="prepend">收缩压/舒张压</template>
                    </el-input>
                </el-col>
                <el-col :span="1" class="line center">/</el-col>
                <el-col :span="8">
                    <el-input class="input2-width" v-model="medical_record.lower_blood">
                        <template slot="append">mmHg</template>
                    </el-input>
                </el-col>
            </div>
        </el-form-item>
        <el-row class="mb2">
            <el-col :span="9">
                <el-form-item label="心率 HB：">
                    <span v-if="isDisabled">{{ medical_record.pluse_rate == '' ? '\\-\\' : medical_record.pluse_rate }}</span>
                    <el-input class="col1-width" v-else v-model="medical_record.pluse_rate">
                        <template slot="append">次/分(BPM)</template>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="呼吸频率 RR：">
                    <span v-if="isDisabled">{{ medical_record.respiratory_rate == '' ? '\\-\\' : medical_record.respiratory_rate }}</span>
                    <el-input class="col2-width" v-else v-model="medical_record.respiratory_rate">
                        <template slot="append">次/分(BPM)</template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="9">
                <el-form-item label="体温 T：">
                    <span v-if="isDisabled">{{ medical_record.temperature == '' ? '\\-\\' : medical_record.temperature }}</span>
                    <el-input class="col1-width" v-else v-model="medical_record.temperature">
                      <template slot="append">℃</template>
                    </el-input>
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item label="血样饱和度 SaO2：">
                    <span v-if="isDisabled">{{ medical_record.blood_oxygen == '' ? '\\-\\' : medical_record.blood_oxygen }}</span>
                    <el-input class="col2-width" v-else v-model="medical_record.blood_oxygen">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="末次月经时间：">
          <span v-if="isDisabled">{{ medical_record.last_emmenia_date ? medical_record.last_emmenia_date : '\\-\\' }}</span>
          <div v-else>
            <el-date-picker
                    v-model="medical_record.last_emmenia_date"
                    type="date"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd">
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="其他药品：">
            <span v-if="isDisabled">{{ medical_record.other_medicine == '' ? '无特殊' : medical_record.other_medicine }}</span>
            <el-input class="text-width" v-else type="textarea" :autosize="{ minRows: 2 }" v-model="medical_record.other_medicine"></el-input>
        </el-form-item>
        <el-form-item label="诊断：">
            <span v-if="isDisabled">{{ medical_record.treatment == '' ? '无特殊' : medical_record.treatment }}</span>
            <el-input class="text-width" v-else type="textarea" :autosize="{ minRows: 2 }" v-model="medical_record.treatment"></el-input>
        </el-form-item>
        <div class="center">
          <el-button type="primary" @click="handleSave()" v-if="!isDisabled">保存</el-button>
        </div>
    </el-form>
  </div>
</template>
<script>
import { Message } from 'element-ui'
import { setMedicalRecord } from '@/api/orders'
export default {
  name: 'medicalrecord',
  data () {
    return {
      isDisabled: true,
      is_nurse_permission: true,
      is_doctor_permission: false,
      is_service_permission: false,
      medical_record: {},
      isEdit: true
    }
  },
  methods: {
    onMedical () {
      this.$emit('handleHealth', this.medical_record.patient_id)
    },
    handleMedicalRecord (medical_record, order) {
      if (medical_record !== null) {
        this.medical_record = medical_record  
      } else {
        this.medical_record.order_id = order.id
        this.medical_record.patient_id = order.patient_id
      }
    },
    handleSave () {
      setMedicalRecord(this.medical_record).then(response => {
        this.isDisabled = true
        Message.info('已修改')
      })
    }
  }
}
</script>
