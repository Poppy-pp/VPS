<template>
    <div id="placeBox">

      <div class="chartBg"></div>
      <el-row class="content">
        <el-col :span="8">常去地点排行</el-col>
        <el-col :span="4"><i class="el-icon-time"></i></el-col>
        <el-col :span="4"><i class="el-icon-location"></i> 成都</el-col>
        <el-col :span="8" style="text-align:right;">
          <i class="el-icon-close" @click="placeClose"></i>
        </el-col>
      </el-row>
      <el-row class="content_text" v-for="(placeList, index) in placeLists" :key="index" :style="RankStyle(placeList.rank)">
        <el-col :span="2"><i class="el-icon-warning"></i></el-col>
        <el-col :span="2">{{ index+1 }}</el-col>
        <el-col :span="12">{{ placeList.place }}</el-col>
        <el-col :span="4">{{ placeList.times }}次</el-col>
        <el-col :span="4">{{ placeList.hours }}小时</el-col>
      </el-row>
    </div>
</template>
<script>
  export default {
    name: 'FrequentPlace',
    data () {
      return {
        placeLists:[
          {
            rank:1,
            place: '四川省武侯区保利花园',
            times: 2631,
            hours: 296
          },
          {
            rank:2,
            place: '四川省武侯区保利花园',
            times: 2631,
            hours: 168
          },
          {
            rank:3,
            place: '四川省武侯区保利花园',
            times: 2631,
            hours: 122
          },
          {
            rank:4,
            place: '四川省武侯区保利花园',
            times: 2631,
            hours: 69
          },
          {
            rank:5,
            place: '四川省武侯区保利花园',
            times: 2631,
            hours: 69
          },
          {
            rank:6,
            place: '四川省武侯区保利花园',
            times: 2631,
            hours: 69
          },
          {
            rank:7,
            place: '四川省武侯区保利花园',
            times: 2631,
            hours: 69
          },
          {
            rank:8,
            place: '四川省武侯区保利花园',
            times: 2631,
            hours: 69
          },
        ]
      }
    },
    computed: {

    },
    methods: {
      RankStyle (rank) {
        if(rank === 7){
          return {color: '#ff1a1a'}
        }else if( rank === 1 || rank === 2 || rank === 3){
          return {color: '#f4ec27'}
        }
      },
      placeClose () {
        this.$emit('placeClose')
      }
    }
  }
</script>
<style scoped>

</style>
