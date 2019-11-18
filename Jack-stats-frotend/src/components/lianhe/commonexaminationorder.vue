<template>
  <el-dialog :visible.sync="dialogVisible" title="通用通用检查单" width="35%" :loading="loading">
    <el-table :data="list" element-loading-text="拼命加载中" stripe v-loading="loading">
      <el-table-column align="center" prop="diagnosis_name" label="临床诊断" width="200"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="{$index, row}">
          <el-button @click="showDetail(row.id)" type="text">查看详情</el-button>
          <el-button type="text" @click="addToOrder(row.id)">加入检查单</el-button>
          <el-button type="text" @click="handleHide(row.id)" v-if="search_form.type == 2">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="center pt3" v-show="!loading">
      <el-pagination small layout="total, prev, pager, next, jumper"
               :page-size="20"
               @current-change="handleCurrentChange"
               :total="total">
      </el-pagination>
    </div>
  </el-dialog>
</template>
<script>
import { getCommonExaminationList } from '@/api/hospital'
import { hideCommonExamination } from '@/api/hidedel'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      list: [],
      total: 0,
      search_form: {
        page: 1,
        limit: 20,
        type: 1
      },
      pagination: {
        total: 0,
        page_size: 0,
      },
    }
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.loading = false;
      }
    },
  },
  methods: {
    showDetail(id) {
      this.$emit('commonDetail', id)
    },
    addToOrder(id) {
      this.loading = true
      this.dialogVisible = false
      this.$emit('addCommonToOrder', id)
    },
    handleCurrentChange (val) {
      this.search_form.page = val
      this.showCommon()
    },
    handleHide (id) {
      this.$confirm('确认隐藏此通用检查单？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideCommonExamination({'order_id': id}).then(response => {
          this.showCommon(this.search_form.type)
        })
      })
    },
    showCommon(type) {
      this.search_form.type = type
      this.loading = true
      this.dialogVisible = true
      getCommonExaminationList(this.search_form).then(response => {
        this.total = response.data.total
        this.list = response.data.list
      })
      this.loading = false
    }
  },
};
</script>
