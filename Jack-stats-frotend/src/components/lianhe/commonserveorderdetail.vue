<template>
  <el-dialog :visible.sync="dialogVisible" title="我的通用服务单详情" width="90%" :loading="loading">
    <ul class="list-reset flex flex-wrap info-group px4 mb3">
      <li class="col-8 pr3 pb3">
        <span class="title">服务名称：</span>
        <span class="cont">{{ form.name }}</span>
      </li>
      <li class="col-8 pr3 pb3">
        <span class="title">服务类型：</span>
        <span class="cont">{{ form.serve_type_name }}</span>
      </li>
      <li class="col-12 pr3 pb3">
        <span class="title">简介：</span>
        <span class="cont">{{ form.summary }}</span>
      </li>
    </ul>
  </el-dialog>
</template>

<script>
import { getCommonServeOrder } from '@/api/hospital'
export default {
  data() {
    return {
      id: null,
      form: {
        serve_type: {},
        summary: '',
        name: '',
      },
      dialogVisible: false,
      loading: false,
    };
  },
  methods: {
    commonDetail(id) {
      this.loading = true
      this.dialogVisible = true
      getCommonServeOrder({id: id}).then(response => {
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
