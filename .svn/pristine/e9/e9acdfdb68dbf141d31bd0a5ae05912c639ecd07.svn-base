<template>
  <div class="BI">
    <iframe id="vehicleMonitoring" frameborder="0" width="100%" height="100%" marginheight="0" marginwidth="0" scrolling="no" :src="src"></iframe>
    <el-button type="primary" class="editBack" @click="$router.back(-1)" icon="el-icon-back" circle></el-button>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        src: ''
      };
    },
    methods: {
    },
    created() {
      this.src = 'http://192.168.50.72:8080/';
    }
  };
</script>
<style type="text/css">
  .BI{
    width: 100vw;
    height: 100vh;
  }
  .editBack{
    position: absolute;
    z-index: 9999;
    bottom: 10px;
    right: 10px;
  }
</style>
