<template>
  <d2-container>
    <el-row :gutter="10">
      <el-col :span="12">
        <el-card>
          <div class="pb2">
            <div class="right">
                <el-button type="primary" @click="handleCreate(1)">添加一级分类</el-button>
            </div>
            <div class="clearfix"></div>
          </div>
          <el-table :data="firstList" v-loading="firstLoading" height="600">
            <el-table-column label="分类名称" prop="name"></el-table-column>
            <el-table-column align="left" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleHide(scope.row)">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div class="pb2">
            <div class="right">
                <el-button type="primary" @click="handleCreate(0)">添加二级分类</el-button>
            </div>
            <div class="clearfix"></div>
          </div>
          <el-table :data="secondList" v-loading="secondLoading" height="600">
            <el-table-column label="分类名称" prop="name"></el-table-column>
            <el-table-column align="left" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleHide(scope.row)">删除</el-button>
                </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
  </el-row>

    <el-dialog :title="dialogFormTitle" :visible.sync="dialogFormVisible" width="50%" center :close-on-click-modal="false">
      <el-form ref="medicineClassificationForm" :model="medicineClassificationForm">
        <el-form-item label="名称">
          <el-input v-model="medicineClassificationForm.name" style="width: 80%;" placeholder="请输入分类名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="分类" prop="pids" v-if="medicineClassificationForm.parent == 0">
          <el-tag
            v-for="tag in selectedOptions"
            :key="tag.name"
            closable
            size="mini"
            :gutter="20"
            @close="handleClose(tag)">{{tag.name}}
          </el-tag>
        </el-form-item>
        <el-table :data="parseFirstList" height="600" v-if="medicineClassificationForm.parent == 0">
          <el-table-column label="分类名称" prop="name" width="200px;"></el-table-column>
          <el-table-column align="left" label="操作">
            <template slot-scope="scope">
              <el-button size="small" @click="handleAddFirst(scope.row)" v-if="medicineClassificationForm.pids.indexOf(scope.row.id) < 0">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitSet">确 定</el-button>
      </div>
    </el-dialog>

  </d2-container>
</template>

<script>
import { getMedicineClassificationList, setMedicineClassification } from '@/api/hospital'
import { Message } from 'element-ui'
import { hideMedicineClassification } from '@/api/hidedel'
export default {
  name: 'medicineclassificationsubjectlist',
  data () {
    return {
      firstList: null,
      secondList: null,
      total: null,
      firstLoading: true,
      secondLoading: true,
      listQuery: {
        'page': 1,
        'limit': 500,
        'type': 'subject',
        'parent': 1
      },
      selectedOptions: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      medicineClassificationForm: {
        id: '',
        name: '',
        type: 'subject',
        parent: 1,
        pids: ''
      },
      parseFirstList: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleHide (row) {
      this.$confirm('确认删除此分类？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideMedicineClassification({classification_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleAddFirst (row) {
      this.selectedOptions.push({ 'id': row.id, 'name': row.name })
      var tmpPids = []
      for (var i in this.selectedOptions) {
        tmpPids.push(this.selectedOptions[i].id)
      }
      this.medicineClassificationForm.pids = tmpPids.join(',')
      this.parsePids(this.medicineClassificationForm.pids)
    },
    handleClose (tag) {
      var tmpPids = []
      for (var i in this.selectedOptions) {
        if (this.selectedOptions[i].id === tag.id) {
          this.selectedOptions.splice(i, 1)
          break
        }
      }
      for (var j in this.selectedOptions) {
        tmpPids.push(this.selectedOptions[j].id)
      }
      this.medicineClassificationForm.pids = tmpPids.join(',')
      this.parsePids(this.medicineClassificationForm.pids)
    },
    parsePids (pids) {
      this.selectedOptions = []
      this.parseFirstList = []
      var notAddedFirst = []
      if (pids !== '' && pids !== null) {
        var tmp = pids.split(',')
        for (var i in this.firstList) {
          if (tmp.indexOf(this.firstList[i].id) > -1) {
            this.selectedOptions.push({ 'id': this.firstList[i].id, 'name': this.firstList[i].name })
            this.parseFirstList.push({ 'id': this.firstList[i].id, 'name': this.firstList[i].name })
          } else {
            notAddedFirst.push({ 'id': this.firstList[i].id, 'name': this.firstList[i].name })
          }
        }
      } else {
        notAddedFirst = this.firstList
      }
      this.parseFirstList = this.parseFirstList.concat(notAddedFirst)
    },
    handleCreate (parent) {
      this.dialogFormVisible = true
      this.medicineClassificationForm = {
        id: '',
        name: '',
        type: 'subject',
        parent: parent,
        pids: ''
      }
      this.selectedOptions = []
      this.parseFirstList = this.firstList
      if (parent === 1) {
        this.dialogFormTitle = '新增一级分类'
      } else {
        this.dialogFormTitle = '新增二级分类'
      }
    },
    handleEdit (row) {
      this.medicineClassificationForm.id = row.id
      this.medicineClassificationForm.name = row.name
      this.medicineClassificationForm.type = row.type
      this.medicineClassificationForm.parent = row.parent
      this.medicineClassificationForm.pids = row.pids
      this.parsePids(row.pids)
      this.dialogFormVisible = true
      if (parseInt(row.parent) === 1) {
        this.dialogFormTitle = '修改一级分类'
      } else {
        this.dialogFormTitle = '修改二级分类'
      }
    },
    submitSet () {
      if (this.medicineClassificationForm.name.length === 0) {
        Message.error('名称不能为空')
        return
      }
      if (this.medicineClassificationForm.parent === 0 && this.medicineClassificationForm.pids.length === 0) {
        Message.error('请选择一级分类')
        return
      }

      setMedicineClassification(this.medicineClassificationForm).then(response => {
        this.listQuery.page = 1
        this.fetchData()
        this.dialogFormVisible = false
        if (this.medicineClassificationForm.id === '') {
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
    fetchData () {
      this.firstLoading = true
      getMedicineClassificationList({ 'page': 1, 'limit': 1000, 'type': 'subject', 'parent': 1 }).then(response => {
        this.firstList = response.data
        this.firstLoading = false
      })
      this.secondLoading = true
      getMedicineClassificationList({ 'page': 1, 'limit': 1000, 'type': 'subject', 'parent': 0 }).then(response => {
        this.secondList = response.data
        this.secondLoading = false
      })
    }
  }
}
</script>
