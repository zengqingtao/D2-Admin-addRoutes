<template>
  <div>
    <el-dialog :visible.sync="dialogVisible" title="搜索就诊人" center :close-on-click-modal="false">
      <el-row type="flex" align="middle" class="pb2">
        <el-col :span="14">
          <el-input v-model="form.search" placeholder="名字/手机号/诊疗卡号"></el-input>
        </el-col>
      </el-row>

      <el-row>
        <div class="ui-search-consult">
          <el-table
              v-loading="loading"
              :data="list"
              stripe
              @filter-change="filterChange"
              @row-click="rowClick"
              @click="onClick($event)">
            <el-table-column prop="full_name" label="姓名" min-width="80px">
            </el-table-column>
            <el-table-column prop="phone" label="手机号" min-width="130px">
            </el-table-column>
            <el-table-column prop="identification_number" min-width="130px" label="身份证号" :span="8">
            </el-table-column>
            <el-table-column prop="card" label="诊疗卡号" :span="8">
            </el-table-column>
          </el-table>
        </div>

        <div class="center p3">
          <el-pagination
              layout="total"
              @current-change="fetchData"
              :page-size="pagination.page_size"
              :current-page="form.page"
              :total="pagination.total">
          </el-pagination>
        </div>
      </el-row>
    </el-dialog>
  </div>
</template>
<script>
import { getPatientsList } from '@/api/personnel'
export default {
  data() {
    return {
      form: {
        search: null,
        page: 1,
      },
      list: [],
      options: [],
      dialogVisible: false,
      loading: false,
      pagination: {
        page_size: null,
        total: null,
      },
    }
  },
  watch: {
    'form.search'(val) {
      if (val) {
        this.fetchData()
      } else {
        this.list = []
      }
    },
  },
  methods: {
    rowClick(row, event, column) {
      this.$emit('changePatient', row)
      this.dialogVisible = false
    },
    resetData() {
      this.form.search = ''
      this.form.page = 1
      this.list = []
    },
    fetchData(page = null) {
      if (page){
        this.form.page = page
      }
      getPatientsList(this.form).then(response => {
        this.list = response.data.list
        this.pagination.total = response.data.total
      })
    },
    filterChange(val) {
      for (const i in val) {
        this.form[i] = val[i]
      }
      this.resetPage()
    },
    resetPage() {
      if (this.form.page === 1) {
        this.fetchData()
      } else {
        this.form.page = 1
      }
    },
  },
}
</script>

<style lang="scss">
  .ui-search-consult {
    min-height: 200px
  }
</style>
