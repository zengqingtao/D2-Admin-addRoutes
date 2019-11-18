<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
      <el-select  style="width: 180px;margin-left: 10px;" v-model="listQuery.role">
        <el-option label="全部" value=""></el-option>
        <el-option
          v-for="item in staffRoleOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="名称" clearable></el-input>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="full_name" label="用户"></el-table-column>
      <el-table-column align="center" prop="account" label="联系电话"></el-table-column>
      <el-table-column align="center" prop="role" label="岗位">
        <template slot-scope="scope">
          <span>{{ scope.row.role | parseRole }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="注册时间"></el-table-column>
      <el-table-column align="center" prop="status" label="审核状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'pending' || scope.row.status == null">未审核</span>
          <span v-if="scope.row.status == 'audit'">审核中</span>
          <span v-if="scope.row.status == 'success'">审核通过</span>
          <span v-if="scope.row.status == 'fail'">审核失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="authentication" label="认证状态">
        <template slot-scope="scope">
          <span v-if="scope.row.authentication == 'pending' || scope.row.authentication == null">未认证</span>
          <span v-if="scope.row.authentication == 'audit'">认证中</span>
          <span v-if="scope.row.authentication == 'success'">认证通过</span>
          <span v-if="scope.row.authentication == 'fail'">认证失败</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200" class="opt-box">
        <template slot-scope="scope">
          <div class="btn-box">
            <el-button size="mini" type="default" @click="handleQrcode(scope.row.url)">二维码</el-button>
            <el-button size="mini" type="default" @click="getInviteList(scope.row.id)">邀约名单</el-button>
            <el-button size="mini" type="danger" @click="handleHide(scope.row)">删除</el-button>
            <el-button size="mini" type="info" @click="handleDisable(scope.row)" v-if="scope.row.deleted_at == null || scope.row.deleted_at == ''">禁用</el-button>
            <el-button size="mini" type="success" @click="handleAble(scope.row)" v-if="scope.row.deleted_at != null && scope.row.deleted_at != ''">启用</el-button>
            <el-button size="mini" type="primary" plain @click="handleBonusDetail(scope.row.id)">收益明细</el-button>
            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
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

    <el-dialog title="邀约名单" :visible.sync="dialogInviteVisible" width="70%" center :close-on-click-modal="false">
      <el-table :data="inviteList"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
        <el-table-column align="center" label="用户类型">
          <template slot-scope="scope">
            <span>{{ scope.row.role | parseRole }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="full_name" label="用户"></el-table-column>
        <el-table-column align="center" prop="authentication" label="认证状态">
          <template slot-scope="scope">
            <span v-if="scope.row.authentication == 'pending'">未认证</span>
            <span v-if="scope.row.authentication == 'audit'">认证中</span>
            <span v-if="scope.row.authentication == 'success'">认证通过</span>
            <span v-if="scope.row.authentication == 'fail'">认证失败</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="spread_name" label="推广者"></el-table-column>
        <el-table-column align="center" prop="account" label="联系电话"></el-table-column>
        <el-table-column align="center" prop="created_at" label="注册时间"></el-table-column>
      </el-table>
    </el-dialog>


    <el-dialog :title="dialogFormTitle" :visible.sync="dialogNewFormVisible" width="60%" center :close-on-click-modal="false" >
      <el-form ref="addForm" :model="addForm" label-width="100px">
        <el-form-item label="系统角色" style="width: 100%">
          <el-select v-model="addForm.role" clearable placeholder="请选择角色" @change="roleChange" :disable="addForm.id.length != 0">
            <el-option key="staff.doctor.general" label="全科医生" value="staff.doctor.general"></el-option>
            <el-option key="staff.doctor.specialist" label="专科医生" value="staff.doctor.specialist"></el-option>
            <el-option key="staff.nurse" label="护士" value="staff.nurse" v-if="addForm.id.length != 0"></el-option>
            <el-option key="staff.service" label="客服" value="staff.service" v-if="addForm.id.length != 0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机号/登录名" class="half-width">
          <el-input v-model="addForm.account" placeholder="请输入手机号作为登录名" clearable></el-input>
        </el-form-item>
        <el-form-item label="真实姓名" class="half-width">
          <el-input v-model="addForm.full_name" placeholder="真实姓名"></el-input>
        </el-form-item>
        <el-form-item label="登录密码" class="half-width">
          <el-input v-model="addForm.password" :type="pwdType" password placeholder="为空默认密码与登录名一致"></el-input>
        </el-form-item>
        <!--全科医生/专科医生-->
        <div v-if="addForm.role == 'staff.doctor.general' || addForm.role == 'staff.doctor.specialist'">
          <el-form-item label="执业点医院科室" style="width:100%;">
            <div>
              <selecthospitals v-model="addForm.hospital_id" @updateHospitals="updateHospitals"></selecthospitals>
              <el-cascader placeholder="请选择科室" :options="subjectOptions" v-model="addForm.subject_id"></el-cascader v-if="addForm.hospital_id">
              <el-button type="primary" @click="addHospitalSubject" v-if="addForm.hospital_id">添加</el-button>
            </div>
            <table class="ui-table mt2" v-if="subjectTables.length">
              <tr>
                <th>医院名称</th>
                <th>科室</th>
                <th>编辑</th>
              </tr>
              <tr v-for="(v, $index) in subjectTables">
                <td style="padding:0 8px;">{{ v.hospital_name }}</td>
                <td style="padding:0 8px;">{{ v.subject_name }}</td>
                <td style="padding:0 8px;">
                  <el-button type="danger" size="mini" @click="handleWorkplacesDel($index)">移除</el-button>
                  <!--<el-button native-type="button" :disabled="v.isDefault ? true : false"
                             :type="v.isDefault ? 'default' : 'primary'" size="mini" @click="setDefault(v)">
                      {{ v.isDefault ? '默认医院' : '设为默认' }}
                  </el-button>-->
                </td>
              </tr>
            </table>
          </el-form-item>
          <el-form-item label="所在医院科室" style="width:100%;">
            <div>
              <selecthospitals v-model="addForm.work_hospital" @updateHospitals="updateHospitals"></selecthospitals>
              <el-cascader placeholder="请选择科室" :options="subjectOptions" v-model="addForm.work_subject_id"></el-cascader v-if="addForm.work_hospital">
              <el-button type="primary" @click="addWorkHospitalSubject" v-if="addForm.work_hospital">添加</el-button>
            </div>
            <table class="ui-table mt2" v-if="workSubjectTables.length">
              <tr>
                <th>医院名称</th>
                <th>科室</th>
                <th>编辑</th>
              </tr>
              <tr v-for="(v, $index) in workSubjectTables">
                <td style="padding:0 8px;">{{ v.hospital_name }}</td>
                <td style="padding:0 8px;">{{ v.subject_name }}</td>
                <td style="padding:0 8px;">
                  <el-button type="danger" size="mini" @click="handleWorkSubjectsDel($index)">移除</el-button>
                  <!--<el-button native-type="button" :disabled="v.isDefault ? true : false"
                             :type="v.isDefault ? 'default' : 'primary'" size="mini" @click="setDefault(v)">
                      {{ v.isDefault ? '默认医院' : '设为默认' }}
                  </el-button>-->
                </td>
              </tr>
            </table>
          </el-form-item>
          <el-form-item label="头像" class="half-width">
            <uploadimg ref="avataruploadimg" v-model="addForm.avatar" :max="1" :filelist="avatarList"></uploadimg>
          </el-form-item>
          <el-form-item label="医生签名" class="half-width">
            <uploadimg ref="signurluploadimg" v-model="addForm.sign_url" :max="1" :filelist="signUrlList"></uploadimg>
          </el-form-item>
          <el-form-item label="挂号费" class="half-width">
              <el-input v-model="addForm.price"></el-input>
          </el-form-item>
          <el-form-item label="是否合伙人" class="half-width">
            <el-switch
                    v-model="addForm.is_partner"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-value='1'
                    inactive-value='0'>
            </el-switch>
            <span v-if="parseInt(addForm.is_partner) === 0">  否</span>
            <span v-else>  是</span>
          </el-form-item>
          <el-form-item label="原价"class="half-width">
              <el-input v-model="addForm.original_price"></el-input>
          </el-form-item>
          <el-form-item label="职称" class="half-width">
              <el-input v-model="addForm.job_title"></el-input>
          </el-form-item>
          <!--<el-form-item label="渠道指数" class="half-width">-->
              <!--<el-input v-model="addForm.index">-->
                  <!--<template slot="append">%</template>-->
              <!--</el-input>-->
          <!--</el-form-item>-->
          <el-form-item label="邀新用户指数" class="half-width">
            <el-input v-model="addForm.user_index">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="邀新医生指数" class="half-width">
            <el-input v-model="addForm.employee_index">
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item label="开单指数" class="half-width">
              <el-input v-model="addForm.order_index">
                  <template slot="append">%</template>
              </el-input>
          </el-form-item>
          <el-form-item label="成本指数" class="half-width">
              <el-input v-model="addForm.cost_index">
                  <template slot="append">%</template>
              </el-input>
          </el-form-item>
          <el-form-item label="诊所指数" class="half-width">
              <el-input v-model="addForm.clinic_index">
                  <template slot="append">%</template>
              </el-input>
          </el-form-item>
          <el-form-item label="平台费率" class="half-width">
              <el-input v-model="addForm.platform_rate">
                  <template slot="append">%</template>
              </el-input>
          </el-form-item>
          <el-form-item label="级别指数"  class="half-width">
              <el-input v-model="addForm.level_index">
                  <template slot="append">%</template>
              </el-input>
          </el-form-item>
          <!-- <el-form-item label="擅长疾病">
              <el-input v-model="addForm.good_at" type="textarea">
              </el-input>
          </el-form-item> -->
          <el-form-item label="擅长" style="width:95%;">
              <el-input v-model="addForm.good_at" type="textarea">
              </el-input>
          </el-form-item>
          <el-form-item label="专家介绍" style="width:95%;">
              <el-input v-model="addForm.expert_introduction" type="textarea">
              </el-input>
          </el-form-item>
          <el-form-item label="推荐理由" style="width:95%;">
              <el-input v-model="addForm.recommended_reason" type="textarea">
              </el-input>
          </el-form-item>
        </div>
        <!--护士 / 客服-->
        <div v-if="addForm.role == 'staff.nurse' || addForm.role == 'staff.nurse'">
          <el-form-item label="头像" class="half-width">
            <uploadimg v-model="addForm.avatar" :max="1"></uploadimg>
          </el-form-item>
          <el-form-item label="医院" style="width:100%;" v-if="addForm.roleID == '00000004'">
            <selecthospitals v-model="addForm.hospital_id"></selecthospitals>
          </el-form-item>
          <el-form-item label="通知邮箱"  class="half-width">
              <el-input v-model.trim="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="开单指数"  class="half-width">
              <el-input v-model="addForm.order_index">
                  <template slot="append">%</template>
              </el-input>
          </el-form-item>
          <el-form-item label="级别指数"  class="half-width">
              <el-input v-model="addForm.level_index">
                  <template slot="append">%</template>
              </el-input>
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogNewFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSet">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="二维码" :visible.sync="dialogQrcode" width="30%" center :close-on-click-modal="false">
      <div style="display: flex; align-items:center; justify-content: center" >
        <div id="qrcode"  ref="qrcode"></div>
      </div>
    </el-dialog>

    <invitelist ref="invitelist"></invitelist>
    <invitedetail ref="invitedetail"></invitedetail>
  </d2-container>
</template>

<script>
import { getUserList, getAdmin, setAdmin } from '@/api/user'
import { getSubjectList } from '@/api/hospital'
import { getStaffList, getStaff, setStaff, getStaffBonusDetail } from '@/api/personnel'
import { staffRoleOptions } from '@/data/data'
import { Message } from 'element-ui'
import QRCode from 'qrcodejs2'
import invitedetail from '@/components/lianhe/invitedetail'
import { hideAdmin, ableAdmin, disableAdmin } from '@/api/hidedel'
import selecthospitals from '@/components/lianhe/selecthospitals'
import invitelist from '@/components/lianhe/invitelist'
import uploadimg from '@/components/lianhe/uploadimg'
import { getRoleOptions } from '@/api/role'
export default {
  name: 'stafflist',
  components: {
    QRCode: QRCode,
    invitedetail,
    selecthospitals,
    uploadimg,
    invitelist
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      inviteList: [],
      staffRoleOptions: [],
      listQuery: {
        'page': 1,
        'limit': 20,
        'role': '',
        'search': ''
      },
      dialogFormTitle: '',
      dialogFormVisible: false,
      dialogInviteVisible: false,
      dialogQrcode: false,
      addForm: {
        id: '',
        account: '',
        userName: '',
        is_partner: 0,
        realName: '',
        roleID: '',
        password: '',
        avatar: '',
        hospital_id: '',
        work_hospital: '',
        workplaces: [],
        price: 0,
        original_price: 0,
        index: 0,
        order_index: 0,
        user_index: 0,
        employee_index: 0,
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
        hospital_ids: [],
        status: 1,
        authentication: 'success'
      },
      pwdType: 'password',
      subjectOptions: [],
      hospitals: [],
      subjectTables: [],
      workSubjectTables: [],
      dialogNewFormVisible: false,
      avatarList: [],
      signUrlList: []
    }
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
    'addForm.user_index'(val) {
        let num1 = val ? parseFloat(val) : 0.00;
        let num2 = this.addForm.employee_index ? parseFloat(this.addForm.employee_index) : 0.00;
        this.addForm.index = num1 + num2 ;
    },
    'addForm.employee_index'(val) {
        let num1 = val ? parseFloat(val) : 0.00;
        let num2 = this.addForm.user_index ? parseFloat(this.addForm.user_index) : 0.00;
        this.addForm.index = num1 + num2 ;
    }
  },
  created () {
    this.fetchData()
  },
  filters: {
    parseRole (role) {
      for (var i in staffRoleOptions) {
        if (role === staffRoleOptions[i].value) {
          return staffRoleOptions[i].label
        }
      }
    }
  },
  methods: {
    handleXcx (id) {
      Message.success('已生成')
    },
    handleBonusDetail (id) {
      getStaffBonusDetail({employee_id: id}).then(response => {
        this.$refs.invitedetail.showInviteDetail(response.data)
      })
    },
    handleQrcode (url) {
      this.dialogQrcode = true
      setTimeout(function () {
        document.getElementById('qrcode').innerHTML = ''
        let qrcode = new QRCode('qrcode', {
          width: 232,
          height: 232,
          text:  url
        })
      }, 200)
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
    getInviteList (id) {
      this.$refs.invitelist.showInviteList(id, 'staff')
    },
    getRoles () {
      getRoleOptions().then(response => {
        this.roleOptions = response.data
      })
    },
    roleChange () {
      this.subjectTables = []
      this.workSubjectTables = []
    },
    handleWorkplacesDel (index) {
      this.subjectTables.splice(index, 1)
    },
    handleWorkSubjectsDel (index) {
      this.workSubjectTables.splice(index, 1)
    },
    updateHospitals (val) {
      this.hospitals = val
    },
    addHospitalSubject () {
      if (this.addForm.subject_id.length != 2) {
        Message.error('先选择科室')
        return
      }
      for (var i in this.subjectTables) {
        if (this.subjectTables[i].hospital_id === this.addForm.hospital_id && this.subjectTables[i].subject_id === this.addForm.subject_id[1]) {
          Message.error('医院和科室已经添加')
          return
        }
      }
      var hospital_name = ''
      this.hospitals.forEach((v) => {
        if (v.id === this.addForm.hospital_id) {
          hospital_name = v.name
        }
      })
      var subject_first_name = ''
      var subject_child_name = ''
      this.subjectOptions.forEach((v, j) => {
        if (v.id === this.addForm.subject_id[0]) {
          subject_first_name = v.label
          v.children.forEach((o, k) => {
            if (o.id === this.addForm.subject_id[1]) {
              subject_child_name = o.label
            }
          })
        }
      })
      this.subjectTables.push({ hospital_id: this.addForm.hospital_id, hospital_name: hospital_name, subject_id: this.addForm.subject_id[1], subject_name: subject_first_name + '/' + subject_child_name })
    },
    addWorkHospitalSubject () {
      if (this.addForm.work_subject_id.length != 2) {
        Message.error('先选择科室')
        return
      }
      for (var i in this.workSubjectTables) {
        if (this.workSubjectTables[i].hospital_id === this.addForm.work_hospital && this.workSubjectTables[i].subject_id === this.addForm.work_subject_id[1]) {
          Message.error('医院和科室已经添加')
          return
        }
      }
      var hospital_name = ''
      this.hospitals.forEach((v) => {
        if (v.id === this.addForm.work_hospital) {
          hospital_name = v.name
        }
      })
      var subject_first_name = ''
      var subject_child_name = ''
      this.subjectOptions.forEach((v, j) => {
        if (v.id === this.addForm.work_subject_id[0]) {
          subject_first_name = v.label
          v.children.forEach((o, k) => {
            if (o.id === this.addForm.work_subject_id[1]) {
              subject_child_name = o.label
            }
          })
        }
      })
      this.workSubjectTables.push({ hospital_id: this.addForm.work_hospital, hospital_name: hospital_name, subject_id: this.addForm.work_subject_id[1], subject_name: subject_first_name + '/' + subject_child_name })
    },
    submitSet () {
      if (this.addForm.account.length === 0) {
        Message.error('用户名不能为空')
        return
      }
      if (this.addForm.full_name.length === 0) {
        Message.error('真实姓名不能为空')
        return
      }
      if ((this.addForm.role == 'staff.doctor.general' || this.addForm.role == 'staff.doctor.specialist')) {
        if (this.subjectTables.length === 0) {
          Message.error('请选择医院科室')
          return
        }
        if (this.addForm.job_title.length === 0) {
          Message.error('请填写职称')
          return
        }
        if (this.addForm.good_at.length === 0) {
          Message.error('请填写擅长')
          return
        }
        if (this.addForm.recommended_reason.length === 0) {
          Message.error('请填写推荐理由')
          return
        }
        if (this.addForm.expert_introduction.length === 0) {
          Message.error('请填写专家介绍')
          return
        }
      }
      if (this.addForm.role == 'staff.nurse' && !this.addForm.hospital_id ) {
        Message.error('请选择医院')
        return
      }
      this.addForm.subject_ids = this.subjectTables
      this.addForm.work_subject_ids = this.workSubjectTables

      // console.log(this.addForm)
      setStaff(this.addForm).then(response => {
        Message.info('更新成功')
        this.listQuery.page = 1
        this.fetchData()
        this.dialogNewFormVisible = false
      }).catch((e) => {
        Message.error(e.msg)
      })
    },
    handleCreate () {
      this.dialogNewFormVisible = true
      this.dialogFormTitle = '新增医护人员'
      this.addForm = {
        id: '',
        account: '',
        userName: '',
        is_partner: 0,
        realName: '',
        roleID: '',
        password: '',
        avatar: '',
        hospital_id: '',
        work_hospital: '',
        workplaces: [],
        price: 0,
        original_price: 0,
        index: 0,
        order_index: 0,
        user_index: 0,
        employee_index: 0,
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
        hospital_ids: [],
        status: 1,
        authentication: 'success'
      }
    },
    handleEdit (row) {
      var _this = this
      this.dialogFormTitle = '修改医护人员'
      getStaff({id: row.id}).then(response => {
        this.dialogNewFormVisible = true
        this.addForm = response.data
        var avatarList = (response.data.avatar == '' || response.data.avatar == null) ? [] : [{name: 'surface', url: response.data.avatar}]
        var signUrlList = (response.data.sign_url == '' || response.data.sign_url == null) ? [] : [{name: 'avatar', url: response.data.sign_url}]
        var t = setTimeout(function () {
          clearTimeout(t)
          if (_this.$refs.avataruploadimg != undefined) {
            _this.$refs.avataruploadimg.setFile(avatarList) 
          }
          if (_this.$refs.signurluploadimg != undefined) {
            _this.$refs.signurluploadimg.setFile(signUrlList) 
          }
        }, 200)
        this.addForm.status = parseInt(response.data.status)
        this.subjectTables = response.data.subject_ids
        this.workSubjectTables = response.data.work_subject_ids
      }).catch((e) => {
        Message.error(e.msg)
      })
    },
    fetchData () {
      this.listLoading = true
      this.staffRoleOptions = staffRoleOptions
      getStaffList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
      getSubjectList().then(response => {
        this.subjectOptions = response.data
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
