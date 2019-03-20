<!-- 数据图表-里程公里 -->
<template>
  <section v-loading="loading" class="mileageChartComents" :id="mileageChartComentsid">
      <div class="mileageChart" :id="mileageChartid"></div>
      <!-- 四边小角 -->
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
  </section>
</template>
<script>
import { mileAge, chartForDistance } from '@/Api/mapApi.js'
export default {
  name: '',
  data () {
    return {
      listData: [], // 数据组
      mileageChartComentsid: '',
      mileageChartid: ''
    }
  },
  computed: {
    loading () {
      return this.$store.getters.loadingObj.ECDayMileage
    },
    timeState () {
      return this.$store.getters.timeState;
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
      var reg = /[a-zA-Z]/g; var carid = ''; // 去掉车辆id中的字母
      // carid = this.$store.state.hisZoom.info[0].vehicleid.replace(reg, '');
      let hisZoom = this.$store.state.hisZoom.info
      carid = hisZoom[hisZoom.length - 1].vehicleid.replace(reg, '');
      this.mileageChartComentsid = 'mileageChartComents' + carid
      this.mileageChartid = 'mileageChart' + carid
      let para = {
        vehicleid: carid,
        type: this.$store.getters.timeState
      }
      // mileAge(para).then((res) => {
      //   if (res.data.status == 'SUCCEED') {
      //     this.listData = res.data.data;
      //     this.$store.commit('SET_COUNT', {mileAll: this.listData.PERIOD});// 更新vuex，提供给总数统计
      //   }
      //   if (callback) callback(this.listData)
      // })
      this.$store.dispatch('setLoadingObj', {key: 'ECDayMileage', bool: true})
      chartForDistance(para).then(res => {
        let data = res.data.data.chartdata
        this.$store.dispatch('setLoadingObj', {key: 'ECDayMileage', bool: false})
        let total = 0
        this.listData = {
          runList: data.map(d => {
            total += (+d.y)
            return {VALUE: d.y, TIME: d.x}
          })
        }
        this.listData.total = total
        this.$store.commit('SET_COUNT', {mileAll: this.listData.total});// 更新vuex，提供给总数统计
        //   }
        if (callback) callback(this.listData)
      })
    },



    drawLine (timeState, listData) {
      let chartTime = ''
      let chartData = ''
      let itemTime = []
      let itemTimeLength = []
      listData.runList.forEach((item, index) => {
        if (timeState === 2) { // 年
          itemTime.push(item.TIME.split('-')[1]);
        } else if (timeState === 1) { // 月
          itemTime.push(item.TIME.split('-')[2]);
        } else if (timeState === 3) { // 日
          itemTime.push(item.TIME);
        }
        itemTimeLength.push(item.VALUE ? item.VALUE : 0)
      })
      switch (+timeState) {
        // 年
        case 2: {
          chartTime = itemTime;
          chartData = itemTimeLength;
          this.chartInit(chartTime, chartData, '月');
          break;
        }
        // 月
        case 1: {
          chartTime = itemTime;
          chartData = itemTimeLength;
          this.chartInit(chartTime, chartData, '日');
          break;
        }
        // 日
        case 3: {
          chartTime = itemTime;
          chartData = itemTimeLength;
          this.chartInit(chartTime, chartData, '年');
          break;
        }
      }
    },
    chartInit (chartTime, chartData, timeCompany) {
      let _this = this
      // 基于准备好的dom，初始化echarts实例
      let chartDiv = document.querySelector('#' + this.mileageChartid);
      // 自适应宽高
      let myChartContainer = function () {
        chartDiv.style.width = $('#' + _this.mileageChartComentsid).width() + 'px';
        chartDiv.style.height = $('#' + _this.mileageChartComentsid).height() + 'px';
      };
      myChartContainer();
      let dayMileageChart = this.$echarts.init(chartDiv);
      // let xAxisData = ''; let seriesData = '';
      dayMileageChart.setOption({
        // tooltip: {
        //   trigger: 'axis',
        //   axisPointer: { // 坐标轴指示器，坐标轴触发有效
        //     type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
        //   },
        //   formatter: '{b} : <br/> {c}/km'
        // },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          show: false
        },
        tooltip: {
          trigger: 'axis',
          formatter: function (params, ticket, callback) {
            return '<div style="padding: 6px">' +
               '<p>&nbsp;&nbsp;&nbsp;时间：&nbsp;' + params[0].name + timeCompany + '</p>' +
               '<p><span style="background: #c23513;width: 10px;height: 10px;border-radius: 50%;display: inline-block"></span> ' +
               '<span> 累计里程：' + params[0].value + '/km</p>' +
               '</div>';
          }

        },
        legend: {
          data: ['里程公里数'],
          textStyle: {
            color: '#fff'
          }
        },
        xAxis: [
          {
            show: true,
            type: 'category',
            boundaryGap: false,
            data: chartTime.length !== 0 ? chartTime : '暂无数据',
            axisTick: {
              // alignWithLabel: true
              textStyle: {
                color: '#FFFFFF'
              }
            },
            axisLine: {
              lineStyle: {
                color: '#FFFFFF'
              }
            }
          }
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#FFFFFF'
              }

            },
            axisLabel: {
              textStyle: {
                color: '#FFFFFF'
              }
            }
          }
        ],
        series: [
          {
            name: '里程公里数',
            type: 'line',
            // barWidth: '30%',
            data: chartData,
            areaStyle: {normal: {}},
            astack: '总量'
          }
        ]
      });
      // 浏览器大小改变时重置大小
      window.addEventListener('resize', function () {
        myChartContainer();
        dayMileageChart.resize();
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

