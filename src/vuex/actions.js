import utils from '@/utils/tool'
import {getvehicletotaldistance, vehicleremarks, vehicledetail, searchVEbyvehicleid, followinfobyid, getydsfbyvehicleid, getvehicletodaydistance, proddetail, getsbbysbid} from '@/Api/mapApi.js'
import { getPhoto } from '../Api/mapApi';
function generateUUID () {
  var d = new Date().getTime();

  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (
    c
  ) {
    var r = ((d + Math.random() * 16) % 16) | 0;

    d = Math.floor(d / 16);

    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });

  return uuid;
}
export default {
  getMonitorDataDetails ({commit, state, getters}, {vehicleid, prodnum}) {
    // 车辆详情
    function runCarDetails () {

    }
    // 设备详情
    function runCropDetails () {

    }
    if (prodnum) {
      runCarDetails.call(this)
    } else {
      runCropDetails.call(this)
    }
  },
  setLoadingObj ({commit, state, getters}, {key, bool}) {
    state.loadingObj[key] = bool
  },
  setTaskNoticeData ({commit, state, getters}, data) {
    state.taskNoticeData = [...data]
  },
  bindRightBtnObj ({commit, state, getters}, obj) {
    state.rightBtnObj = {...obj}
  },
  // X:弹窗逻辑不要擅动
  // 播放一次
  playPoliceOne ({commit, state, getters}, bool) {
    let _this = this
    this.dispatch('setSoundPolice', true)
    if (getters.sounds.timeP) {
      clearTimeout(getters.sounds.timeA)
    }
    state.sounds.timeP = setTimeout(() => {
      _this.dispatch('setSoundPolice', false)
    }, 1000 * 5);
  },
  // X:弹窗逻辑不要擅动
  setSoundPolice ({commit, state, getters}, bool) {
    state.sounds.police = bool
  },
  // X:弹窗逻辑不要擅动
  // 播放一次
  playAbnormalOne ({commit, state, getters}, bool) {
    let _this = this
    this.dispatch('setSoundAbnormal', true)
    if (getters.sounds.timeA) {
      clearTimeout(getters.sounds.timeA)
    }
    state.sounds.timeA = setTimeout(() => {
      _this.dispatch('setSoundAbnormal', false)
    }, 1000 * 5);
  },
  // X:弹窗逻辑不要擅动
  setSoundAbnormal ({commit, state, getters}, bool) {
    state.sounds.abnormal = bool
  },
  // X:弹窗逻辑不要擅动
  pushListPolice ({commit, state, getters}, {data}) {
    state.listPolice.push(data)
  },
  // X:弹窗逻辑不要擅动
  insertListPolice ({commit, state, getters}, {data, index}) {
    state.listPolice.insert(index, data)
  },
  // X:弹窗逻辑不要擅动
  changeListPolice ({commit, state, getters}, {data, index}) {
    let list = getters.listPolice
    list[index] = data
    state.listPolice = [...list]
  },
  // X:弹窗逻辑不要擅动
  pushCuNotify ({commit, state, getters}) {
    let list = [...getters.listPolice]
    let arr = [...getters.arrCuNotify]
    let data = arr.length < 5 ? list[arr.length] : list[5]
    if (!data) return
    let index = arr.length < 5 ? arr.length : 5
    let titles = ['异常信息', '报警信息']
    let types = ['warning', 'error']
    let time = getters.setting.police.savaFollow ? 0 : 5
    let isPolice = +(data.stateType === '5' || data.stateType === '6')
    data._no = state.home.$notify({
      title: titles[isPolice],
      message: data.obj.message,
      dangerouslyUseHTMLString: true,
      type: types[isPolice],
      offset: 80,
      duration: time * 1000,
      _data: {...data},
      _index: index
    })
    let _this = this
    data._no.oldClose = data._no.onClose
    data._no.onClose = function ($event) {
      _this.dispatch('removeCuNotify', {index: this.$data._data.vehicleid})
      data._no.oldClose.call(this)
      _this.dispatch('pushCuNotify')
    }
    state.arrCuNotify.push({...data})
    // 常驻
    // if (getters.setting.police.soundsOn) {
    if (isPolice) {
      this.dispatch('setSoundPolice', true)
    } else {
      this.dispatch('setSoundAbnormal', true)
    }
    // } else {
    // }
  },
  // X:弹窗逻辑不要擅动
  insertCuNotify ({commit, state, getters}, data) {

  },
  // X:弹窗逻辑不要擅动
  changeCuNotify ({commit, state, getters}, {data, index}) {
    let oldarr = [...getters.arrCuNotify]
    let old = oldarr[index]
    old._no.message = data.obj.message
    old._no.startTimer()
  },
  // X:弹窗逻辑不要擅动
  removeCuNotify ({commit, state, getters}, {id}) {
    function remove (str) {
      let arr = [...getters[str]]
      let beArr = arr.splice(0, index)
      let afArr = arr.splice(1)
      let newArr = beArr.concat(afArr)
      state[str] = newArr
    }
    let _this = this
    let index = getters.arrCuNotify.IndexOf(id, d => d.obj.vehicleid)
    if (index === 0) {
      // state.listPolice.unshift()
      // state.arrCuNotify.unshift()
      remove('listPolice')
      remove('arrCuNotify')
    } else if (index === getters.arrCuNotify.length - 1) {
      state.listPolice.pop()
      state.arrCuNotify.pop()
    } else {
      remove('listPolice')
      remove('arrCuNotify')
    }
    // if (getters.setting.police.soundsOn) {
    let isP = getters.arrCuNotify.some(function (d) {
      let b = (d.stateType === '5' || d.stateType === '6')
      return b
    })
    if (!isP) {
      _this.dispatch('setSoundPolice', false)
    }
    let isA = getters.arrCuNotify.some(function (d) {
      let b = !(d.stateType === '5' || d.stateType === '6')
      return b
    })
    if (!isA) {
      _this.dispatch('setSoundAbnormal', false)
    }
    // }
  },
  // X:弹窗逻辑不要擅动
  // 处理报警弹窗
  runNotify ({commit, state, getters}, {data}) {
    // 计算返回 新报警存入list的位置
    function getNextIndex () {
      let indexIns = -1
      let arrCuNotify = getters.arrCuNotify
      if (arrCuNotify.length < 5) {
        indexIns = arrCuNotify.length
      } else {
        let _index = 5
        while (indexIns === -1 && _index < list.length) {
          if (list[_index].stateType === '5' || data.stateType === '6') {
            _index++
          } else {
            indexIns = _index
          }
        }
        // if(indexIns<5){
        if (indexIns === -1) {
          indexIns = _index
        }
      }

      return indexIns
    }
    function runcall (call) {
      call.call(_this)
    }

    let _this = this
    let list = [...getters.listPolice]
    let arrCuNotify = getters.arrCuNotify

    // 报警还是异常
    let isPolice = +(data.stateType === '5' || data.stateType === '6');
    // 是否存在报警
    let index = list.IndexOf(data.obj.uuid, d => d.obj.uuid);

    if (isPolice) {
      // type:报警
      // 新报警-插队处理
      if (index === -1) {
        let nextIndex = getNextIndex()
        this.dispatch('insertListPolice', {data: data, index: nextIndex})
        // 弹弹弹
        if (nextIndex < 5) {
          this.dispatch('pushCuNotify')
        }
      } else {
        // 已弹出 -- 修不修改list就无所谓了
        if (index < 5) {
          runcall(function () {
            this.dispatch('changeCuNotify', {data, index})
          })
        } else {
          // 修改list
          this.dispatch('changeListPolice', {data: data, index})
        }
      }
    } else {
      // type:异常
      if (index === -1) {
        // 新报警 push list
        this.dispatch('pushListPolice', {data})
        // 弹弹弹
        if (getters.arrCuNotify.length < 5) {
          runcall(function () {
            this.dispatch('pushCuNotify')
          })
        }
      } else {
        if (index < 5) {
          runcall(function () {
            this.dispatch('changeCuNotify', {data, index})
          })
        } else {
          this.dispatch('changeListPolice', {data, index})
        }
      }
    }
  },

  // X:弹窗逻辑不要擅动
  // 处理报警推送
  policeData ({commit, state, getters}, result) {
    let policeMseeg = `<p>车辆 ${result.obj.carNo}/${result.obj.ownername} ${result.obj.policeInfo}</p>
                         <p>设备号 ${result.obj.equipmentNo}</p>
                         <p>通讯时间 ${result.obj.GPSTime}</p>`;
    //  <p>接收时间 ${result.obj.serverTime}</p>`

    let key = ['abnormalData', 'policeData']
    function createObj () {
      result.show = false
      let old = {...result.obj}
      result.obj.history = [old]
      result.obj.message = policeMseeg
      state[key[isPolice]].unshift(result.obj)
    }
    function updateObj () {
      let old = {...getters[key[isPolice]][index]}
      old.serverTime = result.obj.serverTime
      old.GPSTime = result.obj.GPSTime
      old.policeInfo = result.obj.policeInfo
      old.point = result.obj.point
      old.address = result.obj.address
      old.speed = result.obj.speed
      old.policeSecond += 1
      result.obj.message = policeMseeg
      old.message = result.obj.message
      old.history.unshift({...result.obj})

      let oldarr = [...getters[key[isPolice]]]
      oldarr.splice(index, 1)
      oldarr.unshift(old)
      state[key[isPolice]] = [...oldarr]
    }
    // 报警还是异常
    let isPolice = +(result.stateType === '5' || result.stateType === '6')
    // 相应data
    let data = state[key[isPolice]]

    // craete or update
    let index = data.IndexOf(result.obj.uuid, d => d.uuid)
    // 是否更新
    if (index === -1) {
      createObj.call(this)
    } else {
      updateObj.call(this)
    }

    if (getters.setting.police.tipOn) {
      this.dispatch('runNotify', {data: result})
    } else {
      if (isPolice) {
        this.dispatch('playPoliceOne')
      } else {
        this.dispatch('playAbnormalOne')
      }
    }
  },
  // 修改设置-报警
  changeSettingPolice ({commit, state, getters}, option) {
    let {type, ...obj} = {...option}
    let old = getters.setting[type]
    state.setting[type] = {...old, ...obj}
    localStorage.setItem('settingPolice', JSON.stringify(getters.setting[type]))
  },
  treeLoading ({commit, state, getters}, {bool}) {
    state.treeLoading = bool
  },
  screenText ({commit, state, getters}, text) {
    state.screenText = text
  },
  screenCorp ({commit, state, getters}, text) {
    state.screenCorp = text
  },
  // 在高德地图定位车辆位置 根据点击车的id获取对应maker
  zoomToCarByCarId ({ commit, state, getters }, { carId, _this }) {
    var map = _this.$map;
    var markers = state.carMarkerList;
    var marker = null;
    for (var i = 0, len = markers.length; i < len; i++) {
      if (markers[i].getExtData().vehicleid === carId) {
        marker = markers[i];
        break;
      }
    }
    if (marker == null) {
      // 获取最后一条位置信息
      _this.$message({
        message: '该车辆无位置信息！',
        type: 'error'
      });
    } else {
      // map.setZoomAndCenter(4, marker.getPosition())
      // map.setZoomAndCenter(16, marker.getPosition())
      // map.panTo(marker.getPosition())
      // map.panBy(0,-$("div#mapContainer").height()/3*0.8)

      // 删除平移动画
      // 定位当前点至三分之一处
      let coord = marker.getPosition()
      let extend = map.getBounds()
      let c = Math.abs(extend.northeast.lat - extend.southwest.lat)
      let lat = coord.lat - c / 3 * 0.8
      let lng = coord.lng
      let newCoord = new AMap.LngLat(lng, lat)
      map.panTo(newCoord)
    }
  },
  zoomYdsf ({ commit, state, getters }, vehicleid) {
    // let map = state.home.$map
    let map = state.mapObj
    // map.add(state.dictYDSFMarker)
    let marker = state.dictYDSFMarker[vehicleid]
    if (marker) {
      marker.setMap(map)
      map.setFitView([marker])
    }
    // let coord = marker.getCenter()
    // let extend = map.getBounds()
    // let c = Math.abs(extend.northeast.lat - extend.southwest.lat)
    // let lat = coord.lat - c / 3 * 0.8
    // let lng = coord.lng
    // let newCoord = new AMap.LngLat(lng, lat)
    // map.panTo(newCoord)
  },
  // 在高德地图定位车辆位置 根据点击车的id获取对应位置
  zoomBJToCarByCarId ({ commit, state, getters }, { carId, _this, type }) {
    var map = _this.$map;
    var data = (type === 1 ? state.policeData : state.abnormalData);
    var info = null;
    for (var i = 0, len = data.length; i < len; i++) {
      if (data[i].vehicleid === carId) {
        info = data[i];
        break;
      }
    }
    if (info == null) {
      // 获取最后一条位置信息
      _this.$message({
        message: '该车辆无位置信息！',
        type: 'error'
      });
    } else {
      map.setZoomAndCenter(4, info.point)
      map.setZoomAndCenter(16, info.point)
    }
  },
  // 删除指点marker和对应的label
  delete_carMaker ({ commit, state, getters }, { carId, _this, index }) {
    var map = _this.$map;
    var markers = state.carMarkerList;
    var marker_labels = state.carlabelList;
    var marker = null;
    var marker_label = null;
    for (var i = 0, len = markers.length; i < len; i++) {
      if (markers[i].getExtData().vehicleid == carId) {
        marker = markers[i];
        marker_label = marker_labels[i];
        break;
      }
    }
    if (marker != null) {
      marker.setMap(null);
      marker_label.setMap(null);
      commit('delete_carMarker', index);
    }
  },
  initMoveCarInfo ({commit, state, getters}) {
    // let vehicleid = getters.moveCarInfo
    // getters.dictYDSFMarker[vehicleid]
    state.moveCarInfo = {
      vehicleid: '', // 车辆标识ID
      lng: '', // 当前车辆经度
      lat: '', // 当前车辆纬度
      carno: '', // 车架号
      ownername: '' // 车主
    }
  },
  mergeFollowData ({ commit, state, getters }, { arrType, arrCarInfos = 0 }) {
    console.debug('bug1=>>>mergeFollowData', arrType, arrCarInfos)
    function getCorpArr (typeId, arrCarInfo) {
      let corpArr = []
      arrCarInfo.filter(cellCar => {
        cellCar.label = cellCar.name + '/' + cellCar.owner;
        cellCar.vehicleid = cellCar.id
        cellCar.children = []
        if (typeId === cellCar.pid) {
          let index = corpArr.IndexOf(cellCar.corpname, d => d.label)
          if (index === -1) {
            let uuid = generateUUID('bbb')
            let obj = {
              label: cellCar.corpname,
              disabled: true,
              children: [cellCar],
              followKey: uuid
            }
            // _this.dispatch('add')
            _this.dispatch('addStateTree', { tag: 'follow', key: 'expand', value: uuid })
            corpArr.push(obj);
            return obj
          } else {
            corpArr[index].children.push(cellCar)
          }
        }
      });

      return corpArr
    }
    function updataData (key, dataNew = []) {
      let Obj = {
        'arrCarInfos': { data: 'arrFollowCarInfo', key: 'vehicleid' },
        'arrType': { data: 'arrFollowType', key: 'id' }
      }[key]
      let dataOld = [...getters[Obj.data]]
      let dataR = []
      // 采用旧数据
      if (!dataNew.length) {
        // dataR = dataOld.forEach(corp => {
        //   if (corp.children) {
        //     corp.children.length = 0
        //   }
        // })
        if (key === 'arrCarInfos') {
          dataR = []
        } else {
          dataR = [...dataOld]
        }
      } else {
      // 更新并添加车辆信息
        dataNew.forEach(cell => {
          let newCell = cell
          let ArrOldCell = dataOld
          let oldIndex = ArrOldCell.indexOf(+cell[Obj.key], d => +d[Obj.key])
          if (oldIndex !== -1) { // 更新
            let oldCell = ArrOldCell[oldIndex]
            newCell = { ...oldCell, ...cell }
          } else { // 添加
            newCell.followKey = generateUUID('aaa')
            if (key === 'arrType') {
              _this.dispatch('addStateTree', { tag: 'follow', key: 'expand', value: newCell.followKey })
            }
          }
        })
        dataR = dataNew
      }
      return dataR
    }
    let _this = this
    let arrCarInfo = updataData('arrCarInfos', arrCarInfos)
    commit('arrFollowCarInfo', arrCarInfo)
    arrType = updataData('arrType', arrType)
    commit('arrFollowType', arrType)
    let arr = arrType.map(cell => {
      cell.label = cell.name
      cell.cid = 'f' + cell.id
      cell.children = getCorpArr(cell.id, arrCarInfo)
      cell.disabled = true
      return cell
    })
    commit('arrFollowList', arr)
  },
  initStateTree ({ commit, state, getters }, { tag }) {
    let data = state.treeState
    data[tag].arrCheck.length = 0
    data[tag].arrExpand.length = 0
  },
  changeMonitorData ({commit, state, getters}, {data, index, changeFun}) {
    // 更新DB
    function updataDB (newData) {
      state.home.$indexedDB.putData('vehicleDetail', newData, function (res) {
      })
    }
    index = index !== undefined ? index : getters.monitorData.IndexOf(data.basicdata.vehicleid, d => d.vehicleid)
    if (index === -1) return
    let oldData = getters.monitorData
    oldData = changeFun(oldData, data, index)


    updataDB(oldData[index])
    state.monitorData = [...oldData]
  },
  reloadMonitorData ({commit, state, getters}, {data, index}) {
    let _this = this
    // 获取地址
    function getAdd (newData) {
      let { realdata } = { ...newData }
      utils.point2Address(realdata.lng, realdata.lat, function (address) {
        newData.address = address
        _this.dispatch('changeMonitorData', {data: address,
          index,
          changeFun: function (oldData, data, index) {
            oldData[index].address = data
            return oldData
          }})
      }, state.mapObj)
    }
    // 获取地址
    function getAdd2 (lng, lat, cuIndex) {
      utils.point2Address(lng, lat, function (address) {
        // newData.address = address
        _this.dispatch('changeMonitorData', {data: {address, index: cuIndex},
          index,
          changeFun: function (oldData, data, index) {
            oldData[index].custom.devices[data.index].address = data.address
            return oldData
          }})
      }, state.mapObj)
    }
    // index
    index = index !== undefined ? index : getters.monitorData.IndexOf(data.basicdata.vehicleid, d => d.vehicleid)
    if (index === -1) return

    // format
    let { basicdata, proddata, realdata } = { ...data }
    let newData
    // 组装新数据
    // 存在实时数据
    if (realdata) {
      newData = {basicdata, proddata, realdata, vehicleid: basicdata.vehicleid}
      let [lng, lat] = utils.transformWGStoGCJ(realdata.lng, realdata.lat)
      realdata = {...realdata, lng, lat}
      getAdd(newData)
    } else {
      newData = {basicdata, proddata, realdata, vehicleid: basicdata.vehicleid}
    }

    let oldData = getters.monitorData
    // 是否存在旧数据
    if (!oldData[index].vehicleid) {
      // 基础数据
      basicdata.carNo = basicdata.carno + '/' + basicdata.ownername
      basicdata.appointDataStr = utils.transformTime(basicdata.appointdate)
      if (basicdata.serviceexpdate) {
        basicdata.serviceexpdateStr = utils.transformTime(basicdata.serviceexpdate).split(' ')[0]
      }

      newData.custom = {isDetails: false}
      newData.address = '获取中ing' // oldData[index].address
      // oldData[index] = newData
    } else {
      if (data.realdata) {
        let oldgpstime = utils.formatDate.getDateStringTime(oldData[index].realdata.gpsTime)
        let cugpstime = utils.formatDate.getDateStringTime(data.realdata.gpstime)
        if (cugpstime <= oldgpstime) return
        newData.custom = oldData[index].custom || {isDetails: false}
        newData.address = oldData[index].address
      } else {
        newData.custom = oldData[index].custom || {isDetails: false}
      }
      newData.proddata = oldData[index].proddata

      // oldData[index] = newData
    }

    // 同步设备
    function syncDevices (prodIndex) {
      // if (oldData[index].custom.devices) {
      //   console.debug('syncDevices=>old', oldData[index].custom.devices[0].lng, oldData[index].custom.devices[0].lat)
      //   console.debug('syncDevices=>cu', data.realdata.lng, data.realdata.lat)
      // }
      oldData[index].custom.devices = oldData[index].custom.devices || []
      function firstLogin () {
        let param = {id: oldData[index].proddata[prodIndex].prodnum}
        getsbbysbid(param)
          .then(res => {
            if (res.data.result.code === 0) {
              let data = res.data.data

              let devices = oldData[index].custom.devices
              devices[prodIndex].sbbysbid = data
              _this.dispatch('changeMonitorData', {data: devices,
                index,
                changeFun: function (oldData, data, index) {
                  oldData[index].custom.devices = [...data]
                  return oldData
                }})
            }
          })
      }
      function getprod () {
        let param = {id: oldData[index].proddata[prodIndex].prodnum}
        proddetail(param)
          .then(res => {
            if (res.data.result.code === 0) {
              if (res.data.data.realdata) {
                res.data.data.realdata.locationmodel = res.data.data.realdata.locationmode
              }

              let data = res.data.data.realdata || {}

              let devices = oldData[index].custom.devices
              devices[prodIndex] = {...oldData[index].proddata[prodIndex], ...data}
              _this.dispatch('changeMonitorData', {data: devices,
                index,
                changeFun: function (oldData, data, index) {
                  oldData[index].custom.devices = [...data]
                  return oldData
                }})
              if (Object.keys(oldData[index].custom.devices[prodIndex]).indexOf('sbbysbid') === -1) {
                firstLogin()
              }
              if (res.data.data.realdata) {
                let [lng, lat] = utils.transformWGStoGCJ(data.lng, data.lat)
                data = {...data, lng, lat}
                getAdd2(lng, lat, prodIndex)
              }
            }
          })
      }
      if (prodIndex === 0) {
        oldData[index].custom.devices[0] = {...oldData[index].proddata[0]}
        if (oldData[index].realdata) {
          oldData[index].realdata.locationmodel = data.realdata.locationmode || data.realdata.locationmodel

          oldData[index].custom.devices[0] = {...data.realdata, ...oldData[index].custom.devices[0]}
        }
        oldData[index].custom.devices[0].address = oldData[index].address
        if (!oldData[index].custom.devices[prodIndex].sbbysbid) {
          firstLogin()
        }
      } else {
        getprod()

        //  firstLogin()
      }
    }


    this.dispatch('changeMonitorData', {data: newData,
      index,
      changeFun: function (oldData, data, index) {
        oldData[index] = data
        return oldData
      }})
    if (oldData[index].custom.isDetails) {
      oldData[index].proddata.forEach((d, prodIndex) => {
        syncDevices(prodIndex)
      })
    }
  },
  initMonitorData ({commit, state, getters}, {data, Vue}) {
    state.monitorData = [{}, ...state.monitorData]
    this.dispatch('reloadMonitorData', {data, index: 0})
    this.dispatch('addMonitorData', {data, VueObj: Vue})
    // 同步相关信息
    this.dispatch('syncVehicleInfo', {vehicleid: data.basicdata.vehicleid})
  },
  setIndexOfMonitorDetails ({commit, getters, state}, index) {
    if (Array.isArray(index)) {
      state.indexOfMonitorDetails = index
    } else {
      state.indexOfMonitorDetails[0] = index
      state.indexOfMonitorDetails[1] = 0
    }
  },
  // 添加监控列表信息
  addMonitorData ({commit, state, getters}, {data, VueObj}) {
    let index = state.monitorData.IndexOf(data.vehicleid, d => d.vehicleid)
    if (index === -1) {
      let arr = state.monitorData.map(d => 'v' + d.vehicleid)
      this.dispatch('treeStateTree', {data: arr})
      VueObj && VueObj.$tree && VueObj.$tree.setCheckedKeys(getters.treeState.tree.arrCheck)
      VueObj && VueObj.$searchVehtree && VueObj.$searchVehtree.setCheckedKeys(getters.treeState.tree.arrCheck)
    }
  },
  // 删除监控列表信息
  deleteMonitorData ({commit, state, getters}, {data, VueObj}) {
    let index = state.monitorData.IndexOf(data.vehicleid, d => d.vehicleid)
    if (index !== -1) {
      state.monitorData.splice(index, 1)
      let arr = state.monitorData.map(d => 'v' + d.vehicleid)
      this.dispatch('treeStateTree', {data: arr})
      VueObj && VueObj.$tree && VueObj.$tree.setCheckedKeys(getters.treeState.tree.arrCheck)
      VueObj && VueObj.$searchVehtree && VueObj.$searchVehtree.setCheckedKeys(getters.treeState.tree.arrCheck)
    }
  },
  treeStateTree ({commit, state, getters}, {data}) {
    state.treeState.tree.arrCheck = [...data]
  },
  addStateTree ({ commit, state, getters }, { tag, key, value }) {
    let transformKeyToKeys = {
      check: 'arrCheck',
      expand: 'arrExpand'
    }
    let data = getters.treeState
    let keys = transformKeyToKeys[key]
    let index = data[tag][keys].indexOf(value)
    if (index === -1 && value !== undefined) {
      data[tag][keys].push(value)
      commit('stateTree', data)
    }
  },
  removeStateTree ({ commit, state, getters }, { tag, key, value }) {
    let transformKeyToKeys = {
      check: 'arrCheck',
      expand: 'arrExpand'
    }
    let data = getters.treeState
    let keys = transformKeyToKeys[key]
    let index = data[tag][keys].indexOf(value)
    if (index !== -1 && value !== undefined) {
      data[tag][keys].splice(index, 1)
      commit('stateTree', data)
    }
  },
  updateVehicleStateTree ({ commit, state, getters }, { vehicleid, data, isClear }) {
    let oldData = getters.treeState
    if (!isClear) {
      oldData.follow.objVehicleState[vehicleid] = oldData.follow.objVehicleState[vehicleid] || []
      oldData.follow.objVehicleState[vehicleid].push(data)
    } else {
      oldData.follow.objVehicleState[vehicleid].length = 0
    }
    commit('stateTree', oldData)
  },
  getPointAddressMut ({ commit, state, getters }, { map, vehicleid, point }) {
    map.$methods.getPointAddress(point, function (data) {
      let oldData = getters.monitorData
      let newData = oldData.map(item => {
        if (item.vehicleid + '' === vehicleid + '') {
          return { ...item, ...{ address: data } }
        } else {
          return item
        }
      })
      commit('monitorData', newData)
    })
  },
  updateTodayDistance ({commit, state, getters}, {vehicleid, prodid}) {
    let _this = this
    let index = getters.monitorData.IndexOf(vehicleid, d => d.vehicleid)
    let para = {id: vehicleid + ',' + prodid}
    getvehicletodaydistance(para)
      .then(res => {
        if (res.data.result.code === 0) {
          let data// = res.data.data.totalmile
          if (!res.data.data) {
            data = '-'
          } else {
            data = res.data.data.totalmile
          }
          _this.dispatch('changeMonitorData', {data,
            index,
            changeFun: function (oldData, data, index) {
              oldData[index].custom.todaymile = data
              return oldData
            }})
        }
      })
  },
  // 初始化监控列表数据
  async syncVehicleInfo ({ commit, state, getters }, {vehicleid}) {
    let cuIndex = getters.monitorData.IndexOf(vehicleid, d => d.vehicleid)
    let data = getters.monitorData[cuIndex]
    let para1 = {
      index: 0,
      pagesize: 100000,
      id: data.vehicleid || data.basicdata.vehicleid,
      userid: state.user.userid
    };

    let para3 = {
      condition: data.vehicleid || data.basicdata.vehicleid,
      userid: state.user.userid
    };


    let para = {
      id: data.vehicleid || data.basicdata.vehicleid,
      userid: state.user.userid
    };
    let para2 = {
      vehicleid: data.vehicleid || data.basicdata.vehicleid,
      prodid: data.proddata[0].prodnum
    }
    let para4 = {
      vehicleid: data.vehicleid || data.basicdata.vehicleid
    }
    // let { dataDetails, isUpDB } = await _this.$request.packageDB.getVehicleDetail(data)
    // 不更新DB
    let _this = this

    // 根据车辆id获取所有关注
    followinfobyid(para).then((res) => {
      if (res.data.result.code === 0) {
        let followList = res.data.data || [];
        // followList.id += ''
        followList.forEach(d => {
          d.id += ''
        })
        // _this.$store.commit('update_follow', { fllowList: fllowList, vehicleid: data.vehicleid });

        _this.dispatch('changeMonitorData', {data: followList,
          index: cuIndex,
          changeFun: function (oldData, data, index) {
            oldData[index].custom.follow = data
            return oldData
          }})
      }
    });
    // 根据车辆id查询对应的电子围栏
    searchVEbyvehicleid(para3).then((res) => {
      if (res.data.result.code === 0) {
        let VE = res.data.data || [];
        _this.dispatch('changeMonitorData', {data: VE,
          index: cuIndex,
          changeFun: function (oldData, data, index) {
            oldData[index].custom.dzwl = data
            return oldData
          }})
      }
    });
    // 跟据车辆id查找对应原地设防信息
    getydsfbyvehicleid(para).then((res) => {
      if (res.data.result.code === 0) {
        let data = res.data.data
        if (data) {
          _this.dispatch('changeMonitorData', {data,
            index: cuIndex,
            changeFun: function (oldData, data, index) {
              oldData[index].custom.ydsf = data
              return oldData
            }})
        }
      }
    });
    // 根据车辆id获取备注信息
    vehicleremarks(para1).then((res) => {
      if (res.data.result.code === 0) {
        // let data = res.data.data
        let data
        if (res.data.data) {
          res.data.data.forEach((d, i) => {
            d.i = i
          })
          data = res.data.data.sort((a, b) => {
            return b.i - a.i
          })
        }

        if (data) {
          _this.dispatch('changeMonitorData', {data,
            index: cuIndex,
            changeFun: function (oldData, data, index) {
              oldData[index].custom.remark = data
              return oldData
            }})
        }
      }
    });
    this.dispatch('updateTodayDistance', para2)


    getvehicletotaldistance({id: para2.vehicleid + ',' + para2.prodid})
      .then(res => {
        if (res.data.result.code === 0) {
          let data //= !res.data ? '--' : res.data.data.totalmile
          if (!res.data.data) {
            data = '--'
          } else {
            data = res.data.data.totalmile
          }
          let index = getters.monitorData.IndexOf(para2.vehicleid, d => d.basicdata.vehicleid)
          _this.dispatch('changeMonitorData', {data,
            index,
            changeFun: function (oldData, data, index) {
              oldData[index].custom.totalmile = data
              return oldData
            }})
        }
      })
    getPhoto(para2.vehicleid)
      .then(res => {
        if (res.data.result.code === 0) {
          let data = res.data.data
          let veh = data.pictures.map(d => {
            // return 'http://www.wwvas.com:9119/img/' + d.piclink
            // d.forEach(item => {
            d.piclink = 'http://www.wwvas.com:9119/img/' + d.piclink
            // })
            return d
          })
          let prod = data.installDetails.map(d => {
            d.pictures.forEach(item => {
              item.piclink = 'http://www.wwvas.com:9119/img/' + item.piclink
            })
            return d.pictures
          })
          let index = getters.monitorData.IndexOf(para2.vehicleid, d => d.basicdata.vehicleid)
          _this.dispatch('changeMonitorData', {data: veh,
            index,
            changeFun: function (oldData, data, index) {
              oldData[index].custom.photoVeh = data
              return oldData
            }})
          _this.dispatch('changeMonitorData', {data: prod,
            index,
            changeFun: function (oldData, data, index) {
              oldData[index].custom.photoProd = data
              return oldData
            }})
        }
      })
      .then(err => {
        if (err) {
          console.log(err)
        }
      })
  }

}
