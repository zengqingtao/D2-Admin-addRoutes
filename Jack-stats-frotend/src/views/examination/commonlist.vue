<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="id" label="编号"></el-table-column>
      <el-table-column align="center" prop="diagnosis_name" label="临床诊断"></el-table-column>
      <el-table-column align="center" prop="admin_name" label="创建者"></el-table-column>
      <el-table-column align="center" label="操作" width="180">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleEdit(scope.row)">查看</el-button>
          <el-button size="mini" type="danger" @click="handleHide(scope.row)">删除</el-button>
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
      <el-form ref="form" :model="form">
        <el-form-item label="临床诊断">
          <!-- <el-input v-model="form.diagnosis" style="width: 80%;" placeholder="请输入临床诊断" clearable></el-input> -->
          <el-select
            v-model="form.diagnosis"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="请输入关键词"
            :remote-method="getICDLibraries">
            <el-option
              v-for="item in icds"
              :key="item.id"
              :label="item.fjbname"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查项目">
          <el-button @click="handleExaminationList">添加</el-button>
        </el-form-item>
        <el-table :data="form.items">
            <el-table-column prop="name" align="center" label="名称" min-width="120"></el-table-column>
            <el-table-column prop="code" align="center" label="检验号" width="110"></el-table-column>
            <el-table-column prop="sample" align="center" label="标本类型" width="100"></el-table-column>
            <el-table-column prop="type" align="center" label="类型" width="120"></el-table-column>
            <el-table-column label="项目详情" align="center" min-width="150">
                <template slot-scope="scope">
                    <span>{{ scope.row.detail }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="organization_name" align="center" label="检查机构" width="130"></el-table-column>
            <el-table-column prop="price" align="center" label="零售价" width="150"></el-table-column>
            <el-table-column label="操作" align="center" width="150">
              <template slot-scope="scope">
                <el-button size="small" @click="handleDelete(scope.$index, scope.row)" type="danger">删除
                    </el-button>
              </template>
            </el-table-column>
          </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSet">确 定</el-button>
      </div>
    </el-dialog>
    <examination ref="examination" @handleAddExamination="handleAddExamination"></examination>
  </d2-container>
</template>

<script>
import { getCommonExaminationList, setCommonExamination, getCommonExamination } from '@/api/hospital'
import { Message } from 'element-ui'
import { regionData, CodeToText } from 'element-china-area-data'
import examination from '@/components/lianhe/examination'
import { hideCommonExamination } from '@/api/hidedel'
import { getICDList } from '@/api/neworder'
export default {
  name: 'hospitallist',
  components: {
    examination
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': ''
      },
      icds: [],
      options: regionData,
      selectedOptions: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      form: {
        diagnosis: '',
        items: []
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleHide (row) {
      this.$confirm('确认隐藏此通用检查单？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideCommonExamination({order_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleDelete (index, item) {
      this.form.items.splice(index, 1)
    },
    handleAddExamination (item) {
      this.form.items.push(item)
    },
    handleExaminationList () {
      var tmp = []
      for (var i in this.form.items) {
        tmp.push(this.form.items[i].examination_id)
      }
      this.$refs.examination.handleExaminationList(tmp)
    },
    handleCreate () {
      this.dialogFormVisible = true
      this.form = {
        diagnosis: '',
        items: []
      }
      this.dialogFormTitle = '新增通用检查单'
    },
    handleEdit (row) {
      this.dialogFormTitle = '修改通用检查单'
      this.dialogFormVisible = true
      getCommonExamination({id: row.id}).then(response => {
        this.form = response.data
        this.getICDLibraries('', this.form.diagnosis)
      })
    },
    submitSet () {
      if (this.form.diagnosis.length === 0) {
        Message.error('临床诊断不能为空')
        return
      }
      if (this.form.items.length === 0) {
        Message.error('请添加检查项目')
        return
      }
      setCommonExamination(this.form).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogFormVisible = false
        this.form = {
          diagnosis: '',
          items: []
        }
        if (this.form.id === '') {
          Message.info('新增成功')
        } else {
          Message.info('修改成功')
        }
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
    getICDLibraries (search, diagnosis) {
      getICDList({ search: search, icds: diagnosis ? diagnosis.join(',') : '' }).then(response => {
        this.icds = response.data.list
      })
    },
    fetchData () {
      this.listLoading = true
      getCommonExaminationList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
