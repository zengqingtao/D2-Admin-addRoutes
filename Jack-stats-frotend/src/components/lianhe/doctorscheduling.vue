<template>
  <div class="select-doctor-scheduling">
    <div class="flex items-center mb3">
      <el-row>
        <el-col :span="4">
          <div class="label">选择日期:</div>
          <el-date-picker v-model="selectDate" type="date" class="mx3"
              align="center" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
              :picker-options="pickerOptions" @change="datePickerChange">
          </el-date-picker>    
        </el-col>

        <el-col :span="8">
          <div class="label">选择医院:</div>
          <div>
            <el-cascader
              :options="districtOptions"
              @change="handleDistrictChange">
            </el-cascader>
            <el-select v-model="form.hospital_id" @change="handleHostpitalChange">
              <el-option :value="v.id" :label="v.name" v-for="v in hospitalOptions"></el-option>
            </el-select>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="label">选择科室:</div>
          <div>
            <el-cascader
              :options="subjectOptions"
              v-model="form.subjects_id"
              @change="handleSubjectChange">
            </el-cascader>
          </div>
        </el-col>

        <el-col :span="4">
          <div class="label">选择医生:</div>
          <el-select v-model="form.able_id" placeholder="请选择" class="mx3" @change="handleDoctorChange">
            <el-option
                v-for="i in doctorOptions"
                :key="i.id"
                :label="i.full_name"
                :value="i.id">
            </el-option>
          </el-select>
        </el-col>
      </el-row>
    </div>
    <table class="col-12 scheduling-date" v-if="attendances.length">
      <thead v-if="days.length">
      <th>预约时间</th>
      <th v-for="(i, index) in 7" v-html="showDay(index)"></th>
      </thead>

      <tbody v-if="hours.length">
      <tr v-for="h in hours">
        <td>{{ formatTime(h) }}</td>
        <td v-for="(v, i) in 7" @click="selectDay(i, h)" :class="showStyle(i, h)">{{ showInfo(i, h) }}</td>
      </tr>
      </tbody>
    </table>

    <div class="center" style="color: #1111ff" v-if="(!attendances.length || !hours.length) && form.able_id">
      <i class="el-icon-date mr1" style="font-size: 18px"></i>该医生最近几天没有出诊，请返回选择【分诊服务】让全科医生帮您预约
    </div>

    <div class="center mt3 mt20" v-if="!hideoperate">
      <el-button type="default" @click="close()">取消</el-button>
      <el-button type="primary" class="mr3" @click="onSubmit()">确定</el-button>
    </div>
  </div>
</template>
<script>
import { getAttendancesDistrict, getAttendancesHospitalByDistrict, getAttendancesSubjectByHospital, getAttendancesDoctorBySubject, getAttendancesByDoctor } from '@/api/neworder'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import { Message } from 'element-ui'
export default {
  props: ['hideoperate'],
  data () {
    return {
      lists: null,
      selectDate: '',
      form: {
        date_range: '',
        subjects_id: [],
        hospital_id: null,
        able_id: null,
        type: 'Doctor',
        with_count_orders: true
      },
      districtOptions: [],
      hospitalOptions: [],
      subjectOptions: [],
      doctorOptions: [],
      district_id: [],
      attendance: {
        hospital_attendance: null,
        subjects_attendance: [],
      },
      attendance: '',
      selectId: null,
      weekend: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      doctors: null,
      attendances: [],
      pickerOptions: {
        disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7;
        }
      }
    }
  },
  computed: {
    days () {
      let arr = []
      let selectDay = this.selectDate;
      this.attendances.map(el => {
        if (!arr.includes(el.date) && selectDay <= el.date) {
          arr.push(el.date)
        }
      })
      return arr.sort()
    },
    hours () {
      let arr = []
      let selectDay = this.selectDate
      this.attendances.map(el => {
        if (!arr.includes(el.hour) && selectDay <= el.date) {
          arr.push(parseInt(el.hour))
        }
      })
      return arr
    }
  },
  methods: {
    // 格式化时间段
    formatTime(number) {
      let arr = [number, number + 1]
      return arr.map(i => {
          return (i < 10 ? '0' + i : i) + ':00';
      }).join(' ~ ')
    },
    // 格式化日期
    formatDate(val) {
      let date = {
          year: val.getFullYear(),
          month: val.getMonth() + 1,
          date: val.getDate()
      }
      // 日期补零
      if (date.month < 10) {
        date.month = '0' + date.month
      }
      if (date.date < 10) {
        date.date = '0' + date.date
      }
      // 返回日期
      return date.year + '-' + date.month + '-' + date.date
    },
    showDay(index) {
      let date = this.days[index]
      return date && date + '<br>' + this.weekend[new Date(date).getDay()]
    },
    // 查找单个数据
    showData(index, hour) {
      return this.attendances.find(el => parseInt(el.hour) === parseInt(hour) && el.date === this.days[index])
    },
    showStyle(i, h) {
      let style = []
      let data = this.showInfo(i, h)
      // console.log(data, i, h)
      if (data === null) {
        style.push('no-touch')
      }
      if (data === '已满') {
        style.push('is-full', 'no-touch')
      }
      if (data === '已选择') {
        style.push('is-select')
      }
      if (data === '已超时') {
        style.push('time-out', 'no-touch')
      }
      return style
    },
    showInfo(index, hour) {
      let obj = this.showData(index, hour)
      if (!obj) {
        return null
      }
      let d = new Date()
      let t = d.getHours()
      d = this.formatDate(d)
      if (!obj || obj.valid_orders_count === obj.visits_amount) {
        return '已满'
      }
      else if (obj.valid_orders_count < obj.visits_amount && t > obj.hour && obj.date === d) {
        return '已超时'
      }
      else if (obj.id === this.selectId) { 
        return '已选择'
      }
      else if (obj.valid_orders_count < obj.visits_amount) {
        return '可选择'
      }
    },
    // 点击选择时间
    selectDay(index, hour) {
      let type = this.showInfo(index, hour)
      if (type !== '可选择') {
        return
      }
      if (!this.days[index]) {
        return
      }
      let data = this.showData(index, hour)
      this.selectId = data ? data.id : null
      this.$emit('setAttendance', this.selectId)
    },
    close () {
      this.$emit('close', '')
    },
    onSubmit () {
      if (this.selectId == null || this.selectId == '') {
        Message.error('先选择预约医生')
        return
      }
      this.$emit('saveOrder', this.selectId)
    },
    datePickerChange (val) {
      // 获取地区
      this.date = val
      getAttendancesDistrict({ 'date': val }).then(response => {
        this.districtOptions = response.data
      })
    },
    handleDistrictChange (val) {
      // 获取医院
      this.district_id = val
      getAttendancesHospitalByDistrict({ 'date': this.date, 'district_id': val[2] }).then(response => {
        this.hospitalOptions = response.data
      })
    },
    handleHostpitalChange (val) {
      // 获取科室
      this.form.hospital_id = val
      getAttendancesSubjectByHospital({ 'date': this.date, 'hospital_id': val }).then(response => {
        this.subjectOptions = response.data
      })
    },
    handleSubjectChange (val) {
      this.form.subjects_id = val
      getAttendancesDoctorBySubject({ 'date': this.date, 'subject_id': val[1], 'hospital_id': this.form.hospital_id }).then(response => {
        this.doctorOptions = response.data
      })
    },
    handleDoctorChange (val) {
      getAttendancesByDoctor({ 'from': startOfWeek(this.date).format('YYYY-MM-DD'), 'to': endOfWeek(this.date).format('YYYY-MM-DD'), 'doctor_id': val }).then(response => {
        this.attendances = response.data
      })
    },
  }
}
</script>
<style lang="scss" scoped>
div.label {
    width: 81px;
}

.scheduling-date {
    border: 1px solid #a5d9ff;
    border-collapse: collapse;

    thead {
        border-bottom: 1px solid #eee;
    }

    tr {
        border-bottom: 1px solid #eee;
        &:last-child {
            border-bottom: 0;
        }
    }

    th {
        width: 12.5%;
        padding: 16px 1em;
    }

    td {
        padding: 1.6rem 1em;
        text-align: center;
        vertical-align: middle;

        &:first-child {
            border-right: 1px solid #eee;
        }

        &:hover {
            background-color: #20A0FF;
            color: #F9FAFC;
            cursor: pointer;
        }
    }

    .no-touch {
        &:hover {
            cursor: not-allowed;
            background-color: transparent;
        }
    }

    .is-full {
        color: #fff;
        background-color: #f08400;
        &:hover {
            background-color: #f08400;
        }
    }
    .time-out {
        color: #fff;
        background-color: #aaa;
        &:hover {
            color: #fff;
            background-color: #aaa;
        }
    }

    .is-select {
        color: #fff;
        background-color: #38adf4;
    }
}
</style>
