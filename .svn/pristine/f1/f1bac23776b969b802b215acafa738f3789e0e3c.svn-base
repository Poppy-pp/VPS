<!--*
* @description: 地图首页
* @author: wp
* @update: 2018-04-12
-->
<template>
  <section class="vpsLayer" @click="overallClick" v-if="goHome">
    <loading></loading>
    <!-- 地图 -->
    <div :is="mapComponent" :mapid="mapid" ref="rmap"></div>

    <!-- 左侧搜索框 -->
    <seachs @openTree="openTreeFn"></seachs>

    <!-- 左侧树状结构 -->
    <tool-box :treeStateProps="treeState">
      <tree slot="ls1" @handleCheck="openCarInfo"></tree>
      <ElectronicFence slot="ls2"></ElectronicFence>
      <followCar slot="ls3" @handleCheck="openCarInfo"></followCar>
      <FilterTree slot='ls4'></FilterTree>
    </tool-box>

    <!-- 右上方地址工具栏 -->
    <signTool></signTool>

    <!-- 右上方vps工具栏 -->
    <setTool ref="setTool" @mapThemeRefresh="mapThemeRefresh"></setTool>

    <!-- 监控列表 -->
    <transition name="bounce">
      <tabsBox ref="tabbox" :treeStateProps="treeState">
        <monitorList ref="monitorList" @handleCheck="openCarInfo" @createMarkerCar="createMarkerCar" slot="t0"></monitorList>
        <police ref="police" slot="t1"></police>
        <abnormal ref="abnormal" slot="t2"></abnormal>
      </tabsBox>
    </transition>

    <!--地图车辆弹框 -->
    <div :is="frameCompts" :frameProp="frameDatas"></div>

    <windbox v-for="(item,index) in hisWindowData" v-bind:key="index" class="hisbounce-enter-active" :title="item.name" :id="'his'+item.vehicleid">
      <!-- 历史轨迹 start-->
      <trajectoryFrame :vehicleid="item.vehicleid" v-if="item.isHidden && !item.windowType"></trajectoryFrame>
      <!-- 历史轨迹 end-->

      <!-- 图表详情 start-->
      <behavier v-else-if="item.isHidden && item.windowType === 'chart'" :cls="'his'+item.vehicleid"></behavier>
      <!-- 图表详情 end-->

      <!-- 图表详情 start-->
      <isPolice v-else-if="item.isHidden && item.windowType === 'isPolice'" :cls="'his'+item.vehicleid"></isPolice>
      <!-- 图表详情 end-->
    </windbox>

    <floatBox v-show="hisWindowData.length > 0"></floatBox>
    <div id="testVersion">
      <div class="left-top"></div>
      <div class="right-top"></div>
      <div class="let-bottom"></div>
      <div class="right-bottom"></div>
      <span id="testVersionTitle">version:</span>
      <span id="testVersionNum">3.0.7</span>
    </div>

    <audio id="isSA" v-if=" isSabnormal"  :muted="!isSabnormal" src="../../static/sounds/alarm0.wav" loop="0" autoplay="false" :hidden="false"></audio>
    <audio id="isSP" v-if=" isSpolice"  :muted="!isSpolice" src="../../static/sounds/alarm3.wav" loop="0" autoplay="false" :hidden="false"></audio>

    <!--end-->
    <!-- <el-radio-group class="tabMap" @change="tabMap" v-model="maptype" size="medium">
      <el-radio-button label="0" >高德</el-radio-button>
      <el-radio-button label="1">百度</el-radio-button>
    </el-radio-group> -->
  </section>
</template>

<script>
import { PM } from '@/plugin/permissionManage';
import windbox from '@/components/mapTool/windBox.vue'; // 窗口
import floatBox from '@/components/mapTool/floatBox.vue'; // 窗口

import toolBox from '@/components/mapTool/toolBox.vue'; // 左侧集合板块
import ElectronicFence from '@/components/mapTool/ElectronicFence.vue'; // 左侧电子围栏
import tree from '@/components/mapTool/tree.vue'; // 左侧树
import followCar from '@/components/mapTool/followCar.vue'; // 左侧关注信息
import FilterTree from '@/components/mapTool/FilterTree.vue';

import tabsBox from '@/components/table/tabsBox'; // 数据展示 模板框
import monitorList from '@/components/table/monitorList'; // 监控列表
import abnormal from '@/components/table/abnormal'; // 车辆异常
import police from '@/components/table/police'; // 车辆报警

import utils from '@/utils/tool.js'; // 车辆信息
import setTool from '@/components/mapTool/setTool'; // 右侧工具栏
// import trajectoryFrame from '@/components/mapTool/trajectoryFrame.vue'// 历史轨迹
// import amap from '@/components/Map/amap'; // 高德地图

import fortificationBox from '@/components/MessageBox/fortificationFrame.vue'; // 设防弹框
import enclosureBox from '@/components/MessageBox/enclosureFrame.vue'; // 电子围栏弹框
import instructionsBox from '@/components/MessageBox/instructionsFrame.vue'; // 指令弹框
import followFrameBox from '@/components/MessageBox/followFrame.vue'; // 关注弹框
import remarkFrameBox from '@/components/MessageBox/remarkFrame.vue'; // 添加备注弹框
import taskNoticeFrameBox from '@/components/MessageBox/taskNoticeFrame.vue';
import followInfoFrameBox from '@/components/MessageBox/followInfoFrame.vue'; // 添加备注弹框
import addCarFrameBox from '@/components/MessageBox/addCarFrame.vue'; // 电子围栏添加车辆弹框
import behavier from '@/components/Behavier/home/behavier.vue'; // 关注弹框
import isPolice from '@/components/table/carDetails/isPolice.vue'; // 历史报警信息

import sDLoading from '@/components/loading/c3DLoading.vue'; // 全局加载
import {
  getvehiclessimpleNew,
  getInstructions,
  getInstructionsDX,
  getCorpList,
  getalltags,
  policeType,
  vehiclesCount,
  getvehiclessimpleFile,
  getprodssimpleFile,
  getprodssimpleNew,
  // getpermissionsAll,
  // getpermissionsForUser,
  getPermissions,
  queryfollowdata
} from '@/Api/mapApi.js';
export default {
  components: {
    loading: sDLoading,
    seachs: resolve => {
      require(['@/components/mapTool/seach.vue'], resolve);
    }, // 搜索框组件
    toolBox,
    windbox,
    floatBox,
    trajectoryFrame: resolve => {
      require(['@/components/mapTool/trajectoryFrame.vue'], resolve);
    },
    signTool: resolve => {
      require(['@/components/mapTool/signTool'], resolve);
    }, // 右上角工具栏
    setTool,
    ElectronicFence,
    FilterTree,
    tree,
    tabsBox,
    monitorList,
    abnormal,
    police,
    fortificationBox,
    enclosureBox,
    instructionsBox,
    followFrameBox,
    remarkFrameBox,
    followInfoFrameBox,
    addCarFrameBox,
    behavier,
    followCar,
    isPolice,
    taskNoticeFrameBox,
    amap: resolve => {
      require(['@/components/Map/amap'], resolve);
    }
    // bmap: resolve => {
    //   require(['@/components/Map/bmap'], resolve)
    // },
  },
  computed: {
    isSabnormal () {
      return this.$store.getters.setting.police.soundsOn && this.$store.getters.sounds.abnormal;
    },
    isSpolice () {
      return this.$store.getters.setting.police.soundsOn && this.$store.getters.sounds.police;
    },
    // 初始化地图类型
    maptype () {
      return this.$store.getters.MAPTYPE;
    },
    // 地图类型
    mapComponent () {
      return +this.maptype === 0 ? 'amap' : 'bmap'; // amap为高德地图，bmap为百度地图
    },
    // 历史窗体列表
    hisWindowData () {
      return this.$store.getters.hisZoom.info;
    },
    // 弹框类型
    frameCompts (data) {
      let _this = this;
      let frameBoxObj = _this.$store.getters.frameBoxAll;
      for (let obj in frameBoxObj) {
        if (frameBoxObj[obj]) {
          switch (obj) {
            // 设防弹框打开，赋予相应的值
            case 'fortificationBox': {
              // 未设防跳出
              // 获取基础数据
              let moveCarInfo = _this.$store.getters.moveCarInfo;
              let vhid;
              if (moveCarInfo.vehicleid !== '') {
                vhid = moveCarInfo.vehicleid;
              } else {
                vhid = _this.$store.getters.selectVhID;
              }
              let mapObj = _this.$store.getters.mapObj;
              // 获取基本信息

              if (_this.fortificationBox.vehicleid === vhid) {
                // break
              }
              _this.fortificationBox = {
                boxTit: '', // tit
                carno: '', // 车牌号
                carOwner: '', // 车主
                lg: '', // 设防经度
                lt: '', // 设防纬度
                place: '', // 位置
                sfplace: '', // 设防距离
                distance: 100, // 距离 默认0
                showDelSf: false,
                ID: ''
              };
              _this.fortificationBox.vehicleid = vhid;
              _this.$indexedDB.getDataById('vehicleDetail', vhid, function (
                result
              ) {
                let res = result.data;
                if (res) {
                  _this.fortificationBox.boxTit = '原地设防';
                  _this.fortificationBox.carno = res.basicdata.carno;
                  _this.fortificationBox.carOwner = res.basicdata.ownername;
                  // 当前位置解析
                  mapObj.plugin(['AMap.Geocoder'], function () {
                    let MGeocoder = new AMap.Geocoder({
                      radius: 1000,
                      extensions: 'base'
                    });
                    // 地理编码数据
                    AMap.event.addListener(MGeocoder, 'complete', function (
                      data
                    ) {
                      if (data.info === 'OK') {
                        _this.fortificationBox.place =
                          data.regeocode.formattedAddress;

                        // _this.frameDatas = {..._this.fortificationBox};
                        // _this.fortificationBox = {}
                        // _this.fortificationBox.place =
                        // data.regeocode.formattedAddress;
                      }
                    });
                    let [lng, lat] = utils.transformWGStoGCJ(
                      res.realdata.lng,
                      res.realdata.lat
                    );
                    MGeocoder.getAddress([lng, lat]);
                  });
                }
              });
              let marker =
                _this.$store.getters.dictYDSFMarker[
                  _this.$store.getters.selectVhID
                ];
              _this.fortificationBox.showDelSf = false;
              if (marker) {
                _this.fortificationBox.showDelSf = true;
                Object.assign(_this.fortificationBox, {
                  ...marker.getExtData()
                });
                _this.$store.dispatch(
                  'zoomYdsf',
                  _this.fortificationBox.vehicleid
                );
              } else {
                // 获取原地设防初始数据
                let carInfo = _this.$store.getters.moveCarInfo;
                // getYdsfInfo({
                //   id: carInfo.vehicleid,
                //   userid: _this.$store.getters.user.userid
                // })
                _this.$request.vehicle
                  .getYDSF(carInfo.vehicleid)
                  .then(function (response) {
                    let info = response.data;
                    if (info.data == null) {
                      return;
                    }

                    if (info.result.code === 0) {
                      // 属性
                      _this.fortificationBox.lg = +info.data.LngLat.split(
                        ','
                      )[0];
                      _this.fortificationBox.lt = +info.data.LngLat.split(
                        ','
                      )[1];
                      _this.fortificationBox.showDelSf = true;
                      _this.fortificationBox.distance = info.data.Radius;
                      _this.fortificationBox.vehicleid = info.data.VehicleId; // ID;
                      _this.fortificationBox.ID = info.data.ID
                      _this.fortificationBox.CreateDate = new Date(
                        info.data.CreateDate
                      ).toLocaleDateString();
                      _this.$refs.rmap.createFortificationMarker(
                        _this.fortificationBox
                      );
                      mapObj.plugin(['AMap.Geocoder'], function () {
                        let MGeocoder = new AMap.Geocoder({
                          radius: 1000,
                          extensions: 'base'
                        });
                        // 地理编码数据
                        AMap.event.addListener(MGeocoder, 'complete', function (
                          data
                        ) {
                          if (data.info === 'OK') {
                            _this.fortificationBox.sfplace =
                              data.regeocode.formattedAddress;
                            // _this.frameDatas = {..._this.fortificationBox};

                            // _this.fortificationBox = {}
                            // _this.fortificationBox.place =
                            // data.regeocode.formattedAddress;
                          }
                        });
                        let [lng, lat] = utils.transformWGStoGCJ(
                          _this.fortificationBox.lg,
                          _this.fortificationBox.lt
                        );
                        MGeocoder.getAddress([lng, lat]);
                      });

                      // _this.$store.di.setMap(mapObj);
                      _this.$store.dispatch(
                        'zoomYdsf',
                        _this.fortificationBox.vehicleid
                      );
                    }
                  })
                  .catch(function (error) {
                    if (error) {
                    }
                  });
              }
              _this.frameDatas = _this.fortificationBox;
              // _this.fortificationBox = {}
              break;
            }
            // 电子围栏弹框打开，赋予相应的值
            case 'enclosureBox': {
              _this.frameDatas = _this.arrEnclosure;
              break;
            }
            // 指令弹框打开，赋予相应的值
            case 'instructionsBox': {
              let ydsfInfo = _this.$store.getters.moveCarInfo; // 获取状态树 原地设防数据
              _this.$indexedDB.getDataById(
                'vehicleDetail',
                ydsfInfo.vehicleid,
                function (result) {
                  let res = result.data;
                  if (res) {
                    let basicdata = res.basicdata;

                    let proddata = res.proddata;
                    let resultObj = {};
                    resultObj.proddata = res.proddata;
                    resultObj.proddataIndex = 0; // 默认获取第一个设备的所有指令
                    // _this.$store.commit('instructionsCode',resultObj);
                    /* 获取指令基本信息 */
                    _this.instructionsBox.boxTit = '指令';
                    _this.instructionsBox.plateNumber = basicdata.carno;
                    _this.instructionsBox.carOwner = basicdata.ownername;
                    _this.instructionsBox.phoneCheck = proddata[0].prodnum;
                    _this.instructionsBox.numberArr = proddata;
                    _this.instructionsBox.instructionResult = '';
                    /* end */
                    _this.instructionsBox.instructionsArr = []
                    // let
                    proddata.forEach((d, i) => {
                      if (d.prodspec === '有线') {
                        let parms = {};
                        parms.id = proddata[i].prodnum;
                        getInstructions(parms)
                          .then(function (response) {
                            let info = response.data;
                            if (info.result.code === 0) {
                              let old = _this.instructionsBox.instructionsArr
                              old[i] = info.data
                              _this.instructionsBox.instructionsArr = [...old];
                            }
                          })
                          .catch(function (error) {
                            if (error) {
                            }
                          })
                      } else {
                        let parms1 = {};
                        parms1.id = proddata[i].prodnum;
                        getInstructionsDX(parms1)
                          .then(function (response) {
                            let info = response.data;
                            if (info.result.code === 0) {
                              // _this.instructionsBox.instructionsArr[i] = info.data;
                              let old = _this.instructionsBox.instructionsArr
                              old[i] = info.data
                              _this.instructionsBox.instructionsArr = [...old];
                            }
                          })
                          .catch(function (error) {
                            if (error) {
                            }
                          })
                      }
                    })
                    // let parms = {};
                    // parms.id = proddata[0].prodnum;
                    // getInstructions(parms)
                    //   .then(function (response) {
                    //     let info = response.data;
                    //     if (info.result.code === 0) {
                    //       _this.instructionsBox.instructionsArr = info.data;
                    //     }
                    //   })
                    //   .catch(function (error) {
                    //     if (error) {
                    //     }
                    // });
                  } else {
                    /* 访问真是后台数据 */
                  }
                }
              );
              _this.frameDatas = _this.instructionsBox;
              break;
            }
            case 'remarkFrameBox': {
              _this.remarkBox.boxTit = '备注信息';
              _this.frameDatas = _this.remarkBox;
              break;
            }
            case 'taskNoticeFrameBox': {
              _this.taskNoticeBox.boxTit = '关于';
              _this.frameDatas = _this.taskNoticeBox;
              break;
            }
            case 'followInfoFrameBox': {
              _this.followInfoBox.boxTit = '关注车辆信息';
              _this.followInfoBox.guanzhuInfo = {};
              let carinfo = _this.$store.getters.selectVhID.split('@');
              _this.$request.follow
                .getInfo(carinfo)
                .then(response => {
                  if (response.data.result.code === 0) {
                    let data = response.data.data;
                    _this.followInfoBox.guanzhuInfo = data;
                    _this.$store.dispatch(
                      'bindRightBtnObj',
                      _this.followInfoBox
                    );
                  }
                })
                .catch(error => {
                  if (error) {
                  }
                });
              // _this.frameDatas = _this.followInfoBox
              _this.$store.dispatch('bindRightBtnObj', _this.followInfoBox);
              break;
            }
            case 'addCarFrameBox': {
              _this.addCarToFence.boxTit = '电子围栏车辆设置';
              _this.frameDatas = _this.addCarToFence;
              break;
            }
            // 关注弹框打开，赋予相应的值
            case 'followFrameBox': {
              // let carInfo= _this.$store.getters.moveCarInfo;
              let carInfo = { vehicleid: _this.$store.getters.selectVhID };
              // 获取状态树 原地设防数据
              /* 获取所有关注类型赋值 */

              _this.followBox.boxTit = '关注车辆信息';
              _this.followBox.guanzhuInfo = '';
              // getFollow({ id: _this.$store.getters.user.userid })
              _this.$request.follow
                .getList()
                .then(function (response) {
                  let info = response.data;
                  if (info.result.code === 0) {
                    // var allfollowType = info.data;
                    var allfollowType = info.data.filter(d => {
                      return _this.$PM.module.follow.v.value.includes(d.id);
                    });

                    // 过滤
                    ['350', '351', '352'].forEach(d => {
                      let index = allfollowType.IndexOf(d, d => d.id);
                      if (index !== -1) {
                        allfollowType.splice(index, 1);
                      }
                    });

                    /* 访问已经关注的类型 */
                    // getAlreadyFollow({
                    //   userid: _this.$store.getters.user.userid,
                    //   id: carInfo.vehicleid
                    // })
                    _this.$request.vehicle
                      .getFollowList({
                        userid: _this.$store.getters.user.userid,
                        id: carInfo.vehicleid
                      })
                      .then(function (response) {
                        let infos = response.data;
                        if (infos.result.code === 0) {
                          let followType = infos.data;
                          // XXX:隐藏bug: 返回空数据
                          followType = followType || [];
                          if (followType.length > 0) {
                            for (const index in followType) {
                              if (followType.hasOwnProperty(index)) {
                                const cell = followType[index];
                                let id = +cell.pid;
                                let _index = allfollowType.IndexOf(
                                  id,
                                  d => +d.id
                                );
                                if (_index !== -1) {
                                  allfollowType.splice(_index, 1);
                                }
                              }
                            }
                            _this.followBox.guanzhuTypeArr = allfollowType;
                          } else {
                            // _this.followBox.guanzhuTypeArr=info.data;
                            _this.followBox.guanzhuTypeArr = allfollowType;
                            // _this.followBox.guanzhuTypeArr = info.data;
                          }
                        }
                      })
                      .catch(function (error) {
                        if (error) {
                          console.log('进入catch');
                        }
                      });
                    /* end */
                  } else {
                    // _this.followBox.guanzhuTypeArr = allfollowType;
                    _this.followBox.guanzhuTypeArr = info.data;
                  }
                })
                .catch(function (error) {
                  if (error) {
                  }
                });
              /* end */
              _this.frameDatas = _this.followBox;
              break;
            }
          }
          return obj;
        }
      }
    },
    // 代替滚动显示隐藏
    ThumbnailReplace () {
      return this.$store.getters.ThumbnailArrReplace;
    },
    // 代替滚动动画Class
    addtransitionRight02 () {
      return this.$store.getters.addtransitionRight02;
    }
  },
  data () {
    return {
      notifyTime: [5000, 5000],
      test: 0,
      user: null,
      pageSize: 0,
      goHome: false, // 当indexedDb初始化完成在渲染页面
      mapid: 'mapContainer',
      treeState: 0, // 树展开 1 树收缩 0
      /* 弹框传值 */
      frameDatas: '',
      /* 原地设防弹框传值 */
      fortificationBox: {
        boxTit: '', // tit
        carno: '', // 车牌号
        carOwner: '', // 车主
        lg: '', // 设防经度
        lt: '', // 设防纬度
        place: '', // 位置
        sfplace: '', // 设防距离
        distance: 100, // 距离 默认0
        showDelSf: false
      },
      /* end */
      /* 电子围栏弹框传值 */
      arrEnclosure: [
        {
          name: '锦江区围栏',
          checked: false,
          value: 2
        }
      ],
      /* 指令弹框传值 */
      instructionsBox: {
        boxTit: '', // tit
        plateNumber: '', // 车牌号
        carOwner: '', // 车主
        phoneCheck: '', // 默认选择的设备获取第一个
        instructionResult: '', // 筛选后的指令
        numberArr: [
          // 设备号数组
        ],
        instructionsArr: [
          // 指令选择数据
        ]
      },
      /* end */
      /* 关注弹框传值 */
      followBox: {
        boxTit: '关注车辆信息', // tit
        // 关注类型单选框值
        guanzhuTypeArr: [],
        guanzhuInfo: '' // 关注信息
        // whetherShare: '1'                        //是否分享
      },
      taskNoticeBox: {
        boxTit: '关于'
      },
      remarkBox: {
        boxTit: '备注信息'
      },
      followInfoBox: {
        boxTit: '关注信息'
      },
      addCarToFence: {
        boxTit: '备注信息'
      },
      /* end */
      ThumbnailArr: false, // 历史轨迹缩略图集合
      addtransitionRight: false, // 缩小圆圈向右过渡class
      currentIndex: '', // 打开缩小弹框的index
      vehList: [],
      prodList: {},
      versionDB: '1.0.4',
      timerPoliceS: null,
      timerAbnormalS: null
    };
  },
  watch: {
  },

  methods: {
    // 全局点击事件
    overallClick () {},
    // 地图主题样式刷新
    mapThemeRefresh (enName) {
      var element = document.body;

      var className = '';
      if (enName === 'a68e4ef956562f5634b461b6e0e4a408') {
        className = 'default';
      } else {
        className = enName;
      }
      if (!element || !className) {
        return;
      }
      // 如果是卫星图 单独处理
      if (enName === 'satellite') {
        this.$store.commit('UPDATE_THEME', 'satellite');
      } else {
        element.className = 'vps-custom-' + className;
        this.$store.commit('UPDATE_THEME', className);
      }
      this.$refs.rmap.mapThemeRefresh(enName);
    },
    // 切换地图类型
    tabMap (t) {
      if (t === this.$store.getters.MAPTYPE) return;
      this.$store.commit('UPDATE_MAPTYPE', t);
      if (+t === 0) this.mapComponent = 'amap';
      else this.mapComponent = 'bmap';
    },
    // 展开树信息
    openTreeFn (state) {
      this.treeState = state;
    },
    // 展开车辆监控列表信息
    openCarInfo ({ data, ischeck, cischeck, type }) {
      let monitorData = this.$store.getters.monitorData;
      function isAddOrDelect () {
        let bool;
        switch (type) {
          case 'monitor':
            bool = false;
            break;
          default:
            bool =
              monitorData.IndexOf(
                '' + data.vehicleid,
                d => d.basicdata.vehicleid
              ) === -1;
        }
        return bool;
      }
      // 添加监控
      function runAddMonitore () {
        getVehDetail();
        _this.$mqtt.subscribeOneCar(data.vehicleid);
      }
      // 删除监控
      function runDeleteMonitore () {
        _this.$store.commit('listOrDeails', { states: false, index: 0 });
        /* 关闭车辆信息弹框 */
        utils.closeBoxCom(_this.$store.getters);
        /** 取消订阅单个车 start**/
        _this.$mqtt.unsubscribeOneCar(data.vehicleid);

        _this.$map.clearInfoWindow();

        // 删除设备
        for (var i = 0, len = monitorData.length; i < len; i++) {
          if (monitorData[i].basicdata.vehicleid === data.vehicleid + '') {
            monitorData[i].proddata &&
              monitorData[i].proddata.forEach(dev => {
                _this.$tree &&
                  _this.$tree.remove('d' + dev.prodnum + data.vehicleid);
                _this.$searchVehtree &&
                  _this.$searchVehtree.remove(
                    'd' + dev.prodnum + data.vehicleid
                  );
              });

            _this.$store.dispatch('deleteMonitorData', {
              data: monitorData[i],
              VueObj: _this
            });
            _this.$store.dispatch('delete_carMaker', {
              carId: data.vehicleid,
              _this: _this,
              index: i
            });
            break;
          }
        }

        let objVehicleState =
          _this.$store.getters.treeState.follow.objVehicleState;
        if (objVehicleState[data.vehicleid]) {
          objVehicleState[data.vehicleid].forEach(key => {
            _this.$store.dispatch('removeStateTree', {
              tag: 'follow',
              key: 'check',
              value: key
            });
          });
          _this.$store.dispatch('updateVehicleStateTree', {
            vehicleid: data.vehicleid,
            isClear: 1
          });
        }
        _this.$store.dispatch('removeStateTree', {
          tag: 'follow',
          key: 'expand',
          value: data.followKey
        });
      }
      // 获取车辆详情
      async function getVehDetail () {
        // 地图上创建Car
        function _markCar (vdata) {
          _this.createMarkerCar(vdata);
        }
        // tree添加设备节点
        function _addDevicesNodeForTree (vdata) {
          // tree添加车辆设备 信息
          vdata.proddata.forEach(function (item, index) {
            item.label = item.prodnum;
            item.str =
              item.prodspec + '/' + item.prodmodel + '/' + item.prodnum;
            item.leaf = true;
            item.disabled = true;
            item.type = 1;
            item.cid = 'd' + item.prodnum + '' + data.vehicleid;
            if (_this.$searchVehtree) {
              if (
                _this.$searchVehtree.getNode(data.cid) &&
                !_this.$searchVehtree.getNode(item.cid)
              ) { _this.$searchVehtree.insertAfter(item, data.cid); }
            }
            if (_this.$tree) {
              if (
                _this.$tree.getNode(data.cid) &&
                !_this.$tree.getNode(item.cid)
              ) { _this.$tree.insertAfter(item, data.cid); }
            }
            if (
              _this.$followTree &&
              _this.$followTree.getNode(data.cid) &&
              !_this.$followTree.getNode(item.cid)
            ) {
              console.debug('1111', vdata)
              _this.$followTree.insertAfter(item, data.cid);
            }
          });
        }

        let {
          dataDetails,
          isUpDB
        } = await _this.$request.packageDB.vehicleDetailNow(data);
        // isUpDB = true
        if (!isUpDB) {
          if (!dataDetails) {
            _this.$message.warning('车辆数据获取失败');
          }
          console.error('请检查接口');
        } else {
          // 更新车辆信息
          _this.$store.dispatch('initMonitorData', {
            data: dataDetails,
            Vue: _this
          });
          let vdata = _this.$store.getters.monitorData.filter(d => {
            // if(d.proddata.length)
            d.proddata.forEach(p => {
              p.vehicleid = d.vehicleid;
            });
            return d.vehicleid === dataDetails.basicdata.vehicleid;
          })[0];
          _markCar.call(_this, vdata);
          _addDevicesNodeForTree.call(_this, vdata);

          // _this.$Veh.updateVehicledetail(
          //   { data: dataDetails,
          //     resolves: function (vdata) {
          //       if (!vdata.realdata) {
          //         _this.$store.dispatch('addMonitorData', { data: vdata })
          //         return
          //       }
          // _markCar.call(_this, vdata)
          // _addDevicesNodeForTree.call(_this, vdata)
          //       let [lng, lat] = utils.transformWGStoGCJ(vdata.realdata.lng, vdata.realdata.lat)
          //       vdata.realdata.lng = lng
          //       vdata.realdata.lat = lat
          //       _this.$store.dispatch('addMonitorData', { data: vdata })
          //     }
          //   }
          // )
        }
      }
      let _this = this;
      this.$refs.tabbox.carsInfosHeight = ''; // 展开表格详情
      // 勾选or取消勾选 都返回 设备页面
      this.$store.commit('listOrDeails', {
        states: false,
        index: 0
      });
      if (isAddOrDelect()) {
        runAddMonitore();
      } else {
        runDeleteMonitore();
        this.$store.commit('delete_ydsfMarker');
        this.$store.dispatch('initMoveCarInfo');
      }
    },
    // 创建地图车辆点
    createMarkerCar (vdata) {
      this.$refs.rmap.createMarkerCar(vdata);
    },
    // 报警类型初始化
    initPolice () {
      /* 先获取报警类型 */
      policeType().then(function (response) {
        let results = response.data;
        if (results.result.code === 0) {
          sessionStorage.setItem(
            'policeTypeCode',
            JSON.stringify(results.data)
          );
        }
      });
      /** 车辆报警列表信息订阅 start**/
      this.$mqtt.subscribePoliceInfo(this.$store.getters.user.userid);
      /** end**/
    },

    createdComp (cb) {
      let params = { id: this.$store.getters.user.userid };
      let _self = this;
      getCorpList(params).then(function (response) {
        let results = response.data;
        if (results.data == null) {
          _self.$message({
            message: '数据库异常',
            type: 'error',
            center: true
          });
          cb(results.data);
          return;
        }
        if (results.result.code === 0 && results.data.length > 0) {
          cb(results.data);
        }
      });
    },
    _writeIndexedDB (list) {
      let _this = this;
      return new Promise(resolve => {
        let iij = 0;
        for (let start = 0; start < list.length; start++) {
          let item = { ...list[start] };
          item.vehicleid += '';
          item.isCar = true;
          item.cid = 'v' + item.vehicleid;
          item.label = item.name || '';
          if (item.label.length < 5) {
            item.label = item.vin;
          }
          if (item.ownername) item.label += '/' + item.ownername;
          item.mohu =
            item.ownername + '/' + item.licenseplatenum + '/' + item.vin;
          item.corpid = item.corporateid;
          item.leaf = true;
          item.treeKey = utils.customGenerateUUID('tree');
          item.AddCarKey = utils.customGenerateUUID('addCar');
          item.prod = JSON.stringify(_this.prodList[item.vehicleid]) || '[]';
          // if (item.prod === undefined || item.prod === 'undefined') {
          // console.log('1111111', item.vehicleid)
          // }
          item.index = start;
          _this.$indexedDB.putData('cveh' + item.corpid, item, function (res) {
            iij++;
            _this.ind++;

            if (iij === list.length - 1) {
              resolve(1);
            } else {
              let pval = Math.min(
                100,
                Math.max(
                  5,
                  Math.round((_this.ind / _this.vehList.length) * 100)
                )
              );
              if (pval !== _this.oldPval) {
                _this.$store.commit('update_curLoading', {
                  hidden: true,
                  pval,
                  text: '车辆数据写入...'
                });
                _this.oldPval = pval;
              }
            }
          });
        }
        // for (let start = 0; start < list.length; start++) {
        //   let item = {...list[start]}
        //   item.vehicleid += 'a'
        //   item.isCar = true
        //   item.cid = 'v1' + item.vehicleid
        //   item.label = item.name || ''
        //   if (item.ownername) item.label += ('/' + item.ownername)
        //   item.corpid = item.corporateid
        //   item.leaf = true
        //   item.treeKey = utils.customGenerateUUID('tree')
        //   item.AddCarKey = utils.customGenerateUUID('addCar')
        //   _this.$indexedDB.putData('cveh' + item.corpid, item, function (res) {
        //     iij++
        //     _this.ind++

        //     if (iij === list.length * 4 - 1) {
        //       resolve(1)
        //     } else {
        //       let pval = Math.min(100, Math.max(5, Math.round((_this.ind) / 4 / _this.vehList.length * 100)))
        //       if (pval !== _this.oldPval) {
        //         _this.$store.commit('update_curLoading', {
        //           hidden: true,
        //           pval,
        //           text: '车辆数据写入...'
        //         })
        //         _this.oldPval = pval
        //       }
        //     }
        //   })
        // }
        // for (let start = 0; start < list.length; start++) {
        //   let item = {...list[start]}
        //   item.vehicleid += 'b'
        //   item.isCar = true
        //   item.cid = 'v2' + item.vehicleid
        //   item.label = item.name || ''
        //   if (item.ownername) item.label += ('/' + item.ownername)
        //   item.corpid = item.corporateid
        //   item.leaf = true
        //   item.treeKey = utils.customGenerateUUID('tree')
        //   item.AddCarKey = utils.customGenerateUUID('addCar')
        //   _this.$indexedDB.putData('cveh' + item.corpid, item, function (res) {
        //     iij++
        //     _this.ind++

        //     if (iij === list.length * 4 - 1) {
        //       resolve(1)
        //     } else {
        //       let pval = Math.min(100, Math.max(5, Math.round((_this.ind) / 4 / _this.vehList.length * 100)))
        //       if (pval !== _this.oldPval) {
        //         _this.$store.commit('update_curLoading', {
        //           hidden: true,
        //           pval,
        //           text: '车辆数据写入...'
        //         })
        //         _this.oldPval = pval
        //       }
        //     }
        //   })
        // }
        // for (let start = 0; start < list.length; start++) {
        //   let item = {...list[start]}
        //   item.vehicleid += 'c'
        //   item.isCar = true
        //   item.cid = 'v3' + item.vehicleid
        //   item.label = item.name || ''
        //   if (item.ownername) item.label += ('/' + item.ownername)
        //   item.corpid = item.corporateid
        //   item.leaf = true
        //   item.treeKey = utils.customGenerateUUID('tree')
        //   item.AddCarKey = utils.customGenerateUUID('addCar')

        //   _this.$indexedDB.putData('cveh' + item.corpid, item, function (res) {
        //     iij++
        //     _this.ind++

        //     if (iij === list.length * 4 - 1) {
        //       resolve(1)
        //     } else {
        //       let pval = Math.min(100, Math.max(5, Math.round((_this.ind) / 4 / _this.vehList.length * 100)))
        //       if (pval !== _this.oldPval) {
        //         _this.$store.commit('update_curLoading', {
        //           hidden: true,
        //           pval,
        //           text: '车辆数据写入...'
        //         })
        //         _this.oldPval = pval
        //       }
        //     }
        //   })
        // }
      });
    },

    // 更新前端车辆数据库
    updateDbVehData (user) {
      let _this = this;
      this.ind = 0;
      this.oldPval = undefined;
      // 校验DB
      function checkoutDB () {
        return new Promise(resolve => {
          let isUpdate =
            localStorage.getItem('isupdate') === null
              ? 0
              : JSON.parse(localStorage.getItem('isupdate'));
          if (!isUpdate) {
            _this.$indexedDB.getDataAll('vehicleTotal', function (res) {
              if (res.data.length > 0) {
                let list = res.data;
                let data = list.pop();
                if (data.version === _this.versionDB) {
                  resolve(1);
                } else {
                  resolve(0);
                }
              } else {
                resolve(0);
              }
            });
          } else {
            resolve(0);
          }
        });
      }
      function writeVehicle () {
        // 获取数量
        function _getCount (call) {
          vehiclesCount({ userid: user.userid }).then(call);
        }

        // 获取json
        function _getVehicleJson (call, error, url) {
          let params = url || '/BasicDataUpdate/' + user.userid + '.json';
          getvehiclessimpleNew(params)
            .then(call)
            .catch(error);
        }
        // 请求json文件
        function _getVehicleFile (call, num) {
          let params = {
            userid: user.userid,
            pagesize: num,
            index: 0
          };
          getvehiclessimpleFile(params).then(call);
        }

        return new Promise(resolve => {
          function _getVehicleList (num) {
            if (JSON.parse(localStorage.getItem('isupdate'))) {
              _getVehicleFile(function (res) {
                if (res.data.result.code === 0) {
                  localStorage.setItem('isupdate', 0);
                  _getVehicleList(num);
                }
              }, num);
            } else {
              _getVehicleJson(
                function (res) {
                  if (res.data) {
                    if (res.data && res.data.length > 0) {
                      _this.vehList = res.data;
                      if (_this.vehList === null) {
                        _getVehicleFile(function (res) {}, num);
                        return;
                      }
                      _this.$store.commit('update_curLoading', {
                        hidden: true,
                        text: '车辆数据写入...',
                        pval: 5
                      });
                      resolve(1);
                    }
                  } else {
                    _getVehicleFile(function (res) {
                      if (res.data.result.code === 0) {
                        _getVehicleList(num);
                      }
                    }, num);
                  }
                },
                function (error) {
                  if (error) {
                    _getVehicleFile(function (res) {
                      if (res.data.result.code === 0) {
                        _getVehicleList(num);
                      }
                    }, num);
                  }
                }
              );
            }
          }
          _getCount(function (res) {
            if (res.data.result.code === 0) {
              let num = res.data.data;
              // ***call, error, url
              _getVehicleList(num);
            }
          });
        });
      }
      function writeProd () {
        // // 获取数量
        // function _getCount (call) {
        //   vehiclesCount({userid: user.userid})
        //     .then(call)
        // }

        // 获取json
        function _getProdJson (call, error, url) {
          // 10809_prods
          let params = url || '/BasicDataUpdate/' + user.userid + '_prods.json';
          getprodssimpleNew(params)
            .then(call)
            .catch(error);
        }
        // 请求json文件
        function _getProdFile (call, num) {
          let params = {
            userid: user.userid,
            pagesize: num,
            index: 0
          };
          getprodssimpleFile(params).then(call);
        }

        return new Promise(resolve => {
          function _getProdList (num) {
            if (JSON.parse(localStorage.getItem('isupdate2'))) {
              _getProdFile(function (res) {
                if (res.data.result.code === 0) {
                  localStorage.setItem('isupdate2', 0);
                  _getProdList(num);
                }
              }, num);
            } else {
              _getProdJson(
                function (res) {
                  if (res.data) {
                    if (res.data && res.data.length > 0) {
                      res.data.forEach((prod, index) => {
                        let vehid = '' + prod.vehicleid;
                        let isProd = _this.prodList[vehid];
                        if (isProd) {
                          _this.prodList[vehid].push(prod);
                        } else {
                          _this.prodList[vehid] = [prod];
                        }
                        if (index === res.data.length - 1) {
                          _this.$store.commit('update_curLoading', {
                            hidden: false
                          });
                          resolve(1);
                        }
                      });
                      // if (_this.prodList === null) {
                      // }
                    } else {
                      _getProdFile(function (res) {}, num);
                    }
                  } else {
                    _getProdFile(function (res) {
                      if (res.data.result.code === 0) {
                        _getProdList(num);
                      }
                    }, num);
                  }
                },
                function (error) {
                  if (error) {
                    _getProdFile(function (res) {
                      if (res.data.result.code === 0) {
                        _getProdList(num);
                      }
                    }, num);
                  }
                }
              );
            }
          }
          _getProdList(100000);
        });
      }
      async function run () {
        let ischeckoutDB = await checkoutDB();
        if (!ischeckoutDB) {
          await writeVehicle();
          await writeProd();
          // 开方循环
          let forLength = Math.ceil(Math.sqrt(_this.vehList.length));
          for (let i = 0; i < forLength; i++) {
            let start = i * forLength;
            let end = i * forLength + forLength;
            var arrSub;
            if (end >= _this.vehList.length) {
              arrSub = _this.vehList.slice(start);
              await _this._writeIndexedDB(arrSub, forLength);
              setTimeout(() => {
                _this.$indexedDB.addData(
                  'vehicleTotal',
                  { version: _this.versionDB, vehlen: _this.vehList.length },
                  function (res) {}
                );
                _this.initPolice();
                _this.$store.commit('update_curLoading', {
                  hidden: false,
                  pval: 0
                });
              }, 1000);
            } else {
              arrSub = _this.vehList.slice(start, end);
              await _this._writeIndexedDB(arrSub, forLength);
            }
          }
          // // 正常循环
          // await _this._writeIndexedDB(_this.vehList, _this.vehList.length)
          // setTimeout(() => {
          //   _this.$store.commit('update_curLoading', {
          //     hidden: false,
          //     pval: 0
          //   })
          // }, 1000);
        } else {
          _this.initPolice();
        }
      }
      run();
      return;
      let params = {
        userid: user.userid,
        pagesize: 10000,
        index: this.pageSize
      };

      let _self = this;

      // 初始化tag数据
      _self.$indexedDB.getDataAll('tag', function (res) {
        let ind = 0;
        if (res.data.length > 0) return;
        getalltags().then(function (res) {
          let taglist = res.data.data;
          if (taglist == null) return;
          _self.$store.commit('update_curLoading', {
            hidden: true,
            pval: 7,
            text: '标签数据写入···'
          });
          taglist.forEach(function (item, index) {
            item.disabled = true;
            item.cid = 't' + item.id; // 添加标签唯一标识
            item.tagid = item.idpath.split('|')[
              item.idpath.split('|').length - 1
            ];
            item.label = item.tagnamepath.split('|')[
              item.tagnamepath.split('|').length - 1
            ]; // 显示label
            _self.$indexedDB.putData('tag', item, function (res) {});
            ind++;
            if (ind + 1 == taglist.length) {
              _self.$store.commit('update_curLoading', {
                hidden: true,
                pval: 10,
                text: '车辆数据读取···'
              });
            }
          });
        });
      });

      // 初始化车辆数据tag数据
    },
    initPermissions () {
      async function call (res) {
        // return new Promise(resolve => {
        // _thi_this.$PM.setUserList(res[0].data.data)s.$PM =
        if (res[0].data.result.code === 0) {
          _this.$PM.setUserList(res[0].data.data);
          await _this.$PM.init();
          _this.$store.commit('update_curLoading', { hidden: false });
          _this.CheckoutDB();
        }
      }
      let _this = this;
      getPermissions({ userid: _this.$store.getters.user.userid })
        .then(call)
        .catch(error => {
          if (error) {
          }
        });
    },
    CheckoutDB () {
      let _self = this;
      let user = { userid: localStorage.getItem('uid') };
      this.createdComp(cdata => {
        if (cdata == null) {
          _self.goHome = true;
          return;
        }
        // 初始化数据库 根据用户id创建对应版本数据库
        _self.$indexedDB.initIndexedDB(
          user.userid,
          cdata,
          res => {
            // 如果 前端数据库初始化成功 才进入功能页面
            if (res === 0) {
              _self.goHome = true;
              // 加载一级树 初始化公司数据
              cdata.forEach(function (item, index) {
                item.disabled = true;
                item.cid = 'c' + item.corpid; // 添加公司分组唯一标识
                item.label = item.corpname;
                _self.$indexedDB.putData('company', item, function (res) {}); // 更新前端数据库
              });
              _self.updateDbVehData(user);
            }
          },
          2.2
        );
      });
    }
  },
  beforeCreate () {
    let _this = this;
    /** 初始化用户信息 start **/
    let user = (this.user = {
      userid: localStorage.getItem('uid')
      // userid:10819
    });
    this.$store.commit('SET_USER', user);
    /** 初始化用户信息 end **/
  },
  mounted () {
    this.$store.commit('setHome', this);
  },
  created () {
    console.log('this', this);
    let _self = this;

    let user = this.$store.getters.user;
    /** 初始化地图默认类型 0 高德 ,1 百度 start **/
    this.$store.commit('SET_DEFAULT_MAPTYPE');
    /** 初始化地图默认类型end **/

    /** 连接mqtt start**/
    this.$mqtt.config.loginUserId = user.userid;
    this.$mqtt.mqttConnect();
    /** 连接mqtt end**/

    this.$store.commit('update_curLoading', {
      hidden: true,
      text: '读取设备信息...',
      pval: ''
    });

    this.$context.init({ preventDoubleContext: false }); // 初始化右键菜单
    // 获取公司列表很快
    this.$store.commit('update_curLoading', {
      hidden: true,
      // pval: 0,
      showPval: false,
      text: '校验数据库'
    });
    this.initPermissions();
    let para = {
      userid: this.$store.getters.user.userid,
      condition: '',
      id: -1
    };
    this.$request.follow.inif()
    // queryfollowdata(para).then(res => {
    //   if (res.data.result.code === 0) {
    //     this.$store.commit('SET_FOLLOWLISTLOADING', {
    //       boole: false,
    //       content: '更新关注列表'
    //     });
    //     let followData = {
    //       arrCarInfos: res.data.data || []
    //     };
    //     this.$store.dispatch('mergeFollowData', followData);
    //   }
    // });
  }
};
</script>
<style >
#testVersion {
  position: absolute;
  bottom: 0;
  /* left: 10px; */
  background: rgba(12, 43, 74, 0.8);
  padding: 2px 5px;
}
#testVersionTitle {
  color: #fff;
}
#testVersionNum {
  color: red;
}
.amap-controls .amap-toolbar {
  z-index: 1;
}
</style>
