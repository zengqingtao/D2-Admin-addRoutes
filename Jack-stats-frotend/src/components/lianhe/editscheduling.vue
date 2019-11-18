<template>
  <el-dialog
      title="排班编辑"
      class="schedule-modify-components"
      :visible.sync="dialogVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      width="60%">
    <el-form :span="6" :inline="true" :model="form" label-position="top" class="flex row-bg pb2" :class="nurse || 'justify-between'">
      <el-form-item :label="nurse ? '护士:' : '医生:'">
        <el-select
            v-model="form.able_id"
            :placeholder="nurse ? '选择护士' : '选择医生'"
            @change="handleAbleChange"
            :class="nurse && 'mr2'">
          <el-option
              v-for="item in dataList"
              :label="item.full_name"
              :value="item.id"
              :key="item.id"
              :disabled="tableData.findIndex(el => el.able_id === item.id) > -1 && nurse">
          </el-option>
        </el-select>
        <el-button v-if="nurse" type="primary" style="margin-left: 22px;" native-type="button" @click="handleAdd">添加</el-button>
      </el-form-item>

      <el-form-item label="接诊量:" v-if="!nurse">
        <el-input v-model.number="form.visits_amount" placeholder="接诊量（数字）"></el-input>
      </el-form-item>

      <el-form-item label="时间段:" v-if="!nurse">
        <el-select v-model="form.hour" placeholder="请选择">
          <el-option
              v-for="item in timeOption"
              :key="item.hour"
              :label="item.text"
              :value="item.hour"
              :disabled="disabledTime(item)">
          </el-option>
        </el-select>
        <el-button type="primary" style="margin-left: 22px;" native-type="button" @click="handleAdd">添加</el-button>
      </el-form-item>

    </el-form>
    <span>
      <el-table :data="tableData" stripe v-loading="loading">
        <!-- 姓名 -->
        <el-table-column :label="nurse ? '护士' : '医生'" :width="nurse ? 'auto' : '120px'">
          <template slot-scope="{$index, row}">{{ row.able.full_name }}</template>
        </el-table-column>
        <!-- 接诊量 -->
        <el-table-column label="接诊量" v-if="!nurse">
          <template slot-scope="{$index, row}">
            <template v-if="modifyData && modifyId === row.id && $index === modifyIndex">
              <el-input
                  @blur="inputBlur(row)"
                  v-model="tableData.find(el => el.id === row.id).visits_amount">
              </el-input>
            </template>
            <template v-else>{{ row.visits_amount }}</template>
          </template>
        </el-table-column>
        <!-- 时间段 -->
        <el-table-column label="时间段" v-if="!nurse">
          <template slot-scope="{$index, row}">{{ formatTime(row.hour) }}</template>
        </el-table-column>
        <!-- 删除 -->
        <el-table-column label="操作" width="150px" align="center">
          <template slot-scope="{$index, row}">
            <template v-if="!nurse">
              <el-button size="small"
                     @click.native.prevent="inputBlur(row)"
                     v-if="tableData && modifyId === row.id && $index === modifyIndex">
                取消
              </el-button>
              <el-button size="small" @click.native.prevent="handleEdit($index, tableData, row)" v-else>
                编辑
              </el-button>
            </template>
            <el-button size="small" type="danger"
                   @click.native.prevent="handleDelete($index, tableData, row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </span>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSubmit">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getSubjectDoctor, getGeneralOrNurse } from '@/api/orders'
import { getAttendanceByAble, setAttendance } from '@/api/hospital'
import { Message } from 'element-ui'
export default {
  props: ['value', 'source', 'render', 'nurse'],
  data() {
    return {
      dialogVisible: false,
      period: '',
      dataList: [],
      form: {},
      fetchForm: {
        date: '',
        hospital_id: '',
        subjects_id: [],
        time_period: '',
        items: []
      },
      tableData: [],
      otherTime: [],
      loading: false,
      modifyId: '',
      modifyData: '',
      modifyIndex: '',
    };
  },
  computed: {
    // 遍历输出时间段选项
    timeOption() {
      const [morning, midday, afternoon, evening] = [6, 12, 18, 24];

      switch (this.fetchForm.time_period) {
        case 'morning':
          return this.accountTimeOption(morning, midday);
        case 'afternoon':
          return this.accountTimeOption(midday, afternoon);
        case 'evening':
          return this.accountTimeOption(afternoon, evening);
      }
    },
  },
  methods: {
    // 禁止选择的时间
    disabledTime(item) {
      if (this.otherTime.length) {
        let other = this.otherTime.findIndex(el => el.hour === item.hour);
        if (other > -1) return true;
      }

      let today = this.formatDate(new Date());
      if (this.source.date === today && item.hour < new Date().getHours()) return true;

      let index = this.tableData.findIndex(el => {
        if (el.able_id === this.form.able_id && el.hour === item.hour) return true;
      });

      if (index >= 0) return true;
    },
    // 根据 ’morning/afternoon/evening‘ 返回时间段
    accountTimeOption(begin, end) {
      let arr = [];
      for (let i = begin; i < end; i++) {
        let item = {
          hour: i,
          text: this.formatTime(i),
        };
        arr.push(item);
      }
      return arr;
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
    // 初始化form
    createDate() {
      return {
        id: '',
        able_id: '',
        visits_amount: '',
        hour: '',
        type: this.nurse ? 'App\\Models\\Nurse' : 'App\\Models\\Doctor',
      };
    },
    // 接诊量失去焦点
    inputBlur(row) {
      if (row.valid_orders_count > row.visits_amount) {
        Message.error('接诊量不能小于当前预约数')
        row.visits_amount = this.modifyData;
        return
      }
      this.modifyId = '';
      this.modifyData = '';
      this.modifyIndex = '';
    },
    // 编辑接诊量
    handleEdit(index, data, row) {
      this.modifyId = row.id;
      this.modifyData = row.visits_amount;
      this.modifyIndex = index;
    },
    // 删除排班
    handleDelete(index, data, row) {
      if (row.valid_orders_count > 0) {
        Message.error('存在有效订单，无法删除')
      } else {
        this.delData(index, data);
      }
    },
    // 删除当前工作人员
    delData(index, data) {
      data.splice(index, 1);
      Message.success('删除成功');
    },
    // 添加排班
    handleAdd() {
      if (!this.nurse && (!this.form.able_id
        || !this.form.visits_amount
        || !this.form.hour)) {
        Message.info('请填写完整姓名、接诊量、时间段等信息')
        return
      }
      if (this.nurse && !this.form.able_id) {
        Message.info('请选择护士')
        return
      }

      const has = this.tableData.find(i => {
        return i.able_id === this.form.able_id && i.hour === this.form.hour;
      });
      if (has) {
        Message.error('已经存在相同医生和时间')
        return
      }

      this.form.able = this.dataList.find(el => el.id === this.form.able_id);
      this.form.date = this.source.date
      this.form.time_period = this.source.time_period
      this.form.hospital_id = this.fetchForm.hospital_id
      this.form.able_type = this.form.type
      this.tableData.push(this.form);
      this.form = this.createDate();
    },
    // 保存数据
    handleSubmit() {
      this.fetchForm.items = this.tableData;

      console.log(this.fetchForm)
      // API.post('attendances', this.fetchForm).then(res => {
      //   this.dialogVisible = false;
      // });
      setAttendance({ 'subject_id': this.fetchForm.subjects_id, 'data': this.fetchForm.items }).then(response => {
        this.dialogVisible = false
      })
    },
    // 获取医生列表
    fetchDoctor() {
      // let param = {
      //   hospital_id: this.fetchForm.hospital_id,
      //   subjects_id: this.fetchForm.subjects_id
      // };
      // API.get('doctors', {params: param}).then(res => {
      //   this.dataList = res;
      // });
      getSubjectDoctor({ 'hospital_id': this.fetchForm.hospital_id, 'subject_id': this.fetchForm.subjects_id[1] }).then(response => {
        this.dataList = response.data
      })
    },
    // 获取护士列表
    fetchNurse() {
      // API.get('nurses', {params: {hospital_id: this.fetchForm.hospital_id}})
      //   .then(res => {
      //     this.dataList = res;
      //   });
      getGeneralOrNurse({ 'hospital_id': this.fetchForm.hospital_id, 'has_nurse': 1 }).then(response => {
        this.dataList = response.data
      })
    },
    // 更新doctorList数据
    updateDataListData() {
      if (!this.nurse) this.fetchDoctor();
      else this.fetchNurse();
    },
    handleAbleChange() {
      if (this.nurse) return;

      let config = {
        able_id: this.form.able_id,
        date: this.fetchForm.date,
      };

      // API.get('attendances', {params: config}).then(res => {
      //   this.otherTime = res.filter(el => el.time_period === this.fetchForm.time_period);
      // });
      getAttendanceByAble(config).then(response => {
        this.otherTime = response.data.filter(el => el.time_period === this.fetchForm.time_period)
      })
    }
  },
  watch: {
    source() {
      this.fetchForm = this.source;
    },
    dialogVisible() {
      // 打开时获取医生列表， 关闭时重置form
      if (this.dialogVisible) this.updateDataListData();
      else {
        this.form = this.createDate();
        this.$emit('input', true);
      }
    },
    render() {
      this.tableData = this.render;
    }
  },
  created() {
    this.form = this.createDate();
  }
};
</script>

<style lang="scss">
  .schedule-modify-components {
    .el-dialog__footer {
      text-align: center;
    }
    .el-date-editor.time-select {
      width: 120px;
    }
    .time-select {
      margin: 0;
    }
  }
</style>
