<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="名称/手机号码/诊疗卡号/身份证" clearable></el-input>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="full_name" label="用户"></el-table-column>
      <el-table-column align="center" prop="admin_name" label="创建者"></el-table-column>
      <el-table-column align="center"  label="推广者">
          <template slot-scope="scope">
              <span v-if="scope.row.employee_name">{{scope.row.employee_name}} / 医护人员</span>
              <span v-if="scope.row.user_name">{{scope.row.user_name}} / 用户</span>
          </template>
      </el-table-column>
      <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
      <el-table-column align="center" prop="identification_number" label="身份证"></el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间"></el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <div class="btn-box">
            <el-button size="mini" type="primary" @click="handleUser(scope.row)">查看</el-button>
            <!-- <el-button size="mini" type="danger" @click="handleHide(scope.row)">删除</el-button>
            <el-button size="mini" type="info" @click="handleDisable(scope.row)" v-if="scope.row.deleted_at == null || scope.row.deleted_at == ''">禁用</el-button>
            <el-button size="mini" type="success" @click="handleAble(scope.row)" v-if="scope.row.deleted_at != null && scope.row.deleted_at != ''">启用</el-button> -->
            <el-button size="mini" type="default" @click="getInviteList(scope.row.id)">邀约名单</el-button>
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

    <el-dialog title="用户信息" :visible.sync="dialogUserVisible" width="80%" center :close-on-click-modal="false">
      <el-card class="mb2">
            <el-form ref="form" :model="user" class="flex">
                <div class="user-img" v-if="user.avatar"><img class="avatar" :src="user.avatar"></div>
                <div class="flex flex-auto">
                  <el-row style="margin-bottom: 25px;">
                    <el-col :span="12">用户名：{{ user.full_name }}</el-col>
                    <el-col :span="12">联系电话：{{ user.phone }}</el-col>
                  </el-row>
                  <el-row style="margin-bottom: 25px;">
                    <el-col :span="12">身份证：{{ user.identification_number }}</el-col>
                    <el-col :span="12">出生年：{{ user.birth_year }}</el-col>
                  </el-row>
                  <el-row style="margin-bottom: 25px;">
                    <el-col :span="12">推荐指数：<el-input type="number" style="width:100px;" v-model="user.level_index"></el-input></el-col>
                    <el-col :span="12">
                      是否推荐人：
                      <el-select v-model="user.is_reference">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                      </el-select>
                    </el-col>
                  </el-row>
                  <el-row style="margin-bottom: 25px;">
                    <el-col :span="24" style="text-align:center">
                      <el-button type="primary" @click="handleSetUser">提交</el-button>
                    </el-col>
                  </el-row>
                </div>
            </el-form>
        </el-card>
        <el-card>
            <div slot="header">关联就诊人</div>
            <el-table :data="patientsList" element-loading-text="拼命加载中">
                <el-table-column align="center" prop="full_name" label="就诊人姓名" min-width="120"></el-table-column>
                <el-table-column align="center" prop="phone" label="联系电话" width="150"></el-table-column>
                <el-table-column align="center" prop="card" label="诊疗卡号" width="150"></el-table-column>
                <el-table-column prop="papers_type" label="证件类型" align="center" width="90">
                  <template slot-scope="scope">
                    <span>{{ scope.row.papers_type | parsePapersType }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="identification_number" label="身份证" align="center" width="160"></el-table-column>
                <el-table-column prop="papers" label="其他证件号" align="center" width="160"></el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="small" type="primary" @click="handleHealth(scope.row)">健康档案</el-button>
                        <el-button size="small" type="primary" @click="handleOrders(scope.row)">历史病历</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </el-dialog>

    <invitelist ref="invitelist"></invitelist>
    <health ref="health"></health>
  </d2-container>
</template>

<script>
import { getUsersList, getPatientsByUserId, setRecommend, getUserInviteList } from '@/api/personnel'
import health from '@/components/lianhe/health'
import invitelist from '@/components/lianhe/invitelist'
import { hideUser, ableUser, disableUser } from '@/api/hidedel'
import { Message } from 'element-ui'
export default {
  name: 'userslist',
  components: {
    health,
    invitelist
  },
  data () {
    return {
      list: null,
      total: null,
      user: {},
      patientsList: [],
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'employee_id': '',
        'search': ''
      },
      dialogFormTitle: '',
      dialogFormVisible: false,
      dialogUserVisible: false,
      inviteList: [],
      dialogInviteVisible: false
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleHide (row) {
      this.$confirm('确认删除此注册用户？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideUser({user_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleDisable (row) {
      disableUser({user_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    handleAble (row) {
      ableUser({user_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    handleHealth (row) {
      this.$refs.health.handleHealth(row)
    },
    handleOrders (row) {
      this.$refs.health.handleOrders(row.id)
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
    handleUser (row) {
      this.dialogUserVisible = true
      this.user = row
      getPatientsByUserId({ user_id: row.id }).then(response => {
        this.patientsList = response.data
      })
    },
    handleSetUser () {
      if (this.user.level_index < 0) {
        Message.error('推荐指数不能小于0')
        return
      }
      setRecommend({id: this.user.id, level_index: this.user.level_index, is_reference: this.user.is_reference}).then(response => {
        if (response.code == 1) {
          this.dialogUserVisible = false
          Message.info('设置成功')
        } else {
          Message.error(response.msg)
        }
      })
    },
    getInviteList (id) {
      this.$refs.invitelist.showInviteList(id, 'user')
    },
    fetchData () {
      this.listLoading = true
      if (this.$route.query.employee_id !== undefined) {
        this.listQuery.employee_id = this.$route.query.employee_id
      }
      getUsersList(this.listQuery).then(response => {
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
  text-align:left;
  button{
    margin: 5px;
  }
}
</style>