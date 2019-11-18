<template>
  <div class="login-page">
    <div class="layer bg" id="login"></div>
    <div class="layer flex-center">
      <!-- logo部分 -->
      <div class="logo-group">
        <h3>登录到Union</h3>
      </div>
      <!-- 表单部分 -->
      <div class="form-group">
        <el-card>
          <el-form ref="loginForm" label-position="top" :rules="rules" :model="formLogin">
            <el-form-item  prop="username">
              <el-input type="text" v-model="formLogin.username" placeholder="用户名">
                <d2-icon slot="prepend" name="user-circle-o"></d2-icon>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input type="password" @keyup.enter.native="submit" v-model="formLogin.password" placeholder="密码">
                <d2-icon slot="prepend" name="keyboard-o"></d2-icon>
              </el-input>
            </el-form-item>
            <el-button @click="submit" type="primary" class="button-login">登录</el-button>
          </el-form>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
require('particles.js')
import config from './config/default'
import { mapActions } from 'vuex'
import util from '@/libs/util'
import { checkIsLogined } from '@/api/login'
import { Message } from 'element-ui'
export default {
  data () {
    return {
      // 表单
      formLogin: {
        username: '',
        password: ''
      },
      // 校验
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    // 初始化例子插件
    particlesJS('login', config);
  },
  beforeDestroy () {
    // 销毁 particlesJS
    // thanks https://github.com/d2-projects/d2-admin/issues/65
    // ref https://github.com/VincentGarreau/particles.js/issues/63
    if (pJSDom && pJSDom.length > 0) {
      pJSDom[0].pJS.fn.vendors.destroypJS()
      pJSDom = []
    }
  },
  methods: {
    ...mapActions('d2admin/account', [
      'login'
    ]),
    /**
     * @description 提交表单
     */
    // 提交登陆信息
    submit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          var url = this.$route.query.url
          if (url !== undefined) {
            this.formLogin.url = url
          } else {
            this.formLogin.url = ''
          }
          // 检查是否已经有在登录
          checkIsLogined(this.formLogin).then((response)=> {
            if (response.code != 1) {
              Message.error(response.msg)
            } else {
              if (response.data.islogined == 1) {
                this.$confirm('当前用户已经被其他人登录，确定把对方踢下线并登录？（如果不是你本人操作，请注意账号安全）', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  // 登陆
                  this.login(Object.assign({vm: this}, this.formLogin))
                })
              } else {
                // 登陆
                this.login(Object.assign({vm: this}, this.formLogin))
              }
            }
          })
        } else {
          // 登陆表单校验失败
          this.$message.error('表单校验失败')
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import './style.scss';
</style>
