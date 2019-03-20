<!--*
* @description: 车辆异常
* @author: wp
* @update: 2018-05-3
-->
<template>
  <!--车辆异常  start-->
  <div class="abnormalList setion1 h100">
    <el-table border v-if="!isDetails" height="100%" :data="abnormalData" style="width: 100%; border:none;" @row-dblclick="rowDblclickFitView">
      <el-table-column fixed="left" align="center" label="#" width="60">
        <template slot-scope="scope">
          <i class="iconfont icon-iconfontguanbi" title="删除" @click.stop="deleteRow(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="carNo" fixed="left" label="车牌号" align="center" width="200">
      </el-table-column> -->
      <el-table-column fixed="left" label="车牌号" sortable align="center" width="240">
         <template prop="carNo" slot-scope="scope">
          <div>
            {{scope.row.carNo}}
            /
            {{scope.row.ownername}}
            <!--
              <i  class="iconfont "
            :class="scope.row.show ? 'icon-iconfontguanbi' : 'icon-78'"
             style="font-size:14px;"
             @click="OnLocation(scope.row,scope.$index)">
             </i> -->
             </div>
        </template>
      </el-table-column>
      <el-table-column prop="corpname" sortable align="center" width="150" label="所属公司">
      </el-table-column>

      <el-table-column prop="policeType" sortable align="center" width="150" label="异常类型">
      </el-table-column>
      <!-- <el-table-column prop="policeCode" sortable align="center" width="150" label="异常编码">
      </el-table-column> -->
      <el-table-column prop="policeSecond" sortable align="center" label="异常次数"  width="100">
      </el-table-column>
      <el-table-column prop="GPSTime" sortable align="center" label="报警时间"  width="200">
      </el-table-column>
      <!-- <el-table-column prop="serverTime" align="center" width="200" label="服务器时间">
      </el-table-column> -->
      <!-- <el-table-column prop="speed" align="center"  width="150" label="速度(km/h)">
      </el-table-column> -->
      <!-- <el-table-column prop="equipmentNo" align="center" width="160" label="设备号码">
      </el-table-column>
      <el-table-column prop="frameNumber" align="center" width="160" label="车架号">
      </el-table-column> -->
      <el-table-column prop="adress" sortable align="left" width="600" label="报警地址">
      </el-table-column>
      <el-table-column prop="policeInfo" sortable align="left" label="异常信息" width="200" >
      </el-table-column>
    </el-table>
    <!--车辆异常  end-->
    <!--车辆报警详情-->
    <!-- <abnormalDetails v-if="isDetails"></abnormalDetails> -->
    <abnormalDetails v-if="isDetails"></abnormalDetails>
    <!--end-->
  </div>
</template>

<script>
import utils from '@/utils/tool.js'; // 车辆信息
import abnormalDetails from '@/components/table/carDetails/monitorListDetails.vue'; // 异常详情
import { monitorlsitDetailsAxios, vehicledetail } from '@/Api/mapApi.js';
export default {
  name: 'abnormalList',
  components: {
    abnormalDetails
  },
  computed: {
    abnormalData () {
      return this.$store.getters.abnormalData;
    },
    // abnormaListState () {
    //   return this.$store.getters.abnormaListState;
    // },
    // abnormaListDetailsState () {
    //   return this.$store.getters.abnormaListDetailsState;
    // }
    isDetails () {
      return this.$store.getters.tabsState.state
    }
  },
  data () {
    return {
      dictMarker: {}
    };
  },
  destroyed () {
    for (const id in this.dictMarker) {
      if (this.dictMarker.hasOwnProperty(id)) {
        const marker = this.dictMarker[id];
        marker && marker.setMap(null)
        let index = marker.getExtData().index
        // this.$store.commit('change')
        this.$store.commit('changeAbnormalData', {index, bool: 0})
        delete this.dictMarker[id]
      }
    }
  },

  methods: {


    // 删除一行
    deleteRow (index, row) {
      this.$store.commit('delete_abnormalData', index);
    },
    // 报警信息显示
    showOfMap (row, index) {
      // 获取报警车辆信息
      let _this = this
      vehicledetail({id: row.vehicleid})
        .then(res => {
          if (res.data.result.code === 0) {
            let vdata = res.data.data
            if (!vdata) return
            let marker = _this.$parent.$parent.$refs.rmap.createAbnormalMarker(row, index)

            this.dictMarker[row.vehicleid] = marker
          }
        })
    },
    hiddleOfMap (row) {
      let marker = this.dictMarker[row.vehicleid]
      marker && marker.setMap(null)
    },
    OnLocation (row, index) {
      if (!row.show) {
        // this.rowDblclickFitView(row)
        // row.show = true
        this.$store.commit('changeAbnormalData', {index, bool: 1})
        this.showOfMap(row, index)
      } else {
        // this.$store.commit('changeAbnormalData', {index, bool: 0})
        // this.hiddleOfMap(row)
      }
    },

    // 双击找到对应车辆在地图的位置
    rowDblclickFitView (row, evt) {
      let index = this.abnormalData.IndexOf(row.vehicleid, d => d.vehicleid)
      this.OnLocation(row, index)
      this.$store.dispatch('zoomBJToCarByCarId', {
        carId: row.vehicleid,
        _this: this,
        type: 2
      });
      //   显示车辆信息干嘛？
      // // 双击时打开列表详情
      // var vehicleid = row.vehicleid;
      // var _this = this;
      // this.$store.commit('listOrDeails', { states: true, index: 2 }); // 跳转到详情
      // this.$indexedDB.getDataById(
      //   'vehicleDetail',
      //   parseInt(vehicleid),
      //   function (result) {
      //     let res = result.data;
      //     if (res) {
      //       _this.$store.commit('monitorDataDetails', {
      //         map: _this.$map,
      //         result: res
      //       });
      //     } else {
      //       monitorlsitDetailsAxios({ id: vehicleid }).then(function (response) {
      //         if (response.data.result.code == 0) {
      //           _this.$store.commit('monitorDataDetails', {
      //             map: _this.$map,
      //             result: response.data.data
      //           });
      //         }
      //       });
      //     }
      //   }
      // );
    },
    // 设置表格 车辆数据行 右键菜单
    setTableVehRightContext () {
      let _this = this;
      this.$context.attach(
        'div.abnormalList table.el-table__body tr.el-table__row',
        [
          { header: '车辆功能菜单' },
          {
            text: '车辆详情',
            action: function (e, doms) {
              _this.$store.commit('updataHistoryData', false);
              let vehicleid =
                _this.abnormalData[doms.parents('tr.el-table__row').index()]
                  .vehicleid;
              _this.$store.commit('listOrDeails', { states: true, index: 2 }); // 跳转到详情
              _this.$indexedDB.getDataById(
                'vehicleDetail',
                vehicleid,
                function (result) {
                  let res = result.data;
                  if (res) {
                    _this.$store.commit('monitorDataDetails', {
                      map: _this.$map,
                      result: res
                    });
                  } else {
                    monitorlsitDetailsAxios({ id: vehicleid }).then(function (
                      response
                    ) {
                      if (response.data.result.code === 0) {
                        _this.$store.commit('monitorDataDetails', {
                          map: _this.$map,
                          result: response.data.data
                        });
                      }
                    });
                  }
                }
              );
            }
          }
          // {
          //   text: '车辆分析',
          //   action: function (e, doms) {
          //     let obj = {};
          //     let veh =
          //       _this.abnormalData[doms.parents('tr.el-table__row').index()];
          //     obj = veh; // 将当前车辆详细信息存入
          //     obj.vehicleid = 'echart' + veh.vehicleid; // 获取当前车辆标识ID
          //     obj.name = veh.carNo;
          //     obj.isHidden = true;
          //     obj.windowType = 'chart';
          //     _this.$store.commit('update_hisZoom', obj); // 打开数据图表窗口
          //   }
          // },
          // {
          //   text: '历史数据',
          //   action: function (e, doms) {
          //     // _this.$store.commit('updataHistoryData', true)
          //     // let vehicleid = _this.abnormalData[doms.parents('tr.el-table__row').index()].vehicleid;
          //     _this.$store.commit('listOrDeails', { states: true, index: 2 }); // 跳转到详情
          //     // _this.$indexedDB.getDataById(
          //     //   'vehicleDetail',
          //     //   vehicleid,
          //     //   function (result) {
          //     //     let res = result.data;
          //     //     if (res) {
          //     // _this.$store.commit('monitorDataDetails', {
          //     //   map: _this.$map,
          //     //   result: res
          //     // });
          //     // } else {
          //     // monitorlsitDetailsAxios({ id: vehicleid }).then(function (
          //     //   response
          //     // ) {
          //     //   if (response.data.result.code == 0) {
          //     //     _this.$store.commit('monitorDataDetails', {
          //     //       map: _this.$map,
          //     //       result: response.data.data
          //     //     });
          //     //   }
          //     // });
          //     // }
          //     //   }
          //     // );
          //   }
          // }
        ]
      );
    }
  },
  mounted () {
    // this.setTableVehRightContext(); // 设置右键菜单
  }
};
</script>
