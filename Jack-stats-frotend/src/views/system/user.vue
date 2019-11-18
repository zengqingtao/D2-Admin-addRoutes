<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增用户</el-button>
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="输入手机或姓名搜索" clearable></el-input>
      <el-select v-model="listQuery.role" style="width: 150px;margin-left: 10px;" clearable placeholder="请选择角色">
        <el-option value='' label="全部"></el-option>
        <el-option
          v-for="item in roleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="realName" label="真实姓名"></el-table-column>
      <el-table-column align="center" prop="userName" label="手机号/登录名"></el-table-column>
      <el-table-column align="center" prop="role" label="角色"></el-table-column>
      <el-table-column align="center" prop="status" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'pending'">未审核</span>
          <span v-if="scope.row.status == 'audit'">审核中</span>
          <span v-if="scope.row.status == 'success'">审核通过</span>
          <span v-if="scope.row.status == 'fail'">审核失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
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

    <el-dialog title="新增管理员" :visible.sync="dialogNewFormVisible" width="60%" center>
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-form-item label="系统角色" style="width: 100%">
          <el-select v-model="addForm.roleID" clearable placeholder="请选择角色" :disabled="addForm.id != ''">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号/登录名" class="half-width">
          <el-input v-model="addForm.userName" placeholder="请输入手机号作为登录名" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" class="half-width">
          <el-input v-model="addForm.realName" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" class="half-width">
          <el-input v-model="addForm.password" :type="pwdType" password placeholder="为空默认密码与登录名一致"></el-input>
        </el-form-item>
        <!-- 机构管理员 -->
        <el-form-item label="所属医院"  class="half-width" v-if="addForm.roleID == '00000006'">
          <el-select v-model="addForm.hospital_id" clearable placeholder="请选择管理医院" remote filterable :remote-method="searchHospital">
            <el-option
              v-for="item in hospitalOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>  
        <el-form-item label="状态"  class="half-width">
          <el-switch v-model="addForm.status" active-color="#13ce66" inactive-color="#ff4949" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitCreate">确 定</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>
<script>
import { getUserList, getAdmin, setAdmin } from '@/api/user'
import { getSubjectList, getHospitalOption } from '@/api/hospital'
import { getRoleOptions } from '@/api/role'
import { Message } from 'element-ui'
import { validatPhone } from '@/utils/validate'
import selecthospitals from '@/components/lianhe/selecthospitals'
import uploadimg from '@/components/lianhe/uploadimg'
export default {
  name: 'userlist',
  components: {
    selecthospitals,
    uploadimg
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'role': ''
      },
      roleOptions: [],
      hospital_id: '',
      dialogNewFormVisible: false,
      dialogEditFormVisible: false,
      pwdType: 'password',
      addForm: {
        id: '',
        userName: '',
        realName: '',
        roleID: '',
        password: '',
        hospital_id: '',
        status: 1,
      },
      hospitalOptions: []
    }
  },
  created () {
    this.getRoles()
    this.fetchData()
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.role'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
  },
  methods: {
    handleXcx (id) {
      Message.success('已生成')
    },
    handleBonusDetail (id) {
      this.$refs.bonusdetail.showBonusDetail(id)
    },
    handleQrcode (id) {
      this.$refs.qrcode.showQrcode(id)
    },
    handleHide (row) {
      this.$confirm('确认删除此医护人员？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideAdmin({admin_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleDisable (row) {
      disableAdmin({admin_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    handleAble (row) {
      ableAdmin({admin_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    searchHospital (val) {
      getHospitalOption({search: val}).then(response => {
        this.hospitalOptions = response.data
      })
    },
    handleCreate () {
      if (this.roleOptions.length === 0) {
        Message.warning('还没有创建角色，请先创建角色')
      } else {
        this.addForm = {
          id: '',
          userName: '',
          realName: '',
          roleID: '',
          password: '',
          avatar: '',
          hospital_id: 0,
          workplaces: [],
          price: 0,
          original_price: 0,
          index: 0,
          order_index: 0,
          cost_index: 0,
          clinic_index: 0,
          platform_rate: 0,
          email: '',
          job_title: '',
          sign_url: '',
          level_index: 0,
          good_at: '',
          recommended_reason: '',
          expert_introduction: '',
          subject_ids: [],
          status: 1,
          authentication: 'success'
        }
        this.dialogNewFormVisible = true
      }
    },
    submitCreate () {
      if (this.addForm.userName.length === 0) {
        Message.error('用户名不能为空')
        return
      }
      if (this.addForm.realName.length === 0) {
        Message.error('真实姓名不能为空')
        return
      }
      this.addForm.subject_ids = this.subjectTables
      console.log(this.addForm)

      setAdmin(this.addForm).then(response => {
        Message.info('更新成功')
        this.listQuery.page = 1
        this.fetchData()
        this.dialogNewFormVisible = false
      }).catch((e) => {
        Message.error(e.msg)
      })
    },
    handleEdit (row) {
      getAdmin({id: row.id}).then(response => {
        this.addForm = response.data
        this.addForm.password = ''
        this.addForm.status = parseInt(response.data.status)
        this.subjectTables = response.data.subject_ids
        if (this.addForm.hospital_id > 0) {
          this.searchHospital(this.addForm.hospital_name)
        }
        this.dialogNewFormVisible = true
      }).catch((e) => {
        Message.error(e.msg)
      })
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
      getUserList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
      getSubjectList().then(response => {
        this.subjectOptions = response.data
      })
    },
    getRoles () {
      getRoleOptions().then(response => {
        this.roleOptions = response.data
      })
    }
  }
}
</script>
<style lang="scss">
.half-width{width:45%;}
</style>