<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-input v-model="listQuery.search" @keyup.enter.native="handleFilter" style="width: 180px;margin-left: 10px;" placeholder="名称/手机号码/诊疗卡号/身份证" clearable></el-input>
    </template>
    <!-- table表格 -->
    <el-table :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">
      <el-table-column align="center" prop="full_name" label="就诊人"></el-table-column>
      <el-table-column align="center" prop="phone" label="联系电话"></el-table-column>
      <el-table-column align="center" prop="card" label="诊疗卡号"></el-table-column>
      <el-table-column align="center" prop="papers_type" label="证件类型">
        <template slot-scope="scope">
          <span>{{ scope.row.papers_type | parsePapersType }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="identification_number" label="身份证"></el-table-column>
      <el-table-column align="center" prop="papers" label="其他证件"></el-table-column>
      <el-table-column align="center" prop="address" label="地址"></el-table-column>
      <el-table-column align="center" label="操作" width="280">
        <template slot-scope="scope">
          <div class="btn-box">
            <el-button size="mini" type="default" @click="handleHealth(scope.row)">健康档案</el-button>
            <el-button size="mini" type="primary" @click="handleOrders(scope.row)">历史病历</el-button>
            <!-- <br/>
            <el-button size="mini" type="danger" @click="handleHide(scope.row)">删除</el-button>
            <el-button size="mini" type="info" @click="handleDisable(scope.row)" v-if="scope.row.deleted_at == null || scope.row.deleted_at == ''">禁用</el-button>
            <el-button size="mini" type="success" @click="handleAble(scope.row)" v-if="scope.row.deleted_at != null && scope.row.deleted_at != ''">启用</el-button> -->
          </div>
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
    <health ref="health"></health>
  </d2-container>
</template>

<script>
import { getPatientsList } from '@/api/personnel'
import health from '@/components/lianhe/health'
import { hidePatient, disablePatient, ablePatient } from '@/api/hidedel'
export default {
  name: 'patientslist',
  components: {
    health
  },
  data () {
    return {
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        'page': 1,
        'limit': 20,
        'search': ''
      },
      listOrderQuery: {
        'page': 1,
        'limit': 100,
        'status': 'finished,visited',
        'patient_id': ''
      },
      dialogFormTitle: '',
      dialogFormVisible: false
    }
  },
  watch: {
    'listQuery.search'(val) {
      this.listQuery.page = 1
      this.fetchData()
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    handleHide (row) {
      this.$confirm('确认删除此就诊人？', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        hidePatient({patient_id: row.id}).then(response => {
          this.fetchData()
        })
      })
    },
    handleDisable (row) {
      disablePatient({patient_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    handleAble (row) {
      ablePatient({patient_id: row.id}).then(response => {
        this.fetchData()
      })
    },
    handleHealth (row) {
      this.$refs.health.handleHealth(row)
    },
    handleOrders (row) {
      this.$refs.health.handleOrders(row.id)
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
      getPatientsList(this.listQuery).then(response => {
        this.total = response.data.total
        this.list = response.data.list
        this.listLoading = false
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.btn-box{
  button{
    margin: 5px;
  }
}
.history-medical-records {
    margin-left: 20px;
}

.record {
    &-group {
    }
    &-item {
    }
}

.history-controll {
    span {
        &:hover {
            color: #20A0FF;
            cursor: pointer;
        }
    }
}

.el-input.is-disabled .el-input__inner {
    background-color: #fff;
    border-color: transparent;
    color: #000;
    cursor: auto;
}

.el-input.is-disabled .el-input__icon {
    visibility: hidden;
}

.el-select .el-input.is-disabled .el-input__inner:hover {
    border-color: transparent;
}

.date-select {
    .el-input__inner {
        border: 0;
        border-radius: 0;
        border-bottom: 1px solid #a5d9ff;
    }
    .el-input__icon {
        color: #a5d9ff;
    }
}
</style>
