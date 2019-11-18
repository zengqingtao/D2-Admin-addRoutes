<template>
  <el-dialog :visible.sync="dialogVisible" title="历史处方" width="90%" :loading="loading">

    <el-table :data="list" element-loading-text="拼命加载中" stripe v-loading="loading">
      <el-table-column prop="number" label="单号" width="120"></el-table-column>
      <el-table-column prop="created_at" label="时间" min-width="120"></el-table-column>
      <el-table-column label="创建者" min-width="80" prop="admin_name"></el-table-column>
      <el-table-column label="姓名" min-width="80" prop="patient_name"></el-table-column>
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
import { getPrescriptionHistoryList } from '@/api/neworder'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      patient_id: null,
      list: [],
      total: 0,
      search_form: {
        page: 1,
        patient_id: ''
      },
      pagination: {
        total: 0,
        page_size: 0,
      },
    };
  },
  methods: {
    historyDetail(row) {
      this.$emit('historyDetail', row)
    },
    addHistoryToOrder(id) {
      this.loading = true
      this.dialogVisible = false
      this.$emit('addHistoryToOrder', id)
    },
    showHistory(patient_id) {
      this.loading = true
      this.dialogVisible = true
      this.search_form.patient_id = patient_id
      getPrescriptionHistoryList({patient_id: patient_id, page: this.search_form.page, limit: 20}).then(response => {
        this.total = response.data.total
        this.list = response.data.list
      })
      this.loading = false
    }
  },
};
</script>
