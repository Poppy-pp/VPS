<!-- 数据图表-停车时长 -->
<template>
<!--  -->
  <section v-loading="loading" class="parkingTimeChartComents" :id="parkingTimeChartComentsid">
      <!-- 四边小角 -->
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
      <div class="parkingTimeChart" :id="parkingTimeChartid"></div>
  </section>
</template>
<script>
  import { parkingLength, chartForParkTime } from '@/Api/mapApi.js'
  export default {
    name: '',
    data () {
      return {
        listData: [], // 数据组
        parkingTimeChartComentsid: '',
        parkingTimeChartid: ''
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loadingObj.ECParkingTime
      },
      timeState () {
        return this.$store.getters.timeState;
      }
    },
    mounted () {
      let _this = this;
      _this.getDataDetail((data) => { // 获取数据
        _this.drawLine(1, data);
      })
    },
    methods: {
      // 获取数据
      getDataDetail (callback) {
        var reg = /[a-zA-Z]/g; var carid = ''; // 去掉车辆id中的字母
        let hisZoom = this.$store.state.hisZoom.info
        carid = hisZoom[hisZoom.length - 1].vehicleid.replace(reg, '');
        this.parkingTimeChartid = 'parkingTimeChart' + carid
        this.parkingTimeChartComentsid = 'parkingTimeChartComents' + carid
        let para = {
          vehicleid: carid,
          type: this.$store.getters.timeState
        }
        // parkingLength(para).then((res) => {
        //   this.listData = res.data.data;
        // })
        this.$store.dispatch('setLoadingObj', {key: 'ECParkingTime', bool: true})
        chartForParkTime(para).then(res => {
          let data = res.data.data.chartdata
          this.$store.dispatch('setLoadingObj', {key: 'ECParkingTime', bool: false})
          this.listData = data.map(d => {
            return {TIME: d.x, VALUE: d.y}
          })
          if (callback) callback(this.listData)
        })
      },


      drawLine (timeState, listData) {
        let chartTime = ''; let chartData = ''; let itemTime = []; let itemTimeLength = [];// 声明时间组、停车时长组;
        listData.forEach((item, index) => {
          if (timeState === 2) { // 年
            itemTime.push(item.TIME.split('-')[1]);
          } else if (timeState === 1) { // 月
            itemTime.push(item.TIME.split('-')[2]);
          } else if (timeState === 3) { // 日
            itemTime.push(item.TIME);
          }
          itemTimeLength.push(item.VALUE ? item.VALUE : 0)
        });
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
        let _this = this;
        // 基于准备好的dom，初始化echarts实例
        let chartDiv = document.querySelector('#' + this.parkingTimeChartid);
        // 自适应宽高
        let myChartContainer = function () {
          chartDiv.style.width = $('#' + _this.parkingTimeChartComentsid).width() + 'px';
          chartDiv.style.height = $('#' + _this.parkingTimeChartComentsid).height() + 'px';
        };
        myChartContainer();
        let parkingTimeChart = _this.$echarts.init(chartDiv);
        parkingTimeChart.setOption({
          grid: {
            left: '1%',
            bottom: '3%',
            containLabel: true
          },
          legend: {
            textStyle: {
              color: '#fff'
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
              return '<div style="padding: 6px">' +
               '<p>&nbsp;&nbsp;&nbsp;时间：&nbsp;' + params[0].name + timeCompany + '</p>' +
               '<p><span style="background: #c23513;width: 10px;height: 10px;border-radius: 50%;display: inline-block"></span> ' +
               '<span> 停车时长：' + params[0].value + '/分钟</p>' +
               '</div>';
            }
          },
          xAxis: [
            {
              show: true,
              type: 'category',
              boundaryGap: false,
              data: chartTime.length !== 0 ? chartTime : '暂无数据',
              axisLine: {
                lineStyle: {
                  color: '#fff'
                }
              },
              axisLabel: {
                interval: 0 // 横轴信息全部显示
              // rotate:-30,//-30度角倾斜显示
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
              }
            }
          ],
          series: [
            {
              name: '停车时长',
              type: 'line',
              smooth: true,
              itemStyle: {
                color: '#03771A'
              },
              data: chartData
            }
          ]
        });
        // 浏览器大小改变时重置大小
        window.addEventListener('resize', function () {
          myChartContainer();
          parkingTimeChart.resize();
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


