<template>
  <el-dialog :visible.sync="dialogVisible" title="我的常用处方单" width="48%" :loading="loading">
    <el-table :data="list" element-loading-text="拼命加载中" stripe v-loading="loading">
      <el-table-column align="center" prop="diagnosis_name" label="临床诊断"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="{$index, row}">
          <el-button @click="showDetail(row.id)" type="text">查看详情</el-button>
          <el-button type="text" @click="addToOrder(row.id)">加入药品单</el-button>
          <el-button type="text" @click="handleHide(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="center pt3" v-show="!loading">
      <el-pagination small layout="total, prev, pager, next, jumper"
               @current-change="showCommon"
               :page-size="20"
               :current-page="search_form.page"
               :total="total">
      </el-pagination>
    </div>
  </el-dialog>
</template>

<script>
import { getCommonPrescriptionOrderList } from '@/api/hospital'
import { hideCommonPrescriptionOrder } from '@/api/hidedel'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      list: [],
      total: 0,
      search_form: {
        page: 1,
        type: 'h'
      },
      pagination: {
        total: 0,
        page_size: 0,
      },
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.loading = false;
      }
    },
  },
  methods: {
    addToOrder(id) {
      this.loading = true
      this.dialogVisible = false
      this.$emit('addCommonToOrder', id)
    },
    showDetail (id) {
      this.$emit('commonDetail', id)
    },
    handleHide (id) {
      this.$confirm('确认隐藏此通用常用处方单？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideCommonPrescriptionOrder({'order_id': id}).then(response => {
          this.showCommon(this.search_form.type)
        })
      })
    },
    showCommon(type) {
      this.search_form.type = type
      this.dialogVisible = true
      this.loading = true
      getCommonPrescriptionOrderList(this.search_form).then(response => {
        if (response.code === 1) {
          this.list = response.data.list
          this.total = response.data.total
        } else {
          Message.error(response.msg)
        }
      })
      this.loading = false
    }
  },
}
</script>
