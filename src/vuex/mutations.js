import utils from '@/utils/tool.js' // 车辆信息
import { SSL_OP_SSLREF2_REUSE_CERT_TYPE_BUG } from 'constants';
// import getters from './getters';

// var tiemrAbnormal
// var timeAbnormal = 3
// var tiemrPolice
// var timePolice = 5


export default {
  // 设置 总数统计信息
  SET_COUNT (state, data) {
    if (data.alarmAll) {
      state.count.alarmAll = data.alarmAll;
    } else if (data.mileAll) {
      state.count.mileAll = data.mileAll;
    } else if (data.driveAll) {
      state.count.driveAll = data.driveAll;
    } else if (data.onLineAll) {
      state.count.onLineAll = data.onLineAll
    }
  },
  SET_DZWLLIST (state, data) {
    state.arrDZWLList = data
  },
  SET_DZWLLISTLOADING (state, data) {
    state.loadingDZWLList = data
  },
  SET_MONILOADING (state, data) {
    state.loadingMoni = data
  },
  // treeState(state,{tag,data}){

  // }
  // XXX:dev-tree-state
  clearArrCheck (state, data) {
    state.arrCheck.length = 0;
  },
  // XXX:dev-tree-state
  addArrCheck (state, data) {
    state.arrCheck.push(data)
  },
  // XXX:dev-tree-state
  SET_FOLLOWDATA (state, { arrType, arrCarInfos }) {
    let arrCarInfo = arrCarInfos ? [...arrCarInfos] : state.arrFollowCarInfo
    arrType = arrType || state.arrFollowType
    state.arrFollowType = arrType;
    state.arrFollowCarInfo = arrCarInfos || state.arrFollowCarInfo;
    state.arrCheck.length = 0;
    let arr = arrType.map(cellType => {
      // let typeArr = []
      let typeObj = {}
      typeObj.label = cellType.name;
      typeObj.cid = 'f' + cellType.id;
      typeObj.children = getCorpArr(cellType.id, arrCarInfo)
      typeObj.disabled = true;
      return typeObj
    })

    state.arrFollowList = [...arr]
    function getCorpArr (id, arrCarInfo) {
      let corpArr = []
      arrCarInfo.filter(cellCar => {
        cellCar.label = cellCar.name + '/' + cellCar.owner;
        cellCar.vehicleid = cellCar.id
        cellCar.checkMonitor && delete cellCar.checkMonitor
        cellCar.children = []
        if (id === cellCar.pid) {
          let index = corpArr.IndexOf(cellCar.corpname, d => d.label)
          if (index === -1) {
            let obj = {
              label: cellCar.corpname,
              disabled: true,
              children: [cellCar]
            }
            corpArr.push(obj);
            return obj
          } else {
            corpArr[index].children.push(cellCar)
          }
        }
      });

      return corpArr
    }
  },
  SET_FOLLOWLISTLOADING (state, data) {
    // let data = []
    state.loadingFollowList = { ...data }
  },
  // 设置当前用户信息
  SET_USER (state, user) {
    state.user = user || null
  },
  // 设置默认地图
  SET_DEFAULT_MAPTYPE (state) {
    let t = localStorage.getItem('MAPTYPE');
    state.map.MAPTYPE = t | 0;
  },
  // 更新地图类型
  UPDATE_MAPTYPE (state, t) {
    window.localStorage.setItem('MAPTYPE', t);
    state.map.MAPTYPE = t;
  },
  // 切换主题
  UPDATE_THEME (state, t) {
    window.localStorage.setItem('theme', t);
  },
  // 更新缓冲 过渡效果状态
  update_curLoading (state, s) {
    // state.curLoading = Object.assign({}, state.curLoading, s);
    let newData = {...state.curLoading, ...s}
    state.curLoading = newData
  },
  // 更新用户通信状态
  update_userSignal_state (state, s) {
    state.signalState = s;
  },
  // 设置用户当前默认城市
  set_user_defaultCity (state, city) {
    state.city = city || '成都市'
  },
  // 更新树搜索关键字的值
  update_searchVal (state, newval) {
    state.searchVal = {...newval};
  },
  // 更新分组统计信息
  update_GroupStatistics (state, data) {
    state.GroupStatistics = data;
  },
  // 添加监控车辆 和 车辆对应的label
  add_carMarker (state, { marker, markerLabel }) {
    state.carlabelList.splice(0, 0, markerLabel);
    state.carMarkerList.splice(0, 0, marker);
  },
  // 添加原地设防到字典里
  add_ydsfMarker (state, {key, marker}) {
    state.dictYDSFMarker[key] = marker
  },
  delete_ydsfMarker (state) {
    if (state.dictYDSFMarker[state.selectVhID]) {
      state.dictYDSFMarker[state.selectVhID].setMap(null)
      delete state.dictYDSFMarker[state.selectVhID]
    }
  },
  // 更新历史缩放窗体 信息
  update_hisZoom (state, info) {
    if (info.vehicleid.indexOf('echart') !== -1) {
      let cuIndex
      var veh = state.hisZoom.info.filter(function (item, index) {
        if (item.vehicleid.indexOf('echart') !== -1) {
          cuIndex = index
          return item;
        }
      });
      if (veh.length > 0) {
        let arr = [...state.hisZoom.info]
        arr[cuIndex] = info
        state.hisZoom.info = arr // info
      } else {
        state.hisZoom.info.push(info)
      }
    } else {
      update.call(this)
    }
    function update () {
      var veh = state.hisZoom.info.filter(function (item, index) {
        if (item.vehicleid === info.vehicleid) {
          return item;
        }
      });
      if (veh.length === 0) state.hisZoom.info.push(info);
    }
  },
  // 根据车辆id 隐藏历史缩放窗体
  hiddenHisWind (state, { vehicleid, ishidden }) {
    state.hisZoom.info.map(function (item, index) {
      if (item.vehicleid === vehicleid) {
        item.isHidden = ishidden;
        return item;
      }
    })
  },
  // 根据车辆id 隐藏历史缩放窗体
  isHisWind (state, { vehicleid, callback }) {
    var ishis = state.hisZoom.info.filter(function (item, index) {
      if (item.vehicleid === vehicleid) {
        return item;
      }
    })
    callback(ishis);
  },
  // 更具车辆id 删除历史缩放窗体
  removeHisWind (state, _this) {
    var vehicleid = _this.id.slice(3);
    var veh = state.hisZoom.info.filter(function (item, index) {
      if (item.vehicleid === vehicleid) {
        item.index = index;
        return item;
      }
    })
    if (veh.length > 0) {
      state.hisZoom.info.splice(veh[0].index, 1)
      if (state.hisZoom.info.length === 0) {
        _this.$indexedDB.clear('vehHistory');
      } else {
        _this.$indexedDB.cursorDeldteData('vehHistory', 'vehicleidIndex', vehicleid);
      }
    }
  },
  // 更新历史轨迹数据
  update_Trajectory (state, { data }) {
    state.TrajectoryTable = data;
  },
  // 删除地图上指定车辆maker 和 车辆对应的label
  delete_carMarker (state, index) {
    state.carlabelList.splice(index, 1);
    state.carMarkerList.splice(index, 1);
  },
  // 删除报警列表信息
  delete_policeData (state, index) {
    state.policeData.splice(index, 1);
    state.policeDataNum = state.policeData.length; // 报警次数赋值
  },
  // 删除异常列表信息
  delete_abnormalData (state, index) {
    state.abnormalData.splice(index, 1);
  },
  // 更新table车辆id获取所有关注
  update_follow (state, { fllowList, vehicleid }) {
    let careType = '';
    // 关注类型列表
    fllowList.forEach((item, index) => {
      if (index + 1 !== fllowList.length) { careType += item.pname + ','; } else { careType += item.pname; }
    });
    state.monitorData = state.monitorData.map(function (item) {
      if (item.vehicleid === vehicleid) { return Object.assign({}, item, { careType: careType }) } else { return item; }
    });
  },

  // 更新table车辆详情信息
  update_VE (state, { VE, vehicleid }) {
    let dzwl = '';
    // 电子围栏列表
    VE.forEach((item, index) => {
      if (index + 1 !== VE.length) { dzwl += item.EfenceName + ','; } else { dzwl += item.EfenceName }
    });
    state.monitorData = state.monitorData.map(function (item) {
      if (item.vehicleid === vehicleid) { return Object.assign({}, item, { dzwl: dzwl }) } else { return item; }
    });
  },

  // 更新table车辆详情信息
  update_tableVehicledetail (state, row) {
    state.monitorData = state.monitorData.map(function (item, index) {
      if (item.vehicleid + '' === row.vehicleid + '') {
        // let d = Object.assign({}, item, row)
        let oldDev = item.proddata ? [...item.proddata] : []
        let newDev = [...row.proddata]
        let RDev
        if (oldDev.length < newDev.length) {
          RDev = newDev
        } else {
          RDev = oldDev.map((d, i) => {
            return {...d, ...newDev[i]}
          })
        }
        // RDev = {...oldDev, ...newDev}
        let data = {...item, ...row, ...{proddata: RDev}}
        return data
      } else {
        return item;
      }
    });
  },
  stateTree (state, data) {
    state.treeState = {...data}
  },
  arrFollowType (state, data) {
    state.arrFollowType = [...data]
  },
  arrFollowCarInfo (state, data) {
    state.arrFollowCarInfo = [...data]
  },
  arrFollowList (state, data) {
    state.arrFollowList = [...data]
  },
  objTransfer (state, data) {
    let oldData = {...state.objTransfer}
    state.objTransfer = {...oldData, ...data}
  },
  // 经纬度转地址
  getPointAddressMut (state, { map, vehicleid, point }) {
    map.$methods.getPointAddress(point, function (data) {
      // let address = '';
      state.monitorData = state.monitorData.map(function (item) {
        if (item.vehicleid === vehicleid) { return Object.assign({}, item, { address: data }) } else { return item; }
      });
    });
  },
  // MonitorData (state, data) {
  //   state.monitorData = [...data]
  // },
  // pushMonitorData (state, data) {
  //   state.monitorData.push(data)
  // },
  // insertMonitorData (state, data) {
  //   let oldArr = [...state.monitorData]
  //   state.monitorData = [data, ...oldArr]
  // },
  // deleteMonitorData (state) {
  //   state.monitorData.shift()
  // },
  // 车子弹框信息关闭/打开
  carBoxOpenOrClose (state, { openState, $class, $closeClass }) {
    let frameBoxAll = state.frameBoxAll;
    utils.closeBoxCom(state, $closeClass);
    switch ($class) {
      case 'ydsf': {
        frameBoxAll.fortificationBox = openState;
        break;
      }
      case 'dzwl': {
        frameBoxAll.enclosureBox = openState;
        break;
      }
      case 'zhiling': {
        frameBoxAll.instructionsBox = openState;
        break;
      }
      case 'follow': {
        frameBoxAll.followFrameBox = openState;
        break;
      }
      case 'removeFollow': {
        frameBoxAll.removeFollowBox = openState;
        break;
      }
      case 'remark': {
        frameBoxAll.remarkFrameBox = openState;
        break;
      }
      case 'addCar': {
        frameBoxAll.addCarFrameBox = openState;
        break;
      }
      case 'followInfo': {
        frameBoxAll.followInfoFrameBox = openState;
        break;
      }
      case 'taskNotice': {
        frameBoxAll.taskNoticeFrameBox = openState
        break;
      }
      default: {
        break;
      }
    }
  },
  // 监控列表和监控列表详情内容切换
  listOrDeails (state, { index, states }) {
    state.tabsState = {index, state: states}
  },
  changePoliceData (state, {index, bool}) {
    let data = [...state.policeData]
    data[index].show = bool
    state.policeData = data
  },
  changeAbnormalData (state, {index, bool}) {
    let data = [...state.abnormalData]
    data[index].show = bool
    state.abnormalData = data
  },

  // 监控列表详情获取
  monitorDataDetails (state, { map, result }) {
    state.monitorDataDetails = result;
  },
  // 报警详情数据获取
  policeDataDetails (state, result) {
    state.policeDataDetails = result;
  },
  thisAllpoliceDataList (state, result) {
  },
  // 异常详情数据获取
  abnormalDetails (state, result) {
    state.abnormalDetails = result;
  },
  // 改变行为分析的年月日时间
  timeState (state, result) {
    state.timeState = result
  },
  // 鼠标划过当前车辆，更新当前车的 经纬度和 车辆标识ID
  updateCarInfo (state, result) {
    state.moveCarInfo.vehicleid = result.realdata.vehicleid;
    state.moveCarInfo.lng = result.realdata.lng;
    state.moveCarInfo.lat = result.realdata.lat;
    state.moveCarInfo.carno = result.basicdata.carno;
    state.moveCarInfo.ownername = result.basicdata.ownername;
    state.selectVhID = result.realdata.vehicleid;
  },
  // 获取地图对象
  getMapObj (state, result) {
    state.mapObj = result;
  },
  // 车辆设防覆盖物添加
  coverUpdate (state, result) {
    state.coverArr.push(result);
  },
  // 更新窗口放大缩小状态
  zoomUpdate (state, result) {
    let $speedChart = document.querySelector('#speedChart');


    let $driveTimeChart = document.querySelector('#driveTimeChart');


    let $mileageChart = document.querySelector('#mileageChart');


    let $pieChart = document.querySelector('#pieChart');


    let $stopElectricChart = document.querySelector('#stopElectricChart');


    let $alarmChart = document.querySelector('#alarmChart');
    // 自适应宽高
    let myChartContainer = function () {
      $speedChart.style.width = $('#speedChartComents').width() + 'px';
      $speedChart.style.height = $('#speedChartComents').height() + 'px';

      $driveTimeChart.style.width = $('#driveTimeChartComents').width() + 'px';
      $driveTimeChart.style.height = $('#driveTimeChartComents').height() + 'px';

      $mileageChart.style.width = $('#mileageChartComents').width() + 'px';
      $mileageChart.style.height = $('#mileageChartComents').height() + 'px';

      $pieChart.style.width = $('#riskBox').width() + 'px';
      $pieChart.style.height = $('#riskBox').height() + 'px';

      // $stopElectricChart.style.width = $('#stopElectricBox').width() + 'px';
      // $stopElectricChart.style.height = $('#stopElectricBox').height() + 'px';

      // $alarmChart.style.width = $('#carPoliceBox').width() - $('#carPoliceBox').width() * 0.3 + 'px';
      // $alarmChart.style.height = $('#carPoliceBox').height() + 'px';
    };
    myChartContainer();
    /* 速度图表 */
    let speedChart = state.echaerObj.init($speedChart);
    speedChart.resize();
    /* 行驶时长 */
    let driveTimeChart = state.echaerObj.init($driveTimeChart);
    driveTimeChart.resize();
    /* 总里程 */
    let mileageChart = state.echaerObj.init($mileageChart);
    mileageChart.resize();
    /* 风险监控 */
    let pieChart = state.echaerObj.init($pieChart);
    pieChart.resize();
    /* 长停点 */
    let stopElectricChart = state.echaerObj.init($stopElectricChart);
    stopElectricChart.resize();
    /* 车辆报警 */
    let alarmChart = state.echaerObj.init($alarmChart);
    alarmChart.resize();
  },
  setSelectVhID (state, result) {
    state.selectVhID = result
  },
  setHome (state, _this) {
    state.home = _this
  },
  // 获取备注信息
  getRemarkRecord (state, result) {
    state.readNoteInfo = result;
  },
  setDeviceInfos (state, data) {
    // data.forEach
    data.forEach(d => {
      d.show = false
    })
    state.deviceInfos = [...data]
  },
  // changeDeviceInfos (state, {index, bool}) {
  //   let data = [...state.deviceInfos]
  //   data[index].show = bool
  //   state.deviceInfos = data
  // },
  changeFenceInfo (state, row) {
    let {...obj} = row
    state.fenceInfoForAddCar = obj
  },
  pushDataForAddCarTree (state, {data, index}) {
    if (index === undefined) {
      state.arrDataForAddCarTree.push(...data)
    } else {
      let children = [...data]
      let newData = [...state.arrDataForAddCarTree]
      newData[index].children = children
      state.arrDataForAddCarTree = newData
    }
  },
  clearDataForAddCarTree (state, index) {
    if (!index) {
      state.arrDataForAddCarTree.length = 0 // []
    } else if (index === 'all') {
      let newData = [...state.arrDataForAddCarTree]
      newData.forEach(d => {
        d.children.length = 0
      })
      state.arrDataForAddCarTree = newData
    } else {
      state.arrDataForAddCarTree[index].children.length = 0
    }
  },

  // 更新异常及报警历史数据
  updataHistoryData (state, data) {
    state.hisData = data;
  }
}
