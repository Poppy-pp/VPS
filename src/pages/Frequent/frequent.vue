<template>
  <div>
      <div :is="mapComponent" ref="rmap" style="width:100vw;height:100vh;"></div>
      <timeAnalysis></timeAnalysis>
      <FrequentPlace @placeClose="placeClose" v-if="showPlace"></FrequentPlace>
  </div>
</template>
<script>
import amap from '@/components/Map/amap'//高德地图
import timeAnalysis from '@c/Frequent/timeAnalysis'
import FrequentPlace from '@c/Frequent/place'

export default {
	components: {
    amap,
		timeAnalysis,
		FrequentPlace
	},
	data () {
		return {
      mapComponent:'amap',
			showPlace: true
		}
	},
  mounted(){
    this.$store.commit("update_c3Dloading",false)
  },
	methods:{
		placeClose () {
			this.showPlace = false
		}
	},
	created(){
	}
}
</script>
<style scoped>
</style>
