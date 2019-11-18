<template>
  <el-dialog :visible.sync="dialogVisible" title="历史治疗单" width="90%" :loading="loading">

    <el-table :data="list" element-loading-text="拼命加载中" stripe v-loading="loading">
      <el-table-column prop="number" label="单号" width="120"></el-table-column>
      <el-table-column prop="created_at" label="时间" min-width="120"></el-table-column>
      <el-table-column prop="admin_name" label="创建者" min-width="80"></el-table-column>
      <el-table-column prop="patient_name" label="姓名" min-width="80"></el-table-column>
      <el-table-column prop="diagnosis_name" label="临床诊断"></el-table-column>
      <el-table-column label="操作" min-width="150">
        <template slot-scope="{$index, row}">
          <el-button @click="historyDetail(row)" type="text">查看详情</el-button>
          <el-button type="text" @click="addHistoryToOrder(row.id)">加入处方笺</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="center pt3" v-show="!loading">
      <el-pagination small layout="total, prev, pager, next, jumper"
               @current-change="showHistory"
               :page-size="20"
               :current-page="search_form.page"
               :total="total">
      </el-pagination>
    </div>

  </el-dialog>
</template>

<script>
import { getTreatmentHistoryList } from '@/api/neworder'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      patient_id: null,
      list: [],
      search_form: {
        page: 1,
      },
      pagination: {
        total: 0,
        page_size: 0,
      },
      total: 0
    }
  },
  methods: {
    historyDetail(order) {
      this.$emit('historyDetail', order)
    },
    addHistoryToOrder(id) {
      this.loading = true
      this.dialogVisible = false
      this.$emit('addHistoryToOrder', id);
    },
    showHistory(patient_id) {
      this.loading = true
      this.dialogVisible = true
      this.search_form.patient_id = patient_id
      getTreatmentHistoryList({patient_id: patient_id, page: this.search_form.page, limit: 20}).then(response => {
        this.total = response.data.total
        this.list = response.data.list
      })
      this.loading = false
    }
  },
};
</script>
