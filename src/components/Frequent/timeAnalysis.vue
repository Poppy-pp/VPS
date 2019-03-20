<template>
  <div id="placeCharts">
      <div class="point"></div>
      <div class="point point1"></div>
      <div class="point point2"></div>
      <div class="point point3"></div>
      <div class="point point4"></div>
      <div class="point point5"></div>
      <div class="point point6"></div>
      <div class="point point7"></div>
      <div class="timeAnalysisBG">
        <div id="timeAnalysisChart"></div>
      </div>
  </div>
</template>
<script>

export default  {
  name: 'timeAnalysis',
  components:{

  },
  data () {
    return {
    }
  },
  mounted(){
    let _this=this;
    _this.$nextTick(function(){
      _this.drawLine()
    })

  },
  methods:{
    drawLine() {
      var echarts = this.$echarts;
      // 基于准备好的dom，初始化echarts实例
      let timeAnalysisChart = echarts.init(document.getElementById('timeAnalysisChart'))
      // 绘制图表
      timeAnalysisChart.setOption({
        title : {
          text: '时间段分析',
          textStyle: {
            fontSize: 20,
            fontFamily: "Microsoft YaHei",
            color: '#FFFFFF'
          }
      },
      grid: {
        left: '2%',   //图表距边框的距离
        right: '2%',
        bottom: '4%',
        containLabel: true
      },
      tooltip : {
        trigger: 'axis',
        enterable: true
      },
      legend: {
        // data:['意向','成交']
      },
      toolbox: {
        show : true,
        feature : {
          mark : {show: true},
          dataView : {show: true, readOnly: false},
          magicType : {show: true, type: ['line', 'bar', 'stack', 'tiled']},
          restore : {show: true},
          saveAsImage : {show: true}
        }
      },
      calculable : true,
      xAxis : [
        {
          type : 'category',
          boundaryGap : false,
          data : [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24],
          axisLabel: {
            textStyle: {
              color: '#FFFFFF'
            }
          },
        }
      ],
      yAxis : [
        {
          type : 'value',
          axisLabel: {
            textStyle: {
              color: '#FFFFFF'
            }
          },
        }
      ],
      series : [
        {
          name:'常去点',
          type:'line',
          smooth:true,
          itemStyle: {normal: {
            areaStyle: {
              type: 'default',
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#68aad5'},
                  {offset: 1, color: '#6e84c0'}
                ]
            )
            },
            lineStyle: {
              color: 'transparent'
            }
          }
          },
          data:[20, 80, 12, 71, 35, 60, 20, 80, 12, 71, 35, 60, 20, 80, 12, 71, 35, 60, 16, 71, 35, 60, 16, 71]
        },
        {
          name:'常去点',
          type:'line',
          smooth:true,
          itemStyle: {normal: {
            areaStyle: {
              type: 'default',
              color: new echarts.graphic.LinearGradient(
                0, 0, 0, 1,
                [
                  {offset: 0, color: '#68aad5'},
                  {offset: 1, color: '#6e84c0'}
                ]
            )
            },
            lineStyle: {
              color: 'transparent'
            }
          }
          },
          data:[10, 24, 12, 20, 13, 26, 12, 43, 12, 15, 68, 21, 20, 24, 12, 13, 44, 15, 16, 62, 11, 9, 16, 12]
        }
      ]
      })
    }
  },
  created(){
  }
}
</script>
<style scoped>

</style>
