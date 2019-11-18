<template>
  <el-dialog :visible.sync="visible" @close="close" width="75%">
    <div>
      <div class="assigned-nurse center mt2">
        <el-date-picker
            class="mt2"
            v-model="form.time"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd"
            @change="selectDate1($event)"
            :picker-options="pickerOptions">
        </el-date-picker>
        <selecthospitals @updateHospitals="updateHospitals" :hasDoctor="1" v-model="form.hospital_id" style="display:inline-block"></selecthospitals>
        <!-- <select-subjects :workPlaceId="form.hospital_id" @input="selectDoctor"
                 v-model="form.subjects_id"></select-subjects> -->
         <el-cascader
          :options="subjects"
          v-model="form.subjects_id">
        </el-cascader>
        <el-select v-model="doctor_id" class="mt2" placeholder="请选择医生">
          <el-option v-for="(v,i) in doctors" :key="i" :label="v.full_name" :value="v.id"
                 v-if="!selectedDoctors_id.includes(v.id)"></el-option>
        </el-select>
        <el-button v-if="doctor_id" type="primary" size="small" @click="handleAdd">增加</el-button>
        <div class="doctor-workplaces">
          <table class="ui-table mt2 col-12" v-if="selectedDoctors.length">
            <tr>
              <th>姓名</th>
              <th>操作</th>
            </tr>
            <tr v-for="(v, $index) in selectedDoctors">
              <td>{{ v.full_name }}</td>
              <td>
                <el-button native-type="button" size="mini" @click="handleRemove($index)">移除</el-button>
              </td>
            </tr>
          </table>
        </div>
        <div class="mt20">
          <el-button type="default" @click="close">取消</el-button>
          <el-button type="primary" @click="onSubmit">确定</el-button>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import selecthospitals from '@/components/lianhe/selecthospitals'
import { getHasDoctorSubject, getSubjectDoctor } from '@/api/orders'
export default {
  components: {
    selecthospitals
  },
  props: ['visible'],
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        },
      },
      form: {
        time: '',
        hospital_id: '',
        subjects_id: [],
        selectedDoctor_id: [],
        selectedDoctors: [],
        hospitals: [],
      },
      hospitals: [],
      doctor_id: null,
      doctors: [],
      selectedDoctors: [],
      selectedDoctors_id: [],
      hospital_id: null,
      subjects_id: [],
      subjects: []
    };
  },
  watch: {
    'form.hospital_id'() {
      this.form.subjects_id = []
      this.doctors = []
      this.doctor_id = null
      this.selectSubject()
    },
    'form.subjects_id'() {
      this.selectDoctor()
    }
  },
  methods: {
    handleAdd() {
      if (this.selectedDoctors_id.includes(this.doctor_id)) {
        return
      }
      this.selectedDoctors_id.push(this.doctor_id)
      this.selectedDoctors.push(this.doctors.find(i => i.id === this.doctor_id))
      if (this.selectedDoctors_id.length === 1) {
        this.hospital_id = this.form.hospital_id
        this.subjects_id = this.form.subjects_id
        this.form.hospitals = this.hospitals
      }
      this.doctor_id = null;
    },
    handleRemove(index) {
      this.selectedDoctors.splice(index, 1);
      this.selectedDoctors_id.splice(index, 1);
      if (this.selectedDoctors_id === 0) {
        this.hospital_id = null
        this.subjects_id = []
        this.form.hospitals = []
      }
    },
    close() {
      this.$emit('close')
    },
    onSubmit() {
      this.form.selectedDoctor_id = this.selectedDoctors_id
      this.form.hospital_id = this.hospital_id
      this.form.subjects_id = this.subjects_id
      this.form.selectedDoctors = this.selectedDoctors
      this.$emit('submit', this.form)
    },
    selectSubject() {
      if (this.form.hospital_id
        && this.form.time) {
        getHasDoctorSubject({ 'hospital_id': this.form.hospital_id }).then(response => {
          this.subjects = response.data
        })
      }
    },
    selectDoctor() {
      if (this.form.hospital_id
        && this.form.time
        && this.form.subjects_id.length) {
        getSubjectDoctor({ 'hospital_id': this.form.hospital_id, 'subject_id': this.form.subjects_id[1] }).then(response => {
          this.doctors = response.data
        })
      }
    },
    selectDate1(val) {
      // this.form.hospital_id = '';
      // this.form.subjects_id = [];
      this.doctor_id = null
      this.doctors = []
      this.selectDoctor()
    },
    updateHospitals (val) {
      this.hospitals = val
    }
  },
};
</script>

<style lang="scss">
  .doctor-workplaces {
    .ui-table {
      margin: 10px auto;
      width: 80%;
      border: 1px solid #eef1f6;
      th {
        background-color: #eef1f6;
        height: 40px;
        min-width: 0;
        box-sizing: border-box;
        text-overflow: ellipsis;
        vertical-align: middle;
        position: relative;
      }
      td {
        text-align: center;
      }
    }
  }
</style>
