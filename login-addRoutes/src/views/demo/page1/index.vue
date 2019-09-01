<template>
  <d2-container>
    <template slot="header">Page 1 header</template>
    Hello World
  </d2-container>
</template>

<script>
export default {
  name: 'page1',
  created(){
    this.$axios.get("/api/demo/001").then(res=>{
      console.log("res----------:",res);
    })
  }
}
</script>
