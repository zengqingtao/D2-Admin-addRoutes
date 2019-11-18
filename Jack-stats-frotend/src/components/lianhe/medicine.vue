<template>
  <div>
    <el-dialog title="选择药品" :visible.sync="dialogFormVisible" width="80%" center :close-on-click-modal="false">
      <!-- header 查询条件 -->
    <template>
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="输入名称/编号/品牌搜索" clearable></el-input>
      <el-select v-model="listQuery.is_rx" placeholder="类型">
        <el-option label="全部类型" value=""></el-option>
        <el-option label="处方药" value="1"></el-option>
        <el-option label="非处方药" value="0"></el-option>
      </el-select>
      <el-select v-model="listQuery.source" placeholder="药库类型">
        <el-option label="全部库房" value=""></el-option>
        <el-option :label="v.label" :value="v.value" v-for="v in medicineSource"></el-option>
      </el-select>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
      v-loading="listLoading"
      element-loading-text="拼命加载中..."
      highlight-current-row
      stripe
      style="width: 100%">
      <el-table-column align="center" prop="drug_name" label="名称" min-width="120"></el-table-column>
      <el-table-column align="center" prop="code" label="编码" width="100"></el-table-column>
      <el-table-column align="center" prop="approval_number" label="批准文号" width="160"></el-table-column>
      <el-table-column align="center" prop="is_rx" label="药型" width="100">
          <template slot-scope="scope">
            {{ scope.row.is_rx == 1 ? '处方药' : '非处方药' }}
          </template>
      </el-table-column>
      <el-table-column align="center" prop="price" label="零售价" width="100"></el-table-column>
      <el-table-column align="center" label="分类" width="100">
      </el-table-column>
      <el-table-column align="center" label="库存" prop="count" width="100">
      </el-table-column>
      <el-table-column align="center" label="来源" width="100">
        <template slot-scope="scope">
          {{ scope.row.source | parseMedicineSource }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="100">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleAdd(scope.row)" v-if="selected.indexOf(scope.row.id) < 0 && scope.row.count > 0">加入处方单</el-button>
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
    </el-dialog>
  </div>
</template>
<script>
import { getMedicineList } from '@/api/hospital'
import { medicineSource } from '@/data/data'
import { Message } from 'element-ui'
export default {
  name: 'medicine',
  data () {
    return {
      medicineSource: medicineSource,
      selected: [],
      dialogFormVisible: false,
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': '',
        'is_rx': '',
        'source': '',
        'type': ''
      }
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.is_rx'(val) {
      this.listQuery.page = 1
      this.fetchData()
    },
    'listQuery.source'(val) {
      this.listQuery.page = 1
      this.fetchData()
    }
  },
  methods: {
    handleMedicine (medicine_ids, type, source) {
      this.selected = medicine_ids
      if (type !== undefined) {
        this.listQuery.type = type  
      }
      if (source !== undefined) {
        this.listQuery.source = source  
      }
      this.fetchData()
      this.dialogFormVisible = true
    },
    handleUpdateSelected (medicine_ids) {
      this.selected = medicine_ids
      this.fetchData()
    },
    handleAdd (row) {
      // 中药来源要一致
      if (this.listQuery.type === 'z' && this.listQuery.source && this.listQuery.source !== row.source) {
        Message.error('中药来源要一致')
        return
      }
      if (this.listQuery.type === 'z' && !this.listQuery.source) {
        this.listQuery.source = row.source
      }
      this.$emit('handleEditMedicine', row)
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
      this.listLoading = true
      getMedicineList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
