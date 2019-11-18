<template>
  <el-dialog :visible.sync="dialogVisible" title="二维码" width="30%">
    <div class="center">
      <h2>医护人员</h2>
      <qrcode :value="doctorUrl" :options="{ width: 200 }"></qrcode>
    </div>
    <div class="center">
      <h2>普通用户</h2>
      <qrcode :value="userUrl" :options="{ width: 200 }"></qrcode>
    </div>
    <div class="center">
      <h2>即时通讯</h2>
      <qrcode :value="chatUrl" :options="{ width: 200 }"></qrcode>
    </div>
  </el-dialog>
</template>
<script>
export default{
  data() {
    return {
      dialogVisible: false,
      doctorUrl: '',
      userUrl: '',
      chatUrl: ''
    }
  },
  methods: {
    showQrcode (id) {
      this.dialogVisible = true
      let origin = 'https://lianhe.dev.ganguo.hk'
      let str = ''
      str = escape(origin + '/employee/register/?employee_id=' + id);
      this.doctorUrl = origin + '/admin/ajax/supplier/qrcode?str=' + str + '&size=230';
      str = escape(origin + '/?employee_id=' + id);
      this.userUrl = origin + '/admin/ajax/supplier/qrcode?str=' + str + '&size=230';
      str = escape(origin + '/my/dialog' + id + '/?employee_id=' + id);
      this.chatUrl = origin + '/admin/ajax/supplier/qrcode?str=' + str + '&size=230';
    }
  },
  mounted() {
  }
}
</script>
