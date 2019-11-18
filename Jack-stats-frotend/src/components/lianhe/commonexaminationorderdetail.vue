<template>
  <el-dialog :visible.sync="dialogVisible" title="通用通用检查单详情" width="90%" :loading="loading">
    <div width="120px" class="mb2" style="font-size: 18px;">
      临床诊断: <span>{{ form.diagnosis }}</span>
    </div>
    <div>
      <el-table :data="form.items" v-loading="loading">
        <el-table-column prop="name" align="center" label="名称" min-width="120"></el-table-column>
        <el-table-column prop="code" align="center" label="检验号" width="110"></el-table-column>
        <el-table-column prop="sample" align="center" label="标本类型" width="100"></el-table-column>
        <el-table-column prop="type" align="center" label="类型" width="120"></el-table-column>
        <el-table-column prop="detail" label="项目详情" align="center" min-width="150"></el-table-column>
        <el-table-column prop="organization_name" align="center" label="检查机构" width="130">
        </el-table-column>
        <el-table-column prop="price" align="center" label="零售价" width="150"></el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { getCommonExamination } from '@/api/hospital'
export default {
  data() {
    return {
      id: null,
      form: {
        items: [],
        diagnosis: '',
      },
      dialogVisible: false,
      loading: false,
    };
  },
  methods: {
    commonDetail(id) {
      this.loading = true;
      // API.get('common-examination-orders/' + this.id).then((res) => {
      //   this.form = res;
      // });
      this.dialogVisible = true
      getCommonExamination({id: id}).then(response => {
        this.form = response.data
      })
      this.loading = false;
    }
  },
};
</script>

<style lang="scss">
  .order-check-project-detail {
    .img-group {
      img {
        display: inline-block;
        vertical-align: top;
        width: 150px;
        height: 150px;
      }
    }
    .info-group {
      font-size: 16px;
      .title {
        display: inline-block;
        width: 140px;
      }
    }
  }
</style>
