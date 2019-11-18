<template>
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
                    <el-button @click="handlePrint()" type="primary">打印</el-button>
                </div>
                <!-- <div class="h2 mt20">
                    <el-button v-if="isEditExam" class="right" @click="isEditExam = false" type="primary">
                        {{ form.id == '' ? '立即开单' : '修改订单' }}
                    </el-button>
                    <el-button v-else class="right" @click="isEditExam = true" type="default">取消</el-button>
                </div> -->
            </el-col>
        </el-row>
        <el-row class="mb2">
            <el-col :span="12">
                <el-form-item label="临床诊断:">{{form.diagnosis}}
                    <!-- <el-input type="textarea" :autosize="{minRows: 2, maxRows: 4}" v-model="form.diagnosis"></el-input> -->
                </el-form-item>
            </el-col>
        </el-row>
        <el-row justify="left">
            <el-col :span="12">
                <el-form-item label="既往病史:">{{form.history_disease}}
                    <!-- <el-input v-model="form.history_disease" type="textarea"></el-input> -->
                </el-form-item>
            </el-col>
        </el-row>
        <el-row justify="left">
            <el-col :span="12">
                <el-form-item label="病理及体征:">{{form.pathological_signs}}
                    <!-- <el-input v-model="form.pathological_signs" type="textarea"></el-input> -->
                </el-form-item>
            </el-col>
        </el-row>
        <el-row justify="left">
            <el-col :span="12">
                <el-form-item label="相关检查结果:">{{form.relation_result}}
                    <!-- <el-input v-model="form.relation_result" type="textarea"></el-input> -->
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
 <!--    <el-row>
        <el-col :span="24">
          <div class="center h2 pb2">
            <span class="h1">检查单</span>
            <el-button @click="handleExam()" v-if="!isEditExam" type="primary" size="mini">添加
            </el-button>
          </div>
        </el-col>
    </el-row> -->
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
     <!--    <el-table-column label="操作" align="center" min-width="200">
            <template slot-scope="scope">
                <el-button size="small" @click="handleOrderItem(scope.$index, scope.row)" type="primary">编辑
                </el-button>
                <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="danger">删除
                </el-button>
            </template>
        </el-table-column> -->
    </el-table>
    <!-- <div class="pt2 center submit mt20">
        <el-button type="primary" @click="onSubmit()">保存</el-button>
    </div> -->
  </div>  
</template>
<script>
import { setExaminationOrder } from '@/api/orders'
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
      item: {}
    }
  },
  methods: {
    handleExaminationinfo (examinationinfo, order) {
      if (examinationinfo === null) {
        this.form = {
          number: null,
          id: '',
          order_id: order.id,
          items: [],
          patient_id: order.patient_id,
          serviceNumber: null,
          meinian_result: [],
          meinianResult: [],
          yingda_result: [],
          resource_id: null,
          diagnosis: '',
          history_disease: '',
          pathological_signs: '',
          relation_result: ''
        }
      } else {
        this.form = examinationinfo  
      }
    },
    handleExam () {
      this.itemIndex = -1
      this.$emit('handleExam', this.getExamIds())
    },
    getExamIds () {
      var tmp = []
      for (var i in this.form.items) {
        tmp.push(this.form.items[i].examination_id)
      }
      return tmp
    },
    handleSetTimeperiod (item) {
      this.form.items[this.itemIndex] = item
    },
    handleDelete (index, item) {
      this.form.items.splice(index, 1)
      this.handleOrderAmount()
    },
    handleAddExamination (item) {
      this.form.items.push(item)
      this.handleOrderAmount()
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
    },
    handleOrderItem (index, item) {
      this.item = item
      this.itemIndex = index
      this.$emit('handleTimeperiod', item, 'examination')
    },
    onSubmit () {
      setExaminationOrder(this.form).then(response => {
        Message.info('修改成功')
        this.dialogFormVisible = false
        this.fetchData()
      })
    }
  }
}
</script>
