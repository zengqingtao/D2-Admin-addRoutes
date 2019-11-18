<template>
  <d2-container class="page">
    <d2-page-cover
      title="UNION"
      sub-title="UNION后台管理系统">
      <!--<img src="./image/taroco.png"/>-->
      <template slot="footer">
        <div class="page__btn-group">
        </div>
      </template>
    </d2-page-cover>
  </d2-container>
</template>

<script>
import D2HelpBtn from './components/d2-help-btn'
export default {
  components: {
    D2HelpBtn
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/style/public.scss';
.page {
  .page__btn-group {
    color: $color-text-placehoder;
    font-size: 12px;
    span {
      color: $color-text-sub;
      &:hover {
        color: $color-text-main;
      }
    }
  }
}
</style>
