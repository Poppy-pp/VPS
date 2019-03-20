<!-- 数据图表-平均速度 -->
<template>
  <section v-loading="loading" class="speedChartComents" :id="speedChartComentsid">
      <div :id="chartid"></div>
      <!-- 四边小角 -->
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
  </section>
</template>
<script>
import { speedAvg, chartForSpeed } from '@/Api/mapApi.js'
export default {
  name: '',
  data () {
    return {
      chartTime: '',
      chartData: '',
      listData: [], // 数据组
      speedChartComentsid: 'speedChartComents',
      chartid: 'speedChart'
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loadingObj.ECSpeed
    },
    timeState () {
      return this.$store.getters.timeState;
    },
    zoomUpdate () {
      return this.$store.getters.zoom;
    }
  },
  mounted () {
    let _this = this;
    _this.getDataDetail((data) => { // 获取数据
      _this.drawLine(1, data);
    });
  },
  methods: {
    // 获取数据
    getDataDetail (callback) {
      var reg = /[a-zA-Z]/g;
      var carid = ''; // 去掉车辆id中的字母
      // carid = this.$store.state.hisZoom.info[0].vehicleid.replace(reg, '');
      let hisZoom = this.$store.state.hisZoom.info
      carid = hisZoom[hisZoom.length - 1].vehicleid.replace(reg, '');
      // /speedChartComentsid
      this.speedChartComentsid = 'speedChartComents' + carid
      this.chartid = 'speedChart' + carid
      let para = {
        vehicleid: carid,
        type: this.$store.getters.timeState
      }
      // speedAvg(para).then((res) => {
      //   this.listData = res.data.data;
      //   if (callback) callback(this.listData)
      // })
      // let _this =this
      this.$store.dispatch('setLoadingObj', {key: 'ECSpeed', bool: true})
      chartForSpeed(para)
        .then(res => {
          let data = res.data.data.chartdata
          this.$store.dispatch('setLoadingObj', {key: 'ECSpeed', bool: false})
          this.listData = data.map(d => {
            return {VEO: d.y, TIME: d.x}
          })

// && this.listData.length > 0
          if (callback ) callback(this.listData)
        })
    },


    drawLine (timeState, listData) {
      let chartTime = ''; let chartData = ''; let itemTime = []; let itemVeo = [];// 声明时间组、平均速度组
      listData.forEach((item, index) => {
        if (timeState === 2) { // 月
          itemTime.push(item.TIME.split('-')[1]);
        } else if (timeState === 1) { // 日
          itemTime.push(item.TIME.split('-')[2]);
        } else if (timeState === 3) { // 年
          itemTime.push(item.TIME);
        }
        itemVeo.push(item.VEO)
      });
      switch (+timeState) {
        // 年
        case 2: {
          chartTime = itemTime;
          chartData = itemVeo;
          this.chartInit(chartTime, chartData, '月');
          break;
        }
        // 月
        case 1: {
          chartTime = itemTime;
          chartData = itemVeo;
          this.chartInit(chartTime, chartData, '日');
          break;
        }
        // 日
        case 3: {
          chartTime = itemTime;
          chartData = itemVeo;
          this.chartInit(chartTime, chartData, '年');
          break;
        }
      }
    },
    chartInit (chartTime, chartData, timeCompany) {
      let _this = this;
      // 基于准备好的dom，初始化echarts实例
      let chartDiv = document.querySelector('#' + this.chartid);
      // 自适应宽高
      let myChartContainer = function () {
        chartDiv.style.width = $('#' + _this.speedChartComentsid).width() + 'px';
        chartDiv.style.height = $('#' + _this.speedChartComentsid).height() + 'px';
      };
      myChartContainer();
      let speedChart = _this.$echarts.init(chartDiv);
      speedChart.setOption({
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params, ticket, callback) {
            return '<div style="padding: 6px">' +
              '<p>&nbsp;&nbsp;&nbsp;时间：&nbsp;' + params[0].name + timeCompany + '</p>' +
              '<p><span style="background: #c23513;width: 10px;height: 10px;border-radius: 50%;display: inline-block"></span> ' +
              '<span> 平均速度：' + params[0].value + 'km/h</p>' +
              '</div>';
          }
        },
        legend: {
          data: ['平均速度km/h'],
          textStyle: {
            color: '#fff'
          }
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: chartTime.length != 0 ? chartTime : '暂无数据',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          },
          axisLabel: {
            interval: 0 // 横轴信息全部显示
            // rotate:-30,//-30度角倾斜显示
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#fff'
            }
          }
        },
        dataZoom: [{
          type: 'slider',
          show: true,
          xAxisIndex: [0],
          start: 1,
          end: 60
        }],
        series: [
          {
            name: '平均速度km/h',
            type: 'line',
            stack: '总量',
            data: chartData
          }
        ]
      });
      speedChart.resize();
      // 浏览器大小改变时重置大小
      window.addEventListener('resize', function () {
        myChartContainer();
        speedChart.resize();
      });
    }
  },
  watch: {
    timeState: function (newVal, oldVal) {
      this.getDataDetail((data) => { // 获取数据
        this.drawLine(newVal, data);
      });
    }
  }
}
</script>


