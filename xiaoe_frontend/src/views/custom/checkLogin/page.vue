
<template>
</template>

<script>

/**
 * 2019-08-16
 * Powered By CATT-L
 * 
 */

import util from '@/libs/util.js';
import xe from "@/libs/xe";

export default {
  components: {
  },
  data () {
    return {
    }
  },
  created (){

    if(xe.checkTokenExpired()){

      // 本地校验有效
      this.$router.push("/index");

    } else {

      // 过期
      console.log("本地校验 bearer 失效");

      this.$router.push("/login");
    }

  },
}
</script>
