<template>
  <el-dialog title="明细" :visible.sync="dialogInviteVisible" width="70%" center :close-on-click-modal="false">
    <p>预估收入总和：{{ totalEstimated }}元    实际收入总和：{{ totalActual }}元</p>
    <el-table :data="inviteDetail"
      element-loading-text="拼命加载中..."
      highlight-current-row
      stripe
      style="width: 100%">
      <el-table-column align="center" label="服务类型">
        <template slot-scope="scope">
          {{ scope.row.type | parseType }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="number" label="编号"></el-table-column>
      <el-table-column align="center" label="订单状态">
        <template slot-scope="scope">
          {{ scope.row.status | parseOrderStatus }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="amount" label="订单金额"></el-table-column>
      <el-table-column align="center" prop="createdAt" label="创建时间"></el-table-column>
      <el-table-column align="center" prop="estimated" label="预估收入"></el-table-column>
      <el-table-column align="center" prop="actual" label="实际收入"></el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
export default {
  name: 'invitedetail',
  filters: {
    parseType: function (index) {
      var type = {'orders': '预约单', 'examination_orders': '检查单', 'treatment_orders': '治疗单', 'prescription_orders': '药品单', 'serve_orders': '服务单'}
      return type[index]
    }
  },
  data () {
    return {
      dialogInviteVisible: false,
      inviteDetail: [],
      totalEstimated: 0,
      totalActual: 0
    }
  },
  methods: {
    showInviteDetail (inviteDetail) {
      var totalEstimated = 0
      var totalActual = 0
      inviteDetail.forEach((item) => {
        totalEstimated += parseFloat(item.estimated)
        totalActual += parseFloat(item.actual)
      })
      this.totalEstimated = parseFloat(totalEstimated).toFixed(2)
      this.totalActual = parseFloat(totalActual).toFixed(2)
      this.inviteDetail = inviteDetail
      this.dialogInviteVisible = true
    }
  }
}
</script>