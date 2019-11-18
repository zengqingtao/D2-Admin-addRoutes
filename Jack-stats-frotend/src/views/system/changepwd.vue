<template>
  <d2-container>
    <el-form ref="form" :model="form" label-width="100px">
      <el-form-item label="旧密码">
        <el-input v-model="form.oldpwd" type="password" style="width: 20%"></el-input>
      </el-form-item>
      <el-form-item label="新密码">
        <el-input v-model="form.newpwd" type="password" style="width: 20%"></el-input>
      </el-form-item>
      <el-form-item label="确认密码">
        <el-input v-model="form.confirmpwd" type="password" style="width: 20%"></el-input>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button class="confirm-button" type="primary" @click="submitChange">确 定</el-button>
    </template>
  </d2-container>
</template>

<script>
import { changePwd } from '@/api/user'
export default {
  name: 'user-changepwd',
  data () {
    return {
      form: {
        oldpwd: '',
        newpwd: '',
        confirmpwd: ''
      }
    }
  },
  methods: {
    submitChange () {
      if (this.form.oldpwd.length === 0) {
        this.$message.error('旧密码不能为空')
        return
      }

      if (this.form.newpwd.length === 0) {
        this.$message.error('新密码不能为空')
        return
      }

      if (this.form.confirmpwd.length === 0) {
        this.$message.error('确认密码不能为空')
        return
      }

      if (this.form.newpwd !== this.form.confirmpwd) {
        this.$message.error('新密码与确认密码不一致')
        return
      }

      if (this.form.newpwd.length < 6) {
        this.$message.error('密码最少设置6位')
        return
      }

      changePwd(this.form).then(response => {
        this.$message.info('修改密码成功')
        this.form.newpwd = ''
        this.form.oldpwd = ''
        this.form.confirmpwd = ''
      }).catch((e) => {
        this.$message.error('修改密码失败')
      })
    }
  }
}

</script>

<style scoped>
  .confirm-button {
    margin-left: 140px;
  }
</style>
