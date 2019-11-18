<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-button style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-plus">新增</el-button>
    </template>
    <el-tree element-loading-text="拼命加载中" v-loading="listLoading" :data="data" :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span class="d2-ml">
          <el-button
            type="text"
            size="mini"
            @click="handleEdit(data)">
            编辑
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="30%" center>
      <el-form ref="subjectForm" :model="subjectForm" label-width="30%">
        <el-form-item label="名称">
          <el-input v-model="subjectForm.name" style="width: 80%;" placeholder="请输入科室名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="科室分类" prop="pid">
          <el-select v-model="subjectForm.pid" placeholder="请选择" :disabled="subjectForm.id > '' && subjectForm.pid == null">
            <el-option
              v-for="item in level1SubjectList"
              :label="item.label"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSet">确 定</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { getSubjectList, getLevel1SubjectList, setSubject, delSubject } from '@/api/hospital'
import { Message } from 'element-ui'

export default {
  name: 'subjectlist',
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      data: [],
      dialogFormVisible: false,
      dialogFormTitle: '',
      level1SubjectList: [],
      subjectForm: {
        id: '',
        name: '',
        pid: ''
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleCreate () {
      this.dialogFormVisible = true
      this.dialogFormTitle = '新增科室'
      this.subjectForm = {
        id: '',
        name: '',
        pid: ''
      }
    },
    handleEdit (row) {
      this.subjectForm.id = row.id
      this.subjectForm.name = row.label
      this.subjectForm.pid = row.parentID
      this.dialogFormTitle = '编辑科室'
      this.dialogFormVisible = true
    },
    submitSet () {
      if (this.subjectForm.name.length === 0) {
        Message.error('名称不能为空')
        return
      }
      setSubject(this.subjectForm).then(response => {
        if (response.code === 1) {
          if (this.subjectForm !== '') {
            Message.success('修改成功')
          } else {
            Message.success('新增成功')
          }
          this.dialogFormVisible = false
          this.fetchData()
        } else {
          Message.error(response.msg)
        }
      })
    },
    submitDel (id) {
      delSubject({'id': id}).then(response => {
        if (response.code === 1) {
          Message.success('修改成功')
          this.dialogFormVisible = false
          this.fetchData()
        } else {
          Message.error(response.msg)
        }
      })
    },
    fetchData () {
      this.listLoading = true
      getSubjectList().then(response => {
        this.data = response.data
        this.listLoading = false
      })
      getLevel1SubjectList().then(response => {
        this.level1SubjectList = response.data
      })
    }
  }
}
</script>
