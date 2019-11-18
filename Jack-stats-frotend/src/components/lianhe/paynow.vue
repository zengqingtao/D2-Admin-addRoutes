<template>
  <div>
    <el-dialog title="请选择支付方式" :visible.sync="show">
      <div class="channel">
        <el-radio v-model="channel" label="cash">现金</el-radio>
        <el-radio v-model="channel" label="pos">POS机</el-radio>
        <el-radio v-model="channel" label="weixin_test">微信支付</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit" :loading="isBtnLoading">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { orderToPaid } from '@/api/orders'
import { Message } from 'element-ui'
export default {
  data() {
    return {
      type: '',
      show: false,
      channel: '',
      isBtnLoading: false,
    };
  },
  computed: {},
  watch: {},
  methods: {
    handlePayNow (order_id, type) {
      this.id = order_id
      this.type = type
      this.show = true
    },
    submit() {
      if (!this.channel) {
        return Message.error('请选择支付方式')
      }
      this.isBtnLoading = true
      orderToPaid({ order_id: this.id, type: this.type, channel: this.channel }).then(response => {
        this.isBtnLoading = false
        if (response.code === 1) {
          Message.success('支付成功')
          this.show = false
          this.$emit('handleRefresh')
        } else {
          Message.error(response.msg)
        }
      })
    },
    close() {
      this.show = false
      this.channel = ''
      this.isBtnLoading = false
    },
  },
};
</script>

<style lang="scss">
  div.channel {
    margin: 20px 0 0 100px;
    font-size: 16px;
  }
</style>
