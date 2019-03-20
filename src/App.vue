<template>
  <div id="VPS">
    <router-view />
  </div>
</template>

<script>
  // 默认自定义 海蓝主题样式
  import '@/assets/theme/default/index.css'
  import '@/assets/theme/default/comTool.css'

  // 标准地图 主题样式
  import '@/assets/theme/normal/index.css'
  import '@/assets/theme/normal/comTool.css'

  // 卫星图 主题样式
  import '@/assets/theme/satellite/index.css'
  import '@/assets/theme/satellite/comTool.css'


  // axios公用配置 拦截器 初始化
  import '@/Api/httpConfig'

  export default {
    name: 'VPS',
    data () {
      return {
      }
    },
    mounted () {
      // 默认bodyclass  初始化对应主题样式
      document.body.className = 'vps-custom-' + this.$store.getters.theme;
    }
  }
</script>
