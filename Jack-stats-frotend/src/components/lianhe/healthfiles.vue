<template>
  <el-form ref="form" label-width="140px" class="health-files-components" style="width: 96%;">
      <div class="flex justify-between">
          <p class="h1">基本信息
            <!-- <span v-if="status">
              <el-button type="primary" @click="onEdit()" v-if="isDisabled">编辑</el-button>
              <el-button type="default" @click="onCancel()" v-if="!isDisabled">取消</el-button>
            </span> -->
          </p>
      </div>
      <div class="flex">
          <el-form-item label="名字：" class="col-6">
              <el-input v-model="healthy.full_name" :disabled="isDisabled" :placeholder="placeholder"></el-input>
          </el-form-item>

          <el-form-item label="出生日期：" style="width: 175px;" class="col-6">
              <el-date-picker
                      v-model="healthy.birth_year"
                      type="date"
                      :disabled="isDisabled"
                      value-format="yyyy-MM-dd"
                      placeholder="选择日期">
              </el-date-picker>
          </el-form-item>
      </div>

      <div class="flex">
          <el-form-item label="性别：" class="col-6" v-if="isDisabled">
              <el-input v-model="healthy.sex" :disabled="isDisabled" :placeholder="placeholder"></el-input>
          </el-form-item>
          <el-form-item label="性别：" class="col-6" v-else>
              <el-radio-group v-model="healthy.sex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="证件类型：" class="col-6">
              <el-input v-model="healthy.papers_trans" disabled></el-input>
          </el-form-item>
      </div>

      <div class="flex">
          <el-form-item label="身份证号：" class="col-6">
              <el-input v-model="healthy.identification_number" disabled></el-input>
          </el-form-item>
          <el-form-item label="其他证件：" class="col-6">
              <el-input v-model="healthy.papers" disabled></el-input>
          </el-form-item>
      </div>

      <div class="flex">
          <el-form-item label="手机号码：" class="col-6">
              <el-input v-model="healthy.phone" disabled></el-input>
          </el-form-item>

          <el-form-item v-if="isDisabled" label="所在地区：" class="col-6">
              <span v-for="(v,i) in healthy.districts">
                  {{ v.full_name }}
              </span>
          </el-form-item>
          <el-form-item v-else label="所在地区：" class="col-6">
              <select-districts v-if="healthy.districts_id" v-model="healthy.districts_id"></select-districts>
          </el-form-item>
      </div>

      <p class="h1">医疗信息</p>
      <div class="flex">
          <el-form-item label="身高：" class="col-6">
              <div class="flex" v-show="!isDisabled">
                  <el-input v-model="healthy.height" :disabled="isDisabled" :placeholder="placeholder" style="width:100px"></el-input>
                  <span class="ml1">cm</span>
              </div>
              <span v-show="isDisabled">{{ (healthy.height || '暂无') + (healthy.height ? 'cm' : '') }}</span>
          </el-form-item>

          <el-form-item label="体重：" class="col-6">
              <div class="flex" v-show="!isDisabled">
                  <el-input v-model="healthy.weight" :disabled="isDisabled" :placeholder="placeholder" style="width:100px"></el-input>
                  <span class="ml1">Kg</span>
              </div>
              <span v-show="isDisabled">{{ (healthy.weight || '暂无') + (healthy.weight ? '  Kg' : '') }} </span>
          </el-form-item>
      </div>
      <div class="flex">
          <el-form-item label="血型：" class="col-6">
              <el-select v-model="healthy.blood_type" v-if="!isDisabled" :placeholder="placeholder">
                  <el-option v-for="item in selectOption.blood" :key="item.value" :label="item.label"
                             :value="item.value"></el-option>
              </el-select>
              <span v-else>{{ healthy.blood_type }}</span>
          </el-form-item>
          <el-form-item label="RH阴性：" class="col-6" v-if="!isDisabled">
              <el-select v-model="healthy.RH" :placeholder="placeholder">
                  <el-option label="是" :value="1"></el-option>
                  <el-option label="否" :value="0"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="RH阴性：" class="col-6" v-else>
              <template>
                  <span v-if="healthy.RH === 1">
                      是
                  </span>
                  <span v-else-if="healthy.RH === 0">
                      否
                  </span>
              </template>
          </el-form-item>
      </div>
      <div class="flex">
          <el-form-item label="历史最高血压：" class="col-6">
              <div class="flex" v-show="!isDisabled">
                  <el-input v-model="healthy.lower_blood" :disabled="isDisabled"
                            :placeholder="isDisabled ? '-' : '请填写数值'" style="width:100px"></el-input>
                  <span class="px2">-</span>
                  <el-input v-model="healthy.higher_blood" :disabled="isDisabled"
                            :placeholder="isDisabled ? '-' : '请填写数值'" style="width:100px"></el-input>
              </div>
              <span v-show="isDisabled" :class="healthy.lower_blood || healthy.higher_blood || 'grey-color'">
                  {{ (healthy.lower_blood || '暂无') + '-' + (healthy.higher_blood || '暂无') }}
              </span>
          </el-form-item>

          <el-form-item label="测量时间：" class="col-6">
              <el-date-picker
                      v-model="healthy.check_time"
                      type="date"
                      value-format="yyyy-MM-dd"
                      :disabled="isDisabled"
                      :placeholder="isDisabled ? '-' : '选择日期时间'">
              </el-date-picker>
          </el-form-item>
      </div>
      <div class="flex">
          <el-form-item label="腰围：" class="col-6">
              <div class="flex" v-show="!isDisabled">
                  <el-input v-model="healthy.lower_waistline" :disabled="isDisabled"
                            :placeholder="isDisabled ? '-' : '请填写数值'" style="width:100px"></el-input>
                  cm
                  <span class="px2">-</span>
                  <el-input v-model="healthy.higher_waistline" :disabled="isDisabled"
                            :placeholder="isDisabled ? '-' : '请填写数值'" style="width:100px"></el-input>
                  cm
              </div>
              <span v-show="isDisabled" :class="healthy.lower_waistline || healthy.higher_waistline || 'grey-color'">
                  {{ (healthy.lower_waistline || '暂无') + '-' + (healthy.higher_waistline || '暂无')
                  }}{{ (healthy.lower_waistline && healthy.higher_waistline) ? 'cm' : '' }}
              </span>
          </el-form-item>
          <el-form-item label="臀围：" class="col-6">
              <div class="flex" v-show="!isDisabled">
                  <el-input v-model="healthy.lower_hipline" :disabled="isDisabled"
                            :placeholder="isDisabled ? '-' : '请填写数值'" style="width:100px"></el-input>
                  cm
                  <span class="px2">-</span>
                  <el-input v-model="healthy.higher_hipline" :disabled="isDisabled"
                            :placeholder="isDisabled ? '-' : '请填写数值'" style="width:100px"></el-input>
                  cm
              </div>
              <span v-show="isDisabled" :class="healthy.lower_hipline || healthy.higher_hipline || 'grey-color'">
                  {{ (healthy.lower_hipline || '暂无') + '-' + (healthy.higher_hipline || '暂无')
                  }}{{ (healthy.lower_hipline && healthy.higher_hipline) ? 'cm' : '' }}
              </span>
          </el-form-item>
      </div>
      <div class="flex">
          <el-form-item label="期望体重：" class="col-6">
              <div class="flex" v-show="!isDisabled">
                  <el-input v-model="healthy.expected_weight" :disabled="isDisabled"
                            :placeholder="placeholder" style="width:100px"></el-input>
                  <span class="ml1">Kg</span>
              </div>
              <span v-show="isDisabled">{{ (healthy.expected_weight || '暂无') + (healthy.expected_weight ? '  Kg' : '')
                  }} </span>
          </el-form-item>
      </div>
      <el-form-item label="药物过敏：">
          <el-input v-model="healthy.medicine_allergy" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>

      <el-form-item label="食物或接触物过敏：">
          <el-input v-model="healthy.allergy" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>

      <el-form-item label="目前疾病：">
          <el-input v-model="healthy.current_disease" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>

      <el-form-item label="目前用药：">
          <el-input v-model="healthy.current_medicine" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>

      <el-form-item label="特殊人群标签：" class="col-4" v-if="isDisabled">
          <el-input v-model="healthy.special_people" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>
      <el-form-item label="特殊人群标签：" v-else>
          <el-radio-group v-model="healthy.special_people">
              <el-radio label="怀孕期">怀孕期</el-radio>
              <el-radio label="哺乳期">哺乳期</el-radio>
              <el-radio label="手术修复期">手术修复期</el-radio>
          </el-radio-group>
      </el-form-item>

      <p class="h1">其他信息</p>
      <el-form-item label="婚姻状态：">
          <el-select v-model="healthy.marital_status" v-if="!isDisabled" :placeholder="placeholder">
              <el-option v-for="item in selectOption.marry" :key="item" :value="item"></el-option>
          </el-select>
          <span v-else>{{ healthy.marital_status }}</span>
      </el-form-item>

      <el-form-item label="生育状态：">
          <el-select v-model="healthy.fertility_status" v-if="!isDisabled" :placeholder="placeholder">
              <el-option v-for="item in selectOption.give_birth" :key="item" :value="item"></el-option>
          </el-select>
          <span v-else>{{ healthy.fertility_status }}</span>
      </el-form-item>

      <el-form-item label="手术或外伤：">
          <el-input v-model="healthy.injury" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>

      <el-form-item label="家庭病史：">
          <el-input v-model="healthy.family_disease" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>

      <el-form-item label="个人习惯：">
          <el-input v-model="healthy.habit" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>

      <el-form-item label="医疗保险：" v-if="isDisabled">
          <el-input v-model="healthy.medicare" :disabled="isDisabled" :placeholder="placeholder"></el-input>
      </el-form-item>
      <el-form-item label="医疗保险：" v-else>
          <el-radio-group v-model="healthy.medicare">
              <el-radio label="自费">自费</el-radio>
              <el-radio label="仅有社保">仅有社保</el-radio>
              <el-radio label="仅有商业保险">仅有商业保险</el-radio>
              <el-radio label="社保+商业保险">社保+商业保险</el-radio>
          </el-radio-group>
      </el-form-item>
      <template>
          <el-form-item v-if="healthy.medicare === '仅有社保' || healthy.medicare === '社保+商业保险'" label="社保地区：">
              <el-input v-model="healthy.insurance_district" :disabled="isDisabled"
                        :placeholder="placeholder"></el-input>
          </el-form-item>
          <el-form-item v-if="healthy.medicare === '仅有商业保险' || healthy.medicare === '社保+商业保险'" label="商业保险公司：">
              <el-input v-model="healthy.insurance_company" :disabled="isDisabled"
                        :placeholder="placeholder"></el-input>
          </el-form-item>
      </template>

      <div class="flex justify-center">
          <el-button type="primary" @click="onSubmit()" v-if="!isDisabled">保存</el-button>
      </div>
  </el-form>
</template>
<script>
import { setPatient } from '@/api/personnel'
import { Message } from 'element-ui';
export default {
  name: 'healthfiles',
  props: ['healthy', 'status', 'isService'],
  data () {
    return {
      isDisabled: true,
      selectOption: {
        blood: [
          {value: 'A型', label: 'A型'},
          {value: 'B型', label: 'B型'},
          {value: 'AB型', label: 'AB型'},
          {value: 'O型', label: 'O型'},
          {value: '其他', label: '其他'},
        ],
        marry: ['已婚', '未婚'],
        give_birth: ['已育', '未育']
      }
    }
  },
  computed: {
    placeholder() {
      return this.isDisabled ? '暂无' : '请填写'
    }
  },
  methods: {
    onEdit () {
      this.isDisabled = false
    },
    onCancel () {
      this.isDisabled = true
    },
    onSubmit () {
      setPatient(this.healthy).then(response => {
        Message.info('设置成功')
        this.isDisabled = true
      })
    }
  }
}
</script>
