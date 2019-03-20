<!--*
* @description: 车辆报警
* @author: wp
* @update: 2018-05-3
-->
<template>
  <!--车辆报警  start-->
  <div class="policeList setion1 h100">
    <!-- <div class="tab-police-table-wrapper" style="height:calc(100% - 60px);"> -->
    <el-table ref="policeTable" border v-if="cuTable === 'policeTable' " height="100%" :data="policeData" style="width: 100%;border:none;" @row-dblclick="rowDblclickFitView">
      <el-table-column fixed="left" align="center" label="#" width="60">
        <template slot-scope="scope">
          <i class="iconfont icon-iconfontguanbi" title="删除" @click.stop="deleteRow(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>

      <el-table-column fixed="left" sortable label="车牌号" align="center" width="240">
        <template prop="carNo" slot-scope="scope">
          <div>
            {{scope.row.carNo}}
            /
            {{scope.row.ownername}}
            <!-- <i  class="iconfont "
            :class="scope.row.show ? 'icon-iconfontguanbi' : 'icon-78'"
             style="font-size:14px;"
              @click="OnLocation(scope.row,scope.$index)"></i> -->
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="corpname" sortable align="center" width="150" label="所属公司">
      </el-table-column>
      <el-table-column prop="policeType" sortable align="center" width="150" label="报警类型">
      </el-table-column>
      <!-- 编码 -->
      <!-- <el-table-column prop="policeCode" sortable align="center" width="150" label="异常编码">
      </el-table-column> -->
      <el-table-column prop="policeSecond" sortable align="center" label="报警次数"  width="100" >
      </el-table-column>
      <el-table-column prop="GPSTime" sortable align="center" label="报警时间" width="200" >
      </el-table-column>
      <!-- <el-table-column prop="serverTime" align="center" width="200" label="服务器时间" >
      </el-table-column> -->
      <!-- <el-table-column prop="speed" align="center" width="150" label="速度(km/h)">
      </el-table-column> -->
      <!-- <el-table-column prop="equipmentNo" align="center" width="180" label="设备号码">
      </el-table-column>
      <el-table-column prop="frameNumber" align="center" width="180" label="车架号">
      </el-table-column> -->
      <el-table-column prop="adress" sortable align="left" width="560" label="详细地址">
      </el-table-column>
      <el-table-column prop="policeInfo" sortable align="center" label="报警信息"  width="280" >
      </el-table-column>
       <!-- <el-table-column label="操作" fixed="right">
      <template slot-scope="scope">
        <el-button
          size="mini"
          @click="disposeAlarms(scope.$index, scope.row)">
          一键处理
        </el-button>
      </template>
    </el-table-column> -->
    </el-table>
    <!-- </div> -->
    <!-- <div v-if="!isDetails" class="tab-police-btn-wrapper" style="height:60px;">
      <div class="tab-police-btn" @click="disposeAlarms">
        一键处理
      </div>
    </div> -->
    <!--车辆报警  end-->
    <!--车辆报警详情-->
    <!-- <monitorListDetails v-if="isDetails"></monitorListDetails> -->
    <vehicleDetails v-if="cuTable === 'vehicleDetails'"></vehicleDetails>
    <policeDetails v-if="cuTable === 'policeDetails'"></policeDetails>
    <!--end-->
  </div>
</template>

<script>
// import utils from '@/utils/tool.js'; // 车辆信息
// import monitorListDetails from '@/components/table/carDetails/monitorListDetails.vue'; // 报警详情
import vehicleDetails from '@/components/table/carDetails/monitorListDetails.vue'; // 报警详情
import policeDetails from '@/components/table/carDetails/isPolice.vue'
import { monitorlsitDetailsAxios, currentServerTime, vehicledetail } from '@/Api/mapApi.js';
export default {
  name: 'policeList',
  components: {
    // monitorListDetails
    policeDetails,
    vehicleDetails

  },
  computed: {
    policeData () {
      return this.$store.getters.policeData
    },
    // policeListState () {
    //   return this.$store.getters.policeListState;
    // },
    // policeListDetailsState () {
    //   return this.$store.getters.policeListDetailsState;
    // }
    cuTable () {
      // return this.$store.getters.tabsState.state
      switch (this.$store.getters.tabsState.state) {
        case 0:

          return 'policeTable'
        case 1:
          return 'vehicleDetails'
        case 2:
          return 'policeDetails'
        default:
          return 'policeTable'
      }
    }
  },
  data () {
    return {
      serverTime: '', // 服务器时间
      detailsAdress: '', // 详细地址
      dictMarker: {}
    };
  },
  created () {
  },
  destroyed () {
    for (const id in this.dictMarker) {
      if (this.dictMarker.hasOwnProperty(id)) {
        const marker = this.dictMarker[id];
        marker && marker.setMap(null)
        let index = marker.getExtData().index
        this.$store.commit('changePoliceData', {index, bool: 0})
        delete this.dictMarker[id]
      }
    }
  },
  methods: {
    disposeAlarms (index, row) {
    },
    createPoliceMarker (row, index) {
      let map = this.$store.getters.mapObj
      let marker = new AMap.Marker({
        map,
        autoRotation: true,
        topWhenClick: true,
        offset: new AMap.Pixel(-16, -32),
        position: row.point,
        extData: {...row, index}
      })
      var cImg = document.createElement('img')
      cImg.className = 'cIcon'
      cImg.style.width = '32px'
      cImg.style.height = '32px'
      cImg.src = 'static/images/car3.png'
      marker.setContent(cImg)
      this.dictMarker[row.vehicleid] = marker
    },
    // 删除一行
    deleteRow (index, row) {
      this.$store.commit('delete_policeData', index);
    },
    // 报警信息显示
    showOfMap (row, index) {
      // 获取报警车辆信息
      let _this = this
      // this.$indexedDB.getDataById(
      //   'vehicleDetail',
      //   parseInt(row.vehicleid),
      //   function (result) {
      //     let res = result.data;
      //     if (res) {
      //       _this.createPoliceMarker(row, index)
      //     }
      //   }
      // )
      vehicledetail({id: row.vehicleid})
        .then(res => {
          if (res.data.result.code == 0) {
            let vdata = res.data.data
            if (!vdata) return
            _this.createPoliceMarker(row, index)
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
        this.$store.commit('changePoliceData', {index, bool: 1})
        this.showOfMap(row, index)
      } else {
        // row.show = !row.show
        this.$store.commit('changePoliceData', {index, bool: 0})
        this.hiddleOfMap(row)
      }
    },
    // 双击找到对应车辆在地图的位置
    rowDblclickFitView (row, evt) {
      let index = this.policeData.IndexOf(row.vehicleid, d => d.vehicleid);
      this.OnLocation(row, index)
      this.$store.dispatch('zoomBJToCarByCarId', {
        carId: row.vehicleid,
        _this: this,
        type: 1
      });
      //   显示车辆信息干嘛？
    //   // 双击时显示列表详情
    //   var _this = this;
    //   let vehicleid = row.vehicleid;
    //   this.$store.commit('listOrDeails', { states: true, index: 1 }); // 跳转到详情
    //   this.$indexedDB.getDataById(
    //     'vehicleDetail',
    //     parseInt(vehicleid),
    //     function (result) {
    //       let res = result.data;
    //       if (res) {
    //         _this.$store.commit('monitorDataDetails', {
    //           map: _this.$map,
    //           result: res
    //         });
    //       } else {
    //         monitorlsitDetailsAxios({ id: vehicleid }).then(function (response) {
    //           if (response.data.result.code == 0) {
    //             _this.$store.commit('monitorDataDetails', {
    //               map: _this.$map,
    //               result: response.data.data
    //             });
    //           }
    //         });
    //       }
    //     }
    //   );
    },
    // 设置表格 车辆数据行 右键菜单
    setTableVehRightContext () {
      let _this = this;
      this.$context.attach(
        'div.policeList table.el-table__body tr.el-table__row',
        [
          { header: '车辆功能菜单' },
          // {
          //   text: '车辆详情',
          //   action: function (e, doms) {
          //     let vehicleid =
          //       _this.policeData[doms.parents('tr.el-table__row').index()]
          //         .vehicleid;
          //     _this.$store.commit('listOrDeails', { states: true, index: 1 }); // 跳转到详情
          //     _this.$indexedDB.getDataById(
          //       'vehicleDetail',
          //       vehicleid,
          //       function (result) {
          //         let res = result.data;
          //         if (res) {
          //           _this.$store.commit('monitorDataDetails', {
          //             map: _this.$map,
          //             result: res
          //           });
          //         } else {
          //           monitorlsitDetailsAxios({ id: vehicleid }).then(function (response) {
          //             if (response.data.result.code === 0) {
          //               _this.$store.commit('monitorDataDetails', {
          //                 map: _this.$map,
          //                 result: response.data.data
          //               });
          //             }
          //           });
          //         }
          //       }
          //     );
          //   }
          // },
          // {
          //   text: '车辆分析',
          //   action: function (e, doms) {
          //     let obj = {};
          //     let veh =
          //       _this.policeData[doms.parents('tr.el-table__row').index()];
          //     obj = veh; // 将当前车辆详细信息存入
          //     obj.vehicleid = 'echart' + veh.vehicleid; // 获取当前车辆标识ID
          //     obj.name = veh.carNo;
          //     obj.isHidden = true;
          //     obj.windowType = 'chart';
          //     _this.$store.commit('update_hisZoom', obj); // 打开数据图表窗口
          //   }
          // },
          {
            text: '历史数据',
            action: function (e, doms) {
              let obj = {};
              let veh =
                _this.policeData[doms.parents('tr.el-table__row').index()];

              _this.$store.commit('listOrDeails', { states: 2, index: 1 }); // 跳转到详情
              // obj.vehicleid = 'echart' + veh.vehicleid; // 获取当前车辆标识ID
              // obj.name = veh.carNo;
              // obj.isHidden = true;
              // obj.windowType = 'isPolice';
              // _this.$store.commit('update_hisZoom', obj); // 打开数据图表窗口
            }
          }
        ]
      );
    }
  },
  mounted () {
    // this.setTableVehRightContext(); // 设置右键菜单
  }
};
</script>
