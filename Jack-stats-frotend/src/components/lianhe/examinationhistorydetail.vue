<template>
  <el-dialog :visible.sync="dialogVisible" title="历史检查单详情" width="90%">
    <div>
      <div class="h2 mb2" v-if="form.number">
          <span>单号：{{ form.number }}</span>
      </div>
      <div class="h2 mb2" v-if="form.serviceNumber">
          <span>美年订单号：{{ form.serviceNumber }}</span>
      </div>
      <div class="h2 mb2" v-if="form.resource_id">
          <span>美年检查号：{{ form.resource_id }}</span>
      </div>

      <el-form>
          <el-row class="mb2">
              <el-col :span="24">
                  <div class="right">
                      <el-button @click="handleMeinian()" v-if="form.meinian_result"
                                 type="primary">美年结果
                      </el-button>
                      <el-button @click="handleYingda()" v-if="form.yingda_result" type="primary">
                          影像结果
                      </el-button>  
                  </div>
              </el-col>
          </el-row>
          <el-row class="mb2">
              <el-col :span="12">
                  <el-form-item label="临床诊断:">{{ form.diagnosis }}</el-form-item>
              </el-col>
          </el-row>
          <el-row justify="left">
              <el-col :span="12">
                  <el-form-item label="既往病史:">{{ form.history_disease }}</el-form-item>
              </el-col>
          </el-row>
          <el-row justify="left">
              <el-col :span="12">
                  <el-form-item label="病理及体征:">{{ form.pathological_signs }}</el-form-item>
              </el-col>
          </el-row>
          <el-row justify="left">
              <el-col :span="12">
                  <el-form-item label="相关检查结果:">{{ form.relation_result }}</el-form-item>
              </el-col>
          </el-row>
      </el-form>
      <el-row>
          <el-col :span="24">
            <div class="center h2 pb2">
              <span class="h1">检查单</span>
            </div>
          </el-col>
      </el-row>
      <el-table :data="form.items">
          <el-table-column prop="name" align="center" label="项目名称" min-width="150"></el-table-column>
          <el-table-column prop="code" align="center" label="检验号" min-width="100"></el-table-column>
          <el-table-column prop="sample" align="center" label="样本类型" min-width="100"></el-table-column>
          <el-table-column prop="type" align="center" label="类型" min-width="80"></el-table-column>
          <el-table-column label="项目详情" align="center" min-width="150">
              <template slot-scope="scope">
                  {{ scope.row.detail }}
              </template>
          </el-table-column>
          <el-table-column prop="checkstore_name" align="center" label="检查地点" min-width="100">
          </el-table-column>
          <el-table-column prop="time_period" align="center" label="时间段" width="120">
            <template slot-scope="scope">{{ scope.row.time_period | parseTimePeriod }}</template>
          </el-table-column>
          <el-table-column prop="price" align="center" label="零售价" min-width="100"></el-table-column>
      </el-table>

    </div>  
  </el-dialog>
</template>
<script>
import { getExamOrderItems } from '@/api/orders'
import { Message } from 'element-ui'
export default {
  name: 'examinationinfo',
  data () {
    return {
      isEditExam: false,
      form: {
        number: null,
        id: '',
        order_id: null,
        items: [],
        patient_id: '',
        serviceNumber: null,
        meinian_result: [],
        meinianResult: [],
        yingda_result: [],
        resource_id: null,
        diagnosis: '',
        history_disease: '',
        pathological_signs: '',
        relation_result: ''
      },
      itemIndex: -1,
      item: {},
      dialogVisible: false
    }
  },
  methods: {
    historyDetail (order) {
      this.dialogVisible = true
      getExamOrderItems({ 'order_id': order.id }).then(response => {
        this.form = order
        this.form.items = response.data
      })
    },
    handleOrderAmount () {
      var tmp = 0
      for (var i in this.form.items) {
        tmp += parseFloat(this.form.items[i].price)
      }
      this.form.amount = parseFloat(tmp).toFixed(2)
    },
    getSummaries (param) {
      const {columns} = param
      var sums = []
      sums[columns.length - 1] = '总额：' + this.form.amount + '元'
      return sums
    }
  }
}
</script>
