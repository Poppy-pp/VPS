<!--*
* @description: 监控列表
* @author: wp
* @update: 2018-05-3
-->
<template>
  <div class="monitorList setion1 h100">
    <!--监控列表  start-->
    <el-table border v-if="!isDetails" height="100%" @row-dblclick="rowDblclickFitView" :data="monitorData" style="width: 100%;border:none;" >

      <el-table-column  fixed="left" align="center" label="#" width="60">
        <template slot-scope="scope">
          <i class="iconfont icon-iconfontguanbi" title="取消监控" @click.stop="deleteRow(scope.$index, scope.row)"></i>
        </template>
      </el-table-column>

      <el-table-column  fixed="left" sortable  prop="carNo" label="车辆" align="center" width="240">
        <template slot-scope="scope">
          <div>
            <i :class="arrTypeToIcon[scope.row.basicdata.vehicletype]" style="font-size:20px;"> </i>
              {{"  "+scope.row.basicdata.carno+"/ "+scope.row.basicdata.ownername}}
              <i v-if="scope.row.basicdata.ownersex" class="iconfont " :class="scope.row.basicdata.ownersex === '女' ? 'icon-nv' : 'icon-nan'"
              :style="scope.row.basicdata.ownersex === '女' ? 'color: #f9198a;' : 'color: #04a6f4;'"></i>
          </div>
        </template>
      </el-table-column>

      <el-table-column  prop="corpname" sortable align="center" width="200" label="公司分组">
          <template slot-scope="scope">
          <div>{{(scope.row.basicdata.corpname!=undefined ? scope.row.basicdata.corpname:"- - -")}}</div>
        </template>
      </el-table-column>

      <el-table-column  prop="carState" align="center" label="车辆状态" width="200" :filters="[{text: '停车', value: '停车'}, {text: '行驶', value: '行驶'}]" :filter-method="filterHandler">
        <template slot-scope="scope">
          <div>
              <!-- <span>{{scope.row.gpsTime}}</span> -->
              {{(scope.row.carState ? scope.row.carState : "---")+
              " "+
              ((scope.row.speed !=0 && scope.row.speed  != undefined) ? "("+scope.row.speed+"km/h)" : '')+"   "}}
              <!-- 定位方向 -->
              <i :class="arrFxToIcon[scope.row.fx]" style = "font-size:20px;"></i>
             </div>
        </template>
      </el-table-column>

      <el-table-column prop="gpsTime" sortable align="center" width="180" label="通讯时间">
      </el-table-column>
      <!-- <el-table-column  prop="serverTime" align="center" width="180" label="服务器时间">
      </el-table-column> -->

      <!-- <el-table-column prop="carNo" fixed="left" label="车牌号" align="center" width="220">
      </el-table-column>
      <el-table-column prop="corpname" align="center" width="150" label="公司分组">
      </el-table-column>
      <el-table-column prop="careType" align="center" label="关注类型">
      </el-table-column>
      <el-table-column prop="carState" align="center" label="车辆状态">
      </el-table-column>
      <el-table-column prop="bz" align="center" label="备注">
      </el-table-column> -->
      <!--<el-table-column prop="ydsf" align="center" width="120" label="原地设防(米)">
      </el-table-column>
      <el-table-column prop="dzwl" align="center" width="200" label="电子围栏">
      </el-table-column>
       <el-table-column prop="gpsTime" align="center" width="155" label="GPS时间">
      </el-table-column>
      <el-table-column prop="serverTime" align="center" width="155" label="服务器时间">
      </el-table-column>
      <el-table-column prop="local" align="center" label="有效定位">
      </el-table-column>
      <el-table-column prop="localType" align="center" label="定位方式">
      </el-table-column>
      <el-table-column prop="fx" align="center" label="方向">
      </el-table-column>
      <el-table-column prop="speed" align="center" width="100" label="速度(km/h)">
      </el-table-column>
      <el-table-column prop="sim" align="center" label="SIM卡">
      </el-table-column>
      <el-table-column prop="sbid" align="center" width="150" label="设备号码">
      </el-table-column>
      <el-table-column prop="sbazsj" align="center" width="120" label="设备安装时间">
      </el-table-column>
      <el-table-column prop="power" align="center" label="电量">
      </el-table-column>
      <el-table-column prop="serviceexpdateStr" align="center" width="150" label="服务器到期时间">
      </el-table-column>
      <el-table-column prop="vin" align="center" width="190" label="车架号">
      </el-table-column>
      <el-table-column prop="ownername" align="center" label="车主姓名">
      </el-table-column>
      <el-table-column prop="ownersex" align="center" label="车主性别">
      </el-table-column>
      <el-table-column prop="idcard" align="center" width="200" label="身份证号">
      </el-table-column>
      <el-table-column prop="ownermobile" align="center" width="200" label="手机号码">
      </el-table-column>
      <el-table-column prop="appointDataStr" align="center" width="150" label="接入时间">
      </el-table-column>
       <el-table-column prop="vehicletype" align="center" width="150" label="车辆类型">
      </el-table-column>-->
      <!--<el-table-column prop="model" align="center" width="250" label="车辆型号">
      </el-table-column>
      <el-table-column prop="color" align="center" label="车身颜色">
        <template slot-scope="scope">
          <template v-if="scope.row.color">
            <i class="iconfont icon-car" :style="{color:scope.row.color,fontSize:'30px',verticalAlign:'middle'}"></i>
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="totalDistance" align="center" width="120" label="当日里程(公里)">
      </el-table-column>
      <el-table-column prop="allDistance" align="center" width="120" label="总里程(公里)">
      </el-table-column> -->
      <!-- <el-table-column prop="kxd" align="center" width="150" label="可信度(%)">
      </el-table-column> -->
      <el-table-column  prop="address" sortable align="left" width="470" label="详细地址">
            <template slot-scope="scope">
            <div>
              <!-- 定位方式 -->
              <i v-if="scope.row.localType=='LBS'" class="iconfont icon-lbslocation" style="font-size:22px;"></i>
              <i v-else-if="scope.row.localType=='GPS'" class="iconfont icon-gps" style="font-size:22px;"></i>
          {{scope.row.address || '---'}}</div>
        </template>
      </el-table-column>

      <el-table-column  prop="kxd" sortable align="center" width="120" label="可信度(%)">
      </el-table-column>
    </el-table>
    <!--监控列表  end-->
    <!--监控详情-->
    <monitorListDetails v-if="isDetails"></monitorListDetails>
    <!--end-->
  </div>
</template>

<script>
import utils from '@/utils/tool.js'; // 车辆信息
import monitorListDetails from '@/components/table/carDetails/monitorListDetails.vue';

import { proddetail } from '@/Api/mapApi.js';
export default {
  name: 'monitorList',
  components: {
    monitorListDetails
  },
  computed: {
    monitorData () {
      // let data = [...this.$store.getters.monitorData]
      let data = this.$store.getters.monitorData.map(vehData => {
        let obj = {vehicleid: vehData.basicdata.vehicleid}
        let {basicdata,proddata, realdata} = vehData
        obj.carNo = basicdata.carno
        obj.kxd = '100'
        if (realdata) {
          obj.carState = utils.getCarStateText(realdata.istate)
          obj.speed = realdata.veo
          obj.fx = utils.formateFX(realdata.direct)
          obj.gpsTime = utils.transformTime(realdata.gpstime)
        } else {
          obj.gpsTime = '---'
        }
        obj = {...obj, basicdata, realdata,proddata, address: vehData.address}
        return obj
      });
      return data;
    },
    isDetails () {
      return this.$store.getters.tabsState.state
    }
  },
  data () {
    return {
      serverTime: '', // 服务器时间
      carState: '', // 车辆状态
      detailsAdress: '', // 详细地址
      arrTypeToIcon: {
        '小轿车': 'iconfont icon-dkw_qiche',
        '出租车': 'iconfont icon-chuzuche',
        '小型客车': 'iconfont icon-tubiao-keche',
        '中型客车': 'iconfont icon-zhongxingkeche',
        '大型客车': 'iconfont icon-daxingkeche',
        '小型货车': 'iconfont icon-xiaoxinghuoche-copy',
        '中型货车': 'iconfont icon-daxinghuoche1',
        '大型货车': 'iconfont icon-dahuoche',
        '救援车': 'iconfont icon-jiuyuancheliang',
        '混凝土搅拌车-小': 'iconfont icon-jiaobanche',
        '工程机械': 'iconfont icon-gongchengjixie',
        '货运装卸': 'iconfont icon-zhuangxieshebei',
        '重型载货汽车': 'iconfont icon-131231221',
        '混凝土搅拌车': 'iconfont icon-jiaobanche',
        '半挂牵引车': 'iconfont icon-che'
      },
      arrFxToIcon: {
        '正北方向': 'iconfont icon-jiantou-n',
        '正东方向': 'iconfont icon-jiantou-e',
        '正南方向': 'iconfont icon-jiantou-s',
        '正西方向': 'iconfont icon-jiantou-w',
        '西南方向': 'iconfont icon-jiantou-sw',
        '西北方向': 'iconfont icon-jiantou-nw',
        '东南方向': 'iconfont icon-jiantou-se',
        '东北方向': 'iconfont icon-jiantou-ne'
      }
      //   tableHeader: this.header,
      //   dragState: {
      //     start: -9, // 起始元素的 index
      //     end: -9, // 移动鼠标时所覆盖的元素 index
      //     dragging: false, // 是否正在拖动
      //     direction: undefined // 拖动方向
      //   }
    };
  },
  methods: {
    // 双击找到对应车辆在地图的位置
    rowDblclickFitView (row, evt) {
      this.$store.dispatch('zoomToCarByCarId', {
        carId: row.vehicleid,
        _this: this
      });
      // 双击时打开列表详情
      var vehicleid = row.vehicleid;
      this.pushDetails(vehicleid, row)
    },
    pushDetails (vehicleid, row) {
      var _this = this;
      let cuIndex = this.$store.getters.monitorData.IndexOf(vehicleid, d => d.vehicleid)
      this.$store.dispatch('changeMonitorData', {data: true,
        index: cuIndex,
        changeFun: function (oldData, data, index) {
          oldData[index].custom.isDetails = data
          return oldData
        }})
      this.$store.dispatch('setLoadingObj', {key: 'monitorDetails', bool: true})
      this.$store.commit('listOrDeails', { states: true, index: 0 }); // 跳转到详情
      this.$indexedDB.getDataById('vehicleDetail', vehicleid, function (result) {
        row = result.data;
        if (row) {
          let index = _this.$store.getters.monitorData.IndexOf(row.vehicleid, d => d.vehicleid)
          _this.$store.dispatch('setIndexOfMonitorDetails', index)
          _this.$store.dispatch('reloadMonitorData', {data: row})

          _this.$store.dispatch('setLoadingObj', {key: 'monitorDetails', bool: false})
        }
      }
      );
    },
    setDeviceInfos () {
      let _this = this
      let data = {...this.$store.getters.monitorDataDetails}
      let arrDeviceInfo = []
      let bool = true
      if (data.proddata.length !== 0) {
        let index = data.proddata.IndexOf(data.realdata.prodnum, d => d.prodnum)
        arrDeviceInfo = data.proddata.map((prod, i) => {
          const GETING = '获取中...'
          let obj = {
            vehicleid: GETING,
            prodnum: GETING,
            temperature: GETING,
            oil: GETING,
            istate: GETING,
            cstate: GETING,
            lng: GETING,
            lat: GETING,
            gpstime: GETING,
            alt: GETING,
            veo: GETING,
            direct: GETING,
            recvtime: GETING,
            power: GETING,
            locationmodel: GETING,
            distance: GETING,
            entitytype: GETING,
            datasource: GETING,
            address: GETING,
            prodspec: GETING
          }
          if (data.proddata.length === 1) {
            obj = {...obj, ...data.proddata[0], ...data.realdata, ...{address: data.address}}
          } else if (i === index) {
            obj = {...obj, ...data.realdata, ...{address: data.address}, ...data.proddata[i]}
          } else {
            let para = {id: prod.prodnum}
            bool = bool & false
            proddetail(para).then(function (res) {
              if (res.data.result.code === 0) {
                res.data.data.realdata.locationmodel = res.data.data.realdata.locationmode
                let vdetail = res.data.data;
                if (vdetail) {
                  Object.assign(obj, {...vdetail.realdata, ...prod})
                  var point = utils.transformWGStoGCJ(obj.lng, obj.lat)
                  // point = [gcj_02_point[0], gcj_02_point[1]]

                  // let point = [obj.lng, obj.lat]
                  _this.$map.$methods.getPointAddress(point, function (data) {
                    obj.address = data

                    commit(arrDeviceInfo)
                  })
                //   _this.$store.commit('getPointAddressMut', _this.$mapObj, prod.vehicleid, point)
                }
              }
            })
          }
          return obj
        })
      }
      // if(bool)
      // return arrDeviceInfo
      if (bool) commit(arrDeviceInfo)

      function commit (obj) {
        _this.$store.commit('setDeviceInfos', obj)
      }
    },
    // 右键跳转到对应数据图表分析
    rowContextmenu (row, evt) {
      this.$router.push({
        path: '/behavier',
        query: {
          rows: row
        }
      });
    },
    // 取消监控车辆
    deleteRow (index, row) {
      this.$emit('handleCheck', {
        data: row,
        ischeck: false,
        type: 'monitor'
      })
    },
    // 设置表格 车辆数据行 右键菜单
    setTableVehRightContext () {
      let _this = this;
      this.$context.attach(
        'div.monitorList table.el-table__body tr.el-table__row',
        [
          { header: '车辆功能菜单' },
          {
            text: '车辆详情',
            action: function (e, doms) {
              let vehicleid =
                _this.monitorData[doms.parents('tr.el-table__row').index()]
                  .vehicleid;
              _this.pushDetails(vehicleid)
            }
          },
          {
            text: '车辆分析',
            action: function (e, doms) {
              let obj = {};
              let veh =
                _this.monitorData[doms.parents('tr.el-table__row').index()];
              obj = {...veh}; // 将当前车辆详细信息存入
              obj.vehicleid = 'echart' + veh.vehicleid; // 获取当前车辆标识ID
              obj.name = veh.carNo;
              obj.isHidden = true;
              obj.windowType = 'chart';
              _this.$store.commit('update_hisZoom', obj); // 打开数据图表窗口，提交修改状态数据
            }
          }
        ]
      );
    },
    mousedownFn (e) {
    },
    formatted (row, column, cellValue, index) {
    },
    localTypeFn (row, column, cellValue) {
      var carLocalType = document.getElementById('car_localType');
      if (cellValue === 'GPS') {
        carLocalType.className = 'icon-gps';
      } else if (cellValue === 'LBS') {
        carLocalType.className = 'icon-lbslocation';
      }
    },
    filterHandler (value, row, column) {
      const property = column['property'];
      return row[property] === value;
    }
  },
  mounted () {
    this.setTableVehRightContext(); // 设置右键菜单
  },
  watch: {
    header (val, oldVal) {
      this.tableHeader = val;
    }
  }
};
</script>
<style>
   .vps-custom-default .monitorList .el-checkbox__label{
       color:#606266!important;
   }
</style>
