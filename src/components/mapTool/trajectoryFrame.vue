<template>
  <section class="trajectoryFrame">
    <keep-alive>
      <div :is="mapComponent"
        class="hismap"
        :mapid="'maphis'+vehicleid"
        ref="hmap"></div>
    </keep-alive>
    <!--轨迹表格设置-->
    <div class="setFrame bounce-enter-active"
      v-if="SetBtn">
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
      <com-frame-box :boxTit="'显示设置'"
        @closeState="closeSetBox"></com-frame-box>
      <div class="boxContent">
        <el-checkbox class="checkSty"
          v-for="(item,index) in trajectorySetArr"
          :disabled="item.disabled"
          :key="index"
          :label="item.name"
          @change="(bool)=>changeLogo(index,bool)"
          v-model="item.checked"></el-checkbox>
      </div>
    </div>
    <!--end-->

    <!--左上角数据-->
    <div class="leftTopInfo"
      :class="autoHeight">
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
      <div class="trajtitle">
        <div class="plateNumberBgk">
          <span class="plateNumber"
            v-text="carOwnerDetails.plateNumber"></span>
        </div>
        <div class="trajtitler">
          <span class="carOwner"
            v-text="carOwnerDetails.carOwner"></span>
          <!-- <i class="iconSex iconfont icon-nan"></i> -->
          <i v-if="sex"
            :class="arrSexToIcon(sex)"></i>
          <!-- <i class="iconProtect iconfont icon-baozhang-copy"></i> -->
          <i @click="showOrHide"
            :class="rotateIcon"
            class="openCarInfo iconfont icon-web_xiangxiazhankai"></i>
        </div>
      </div>
      <div v-if="rotateIcon"
        class="detailsInfo">
        <div class="leftTiT">
          <p>车架号:</p>
          <p>所属公司:</p>
          <p>车辆类型:</p>
          <p>型号:</p>
          <p>车身颜色:</p>
          <p>联系电话:</p>
          <p>身份证号:</p>
          <p>接入时间:</p>
        </div>
        <div class="rightINfos">
          <p :title="carOwnerDetails.FrameNumber"
            v-text="carOwnerDetails.FrameNumber"></p>
          <p :title="carOwnerDetails.company"
            v-text="carOwnerDetails.company"></p>
          <p :title="carOwnerDetails.carType"
            v-text="carOwnerDetails.carType"></p>
          <p :title="carOwnerDetails.model"
            v-text="carOwnerDetails.model"></p>
          <p :title="carOwnerDetails.carColor"
            v-text="carOwnerDetails.carColor"></p>
          <p :title="carOwnerDetails.phone"
            v-text="carOwnerDetails.phone"></p>
          <p :title="carOwnerDetails.IDNumber"
            v-text="carOwnerDetails.IDNumber"></p>
          <p :title="carOwnerDetails.accessTime"
            v-text="carOwnerDetails.accessTime"></p>

          <p :title="carOwnerDetails.simcard"
            v-text="carOwnerDetails.simcard"></p>
        </div>
      </div>
      <div class="prodInfo">
        <div class="leftTiT">
          <p class="mt10">设备信息:</p>
        </div>
        <div class="rightINfos">
          <p>
            <!-- multiple -->
            <el-select v-model="pronumset"
              collapse-tags
              placeholder="设备更换"
              @change="proddataChange">
              <el-option v-for="item in carOwnerDetails.proddata"
                :key="item.prodnum"
                :label="item.prodnum"
                :value="item.prodnum">
                <span>设备号:{{ item.prodnum }}</span>
                <span style="color: #FF9800; font-size: 13px;">SIM号:{{ item.simcard }}</span>
              </el-option>
            </el-select>
          </p>
        </div>
      </div>
    </div>
    <!--end-->
    <div class="rightTime bounce-enter-active"
      v-if="TimeBtn"
      id="trajectoryTime">
      <el-date-picker @change="searchHistoryRoute"
        v-model="time"
        type="datetimerange"
        align="right"
        unlink-panels
        range-separator="至"
        start-placeholder="开始日期"
        value-format="yyyy-MM-dd HH:mm:ss"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        clear-icon=''>
      </el-date-picker>

    </div>

    <div :class="boxClass"
      id="trajectoryCase">
      <div class="block">
        <el-slider class="trajectorySlider"
          :show-tooltip=false
          :min="sliderMinVal"
          :max="sliderMaxVal"
          :step="sliderStepVal"
          v-model="sliderCurValue"></el-slider>
      </div>
      <div class="TrajectoryDatas">
        <div class="let-bottom"
          style="left: 20px"></div>
        <div class="right-bottom"
          style="right: 20px"></div>
        <div class="controller">
          <div class="leftBtn">
            <!-- <i class="iconfont icon-houtui1" @click.stop="routePlayLast"></i> -->
            <i class="iconfont icon-bofang"
              @click.stop="routePlay"></i>
            <!-- <i class="iconfont icon-qianjin" @click.stop="routePlayNext"></i> -->
            <!-- <i class="iconfont icon-chehui" @click.stop="restartPlay"></i> -->
            <i style="font-size: 15px;cursor: default;">{{ curhisD }} / {{ totalHis }}</i>
            <!-- <i class="iconfont icon-houtui2" @click.stop="carHistoryRoutePlaySpeed_change(1)">
              <span style="font-size: 15px">后退</span>
            </i> -->
            <!-- <i class="iconfont icon-ai-rew-right" @click.stop="carHistoryRoutePlaySpeed_change(2)">
              <span style="font-size: 15px">快进</span>
            </i> -->
            <!-- <el-slider class="speedSlider" min=".2" max="5"></el-slider> -->
            <i class="iconfont icon-speed"
              @click.stop="carHistoryRoutePlaySpeed_change">
              <span>{{ 'x '+arrSpeed[speedIndex] }}</span>
            </i>
          </div>
          <div class="rightNav">
            <i @click="openFn('set',$event)"
              :class="[SetBtn ? 'ate' : '']"
              class="iconfont icon-shezhi"></i>
            <i @click="openFn('time',$event)"
              :class="[TimeBtn ? 'ate' : '']"
              class="iconfont icon-shijian1"></i>
            <i @click="openFn('down',$event)"
              v-loading="downLoading"
              element-loading-text=""
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              :class="[DownloadBtn ? 'ate' : '']"
              class="iconfont icon-msnui-download">
            </i>
          </div>
        </div>
        <!--表格数据-->
        <div class="tableBox">
          <!-- v-loadmore="loadMore" -->
          <el-table border
            class="hisTbale"
            id="histable"
            :data="TrajectoryTable"
            style="width: 100%"
            v-loading="trajectLoading"
            height="27.5vh"
            @row-dblclick="OndblClick">
            <el-table-column fixed="left"
              prop="index"
              label="编号"
              align="center"
              width="100">
              <template slot-scope="scope">
                <!-- (scope.$index,scope.row) -->
                {{scope.$index + 1 }}
                <i :v-if="NumToType(scope.row.prodnum) !== 'un'"
                  class="iconfont "
                  :class="NumToType(scope.row.prodnum) === 'wx' ? 'icon-iconset0250' : (NumToType(scope.row.prodnum) === 'un'?'':'icon-hekriconshebeichatou2')"
                  :alt="NumToType(scope.row.prodnum) === 'wx' ? '无线设备' : '有线设备'"></i>
              </template>
            </el-table-column>
            <!-- <el-table-column fixed type="index" align="center" label="序号" width="60">

            </el-table-column> -->
            <!-- <el-table-column
              prop="carno"
              align="center"
              width="280"
              fixed
              label="车牌号">
            </el-table-column>
            <el-table-column
              prop="prodnum"
              align="center"
              width="180"
              label="设备号">
            </el-table-column> -->
            <el-table-column prop="gpstime" align="center" width="200" label="通讯时间">
            </el-table-column>
            <!-- <el-table-column
              prop="recvtime"
              align="center"
              width="200"
              label="服务器时间">
            </el-table-column> -->
            <el-table-column prop="direct" align="center" label="方向">
              <template slot-scope='scope'>
  <i :class="arrFxToIcon[scope.row.direct]"
    style="color:#09f209;"></i>
</template>

            </el-table-column>
            <el-table-column prop="veo" align="center" label="速度" width="80">
            </el-table-column>
            <el-table-column prop="locationmode" align="center" label="定位方式" width="100">
            </el-table-column>
            <el-table-column prop="carstate" align="center" label="车辆状态" width="220">
              <template slot-scope="prop">
  <span :id="'carstate'+prop.row.id">{{ prop.row.carstate }}</span>
</template>
            </el-table-column>
            <el-table-column prop="address" align="center" label="详细地址" width="500">
            </el-table-column>
            <el-table-column prop="communicationstate" align="center" label="通讯状态" width="300">
            </el-table-column>
            <el-table-column prop="isresend" align="center" label="补发" width="80">
            </el-table-column>
          </el-table>
        </div>
        <!--end-->
      </div>
    </div>
    <div class="carInfoOpen" :class="carsInfosHeight" @click="openAndHide">
      <i class="xiangxiaIcon iconfont icon-web_xiangxiazhankai"></i>
    </div>
  </section>
</template>

<script>
import comFrameBox from '@/components/MessageBox/comFrameBox'; // 弹框公用头部
import { gethistorybyvehicleidandprodnum, mergePost } from '@/Api/mapApi.js';
import utils from '@/utils/tool.js'; // 工具
export default {
  name: 'history',
  props: ['vehicleid'],
  components: {
    amap: resolve => {
      require(['@/components/Map/amap'], resolve);
    },
    'com-frame-box': comFrameBox
  },
  computed: {
    // 初始化地图类型
    maptype () {
      return this.$store.getters.MAPTYPE;
    },
    // 地图类型
    mapComponent () {
      return this.maptype === 0 ? 'amap' : 'bmap';
    },
    // 打开或关闭轨迹表格
    boxClass () {
      let dc = 'TrajectoryBox transitionAll';
      if (this.carsInfosHeight) {
        dc += ' ' + this.carsInfosHeight;
      }
      return dc;
    }
  },
  data () {
    return {
      arrSexToIcon: {
        '男': 'iconSex iconfont icon-nan',
        '女': 'iconSex iconfont icon-nv'
      },
      sex: '',
      // 文字转icon
      arrFxToIcon: {
        '正北方向': 'iconfont icon-jiantou-n',
        '正东方向': 'iconfont icon-jiantou-e',
        '正南方向': 'iconfont icon-jiantou-s',
        '正西方向': 'iconfont icon-jiantou-w',
        '西南方向': 'iconfont icon-jiantou-sw',
        '西北方向': 'iconfont icon-jiantou-nw',
        '东南方向': 'iconfont icon-jiantou-se',
        '东北方向': 'iconfont icon-jiantou-ne'
      },
      // 下载加载状态
      downLoading: false,
      time: [], // 选择时间取值
      pickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      navgtr: null,
      navgtrMarkerContent: null,
      curMap: null,
      /* 轨迹表格数据 */
      TrajectoryTable: [],
      trackSpeedDefault: 5000, // 初始化速度80km/h
      // carHistoryRoutePlaySpeed: 1, // 速度选择
      arrSpeed: [0.2, 0.5, 1, 2, 5],
      speedIndex: 2,
      totalHisPiecewiseRoute: 0, // 分段轨迹总数
      sliderStepVal: 1, // 滑块步进
      sliderMinVal: 1, // 滑块最小值
      sliderMaxVal: 1, // 滑块最大值
      /* 轨迹右下角按钮点击状态 */
      SetBtn: false,
      TimeBtn: false,
      DownloadBtn: false,
      /* end */
      /* 左上角数据 */
      carOwnerDetails: {},
      /* end */
      pronumset: [], // 切换设备号
      /* 设置复选框 */
      trajectorySetArr: [
        {
          name: '停车点',
          checked: true,
          disabled: false
        },
        {
          name: '行车轨迹',
          checked: true,
          disabled: true
        },
        {
          name: '报警点',
          checked: true,
          disabled: false
        },
        {
          name: '异常点',
          checked: false,
          disabled: true
        },
        {
          name: '原地设防',
          checked: false,
          disabled: true
        },
        {
          name: '电子围栏',
          checked: false,
          disabled: true
        }
      ],
      /* end */
      initValue: 0, // 轨迹进度条
      routePointAryList: [],
      routePointAryListHis: [],
      routePointAry: [],
      hisLineArr: [],
      /* end */
      /* 轨迹时间进度滑块 */
      sliderCurValue: 0,
      /* 打开关闭轨迹表格Class切换 */
      carsInfosHeight: '',
      /* 展开关闭车主信息绑class */
      rotateIcon: '',
      autoHeight: '',
      curhisD: 1, // 当前形成段
      totalHis: 0, // 总记录数
      pathSimplifierIns: null, // 绘制路径工具
      pointSimplifierIns_RoutePoint: null, // 点简单过滤
      pointSimplifierInsIconW: 20,
      pointSimplifierInsIconH: 20,
      /* end */
      trajectLoading: true, // 数据加载过渡效果
      vehicleDrivingList: [], // 车辆驾驶表
      carno: '', // 车牌号
      page: 0, // 页码
      vehicledetail: '', // 车辆基础信息
      dblMarker: null,
      scrollIndex: 0
    };
  },
  methods: {
    changeLogo (index, bool) {
      function showOrHiddle () {
        pIns.setData(_this.basicData.filter(d => {
          switch (d.istate) {
            case 0:
              return 0
            case 2:
              return _this.trajectorySetArr[0].checked
            case 3:
              return _this.trajectorySetArr[2].checked
            default:
              // return 1
              break
          }
        }))
      }
      var _this = this
      var pIns = this.INS[this.masterIndex].pIns
      switch (index) {
        case 0:
          showOrHiddle()
          break

        case 2:
          showOrHiddle()
          break
        default:
          break
      }
    },
    OndblClick (row, evt) {
      let _this = this;
      let index = this.TrajectoryTable.indexOf(row);

      var map = this.$hisMapArr[this.$hisMapArr.IndexOf('maphis' + this.vehicleid, d => Object.keys(d)[0])];
      this.curMap = map['maphis' + this.vehicleid];
      // let [lng, lat] = utils.transformWGStoGCJ(row.lng, row.lat)
      let [lng, lat] = [row.lng, row.lat];
      if (this.curMap.getZoom() !== 16) {
        this.curMap.setZoomAndCenter(16, [lng, lat]);
        setTimeout(() => {
          let extend = this.curMap.getBounds();
          let c = Math.abs(extend.northeast.lat - extend.southwest.lat);
          let zlat = lat - c / 3 * 0.8;
          let zlng = lng;
          this.curMap.setZoomAndCenter(16, [zlng, zlat]);
        }, 1000);
      } else {
        let extend = this.curMap.getBounds();
        let c = Math.abs(extend.northeast.lat - extend.southwest.lat);
        let zlat = lat - c / 3 * 0.8;
        let zlng = lng;
        this.curMap.setZoomAndCenter(16, [zlng, zlat]);
      }

      this.clearMarker();
      this.dblMarker = new SvgMarker(
        new SvgMarker.Shape.IconFont({
          symbloJs: null,
          icon: 'icon-youxianshebei',
          size: 30,
          offset: [-15, -23],
          fillColor: 'green'
        }),
        {
          map: _this.curMap,
          position: [lng, lat],
          showPositionPoint: false,
          extData: { ...row, index }
        }
      );
    },
    clearMarker () {
      this.dblMarker && this.dblMarker.setMap(null);
    },
    // 设备切换
    proddataChange (proinfo) {
      // 清空值
      this.routePointAryList = [];
      // this.INS = []
      this.initPlayView();
      this.TrajectoryTable = [];
      $('.el-picker-panel__footer button.el-button--text').click(function () {
        this.initHisTime();
      });
      this.initHisINfo();
    },
    // 格式化导出数据格式
    formatJson (filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]));
    },
    // 打开轨迹表格右下三个Nav
    openFn (type, e) {
      let _self = this;
      switch (type) {
        case 'set': {
          _self.SetBtn = !_self.SetBtn;
          break;
        }
        case 'time': {
          _self.TimeBtn = !_self.TimeBtn;
          break;
        }
        case 'down': {
          _self.downLoading = true;
          // 导出当前车辆 历史数据
          require.ensure([], () => {
            const { export_json_to_excel } = require('@/vendor/Export2Excel');
            const tHeader = [
              '车牌号',
              '设备号',
              '通讯时间',
              '服务器时间',
              '方向',
              '速度',
              '定位方式',
              '车辆状态',
              '通讯状态',
              '补发',
              '详细地址'
            ];
            const filterVal = [
              'carno',
              'prodnum',
              'gpstime',
              'recvtime',
              'direct',
              'veo',
              'locationmode',
              'carstate',
              'communicationstate',
              'isresend',
              'address'
            ];
            let data = _self.basicData.map((row, index) => {
              // return [row.carno,row.prodnum,row.gpstime,row.recvtime,row.direct,row.veo,]
              let arr = filterVal.map((d, i) => {
                if (i === 0) {
                  return _self.vehicledetail.basicdata.carno
                } else if (d === 'isresend') {
                  return '否'
                } else {
                  return row[d]
                }
              })
              return arr
            })
            // _self.$indexedDB.getDataBySearch(
            //   'vehHistory',
            //   'vehicleidIndex',
            //   _self.vehicleid,
            //   function (res) {
            // const list = res.data;
            // const data = _self.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, data[0][0]);
            _self.downLoading = false;
            // }
            // );
          });
          break;
        }
      }
    },
    // 关闭设置
    closeSetBox () {
      this.SetBtn = false;
    },
    // 打开关闭轨迹表格
    openAndHide () {
      this.carsInfosHeight = this.carsInfosHeight != '' ? '' : 'tup';
    },
    // 点击展开/关闭左上角车主信息
    showOrHide () {
      let _this = this;
      if (!_this.rotateIcon) {
        _this.rotateIcon = 'downTup';
        _this.autoHeight = 'autoHeight';
      } else {
        _this.rotateIcon = '';
        _this.autoHeight = '';
      }
    },
    // 时间查询车辆历史轨迹
    searchHistoryRoute () {
      let _this = this;
      // 清空值
      _this.routePointAryList = [];
      _this.initPlayView();
      _this.TrajectoryTable = [];
      $('.el-picker-panel__footer button.el-button--text').click(function () {
        _this.initHisTime();
      });
      // 查询
      _this.initHisINfo();

      var date = new Date();
      date.setHours(0);
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
      var unixtimestamp = Number(Math.floor(date.getTime() / 1000));
      var selectionTimeStart = Number(
        utils.formatDate.getDateStringTime(_this.time[0])
      );
      var selectionTimeEnd = Number(
        utils.formatDate.getDateStringTime(_this.time[1])
      );
      var timeNow = Number(
        utils.formatDate.getDateStringTime(
          utils.formatDate.formatTime(new Date().getTime())
        )
      );
      if (selectionTimeEnd > timeNow) {
        _this.$message({
          message: '您输入的结束时间已经超出了当前时间',
          type: 'error'
        });
        // _this.time[1] = utils.formatDate.formatTime(new Date().getTime());
      }
      if (selectionTimeStart > timeNow) {
        _this.$message({
          message: '您输入的开始时间已经超出了当前时间',
          type: 'error'
        });
        // _this.time[0] = utils.formatDate.formatTime(date.getTime());
      }
    },

    // 初始化历史记录默认时间
    initHisTime () {
      let nd = new Date();
      let timeStr =
        nd.getHours() + ':' + nd.getMinutes() + ':' + nd.getSeconds();
      let date_str =
        nd.getFullYear() + '-' + (nd.getMonth() + 1) + '-' + nd.getDate();
      this.time = [date_str + ' 00:00:00', date_str + ' ' + timeStr];
      // this.time = ['2018-09-14 00:00:00', '2018-09-14 19:00:00'];
      return this;
    },
    // 初始化车辆 设备 信息
    initVEhINfo () {
      let _this = this;

      _this.$indexedDB.getDataById('vehicleDetail', _this.vehicleid, function (
        result
      ) {
        let res = result.data;
        _this.carOwnerDetails = {
          plateNumber: res.basicdata.carno || '暂无', // 车牌号
          carOwner: res.basicdata.ownername || '-', // 车主
          FrameNumber: res.basicdata.vin || '-', // 车架号
          company: res.basicdata.corpname || '-', // 所属公司
          carType: res.basicdata.vehicletype || '-', // 车辆类型
          model: res.basicdata.model || '-', // 型号
          carColor: res.basicdata.color || '-', // 车身颜色
          phone: res.basicdata.ownermobile, // 联系电话
          IDNumber: res.basicdata.idcard || '-', // 身份证号
          accessTime: res.basicdata.serviceexpdate || '-', // 接入时间
          proddata: res.proddata
        };
        _this.carno = res.carno;
        _this.vehicledetail = res;
        _this.sex = _this.vehicledetail.basicdata.ownersex
        // _this.sex = '男'
        // _this.sex = '女'
        if (res.proddata.length > 0) {
          if (res.proddata.length > 1) {
            let index = res.proddata.IndexOf('有线', d => d.prodspec)
            // _this.pronumset = [res.proddata[index].prodnum]
            _this.pronumset = res.proddata[index].prodnum
          } else {
            _this.pronumset = res.proddata[0].prodnum;
            // _this.pronumset = [res.proddata[0].prodnum];
          }
          _this.initHisINfo();
        }
      });
    },
    // 编码转换为类型缩写
    NumToType (pid) {
      function transformType (type) {
        // let obj = {
        let s;
        switch (type) {
          case '无线':
            s = 'wx';
            break;
          case '有线':
            s = 'yx';
            break;
          default:
            s = 'un';
            break;
        }
        return s;
      }
      // return data.map(d => {
      //   let obj = { type: transformType(d.prodspec), num: d.prodnum };
      //   return obj;
      // });
      let index = this.carOwnerDetails.proddata.IndexOf(pid, d => d.prodnum)
      let type
      if (index !== -1) {
        let typeStr = this.carOwnerDetails.proddata[index].prodspec
        type = transformType(typeStr)
      } else {
        type = 'un'
      }
      return type
    },
    // 创建车辆麻点图层
    createRoutePointSimplifierLayer (level, callback) {
      var groupStyleMap = null;
      var _this = this;
      var map = _this.$hisMapArr.filter(function (item, index) {
        if (Object.keys(item)[0].indexOf(_this.vehicleid) != -1) {
          return item;
        }
      });
      _this.curMap = map[0]['maphis' + _this.vehicleid];

      AMapUI.load(['ui/misc/PointSimplifier', 'lib/$'], function (
        PointSimplifier,
        $
      ) {
        let pIns = new PointSimplifier({
          zIndex: level,
          autoSetFitView: false,
          map: _this.curMap, // 所属的地图实例
          getPosition (item) {
            return [item.lng, item.lat];
          },
          getHoverTitle (dataItem, idx) {
            var msg = '';
            var istate = dataItem.istate;
            switch (istate) {
              case 2:
                // 获取显示的表格的停车数据
                msg += '<span>状态：</span>停车</br>';
                msg +=
                  '<span>通讯时间：</span>' +
                  utils.transformTime(dataItem.gpstime) +
                  '</br>';
                msg +=
                  '<span>服务器时间：</span>' +
                  utils.transformTime(dataItem.recvtime) +
                  '</br>';
                msg += '<span>停车时长：</span>' + dataItem.carstate + '</br>';
                break;
              case 3:
                msg += '<span>状态：</span>报警</br>';
                msg +=
                  '<span>通讯时间：</span>' +
                  utils.transformTime(dataItem.gpstime) +
                  '</br>';
                msg +=
                  '<span>服务器时间：</span>' +
                  utils.transformTime(dataItem.recvtime) +
                  '</br>';
                msg +=
                  '<span>报警信息：</span>' + dataItem.alarmcontent + '</br>';
                break;
              case 1111:
                msg +=
                  '<span>状态：</span>异常点(' + dataItem.catchinfo + ')</br>';
                msg +=
                  '<span>通讯时间：</span>' +
                  utils.transformTime(dataItem.gpstime) +
                  '</br>';
                msg +=
                  '<span>服务器时间：</span>' +
                  utils.transformTime(dataItem.recvtime) +
                  '</br>';
                break;
            }
            if (dataItem.locationmode === 'LBS') {
              msg = '';
              msg += '<span>LBS</span>定位</br>';
              msg +=
                '<span>通讯时间：</span>' +
                utils.transformTime(dataItem.gpstime) +
                '</br>';
              msg +=
                '<span>服务器时间：</span>' +
                utils.transformTime(dataItem.recvtime) +
                '</br>';
            }
            return msg;
          },
          // 使用GroupStyleRender
          renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
          renderOptions: {
            // 点的样式

            getGroupId: function (item, idx) {
              if (item.locationmode === 'LBS') return 111;
              else {
                if (item.istate === null || item.istate === undefined) return 0;
                else return item.istate;
              }
            },
            groupStyleOptions: function (gid) {
              return groupStyleMap[gid];
            }
          }
        });
        function onIconLoad () {
          pIns.renderLater();
        }
        function onIconError (e) {
          console.log('加载失败！');
        }
        groupStyleMap = {
          // 0: {
          //   pointStyle: {
          //     // 绘制点占据的矩形区域
          //     content: PointSimplifier.Render.Canvas.getImageContent(
          //       '/static/images/car2.png',
          //       onIconLoad,
          //       onIconError
          //     ),
          //     // 宽度
          //     width: _this.pointSimplifierInsIconW,
          //     // 高度
          //     height: _this.pointSimplifierInsIconH,
          //     // 定位点为中心
          //     offset: ['-50%', '-100%'],
          //     fillStyle: null
          //   }
          // },
          2: {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                '/static/images/car2.png',
                onIconLoad,
                onIconError
              ),
              // 宽度
              width: _this.pointSimplifierInsIconW,
              // 高度
              height: _this.pointSimplifierInsIconH,
              // 定位点为中心
              offset: ['-50%', '-100%'],
              fillStyle: null
            }
          },
          3: {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                '/static/images/car3.png',
                onIconLoad,
                onIconError
              ),
              // 宽度
              width: _this.pointSimplifierInsIconW,
              // 高度
              height: _this.pointSimplifierInsIconH,
              // 定位点为中心
              offset: ['-50%', '-100%'],
              fillStyle: null
            }
          },
          111: {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                '/static/images/car4.png',
                onIconLoad,
                onIconError
              ),
              // 宽度
              width: _this.pointSimplifierInsIconW,
              // 高度
              height: _this.pointSimplifierInsIconH,
              // 定位点为中心
              offset: ['-50%', '-100%'],
              fillStyle: null
            }
          },
          1111: {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                '/static/images/car9.png',
                onIconLoad,
                onIconError
              ),
              // 宽度
              width: _this.pointSimplifierInsIconW,
              // 高度
              height: _this.pointSimplifierInsIconH,
              // 定位点为中心
              offset: ['-50%', '-100%'],
              fillStyle: null
            }
          },
          10000: {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                '/static/images/startPoint.png',
                onIconLoad,
                onIconError
              ),
              // 宽度
              width: _this.pointSimplifierInsIconW + 10,
              // 高度
              height: _this.pointSimplifierInsIconH + 10,
              // 定位点为中心
              offset: ['-50%', '-100%'],
              fillStyle: null
            }
          },
          10001: {
            pointStyle: {
              // 绘制点占据的矩形区域
              content: PointSimplifier.Render.Canvas.getImageContent(
                '/static/images/endPoint.png',
                onIconLoad,
                onIconError
              ),
              // 宽度
              width: _this.pointSimplifierInsIconW + 10,
              // 高度
              height: _this.pointSimplifierInsIconH + 10,
              // 定位点为中心
              offset: ['-50%', '-100%'],
              fillStyle: null
            }
          }
        };
        // 回调
        if (callback != null) callback(pIns);
      });
    },
    /** ******************************************分段轨迹*************************************************/
    // 清除所有分段轨迹
    cleanPiecewiseRoute () {
      // if (this.pathSimplifierIns != null) {
      // this.pathSimplifierIns.setSelectedPathIndex(-1);
      if (this.INS) {
        this.INS.forEach(obj => {
          obj.Ins.setData([])
          obj.pIns.setData([])
          obj.p1Ins.setData([])
          obj.p2Ins.setData([])
        })
        this.INS = []
      } // }
    },
    // 获取随机颜色
    getColor () {
      return (
        '#' +
        ('00000' + ((Math.random() * 16777215 + 0.5) >> 0).toString(16)).slice(
          -6
        )
      );
    },

    // 创建轨迹
    async  createTrackRoute (routePointAryList, { bool, index }) {
      var _this = this;
      function selectOption (_Index) {
        return {
          renderAllPointsIfNumberBelow: 100, // 绘制路线节点，如不需要可设置为-1
          getPathStyle: function (pathItem, zoom) {
            let ColorArr = [['#005bf1', /* '#46a700', */ '#eeca04'], ['#ff6a1a', '#c60dd2']]
            let index = _Index % 2
            let pathColor = ColorArr[index][0] // '#3366FF'
            if (pathItem.pathIndex % 2 === 1) {
              pathColor = ColorArr[index][1]
            }
            // , startPointStyle, endPointStyle
            let { pathLineStyle, keyPointStyle } = {
              pathLineStyle: {
                strokeStyle: pathColor,
                lineWidth: 4,
                dirArrowStyle: true
              },
              startPointStyle: {
                radius: 0,
                fillStyle: 'green'
              },
              endPointStyle: {
                radius: 0,
                fillStyle: 'red'
              },
              keyPointStyle: {
                // width: 0,
                // height: 0,
                radius: 0,
                fillStyle: 'green'
              }
            }
            return {
              pathLineStyle,
              keyPointStyle
              // startPointStyle,
              // endPointStyle
            }
          }
        }
      }
      let option = selectOption(index)
      let obj = await this.createPathSimplifierIns(bool, option)
      obj.Ins.setData(routePointAryList);
      // 选中
      obj.Ins.setSelectedPathIndex(-1);
      _this.createRoutePointSimplifierLayer(310, function (pIns) {
        pIns.setData(_this.basicData.filter(d => {
          // return d.istate !== 0
          //           if(d.istate ===0){
          //             return 0
          //           }
          //           if(d.istate === 2){
          // return _this.trajectorySetArr[0].checked
          //           }
          //           if(d.istate)
          switch (d.istate) {
            case 0:
              return 0
            case 2:
              return _this.trajectorySetArr[0].checked
            case 3:
              return _this.trajectorySetArr[2].checked
            default:
              return 1
          }
        }));
        obj.pIns = pIns
      });
      _this.createRoutePointSimplifierLayer(311, function (pIns) {
        pIns.setData([_this.basicData[0]]);
        obj.p1Ins = pIns
      });
      _this.createRoutePointSimplifierLayer(312, function (pIns) {
        pIns.setData([_this.basicData[_this.basicData.length - 1]]);
        obj.p2Ins = pIns
      });
      _this.INS = _this.INS || []
      _this.INS.push(obj)

      return obj
      // }
    },
    createPathSimplifierIns (bool, option) {
      let _this = this
      return new Promise(resolve => {
        AMapUI.load(['ui/misc/PathSimplifier', 'lib/$'], function (PathSimplifier, $) {
          if (!PathSimplifier.supportCanvas) {
            alert('当前环境不支持 Canvas！');
          }
          var map = _this.$hisMapArr.filter(function (item, index) {
            if (Object.keys(item)[0].indexOf(_this.vehicleid) !== -1) {
              return item;
            }
          });
          _this.curMap = map[0]['maphis' + _this.vehicleid]
          _this.batchAddressTransform(_this.basicData, 0)
          let Ins = new PathSimplifier({
            zindex: 100,
            map: _this.curMap, // 所属的地图实例
            getPath (pathData, pathIndex) {
              var points = pathData.data;
              var lnglatList = [];
              points.forEach(point => {
                if (!point.catch) {
                  lnglatList.push([point.lng, point.lat]);
                } else {
                }
              })

              return lnglatList;
            },
            getHoverTitle (pathData, pathIndex, pointIndex) {
              if (pointIndex >= 0) {
                if (pathData.data[pointIndex].istate !== 0) {
                  return (
                    pathData.name +
                    ',' +
                    utils.transformTime(pathData.data[pointIndex].gpstime)
                  );
                }
              }
              // line
              return pathData.name;
            },
            renderOptions: option
          })
          let obj = { Ins }
          if (bool) {
            // 创建车辆图标
            let navgtrMarkerContent = PathSimplifier.Render.Canvas.getImageContent(
              '/static/images/car/routetrackcar.png',
              function () {
                Ins.renderLater();
              },
              function () { }
            );
            obj.navgtrMarkerContent = navgtrMarkerContent
            resolve(obj)
          } else {
            resolve(obj)
          }
        })
      })
    },
    // 运算异常点
    operationCatchPointOld (pointDataStart, pointDataEnd) {
      if (pointDataStart === null || pointDataEnd === null) {
        return {
          state: true,
          catchinfo: '该段行驶速度超过160km/h',
          distance: 0
        };
      }
      if (pointDataEnd.locationmode === 'NAVIGATE') {
        return { state: false, catchinfo: '', distance: 0 };
      }
      if (pointDataEnd.locationmode === 'LBS') {
        return { state: true, catchinfo: 'LBS定位', distance: 0 };
      }
      let info = { state: false, catchinfo: '', distance: 0 };
      // 时间差h
      let t =
        (new Date(pointDataEnd.gpstime) - new Date(pointDataStart.gpstime)) /
        1000 /
        3600;
      // 距离km
      let p = new AMap.LngLat(pointDataStart.lng, pointDataStart.lat);
      let l = p.distance([pointDataEnd.lng, pointDataEnd.lat]) / 1000;
      // 速度超过160km/h或者距离超过100km
      if (l / t > 160 || l > 100) {
        info.state = true;
        info.catchinfo = '该段行驶速度超过160km/h';
      }
      info.distance = l;
      return info;
    },
    // 运算异常点
    operationCatchPoint (pointDataStart, pointDataEnd) {
      if (pointDataStart === null || pointDataEnd === null) {
        return {
          state: true,
          catchinfo: '该段行驶速度超过160km/h',
          distance: 0
        };
      }
      if (pointDataEnd.locationmode === 'NAVIGATE') {
        return { state: false, catchinfo: '', distance: 0 };
      }
      if (pointDataEnd.locationmode === 'LBS') {
        return { state: true, catchinfo: 'LBS定位', distance: 0 };
      }
      let info = { state: false, catchinfo: '', distance: 0 };
      // 时间差h
      let t =
        (new Date(pointDataEnd.gpstime) - new Date(pointDataStart.gpstime)) /
        1000 /
        3600;
      // 距离km
      let p = new AMap.LngLat(pointDataStart.lng, pointDataStart.lat);
      let l = p.distance([pointDataEnd.lng, pointDataEnd.lat]) / 1000;
      // 速度超过160km/h
      if (l / t > 160 || l > 100) {
        info.state = true;
        info.catchinfo = '该段行驶速度超过160km/h';
      }
      info.distance = l;
      return info;
    },
    // 优化车辆轨迹
    initVehicleDriving () {
      var _this = this;
      _this.vehicleDrivingList = [];
      for (var i = 0, len = _this.routePointAryList.length; i < len; i++) {
        // 不为异常点且大于2公里
        if (!_this.routePointAryList[i].catch && _this.routePointAryList[i].distance >= 1) {
          // 寻找该点的上一个非异常点
          var startP = null;
          for (var j = i - 1; j >= 0; j--) {
            if (!_this.routePointAryList[j].catch) {
              startP = _this.routePointAryList[j];
              break;
            }
          }
          // 加入导航任务列表
          if (startP != null) {
            _this.vehicleDrivingList.push({
              index: i,
              startP: startP,
              endP: _this.routePointAryList[i]
            });
          }
        }
      }
      // 路径补全
      if (_this.vehicleDrivingList.length > 0) {
        // $("#drivingExcute").css("visibility", "visible");
      }
    },
    /**
     * data: 接口获得的有线数据
     * 过滤数据得到有效数据
     */
    filterPoint (data) {
      function addCustomStopState (obj, { number, state }) {
        obj.customState = obj.customState || {}
        obj.customState = { ...obj.customState, number, state }
        return obj
      }
      let _this = this
      // 过滤停车时间段内的点位
      // 下一次有效点index
      let nextIndex = 0
      let effectiveData = data.filter((point, index) => {
        point.catch = false
        function RunOfStop () {
          let i = 1
          let nextPoint = data[index + i]
          while (nextPoint && point.lng === nextPoint.lng && point.lat === nextPoint.lat) {
            i++
            nextIndex = index + i
            if (nextIndex < data.length) {
              nextPoint = data[nextIndex]
            } else {
              nextPoint = null
            }
          }
        }
        // 过滤1 非GPS定位
        if (point.locationmode !== 'GPS') {
          return 0
        }

        // 过滤2 小于有效点则过滤(停车过程ing的点位)
        if (index < nextIndex) {
          return 0
        }
        // 第一点特殊情况 需要过滤
        if (index === 0) {
          let isFirstRun = point.istate !== 2
          if (!isFirstRun) {
            RunOfStop()
            return 0
          }
        }
        if (index <= data.length - 2 && point.lng === data[index + 1].lng && point.lat === data[index + 1].lat) {
          // return 0
          RunOfStop()
        }

        return 1
      })
      if (effectiveData.length > 100) {
        effectiveData.forEach((point, index) => {
          let total = 1
          let item = []
          let operationArr = []
          let i = 1;
          var num = 30
          while (i <= num) {
            let nextPoint
            let nextIndex
            if (index + num < effectiveData.length) {
              nextIndex = index + i
              nextPoint = effectiveData[nextIndex]
              // if (operationArr.indexOf(point.id) !== -1 || operationArr.indexOf(nextPoint) !== -1) {
              //   i = num + 1
              //   break
              // }
            } else {
              nextIndex = effectiveData.length - 1 - num + i
              nextPoint = effectiveData[nextIndex]
              // if (operationArr.indexOf(point.id) !== -1 || operationArr.indexOf(nextPoint) !== -1) {
              //   i = num + 1
              //   break
              // }
            }

            let itemcu = _this.operationCatchPoint(point, nextPoint)
            item.push(itemcu)
            if (!itemcu.state) {
              total++
              if (total > num - 10) {
                i = num + 1
                break
              }
            }
            i++
          }
          if (total > num - 10) {
            point.distance = item.distance
          } else {
            point.catch = true
            point.distance = item.distance
          }
          i = 1
        })
      } else {
        // ef
      }
      // 分行程段
      this.needDriving = true
      let optimizeData = []
      effectiveData.forEach((point, index) => {
        point.prodspec = '有线'
        if (point.catch) {
          // continue
        } else {
          if (point.locationmode === 'NAVIGATE') {
            this.needDriving = false
            // 地址转换
            let gcj02point = utils.transformWGStoGCJ(point.lng, point.lat)
            point.lng = gcj02point[0]
            point.lat = gcj02point[1]
          }
          let gcj02point = utils.transformWGStoGCJ(point.lng, point.lat)
          point.lng = gcj02point[0]
          point.lat = gcj02point[1]
          let address = '加载中。。。' // point.position
          if (address === null || address === undefined) {
            if (point.lng > 1) {
              address = point.lng + ',' + point.lat
            } else {
              address = ''
            }
          }
          point.uid = point.id
          point.id = index
          point.isreissue += ' '
          point.isreissue = point.isreissue.trim() !== '0' ? '是' : '否'
          let statu = -1
          if (point.veo === 0) {
            let nextIndex = index + 1
            if (nextIndex < effectiveData.length) {
              let nextPoint = effectiveData[nextIndex]
              statu = new Date(nextPoint.gpstime) - new Date(point.gpstime)
            } else {
              statu = 'end'
            }
          }
          point.statu = statu
          switch (statu) {
            case -1:
              point.carstate = '行驶'
              break;
            case 0:
              point.carstate = '停车'
              break;
            case 'end': // XXX:跨天逻辑时需要更改
              point.carstate = '结束'
              break;
            default:
              point.carstate = '停车(' + utils.formatTCSC(point.statu) + ')'
          }

          point.carno = _this.carno
          point._gpstime = point.gpstime
          point.gpstime = utils.transformTime(point.gpstime)
          point._recvtime = point.recvtime
          point.recvtime = utils.transformTime(point.recvtime)
          point._direct = +point.direct
          point.direct = utils.formateFX(+point.direct)
          point.statu = statu
          point.communicationstate = point.cstate
          point.address = address
          let obj = point
          optimizeData.push(obj)
          // 默认轨迹点
        }
      })
      this.basicData = optimizeData
      // optimizeData.forEach()
      let piecewiseData = []
      let picewiseIndex = 0
      optimizeData.forEach((point, index) => {
        // if(optimizeData[index+1])

        if (index === 0) {
          piecewiseData[picewiseIndex] = { name: '行程段-1', total: 1, data: [point] }
          point.istate = 10000
        } else if (index === optimizeData.length - 1) {
          point.istate = 10001
          // if (point.istate === 2) {
          piecewiseData[picewiseIndex].data.push(point)
          piecewiseData[picewiseIndex].total++
          // }
        } else {
          if (new Date(optimizeData[index + 1].gpstime).getDate() - new Date(point.gpstime).getDate > 0) {
            point.istate = 2
          }
          if (point.istate === 2 && !point.catch) {
            if (point.statu > 10 * 60 * 1000) {
              piecewiseData[picewiseIndex].data.push(point)
              piecewiseData[picewiseIndex].total++
              // let old = piecewiseData[piece]
              picewiseIndex++
              piecewiseData[picewiseIndex] = { name: '行程段-' + (picewiseIndex + 1), total: 1, data: [point] }
            } else {
              piecewiseData[picewiseIndex].data.push(point)
              piecewiseData[picewiseIndex].total++
            }
          } else {
            piecewiseData[picewiseIndex].data.push(point)
            piecewiseData[picewiseIndex].total++
          }
        }
      })
      // total = optimizeData


      // return effectiveData
      // return optimizeData
      return { data: piecewiseData, total: optimizeData.length }
    },
    // 格式化表格数据
    formatTableData (row) {
      function runDefault () {
        _this.$message.info('此时间段无数据,当前展示默认数据')
        let obj = { ..._this.vehicledetail }
        let direct = +obj.realdata.direct
        direct = utils.formateFX(+direct)

        let data = [{
          gpstime: obj.realdata.gpstime,
          direct: direct,
          veo: 0,
          locationmode: obj.realdata.locationmode,
          carstate: '停车',
          address: '获取中...',
          communicationstate: obj.realdata.cstate
        }]
        _this.$map.$methods.getPointAddress([obj.realdata.lng, obj.realdata.lat], function (add) {
          data[0].address = add;
        })

        return { data }
      }
      function runWX (data) {
        row = _this.filterPoint(data)
        return { ...row }
      }
      function runYX (data) {
        row = _this.filterPoint(data)
        return { ...row }
      }

      var _this = this;
      _this.cleanPiecewiseRoute();
      // 设备分类处理
      let runObj = { un: runDefault, wx: runWX, yx: runYX }

      let allData = row.map(obj => {
        let key = _this.NumToType(obj.num)
        let _data = runObj[key](obj.arr)
        if (_data.data.length === 0) {
          key = 'un'
          _data = runObj.un([])
        }
        let data = { type: key, ..._data }
        return data
      })
      _this.routePointAryList = []
      let youxiaojishu = 0
      let masterIndex = -1
      allData.forEach((duan, i) => {
        if (duan.type === 'yx') {
          masterIndex = masterIndex > duan.total ? masterIndex : i
        }
      })
      _this.masterIndex = masterIndex !== -1 ? masterIndex : 0
      _this.totalHis = allData[_this.masterIndex].total || 1
      allData.forEach((d, i) => {
        function runYX () {
          if (youxiaojishu % 2 === 0) {

          } else {

          }
          // _this.routePointAryList = d.data
          let obj
          if (i === masterIndex) {
            obj = _this.createTrackRoute(d.data.map(d => {
              let duan = d
              duan.data.filter(d => {
                return !!d.istate
              })
              return duan
            }), { bool: true, index: i }); // 设置轨迹路径线数据
            _this.totalHisPiecewiseRoute = d.data.length
          } else {
            obj = _this.createTrackRoute(d.data.map(d => {
              let duan = d
              duan.data.filter(d => {
                return !!d.istate
              })
              return duan
            }), { index: i }); // 设置轨迹路径线数据
          }
          youxiaojishu++
          _this.basicData.slice(0, 100).forEach(d => {
            _this.TrajectoryTable.push(d)
          })
        }

        function runWX () {
          if (youxiaojishu % 2 === 0) {

          } else {

          }
          // _this.routePointAryList = d.data
          let obj
          if (i === masterIndex) {
            obj = _this.createTrackRoute(d.data.map(d => {
              let duan = d
              duan.data.filter(d => {
                return !!d.istate
              })
              return duan
            }), { bool: true, index: i }); // 设置轨迹路径线数据
            _this.totalHisPiecewiseRoute = d.data.length
          } else {
            obj = _this.createTrackRoute(d.data.map(d => {
              let duan = d
              duan.data.filter(d => {
                return !!d.istate
              })
              return duan
            }), { index: i }); // 设置轨迹路径线数据
          }
          youxiaojishu++
          _this.basicData.slice(0, 100).forEach(d => {
            _this.TrajectoryTable.push(d)
          })
        }
        function runUn () {
          // _this.basicData = d.data
          _this.TrajectoryTable = d.data
        }
        switch (d.type) {
          case 'wx':
            runWX()
            break;
          case 'yx':
            runYX()
            break;
          default:
            runUn()
            break;
        }
      })
      // let end = _this.basicData.length >= 100 ? 100 : _this.basicData.length
    },
    // 递归 地址解析
    batchAddressTransform (rows, ind) {
      let _this = this;
      if (rows.length === ind) return;
      let row = rows[ind];
      let lng = row.lng;
      let lat = row.lat;
      let vehflag = this.$store.getters.hisZoom.info.filter(function (
        item,
        index
      ) {
        if (_this.curMap.getContainer().id.indexOf(item.vehicleid) !== -1) {
          return item;
        }
      });
      if (vehflag.length === 0) return;
      _this.$map.$methods.getPointAddress([lng, lat], function (data) {
        row.address = data;
        // _this.$indexedDB.updateData('vehHistory', row.id, row, function (
        // result
        // ) {});
        _this.batchAddressTransform(rows, ++ind);
      });
    },
    // 初始化播放界面
    initPlayView () {
      var _this = this;
      // 统计信息赋值
      _this.curhisD = 1;
      _this.totalHis = _this.routePointAryList.length;
      // 初始化进度slider
      // _this.sliderMaxVal = _this.routePointAryList.length;
      _this.sliderMaxVal = _this.basicData.length
      _this.sliderMinVal = 1;
      _this.sliderStepVal = 1;
      _this.sliderCurValue = 1;
      _this.$indexedDB.cursorDeldteData(
        'vehHistory',
        'vehicleidIndex',
        _this.vehicleid
      );
      // 播放按钮初始化
      $('i.icon-bofang')
        .removeClass('icon-zanting')
        .attr('title', '播放');
    },
    // 轨迹播放
    routePlay (e) {
      var _this = this;
      if (!$(e.target).hasClass('icon-zanting')) {
        if (_this.basicData.length === 0) {
          _this.$message({
            message: '未获取到相关历史数据！',
            type: 'error'
          });
          return;
        }
        $(e.target)
          .addClass('icon-zanting')
          .attr('title', '暂停');
        $('.hisTbale').animate({ height: '10vh' });
        $('.trajectoryFrame #trajectoryCase').animate({ height: '19vh' });
        if (_this.navgtr != null && _this.navgtr.getNaviStatus() === 'pause') {
          _this.navgtr.resume();
        } else {
          _this.routeToPlay(0);
        }
      } else {
        $(e.target)
          .removeClass('icon-zanting')
          .attr('title', '播放');
        $('.hisTbale').animate({ height: '27.5vh' });
        $('.trajectoryFrame #trajectoryCase').animate({ height: '36vh' });
        _this.navgtr.pause();
      }
    },
    // 历史轨迹播放
    routeToPlay (pathIndex) {
      var _this = this;
      // 初始化进度条
      // _this.sliderMaxVal = _this.INS[_this.masterIndex].Ins.getPathData(
      //   pathIndex
      // ).data.length;

      // 定位到初始点
      var p = _this.INS[_this.masterIndex].Ins.getPathData(pathIndex).data[0];
      _this.curMap.setZoomAndCenter(16, [p.lng, p.lat]);
      // 执行
      var startIndex = _this.sliderCurValue;
      var speed = _this.trackSpeedDefault * _this.arrSpeed[_this.speedIndex] / 2;
      if (speed === null || speed === undefined || speed === '') {
        speed = _this.trackSpeedDefault;
      }
      // 创建一个轨迹巡航器
      _this.navgtr = _this.INS[_this.masterIndex].Ins.createPathNavigator(pathIndex, {
        speed: speed,
        pathNavigatorStyle: {
          // width: 24,
          // height: 24,
          // content: "defaultPathNavigator"
          width: 15,
          height: 30,
          content: _this.INS[_this.masterIndex].navgtrMarkerContent
        }
      });
      $('div.hisTbale .el-table__body-wrapper').scrollTop(0);
      // 行驶事件
      _this._index = 0;
      _this.navgtr.on('move', function () {
        // 获取当前轨迹段
        var pathIndex = this.getPathIndex();
        // 获取当前轨迹段轨迹点
        var point = _this.INS[_this.masterIndex].Ins.getPathData(pathIndex).data[this.getCursor().idx];

        let bounds = _this.curMap.getBounds()
        bounds = [[bounds.southwest.lat, bounds.southwest.lng], [bounds.northeast.lat, bounds.northeast.lng]]
        if (point.lat < bounds[0][0] || point.lat > bounds[0][1] || point.lng < bounds[1][0] || point.lng < bounds[1][1]) {
          _this.curMap.setCenter([point.lng, point.lat])
        }
        // 设置进度
        _this.sliderCurValue = this.getCursor().idx;
        _this.curhisD = point.id + 1;
        _this.totalHis = _this.basicData.length;

        let tab = $('#histable > div.el-table__body-wrapper')
        let scrollX = tab[0].scrollLeft
        tab[0].scrollTo(
          scrollX,
          _this.curhisD * 43
        );

        // 销毁自身
        if (this.isCursorAtPathEnd()) {
          this.destroy();
          _this.navgtr = null;
          if (_this.totalHisPiecewiseRoute > pathIndex + 1) {
            _this.routeToPlay(pathIndex + 1);
          } else {
            _this.curhisD = 1
            _this.sliderCurValue = 1
            $('i.icon-zanting')
              .removeClass('icon-zanting')
              .attr('title', '播放');
            $('.hisTbale').animate({ height: '27.5vh' });
            $('#histable > div.el-table__body-wrapper')[0].scrollTo(0, 0);

            $('.trajectoryFrame #trajectoryCase').animate({ height: '36vh' });
          }
        }
      });
      _this.routePointAryListHis = _this.TrajectoryTable; // 存储 之前播放前的历史列表信息
      // 执行
      _this.navgtr.start(0);
    },
    // 速度变化事件
    carHistoryRoutePlaySpeed_change () {
      // var _this = this;
      // if (ty === 1) {
      //   _this.carHistoryRoutePlaySpeed = Math.max(
      //     1,
      //     _this.carHistoryRoutePlaySpeed / 2
      //   );
      // } else {
      //   _this.carHistoryRoutePlaySpeed = Math.min(
      //     32,
      //     _this.carHistoryRoutePlaySpeed * 2
      //   );
      // }
      // if (_this.navgtr != null && _this.navgtr.getNaviStatus() === 'moving') {
      //   _this.navgtr.setSpeed(
      //     _this.trackSpeedDefault * _this.carHistoryRoutePlaySpeed
      //   );
      // }
      this.speedIndex = this.speedIndex + 1 < this.arrSpeed.length ? this.speedIndex + 1 : 0
    },
    // 重新回放
    restartPlay () {
      var _this = this;
      if (!$('i.icon-bofang').hasClass('icon-zanting')) {
        $('i.icon-bofang')
          .addClass('icon-zanting')
          .attr('title', '暂停');
      }
      if (_this.navgtr != null) {
        _this.navgtr.destroy();
        _this.navgtr = null;
      }
      // 重新开始
      _this.routeToPlay(0);
    },
    // 上一段行程
    routePlayLast () {
      var startPathIndex = 0;
      var _this = this;
      if (!$('i.icon-bofang').hasClass('icon-zanting')) {
        $('i.icon-bofang')
          .addClass('icon-zanting')
          .attr('title', '暂停');
      }
      if (_this.navgtr != null) {
        if (_this.navgtr.getPathIndex() === 0) {
          _this.$message({
            message: '已经是第一段行程！',
            type: 'warning'
          });
        } else startPathIndex = _this.navgtr.getPathIndex() - 1;
        _this.navgtr.destroy();
        _this.navgtr = null;
      }
      if (startPathIndex >= 0) _this.routeToPlay(startPathIndex);
    },
    // 下一段行程
    routePlayNext () {
      var startPathIndex = 0;
      var _this = this;
      if (!$('i.icon-bofang').hasClass('icon-zanting')) {
        $('i.icon-bofang')
          .addClass('icon-zanting')
          .attr('title', '暂停');
      }
      if (_this.navgtr != null) {
        if (
          _this.navgtr.getPathIndex() >=
          _this.pathSimplifierIns._data.pathNum - 1
        ) {
          _this.$message({
            message: '已经是最后段行程！',
            type: 'warning'
          });
        } else startPathIndex = _this.navgtr.getPathIndex() + 1;
        _this.navgtr.destroy();
        _this.navgtr = null;
      }
      if (startPathIndex <= _this.pathSimplifierIns._data.pathNum - 1) {
        _this.routeToPlay(startPathIndex);
      }
    },

    // 初始化历史轨迹信息
    initHisINfo () {
      function _get (para) {
        return gethistorybyvehicleidandprodnum(para)
      }
      let _this = this;

      _this.scrollIndex = 1
      _this.basicData = []
      if (_this.time === null) {
        this.initHisTime();
      }
      let ts = [this.pronumset]
      switch (ts.length) {
        case 0:
          _this.formatTableData([{ num: 'null', arr: [] }])
          break;
        case 1:

          let para = {
            id: _this.vehicleid + ',' + ts[0],
            // id: _this.vehicleid + ',' + _this.pronumset[0],
            condition: _this.time.join('|')
          };
          _this.trajectLoading = true;
          _get(para)
            .then(function (res) {
              _this.trajectLoading = false;
              if (res.data.result.code === 0) {
                var row = res.data.data || [];
                if (res.data.data === null) {
                  _this.formatTableData([{ num: 'null', arr: [] }]);
                } else {
                  // _this.formatTableData([{num: _this.pronumset[0], arr: row}]);
                  _this.formatTableData([{ num: ts[0], arr: row }]);
                }
              }
            })
          ;
          break;
        default:
          let time = _this.time.join('|');
          let getArr = ts.map(d => {
            let para = {
              id: _this.vehicleid + ',' + d,
              condition: time
            };
            return _get({ ...para });
          });
          mergePost(getArr)
            .then(function (res) {
              _this.trajectLoading = false;
              function returnData (obj) {
                if (obj.data.result.code === 0) {
                  return obj.data.data || []
                } else {
                  return []
                }
              }
              // 处理多设备请求
              let arr = res.map((d, i) => {
                let obj = {}
                let data = returnData(d)
                if (data === []) {
                  obj.num = 'null'
                  obj.arr = []
                } else {
                  // obj.num = _this.pronumset[i]
                  obj.num = ts[i]
                  obj.arr = data
                }
                return obj
              })
              // 过滤无数据的设备
              let arr2 = arr.filter(d => {
                return d.num !== 'null'
              })
              // 都无数据的话使用默认数据
              if (arr2 === []) {
                _this.formatTableData([{ arr: [], num: 'null' }])
              } else {
                _this.formatTableData(arr)
              }
            })

          break;
      }
    },
    loadingTable () { },

    // 禁止输入日期
    prohibitInput () {
      //   $('.trajectoryFrame .el-input').addClass('is-disabled');
      //   $('.trajectoryFrame .el-input__inner').prop('disabled', 'disabled');
    }
  },
  created () {
    this.initHisTime().initVEhINfo();
  },
  destroyed () {
    let index = this.$hisMapArr.IndexOf('maphis' + this.vehicleid, d => Object.keys(d)[0])
    this.$hisMapArr.splice(index, 1)
  },
  mounted () {
    let _this = this
    $('.el-table__body-wrapper').on('scroll', function (event) {
      let Height = _this.TrajectoryTable.length * 43 // 当前table高度
      let cuHeight = this.scrollTop // 滚动高度
      let gapHeight = 43 * 15 // 间隔
      if (_this.scrollIndex * 100 > _this.basicData.length) {
        return null
      } else {
        if (cuHeight / 43 > (_this.scrollIndex - 1) * 100 && Height - cuHeight <= gapHeight) {
          _this.TrajectoryTable.push(..._this.basicData.slice(_this.scrollIndex * 100, (_this.scrollIndex + 1) * 100))
          _this.scrollIndex++
        }
      }
    })
  }
};
</script>

<style scoped>
section.trajectoryFrame {
  width: 100%;
  height: 100%;
}
i.pronumRplace:hover {
  color: #067816;
  cursor: pointer;
}
div.trajtitle {
  overflow: hidden;
}
div.trajtitle div.plateNumberBgk {
  border-radius: 5px;
  padding: 2px;
  max-width: 100px;
  overflow: hidden;
  float: left;
  text-overflow: ellipsis;
}
div.trajtitle div.trajtitler {
  width: 175px;
  line-height: 26px;
  float: right;
}

.iconfont.icon-speed > span {
  font-size: 14px;
}
#trajectoryTime
  > div
  > i.el-input__icon.el-range__close-icon.el-icon-circle-close {
  width: 0px;
  height: 0px;
}
</style>
