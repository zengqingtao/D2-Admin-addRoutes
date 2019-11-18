<template>
  <el-dialog :visible.sync="dialogVisible" title="收益详情" width="50%">
    <el-table :data="list">
      <el-table-column align="center" label="服务类型">
        <template slot-scope="scope">
          <span v-if="scope.row.able_type == 'App\\Models\\ExaminationOrder'">检查单</span>
          <span v-if="scope.row.able_type == 'App\\Models\\Order' && scope.row.order_type == 'split'">分诊单</span>
          <span v-if="scope.row.able_type == 'App\\Models\\Order' && scope.row.order_type == 'reserve'">预约单</span>
          <span v-if="scope.row.able_type == 'App\\Models\\TreatmentOrder'">治疗单</span>
          <span v-if="scope.row.able_type == 'App\\Models\\ServeOrder'">服务单</span>
          <span v-if="scope.row.able_type == 'App\\Models\\PrescriptionOrder'">药品单</span>
        </template>
      </el-table-column>
      <el-table-column prop="order_number" align="center" label="订单编号">
      </el-table-column>
      <el-table-column prop="order_status" align="center" label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.able_type == 'App\\Models\\ExaminationOrder'">{{ scope.row.order_status | parseExaminationOrderStatus }}</span>
          <span v-if="scope.row.able_type == 'App\\Models\\Order'">{{ scope.row.order_status | parseOrderStatus }}</span>
          <span v-if="scope.row.able_type == 'App\\Models\\TreatmentOrder'">{{ scope.row.order_status | parseTreatmentOrderStatus }}</span>
          <span v-if="scope.row.able_type == 'App\\Models\\ServeOrder'">{{ scope.row.order_status | parseServeOrderStatus }}</span>
          <span v-if="scope.row.able_type == 'App\\Models\\PrescriptionOrder'">{{ scope.row.order_status | parsePrescriptionOrderStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="order_amount" align="center" label="订单金额">
      </el-table-column>
      <el-table-column label="订单创建时间" align="center" prop="created_at">
      </el-table-column>
      <el-table-column label="服务收益" align="center" prop="estimated">
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
  </el-dialog>
</template>
<script>
import { getBonusDetail } from '@/api/personnel'
export default{
  data() {
    return {
      dialogVisible: false,
      listQuery: {
        'page': 1,
        'limit': 20,
        'role': '',
        'search': ''
      },
      total: null,
      list: [],
      id: ''
    }
  },
  methods: {
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData(this.id)
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.fetchData(this.id)
    },
    showBonusDetail (id) {
      this.id = id
      getBonusDetail({id: id}).then(response => {
        this.total = response.data.total
        this.list = response.data.list
      })
      this.dialogVisible = true
    }
  }
}
</script>
