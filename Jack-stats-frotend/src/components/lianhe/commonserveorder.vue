<template>
  <el-dialog :visible.sync="dialogVisible" title="我的通用服务单" width="48%" :loading="loading">
    <el-table :data="list" element-loading-text="拼命加载中" stripe v-loading="loading">
      <el-table-column align="center" prop="name" label="服务名称" width="200"></el-table-column>
      <el-table-column align="center" prop="serve_type_name" label="服务类型" width="200"></el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template slot-scope="{$index, row}">
          <el-button @click="showDetail(row.id)" type="text">查看详情</el-button>
          <el-button type="text" @click="addToOrder(row.id)">加入服务单</el-button>
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
import { getCommonServeOrderList } from '@/api/hospital'
import { hideCommonServeOrder } from '@/api/hidedel'
export default {
  data() {
    return {
      dialogVisible: false,
      loading: false,
      list: [],
      total: 0,
      search_form: {
        page: 1
      },
      pagination: {
        total: 0,
        page_size: 0,
      },
    };
  },
  watch: {
    'search_form.type'(val) {
      if (val) {
        this.showCommon();
      }
    },
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
      this.$confirm('确认隐藏此通用服务单？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hideCommonServeOrder({'order_id': id}).then(response => {
          this.showCommon()
        })
      })
    },
    showCommon() {
      this.dialogVisible = true
      this.loading = true
      getCommonServeOrderList(this.form).then(response => {
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
