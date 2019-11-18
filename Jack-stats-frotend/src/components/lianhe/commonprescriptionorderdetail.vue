<template>
  <el-dialog :visible.sync="dialogVisible" title="我的常用处方单详情" width="90%" :loading="loading">
    <div width="120px" class="mb2" style="font-size: 18px;">
      临床诊断: <span>{{ form.diagnosis }}</span>
    </div>
    <div>
      <el-table :data="form.items" v-loading="loading">
        <el-table-column prop="drug_name" align="center" label="药品" min-width="120"></el-table-column>
        <el-table-column prop="type" align="center" label="类型" width="110"></el-table-column>
        <el-table-column prop="dosage_form" align="center" label="剂型" width="100"></el-table-column>
        <el-table-column prop="specifications" align="center" label="规格" width="120"></el-table-column>
        <el-table-column prop="price" label="零售价" align="center" min-width="150"></el-table-column>
        <el-table-column prop="amount" align="center" label="总量" width="130">
        </el-table-column>
        <el-table-column prop="amount" align="center" label="小计" width="150"></el-table-column>
        <el-table-column align="center" label="使用方法" width="150">
          <template slot-scope="scope">
            {{ scope.row.frequency }}，一次{{ scope.row.amount }}{{ scope.row.dose_unit }}，{{ scope.row.dosage_time }}，{{ scope.row.usage }}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { getCommonPrescriptionOrder } from '@/api/hospital'
export default {
  data() {
    return {
      id: null,
      form: {
      },
      dialogVisible: false,
      loading: false,
    };
  },
  methods: {
    commonDetail(id) {
      this.loading = true
      this.dialogVisible = true
      getCommonPrescriptionOrder({id: id}).then(response => {
        this.form = response.data
      })
      this.loading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
li{padding: 10px 0; }
</style>
