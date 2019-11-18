<template>
  <div>
    <el-dialog title="检查分类" :visible.sync="dialogFormVisible" width="60%" center :close-on-click-modal="false">
      <el-select v-model="firstId" placeholder="请选择一级分类" @change="handleFirstChange">
        <el-option
          v-for="(v, i) in firstList"
          :key="i"
          :label="v.name"
          :value="v.id">
        </el-option>
      </el-select>
      <el-table :data="parseSecondList" height="400" style="margin-top: 20px">
          <el-table-column label="分类名称" prop="name"></el-table-column>
          <el-table-column align="left" label="操作" width="300">
              <template slot-scope="{$index, row}">
                  <el-button size="small" @click="handleAdd(row)" v-show="selected.indexOf(row.id) < 0">添加
                  </el-button>
                  <el-button size="small" v-show="selected.indexOf(row.id) >= 0" disabled>已添加
                  </el-button>
              </template>
          </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { getExaminationClassificationList } from '@/api/hospital'
export default {
  name: 'checkclassification',
  data () {
    return {
      firstList: null,
      secondList: null,
      firstId: '',
      total: null,
      firstLoading: true,
      secondLoading: true,
      listQuery: {
        'page': 1,
        'limit': 500,
        'type': 'disease',
        'parent': 1
      },
      selected: [],
      selectedOptions: [],
      dialogFormTitle: '',
      dialogFormVisible: false,
      parseFirstList: null,
      parseSecondList: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleFirstChange (value) {
      this.parseSecondList = []
      for (let i in this.secondList) {
        if (parseInt(this.secondList[i].pid) === parseInt(value)) {
          this.parseSecondList.push({ 'id': this.secondList[i].id, 'name': this.secondList[i].name })
        }
      }
    },
    handleAdd (row) {
      this.selected.push(row.id)
      this.$emit('setCheckclassfication', this.selected.join(','))
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
    handleCheckClassification (selected) {
      if (selected == null || selected == '' ) {
        selected = []
      }else if(!Array.isArray(selected)){
        selected = selected.split(',')
      }
      this.dialogFormVisible = true

      this.selected = selected
      this.fetchData()
    },
    fetchData () {
      this.firstLoading = true
      getExaminationClassificationList({ 'page': 1, 'limit': 1000, 'parent': 1 }).then(response => {
        this.firstList = response.data
        this.firstLoading = false
      })
      this.secondLoading = true
      getExaminationClassificationList({ 'page': 1, 'limit': 1000, 'parent': 0 }).then(response => {
        this.secondList = response.data
        this.secondLoading = false
      })
    }
  }
}
</script>