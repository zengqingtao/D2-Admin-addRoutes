<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-select v-model="listQuery.status" placeholder="请选择订单状态">
        <el-option label="全部" value=""></el-option>
        <el-option
          v-for="item in orderStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.search" style="width: 200px;margin-left: 10px;margin-right:20px;" placeholder="输入名称/身份证/订单号/诊疗卡号搜索" clearable></el-input>
      <el-date-picker
        v-model="listQuery.date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="number" label="订单号"></el-table-column>
      <el-table-column align="center" prop="patient_name" label="姓名"></el-table-column>
      <el-table-column align="center" prop="phone" label="手机号"></el-table-column>
      <el-table-column align="center" prop="able_name" label="预约医生"></el-table-column>
      <el-table-column align="center" label="证件类型">
        <template slot-scope="scope">
          {{ scope.row.papers_type | parsePapersType }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="identification_number" label="身份证号"></el-table-column>
      <el-table-column align="center" prop="amount" label="费用"></el-table-column>
      <el-table-column align="center" label="支付方式">
        <template slot-scope="scope">
          {{ scope.row.channel | parsePayChannel }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          {{ scope.row.status | parseOrderStatus }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="创建者">
        <template slot-scope="scope">
          <span v-if="scope.row.source_order_id > 0">{{ scope.row.admin_name }}</span>
          <span v-if="scope.row.source_order_id <= 0">{{ scope.row.creator }}</span>
         </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="提交时间"></el-table-column>
      <el-table-column align="center" label="跟进人员" width="150">
        <template slot-scope="scope">
          <div v-if="scope.row.source_order_id <= 0">
            <span>客服：{{ scope.row.service_name }}</span><br/>
            <span v-if="scope.row.able_name">预约医生：{{ scope.row.able_name }}</span><br/>
            <span v-if="scope.row.nurses_name">转交护士：{{ scope.row.nurses_name }}</span>  
          </div>
          <div v-if="scope.row.source_order_id > 0">
            <span>客服：{{ scope.row.services_name }}</span><br/>
            <span v-if="scope.row.doctor_name">预约医生：{{ scope.row.doctor_name }}</span><br/>
            <span v-if="scope.row.nurse_name">转交护士：{{ scope.row.nurse_name }}</span>  
          </div>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="source_name" label="来源机构"></el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <div class="btn-box">
            <el-button size="mini" type="success" v-if="scope.row.status == 'pay'" @click="handlePay(scope.row.id)">支付</el-button>
            <el-button size="mini" type="primary" plain @click="handleFollow(scope.row.id)">服务跟踪</el-button>
            <el-button size="mini" type="primary" @click="handleWork(scope.row)">工作台</el-button>
            <el-button size="mini" type="warning" @click="handleHide(scope.row)">隐藏</el-button>
          </div>
        </template>
      </el-table-column>

    </el-table>
    <!-- footer 分页条 -->
    <template slot="footer">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="listQuery.page"
          :page-sizes="[10,20,30,50]"
          :page-size="listQuery.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          style="margin: -10px;">
        </el-pagination>
    </template>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="80%" center :close-on-click-modal="false">
      <el-tabs v-model="tabName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="病历信息" name="first">
          <medicalrecordinfo ref="medicalrecordinfo" @handleHealth="handleHealth"></medicalrecordinfo>
        </el-tab-pane>
        <el-tab-pane label="医嘱信息" name="second">
          <prescriptioninfo ref="prescriptioninfo"  @handleMedicine="handleMedicine" @handleUpdateMedicineSelected="handleUpdateMedicineSelected" @handleEditMedicine="handleEditMedicine"></prescriptioninfo>
        </el-tab-pane>
        <el-tab-pane label="检查检验项目" name="third">
          <examinationinfo ref="examinationinfo" @handleExam="handleExam" @handleTimeperiod="handleTimeperiod"></examinationinfo>
        </el-tab-pane>
        <el-tab-pane label="检查检验结果" name="fourth">检查检验结果</el-tab-pane>
        <el-tab-pane label="治疗项目" name="fifth">
          <treatmentinfo ref="treatmentinfo" @handleTreatment="handleTreatment" @handleTimeperiod="handleTimeperiod"></treatmentinfo>
        </el-tab-pane>
        <el-tab-pane label="服务跟进" name="sixth"><el-button type="primary" @click="handleFollow(order_id)">服务跟进</el-button></el-tab-pane>
      </el-tabs>
    </el-dialog>
    <reservationfollow ref="follow" @handleHealth="handleHealth" @handleRefresh="fetchData"></reservationfollow>
    <health ref="health"></health>
    <medicine ref="medicine" @handleEditMedicine="handleEditMedicine"></medicine>
    <editmedicine ref="editmedicine" @handleAddOrSetMedicine="handleAddOrSetMedicine"></editmedicine>
    <examination ref="examination" @handleAddExamination="handleAddExamination"></examination>
    <timeperiod ref="timeperiod" @handleSetTimeperiod="handleSetTimeperiod"></timeperiod>
    <treatment ref="treatment" @handleAddTreatment="handleAddTreatment"></treatment>
    <paynow ref="paynow" @handleRefresh="handleRefresh"></paynow>
  </d2-container>
</template>

<script>
import { getReservationList, getWorkByOrderId } from '@/api/orders'
import { orderStatusOptions } from '@/data/data'
import medicalrecordinfo from '@/components/lianhe/medicalrecordinfo'
import prescriptioninfo from '@/components/lianhe/prescriptioninfo'
import treatmentinfo from '@/components/lianhe/treatmentinfo'
import examinationinfo from '@/components/lianhe/examinationinfo'
import reservationfollow from '@/components/lianhe/reservationfollow'
import health from '@/components/lianhe/health'
import medicine from '@/components/lianhe/medicine'
import editmedicine from '@/components/lianhe/editmedicine'
import examination from '@/components/lianhe/examination'
import treatment from '@/components/lianhe/treatment'
import timeperiod from '@/components/lianhe/timeperiod'
import paynow from '@/components/lianhe/paynow'
import { hideOrder } from '@/api/hidedel'
export default {
  name: 'reservationlist',
  components: {
    medicalrecordinfo,
    prescriptioninfo,
    treatmentinfo,
    examinationinfo,
    reservationfollow,
    health,
    medicine,
    editmedicine,
    examination,
    treatment,
    timeperiod,
    paynow
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      orderStatusOptions: orderStatusOptions,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'type': 'reserve',
        'status': '',
        'date': ['', '']
      },
      order_id: '',
      options: [],
      dialogFormTitle: '',
      work: {},
      tabName: 'first',
      medicineIndex: -1,
      dialogFormVisible: false
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.status'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.date'(val) {
      this.listQuery.page = 1
      this.listQuery.date[0] = this.listQuery.date[0].format('YYYY-MM-DD')
      this.listQuery.date[1] = this.listQuery.date[1].format('YYYY-MM-DD')
      this.fetchData()
    }
  },
  methods: {
    handleHide (row) {
      this.$confirm('确认隐藏此订单？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideOrder({order_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleRefresh() {
      this.fetchData()
    },
    handlePay (order_id) {
      this.$refs.paynow.handlePayNow(order_id, 'App\\Models\\Order')
    },
    handleClick(tab, event) {
      if (tab._data.index === '5') {
        this.handleFollow (this.order_id)
      }
    },
    handleWork (row) {
      this.dialogFormTitle = '工作台'
      this.order_id = row.id
      getWorkByOrderId({ 'order_id': row.id }).then(response => {
        this.work = response.data
        this.$refs.medicalrecordinfo.handleMedicalRecord(this.work.medical_record, this.work.order)
        this.$refs.prescriptioninfo.handlePrescriptioninfo(this.work.prescription, this.work.order)
        this.$refs.examinationinfo.handleExaminationinfo(this.work.examination, this.work.order)
        this.$refs.treatmentinfo.handleTreatmentinfo(this.work.treatment, this.work.order)
      })
      this.dialogFormVisible = true
    },
    handleFollow (order_id) {
      this.$refs.follow.handleFollow(order_id)
    },
    handleHealth (patient_id) {
      this.$refs.health.handleOrders(patient_id)
    },
    handleMedicine (medicine_ids, type, source) {
      this.$refs.medicine.handleMedicine(medicine_ids, type, source)
    },
    handleEditMedicine (medicine) {
      this.$refs.editmedicine.handleEditMedicine(medicine)
    },
    handleAddOrSetMedicine (medicine) {
      this.$refs.prescriptioninfo.handleAddOrSetMedicine(medicine)
    },
    handleUpdateMedicineSelected (selected) {
      this.$refs.medicine.handleUpdateSelected(selected)
    },
    handleExam (examination_ids) {
      this.$refs.examination.handleExaminationList(examination_ids)
    },
    handleAddExamination (examination) {
      this.$refs.examinationinfo.handleAddExamination(examination)
    },
    handleTreatment (treatment_ids) {
      this.$refs.treatment.handleTreatmentList(treatment_ids)
    },
    handleAddTreatment (treatment) {
      this.$refs.treatmentinfo.handleAddTreatment(treatment)
    },
    handleSetTimeperiod (item) {
      this.$refs.examinationinfo.handleSetTimeperiod(item)
    },
    handleTimeperiod (item, type) {
      this.$refs.timeperiod.handleTimeperiod(item, type)
    },
    handleEdit (row) {
      this.dialogFormTitle = '分诊详情'
      this.dialogFormVisible = true
    },
    handleFilter () {
      this.listQuery.page = 1
      this.fetchData()
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.fetchData()
    },
    fetchData () {
      this.listLoading = true
      getReservationList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-box{
  text-align: left;
  button{
    margin: 5px;
  }
}
</style>
