<template>
    <section id="comFrameBox">
          <header class="boxHead">
            <span class="leftTit" v-text="boxTit"></span>
            <span><slot></slot></span>
            <span @click="closeBox" class="rightClose iconfont icon-iconfontguanbi"></span>
          </header>
    </section>
</template>

<script>
    export default {
      name: 'comFrameBox',
      components: {},
      props: ['boxTit'],
      data () {
        return {}
      },
      mounted () {
      },
      methods: {
        closeBox () {
          this.$emit('closeState', false)
        },
        moveBox () {
        }
      },
      filters: {},
      watch: {}

    }
</script>

<style scoped>
  #comFrameBox .boxHead{
    overflow: hidden;
    height: 23px;
  }
  #comFrameBox .leftTit{
    float: left;
    font-size: 15px;
  }
  #comFrameBox .rightClose{
    float: right;
    font-size: 17px;
  }
</style>
