<template>
  <div>
    <el-dialog title="邀约名单" :visible.sync="dialogInviteVisible" width="70%" center :close-on-click-modal="false">
      <el-table :data="inviteList"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
        <el-table-column align="center" prop="user_type" label="用户类型"></el-table-column>
        <el-table-column align="center" prop="full_name" label="用户"></el-table-column>
        <el-table-column align="center" prop="status" label="认证状态"></el-table-column>
        <el-table-column align="center" prop="job_title" label="职称"></el-table-column>
        <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="created_at" label="注册时间"></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="default" v-if="scope.row.user_type=='用户'" @click="handleDetail(scope.row)">消费详情</el-button>
            <el-button type="primary" v-if="scope.row.user_type=='医生'" @click="handleDetail(scope.row)">收益详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <invitedetail ref="invitedetail"></invitedetail>
  </div>
</template>
<script>
import invitedetail from '@/components/lianhe/invitedetail'
import { getStaffInviteList, getUserInviteList } from '@/api/personnel'
export default {
  name: 'invitelist',
  components: {
    invitedetail
  },
  data () {
    return {
      dialogInviteVisible: false,
      inviteList: []
    }
  },
  methods: {
    handleDetail (item) {
      var detail = []
      item.orders.forEach((v, i) => { 
        item.orders[i].type = 'order'
      })
      item.examination_orders.forEach((v, i) => { 
        item.examination_orders[i].type = 'examination_orders'
      })
      item.treatment_orders.forEach((v, i) => { 
        item.treatment_orders[i].type = 'treatment_orders'
      })
      item.prescription_orders.forEach((v, i) => { 
        item.prescription_orders[i].type = 'prescription_orders'
      })
      item.serve_orders.forEach((v, i) => { 
        item.serve_orders[i].type = 'serve_orders'
      })
      detail = detail.concat(item.orders).concat(item.examination_orders).concat(item.treatment_orders).concat(item.prescription_orders).concat(item.serve_orders)
      this.$refs.invitedetail.showInviteDetail(detail)
    },
    showInviteList (id, user_type) {
      if (user_type == 'user') {
        getUserInviteList({ 'user_id': id }).then(response => {
          this.handleData(response.data)
        })
      } else {
        getStaffInviteList({ 'employee_id': id }).then(response => {
          this.handleData(response.data)
        })
      }
      this.dialogInviteVisible = true
    },
    handleData (data) {
      var tmp = []
      data.inviteEmployees.forEach((item) => {
        tmp.push({
          user_type: '医生',
          full_name: item.fullName,
          status: '',
          job_title: item.doctor.phone,
          phone: item.doctor.phone,
          created_at: item.doctor.createdAt,
          orders: item.orders,
          examination_orders: item.examination_orders,
          serve_orders: item.serve_orders,
          treatment_orders: item.treatment_orders,
          prescription_orders: item.prescription_orders,
        })
      })
      data.inviteUsers.forEach((item) => {
        tmp.push({
          user_type: '用户',
          full_name: item.fullName,
          status: '',
          job_title: '',
          phone: item.phone,
          created_at: item.createdAt,
          orders: item.orders,
          examination_orders: item.examination_orders,
          serve_orders: item.serve_orders,
          treatment_orders: item.treatment_orders,
          prescription_orders: item.prescription_orders,
        })
      })
      this.inviteList = tmp
    }
  }
}
</script>