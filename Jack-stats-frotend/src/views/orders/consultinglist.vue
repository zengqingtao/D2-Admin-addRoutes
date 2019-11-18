<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-select v-model="listQuery.state" placeholder="请选择订单状态">
        <el-option label="全部" value=""></el-option>
        <el-option
          v-for="item in consultStatusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;margin-right:20px;" placeholder="输入姓名/手机搜索" clearable></el-input>
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
      <el-table-column prop="id" label="记录编号" align="center" width="100"></el-table-column>
      <el-table-column prop="full_name" label="姓名" align="center" min-width="100"></el-table-column>
      <el-table-column prop="sex" label="性别" align="center" width="80"></el-table-column>
      <el-table-column prop="birth_year" label="出生年月" align="center" width="100"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" width="100"></el-table-column>
      <el-table-column prop="created_at" label="新建时间" align="center" min-width="110"></el-table-column>
      <el-table-column prop="updated_at" label="最新提交时间" align="center" min-width="130"></el-table-column>
      <el-table-column prop="state" label="状态" align="center" min-width="130">
        <template slot-scope="scope">
          <span>{{ scope.row.state | parseConsultStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">查看</el-button>
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
      <el-card>
        <el-row class="clearfix">
          <div class="col col-5 h2">
              <el-row class="bold h1">患者信息：</el-row>
              <el-row class="mt3">
                <div class="mb3 el-col-8" style="word-break: break-all;">
                  <span>姓名：{{ form.full_name }}</span>
                </div>
                <div class="mb3 el-col-8">
                    <span class="mr3">性别：{{ form.sex }}  </span>
                </div>
                <div class="mb3 el-col-8">
                  <span class="mr3">出生年月：{{ form.birth_year }}</span>
                </div>
                <div class="mb3 el-col-8">
                    <span class="mr3">手机号码：{{ form.phone }}</span>
                </div>
                <div class="mb3 el-col-8">
                  <span class="mr3">年龄：{{ form.age }}</span>
                </div>
              </el-row>
              <el-row>
                  <el-col class="bold h1">详细病情：</el-col>
                  <el-col class="mb3" :span="12">{{ form.disease_condition}}</el-col>
                  <el-col class="bold h1">状态：</el-col>
                  <el-col class="mb3" :span="12">{{ form.state == 1 ? '已回复' : ( form.state == 2 ? '已关闭' : '待回复') }}</el-col>
              </el-row>
          </div>
          <div class="col col-4 h2">
              <el-col class="bold h1">哪里不舒服：</el-col>
              <el-col class="mb3">{{ form.discomfort }}</el-col>
              <el-col class="mt3 bold h1">新建时间：</el-col>
              <el-col class="mb3">{{ form.created_at }}</el-col>
          </div>
        </el-row>
        <el-row>
          <el-col class="bold h1" v-if="record.length > 0">回复记录：</el-col>
          <div v-for="item in record">
            <el-col :span="24" class="mb3"><span class="h1">{{ item.full_name }}</span>&nbsp;&nbsp;{{ item.created_at }}：{{ item.content }}</el-col>
          </div>
        </el-row>
        <el-form class="mt4 mt20" label-width="100px" label-position="left" :model="reply" v-if="is_general">
            <div v-show="form.state != 2">
              <el-form-item label="上传图片：">
                <uploadimg v-model="reply.images" :max="5"></uploadimg>
              </el-form-item>
              <el-form-item label="回复内容：">
                  <el-input type="textarea" v-model="reply.content"></el-input>
              </el-form-item>
              <div class="my0 mx-auto col-1 center">
                  <el-button type="primary" @click="handleReply">回复</el-button>
              </div>
          </div>
        </el-form>
      </el-card>
    </el-dialog>

  </d2-container>
</template>
<script>
import { getConsultsList, getConsultRecordsList, addConsultRecord } from '@/api/orders'
import uploadimg from '@/components/lianhe/uploadimg'
import { Message } from 'element-ui'
import { consultStatusOptions } from '@/data/data'
export default {
  name: 'consultinglist',
  components: {
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
        'state': '',
        'date': ['', '']
      },
      consultStatusOptions: consultStatusOptions, 
      options: [],
      record: [],
      form: {},
      reply: {
        'content': '',
        'consult_id': '',
        'images': []
      },
      dialogFormTitle: '',
      is_general: false,
      dialogFormVisible: false
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.state'(val) {
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
  created () {
    this.fetchData()
  },
  methods: {
    handleEdit (row) {
      this.dialogFormTitle = '咨询详情'
      getConsultRecordsList({ 'consult_id': row.id }).then(response => {
        this.record = response.data.records
        this.is_general = response.data.role === 'staff.doctor.general'
      })
      this.form = row
      this.dialogFormVisible = true
    },
    handleReply () {
      this.reply.consult_id = this.form.id
      if (this.reply.content.length == 0) {
        Message.error('回复内容不能为空')
        return
      }
      addConsultRecord(this.reply).then(response => {
        this.dialogFormVisible = false
        Message.success('回复成功')
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
    fetchData () {
      this.listLoading = true
      this.reply.content = ''
      getConsultsList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss">
.mb3{font-size:1rem;padding: 5px 0;}
.h1{padding:10px 0;}
</style>
