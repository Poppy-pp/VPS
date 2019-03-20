<!-- 数据图表-行车时长 -->
<template>
  <section v-loading="loading" class="driveTimeChartComents" :id="driveTimeChartComentsid">
      <div class="driveTimeChart" :id="driveTimeChartid"></div>
      <!-- 四边小角 -->
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
  </section>
</template>
<script>
  import { driveLength, chartForDriveLength } from '@/Api/mapApi.js'
  export default {
    name: '',
    data () {
      return {
        listData: [], // 数据组
        driveTimeChartComentsid: '',
        driveTimeChartid: ''
      }
    },
    computed: {
      loading () {
        return this.$store.getters.loadingObj.ECDriveTime
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
        // carid = this.$store.state.hisZoom.info[0].vehicleid.replace(reg, '');
        let hisZoom = this.$store.state.hisZoom.info
        carid = hisZoom[hisZoom.length - 1].vehicleid.replace(reg, '');
        this.driveTimeChartComentsid = 'driveTimeChartComents' + carid
        this.driveTimeChartid = 'driveTimeChart' + carid
        let para = {
          vehicleid: carid,
          type: this.$store.getters.timeState
        }
        // driveLength(para).then((res) => {
        //   if (res.data.status === 'SUCCEED') {
        //     this.listData = res.data.data;
        //     this.$store.commit('SET_COUNT', {driveAll: this.listData.total});// 更新vuex，提供给总数统计
        //   }
        //   if (callback) callback(this.listData)
        // })
        this.$store.dispatch('setLoadingObj', {key: 'ECDriveTime', bool: true})
        chartForDriveLength(para)
          .then(res => {
            let data = res.data.data.chartdata
            this.$store.dispatch('setLoadingObj', {key: 'ECDriveTime', bool: false})
            let total = 0
            this.listData = {
              runList: data.map(d => {
                total += (+d.y)
                return {VALUE: d.y, TIME: d.x}
              })
            }
            this.listData.total = total
            this.$store.commit('SET_COUNT', {driveAll: total})
            if (callback) callback(this.listData)
          })
      },


      drawLine (timeState, listData) {
        let chartTime = ''; let chartData = ''; let itemTime = []; let itemTimeLength = [];// 声明时间组、行车时长组;
        listData.runList.forEach((item, index) => {
          if (timeState === 2) { // 年
            itemTime.push(item.TIME.split('-')[1]);
          } else if (timeState === 1) { // 月
            itemTime.push(item.TIME.split('-')[2]);
          } else if (timeState === 3) { // 日
            itemTime.push(item.TIME);
          }
          itemTimeLength.push(item.VALUE ? item.VALUE : 0)
        }); ;
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
        let chartDiv = document.querySelector('#' + this.driveTimeChartid);
        // 自适应宽高
        let myChartContainer = function () {
          chartDiv.style.width = $('#' + _this.driveTimeChartComentsid).width() + 'px';
          chartDiv.style.height = $('#' + _this.driveTimeChartComentsid).height() + 'px';
        };
        myChartContainer();
        let driveTimeChart = _this.$echarts.init(chartDiv);
        driveTimeChart.setOption({
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
               '<span> 行车时长：' + params[0].value + '/小时</p>' +
               '</div>';
            }
          },
          legend: {
            data: ['行车时长'],
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
              axisLabel: {
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
              axisLabel: {
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
          series: [
            {
              name: '行车时长',
              type: 'line',
              stack: '总量',
              areaStyle: {normal: {}},
              data: chartData
            }
          ]
        });
        // 浏览器大小改变时重置大小
        window.addEventListener('resize', function () {
          myChartContainer();
          driveTimeChart.resize();
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


