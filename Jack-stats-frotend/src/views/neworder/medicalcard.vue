<template>
  <d2-container>
    <div>
      <el-row>
        <el-col>
          <el-card>
            <el-form ref="form" label-width="100px" :model="form">
              <div class="h1" style="padding:15px 0">添加就诊人</div>

              <el-form-item label="姓名：" class="col-6">
                <el-input v-model="form.full_name" style="width:300px"></el-input>
              </el-form-item>

              <el-form-item label="性别：" class="col-3">
                <el-radio-group v-model="form.sex">
                  <el-radio label="男">男</el-radio>
                  <el-radio label="女">女</el-radio>
                </el-radio-group>
              </el-form-item>

              <el-form-item label="手机号码：" class="col-6">
                <el-input v-model="form.phone" placeholder="请注意，这里是填写支付人的手机号" style="width:300px"></el-input>
              </el-form-item>

              <el-form-item label="证件：" class="col-6">
                <el-input v-model="form.papers" class="input-with-select" style="width:450px">
                  <el-select v-model="form.papers_type" slot="prepend" style="width:150px">
                    <el-option label="身份证" value="1"></el-option>
                    <el-option label="护照证" value="2"></el-option>
                    <el-option label="军人证" value="3"></el-option>
                    <el-option label="回乡证" value="4"></el-option>
                    <el-option label="台胞证" value="5"></el-option>
                    <el-option label="外国人永久居留证" value="6"></el-option>
                  </el-select>
                </el-input>
              </el-form-item>

              <el-form-item class="col-6">
                <el-button :loading="isBtnLoading" type="primary" class="center" @click="onSubmit">立即新建
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
      </el-row>

      <el-dialog :visible.sync="dialogVisible"
          width="30%">
        <div class="dialog-card center dialog-body">
          <div class="title">新建成功!</div>
          <div class="text">用户诊疗卡号： {{ card }}</div>
          <div v-if="both" class="text">账号相关信息已以短信形式发送给用户</div>
        </div>
        <div class="center mt20">
          <el-button type="primary" @click="createOrder">创建订单</el-button>
        </div>
      </el-dialog>
    </div>
  </d2-container>
</template>
<script>
import { setMedicalCard } from '@/api/neworder'
import { Message } from 'element-ui'
export default {
  data() {
  return {
    form: {
      type: 'order',
      sex: '男',
      full_name: '',
      phone: '',
      birth_year: '1990-01-01',
      papers: '',
      papers_type: '1',
    },
    dialogVisible: false,
    id: null,
    card: null,
    isBtnLoading: false,
    both: false,
  }
  },
  methods: {
  onSubmit () {
    if (this.form.full_name.length == 0) {
      Message.error('请填写姓名')
      return
    }
    if (this.form.papers.length != 18 && this.form.papers_type == 1) {
      Message.error('请填写身份证号')
      return
    }
    if (this.form.papers.length == 0 && this.form.papers_type != 1) {
      Message.error('请填写证件号')
      return
    }
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(this.form.phone)) {
      Message.error('手机号码格式不正确')
      return
    }
    setMedicalCard(this.form).then(response => {
      this.card = response.data
      this.dialogVisible = true
      this.form = {
        type: 'order',
        sex: '',
        full_name: '',
        phone: '',
        birth_year: '1990-01-01',
        papers: '',
        papers_type: '1',
      }
    })
  },
  createOrder () {
    this.$router.push('/neworder/order')
  }
  }
}
</script>
