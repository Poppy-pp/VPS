<!--*
* @description: 百度地图
* @author: wp
* @update: 2018-04-12
-->
<template>
    <div id="container" :map="map"></div>
</template>
<script>
  export default {
    data () {
      return {
        map:null
      }
    },
    methods:{
      //地图主题样式刷新
      mapThemeRefresh(enName) {
        // this.map.setMapStyle('amap://styles/'+enName);
      },
      //设置并重新初始化地图类型0高德1百度
      InitMap(){
          this.map = new BMap.Map("container");
          let point = new BMap.Point(116.397428, 39.90923);
          this.map.centerAndZoom(point, 11);
          this.map.enableScrollWheelZoom(true);
      }
    },
    mounted(){
      this.InitMap();
    }
  }
</script>
