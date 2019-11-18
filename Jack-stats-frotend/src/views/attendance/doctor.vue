<template>
  <d2-container>
    <div class="flex row-bg pb2 justify-between item-center">
      <!-- 筛选form -->
      <form :span="6">
        <selecthospitals :hasDoctor="1" v-model="form.hospital_id"></selecthospitals>
        <el-cascader placeholder="请选择科室" :options="subjectOptions" v-model="form.subjects_id"></el-cascader>
        <!-- 日期选择器 -->
        <el-date-picker v-model="selectDay" type="date" placeholder="选择日期" align="center" :editable="false" style="display:inline-block"></el-date-picker>
      </form>
    </div>

    <!-- 排班表：table -->
    <el-table :data="showScheduleData" border element-loading-text="拼命加载中" v-loading="loading" stripe class="mt20">
      <!-- 第一列：时间段 -->
      <el-table-column label="时间段" width="80px" align="center">
        <template slot-scope="{$index, row}">{{ row.period | period }}</template>
      </el-table-column>
      <!-- 2-8列：日期 -->
      <el-table-column
          v-for="day in weekendData"
          :key="day.prop"
          :prop="day.date"
          :label="day.text + ' ( ' + day.date + ' ) '">
        <template slot-scope="{$index, row}">
          <div v-if="row[day.date].length == 0">/</div>
          <div v-for="(i, index) in row[day.date]" v-html="doctorShow(index, row, day.date)"></div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 修改排版表-弹窗 -->
    <editscheduling ref="modifyDialog" :source="transDate" :render="renderData" v-model="dialogVisible"></editscheduling>
  </d2-container>
</template>

<script>
import format from 'date-fns/format'
import startOfWeek from 'date-fns/start_of_week'
import endOfWeek from 'date-fns/end_of_week'
import eachDay from 'date-fns/each_day'
import selecthospitals from '@/components/lianhe/selecthospitals'
import editscheduling from '@/components/lianhe/editscheduling'
import { getWeekAttendance, setAttendance } from '@/api/hospital'
import { getHasDoctorSubject } from '@/api/orders'
import { Message } from 'element-ui'
export default {
  components: {
    selecthospitals,
    editscheduling
  },
  props: [],
  data() {
    return {
      transDate: {},
      renderData: null,
      selectDay: new Date(),
      loading: false,
      dialogVisible: false,
      form: {
        type: 'Doctor',
        hospital_id: '',
        date: '',
        date_range: '',
        subjects_id: [],
        with_count_orders: true
      },
      showScheduleData: null,
      subjectOptions: []
    }
  },
  watch: {
    selectDay() {
      this.fetchData();
    },
    dialogVisible() {
      if (this.dialogVisible) {
        this.fetchData();
        this.dialogVisible = false;
      }
    },
    'form.subjects_id'(val) {
      if (val.length) this.filterData();
    },
    'form.hospital_id'(val) {
      this.form.subjects_id = []
      this.showScheduleData = null
      this.getHasDoctorSubject()
      if (val) {
        this.filterData()
      }
    }
  },
  computed: {
    is_fetch_data() {
      return !!this.form.hospital_id && !!this.form.subjects_id;
    },
    weekendData() {
      let day = this.selectDay ? this.formatDate(this.selectDay) : new Date();
      const weekText = ['日', '一', '二', '三', '四', '五', '六'];

      // week: 返回本周的每一天 @type array
      let week = eachDay(startOfWeek(day), endOfWeek(day));
      let arr = [];

      week.map((date, index) => {
        let item = {
          prop: format(date, 'dddd'),
          text: '星期' + weekText[index],
          date: this.formatDate(date),
        };
        arr.push(item);
      });
      return arr;
    },

  },
  filters: {
    period(val) {
      const lang = {
        morning: '上午',
        afternoon: '下午',
        evening: '晚上',
      };
      return lang[val];
    },
  },
  methods: {
    getHasDoctorSubject () {
      getHasDoctorSubject({ 'hospital_id': this.form.hospital_id }).then(response => {
        this.subjectOptions = response.data
      })
    },
    // 格式化时间段
    formatTime(number) {
      number = parseInt(number)
      let arr = [number, number + 1];
      return arr.map(i => {
        return (i < 10 ? '0' + i : i) + ':00';
      }).join(' ~ ');
    },
    // 格式化日期
    formatDate(val) {
      let date = {
        year: val.getFullYear(),
        month: val.getMonth() + 1,
        date: val.getDate()
      };
      // 日期补零
      if (date.month < 10) date.month = '0' + date.month;
      if (date.date < 10) date.date = '0' + date.date;
      // 返回日期
      return date.year + '-' + date.month + '-' + date.date;
    },
    fetchHour(str) {
      switch (str) {
        case 'morning':
          return 12;
        case 'afternoon':
          return 18;
        case 'evening':
          return 24;
      }
    },
    // create date
    createSchedueData() {
      let arr = [];
      const period = ['morning', 'afternoon', 'evening'];

      for (let i = 0; i < 3; i++) {
        let obj = {
          period: period[i],
        };
        arr.push(obj);

        this.weekendData.forEach((el) => {
          arr[i][el.date] = [];
        });
      }
      return arr;
    },
    // 单元格点击
    cellClick(row, column, cell) {
      if (column.label === '时间段') return null;
      if (!this.is_fetch_data) {
        Message.error('请选择查询的医院与科室')
        return
      }

      // 点击日期在当前日期之前 return false
      let today = this.formatDate(new Date());
      let clickDay = column.property;
      if (clickDay < today) return false;

      // 在当前时间段之前 return false
      if (clickDay === today) {
        let hour = new Date().getHours()
        let clickHour = this.fetchHour(row.period)
        if (clickHour < hour) return false
      }

      if (!this.form.subjects_id.length) {
        Message.error('请选择科室')
        return
      }

      // 传递数据到 SchedulingModify组件
      let rowData = this.showScheduleData.find(el => el.period === row.period)
      let cellData = rowData[column.property]

      // 对cellData浅拷贝处理
      this.renderData = cellData.concat()

      this.transDate = {
        date: column.property,
        hospital_id: this.form.hospital_id,
        subjects_id: this.form.subjects_id,
        time_period: row.period,
        items: []
      }
      this.$refs.modifyDialog.dialogVisible = true
    },
    // 显示单元格的数据
    doctorShow(index, row, key) {
      let data = row[key];
      let doctor = data[index];

      if (!data.length) {
        return ''
      }
      return doctor.able_name + ',' + this.formatTime(doctor.hour) + '<br>';
    },
    // 获取排版数据
    fetchData(page = null) {
      this.loading = true;
      this.changeDate();

      var subject_id = ''
      if (this.form.subjects_id.length > 0) {
        subject_id = this.form.subjects_id[1]
      }
      getWeekAttendance({ 'date': '', 'hospital_id': this.form.hospital_id, 'subject_id': subject_id, 'from': this.form.date_range[0], 'to': this.form.date_range[1], 'type': 'Doctor' }).then(response => {
        this.handleResponse(response.data)
        this.loading = false
      })
    },
    // 筛选数据
    filterData() {
      if (this.is_fetch_data) {
        return this.fetchData()
      }
      Message.error('请选择查询的医院与科室')
    },
    // 处理排班返回的数据
    handleResponse(data) {
      this.showScheduleData = this.createSchedueData();
      if (!data.length) return;

      data.sort((a, b) => {
        return a.hour - b.hour;
      });

      data.map(el => {
        let [period, key] = [el.time_period, el.date];
        let index = this.showScheduleData.findIndex(i => i.period === period);
        let sourceData = this.showScheduleData[index];

        if (sourceData[key]) this.showScheduleData[index][key].push(el);
      });
      return data;
    },
    // 修改选择日期，更新时间范围
    changeDate() {
      if (!this.selectDay) this.selectDay = new Date();

      let day = this.selectDay;
      let start = this.formatDate(startOfWeek(day));
      let end = this.formatDate(endOfWeek(day));
      this.form.date_range = [start, end];
    }
  },
  created() {
  },
  mounted() {
  },
};
</script>
