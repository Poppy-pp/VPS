// /* eslint-disable */
/*
* @description: mqtt和veh(车辆相关操作) 方法实例封装
* @author: wp
* @update: 2018-05-9
*********************************/
import context from 'static/script/context' // 右键菜单 js 基类
import Messaging from 'static/script/mqttws31' // 引入mqtt基类
import utils from '@/utils/tool' // 引入工具
import { followinfobyid, confirmFollow, getFollowData, removeFollow, queryfollowdata, searchefence, searchVEbyvehicleid, addVehicleefence, getAlreadyFollow, deleteVehicleefence, getYdsfInfo, getFollow, addYdsf, updateYdsf, delYdsf, vehicledetail } from '@/Api/mapApi.js'
import { followinfo } from '../Api/mapApi';

var pm = new PermissionManage()
var clientuuid = 'start_' + uuid(15, 30) // 客户端标识
var mqttClient = null // 声明mqtt全局对象

export default {
  install (Vue, { store }) {
    Vue.prototype.$context = context // 右键菜单插件
    // mqtt全局封装对象
    let mapObj = new AMap.Map('mapContainer') // 获取地图对象
    Vue.prototype.$mqtt = {
      config: {
        host: 'mqtt.wwvas.com', // 服务器主机名
        port: 61623, // 服务器端口号
        loginUserId: 10668 // 当前用户id
      },
      moveing: true,
      // mqtt连接
      mqttConnect () {
        let _this = this
        // 如果 mqtt客户端未创建 就重新 新建一个
        if (mqttClient == null) {
          clientuuid = _this.config.loginUserId + '_' + uuid(15, 30)
          _this.createMQTTClient()
        }
        if (mqttClient.connectState) return
        // 直接连接服务器
        mqttClient.connect({
          userName: 'admin',
          password: 'password',
          onSuccess (frame) {
            console.log('mqtt连接成功!')
            // 设置用户通信状态 为通信中
            store.commit('update_userSignal_state', 0)
            // 订阅分组统计信息
            mqttClient.subscribe('user/statistics/' + _this.config.loginUserId)
            // 通知服务器登录信息
            var topicName = 'user/statistics/' + _this.config.loginUserId
            sendMessageToMqttServer('login', topicName)
          },
          onFailure (failure) {
            // 设置用户通信状态 为离线 连接中
            store.commit('update_userSignal_state', 1)
            // 10秒后重新连接
            console.log('重新连接......')
            // mqttClient = null;
            setTimeout(() => {
              // 链接
              _this.mqttConnect()
            }, 30000)
          },
          cleanSession: true
        })
      },
      // 创建mqtt客户端
      createMQTTClient () {
        let _this = this
        if (mqttClient != null) return
        clientuuid = _this.config.loginUserId + '_' + uuid(15, 30)
        mqttClient = new Messaging.Client(_this.config.host, _this.config.port, clientuuid)
        // 事件
        mqttClient.onMessageArrived = function (message) {
          var entity = eval('(' + message.payloadString + ')')
          // 判断主题数据
          switch (entity.topicmodel) {
            // case 0: initCompanyGroup(entity.data); break;
            case 1: _this.initCompanyGroupStatistics(entity.data); break
            //     case 2: initGroupDataToTree(entity); break;
            //     case 3: changeTreeCarState(entity.data); break;
            case 4: _this.excuteRealDataExcute(entity.data); break
            case 5: _this.policeData(entity.data); break
            //     case 6: changeTreeVehicleState(entity.data); break;
          }
        }
        mqttClient.onConnectionLost = function (responseObject) {
          if (responseObject.errorCode !== 0) {
            // 设置用户通信状态 为离线 连接中
            store.commit('update_userSignal_state', 1)
            // 10秒后重新连接
            console.log('重新连接......')
            // mqttClient = null;
            setTimeout(() => {
              // 链接
              _this.mqttConnect()
            }, 30000)
          }
        }
      },
      // 更新树状态统计信息
      initCompanyGroupStatistics (data) {
        store.commit('update_GroupStatistics', data)
      },
      // 订阅单个车辆
      subscribeOneCar (vehicleid) {
        if (mqttClient == null) return
        var topicName = 'vehicle/' + vehicleid
        mqttClient.subscribe(topicName)
        // 通知服务器
        sendMessageToMqttServer('vehiclerealtimedata', topicName)
      },
      // 取消订阅车辆
      unsubscribeOneCar (vehicleid) {
        var topicName = 'vehicle/' + vehicleid
        mqttClient.unsubscribe(topicName)
        sendMessageToMqttServer('cancelsubscribe', topicName)// 通知服务器已取消订阅
      },
      // 订阅报警信息列表
      subscribePoliceInfo (userId) {
        if (mqttClient == null) return
        let topicName = 'alarm/' + userId
        mqttClient.subscribe(topicName)
        // 通知服务器
        sendMessageToMqttServer('socketPoliceInfo', topicName)
      },
      // 报警数据获取
      async policeData (socketData) {
        // 用户设置 -- 过滤非关注车辆
        let isRun
        if (store.getters.setting.police.followOn) {
          let FollowCar = [...store.getters.arrFollowCarInfo]
          let index = FollowCar.IndexOf(+socketData.alarminfo.vehicleid, d => {
            return d.vehicleid || d.id
          })
          isRun = index !== -1
        } else {
          isRun = true
        }
        if (!isRun) {
          return
        }
        /* 高德地图解析经纬度 为地址 */

        var MGeocoder
        function geocoder2 (lng, lat) { // POI搜索，关键字查询
          return new Promise(resolve => {
            function geocoder_CallBack2 (data) { // 回调函数
              if (data.regeocode) {
                objBox.obj.adress = data.regeocode.formattedAddress
                resolve(1)
                // 详细地址
                // store.commit('policeData', objBox) // 过滤一条报警信息或者异常数据，传送给状态树
              }
            }

            let lnglatXY = new AMap.LngLat(lng, lat)
            // 加载地理编码插件
            mapObj.plugin(['AMap.Geocoder'], function () {
              MGeocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: 'all'
              })
              // 返回地理编码结果
              AMap.event.addListener(MGeocoder, 'complete', geocoder_CallBack2)
              // 逆地理编码
              MGeocoder.getAddress(lnglatXY, resolve)
            })
          })
        }
        let objBox = {}
        let obj = {} // 报警列表数据装接
        if (socketData) { // 如果获取webSocket推送的数据
          let lng = socketData.realdata.lng; let lat = socketData.realdata.lat // 获取经纬度
          let point
          if (lng < 1 || lat < 1) {
            point = ''
          } else {
            let gcj_02_point = utils.transformWGStoGCJ(lng, lat)
            point = [gcj_02_point[0], gcj_02_point[1]]
          }
          // let point = [lng,lat]
          // 报警类型获取
          let alarmparamcode = socketData.alarminfo.alarmparamcode + '' // 报警类型对应码
          let getPolicetype = JSON.parse(sessionStorage.getItem('policeTypeCode')) // 获取报警类型对应码和类型
          let policeType = '' // 报警类型
          for (let item of getPolicetype) {
            if (alarmparamcode === item.ParamCode) {
              policeType = item.ParamName // 推送过来的数据，报警类型或者异常类型过滤获取
            }
          }

          obj.point = point
          obj.vehicleid = socketData.alarminfo.vehicleid // 报警车辆标识
          obj.ownername = socketData.basicdata.ownername // 车主姓名
          obj.corpname = socketData.basicdata.corpname // 所属公司
          obj.carNo = socketData.basicdata.carno // 获取车牌号
          obj.policeType = policeType // 报警类型
          obj.policeInfo = socketData.alarminfo.alarmcontent // 报警信息
          obj.policeCode = socketData.alarminfo.alarmparamcode
          obj.uuid = obj.vehicleid + '-' + obj.policeCode // 区分
          obj.policeSecond = 1 // 报警次数
          obj.GPSTime = socketData.realdata.gpstime // GPS时间
          obj.serverTime = socketData.realdata.recvtime // 服务器时间
          obj.speed = '' // 速度
          obj.equipmentNo = socketData.realdata.prodnum // 设备号码
          obj.frameNumber = socketData.basicdata.vin // 车架号
          objBox.obj = obj
          obj.uid = obj.policeType + obj.vehicleid
          objBox.stateType = alarmparamcode // 状态类型如果是5和6就是报警类型，其余为异常类型
          objBox.obj.adress = objBox.obj.adress || '获取中。。。'
          await geocoder2(point[0], point[1])
          // store.commit('policeData', objBox) // 过滤一条报警信息或者异常数据，传送给状态树
          store.dispatch('policeData', objBox)
        }
      },
      // 接受实时数据(更新或者加载数据)
      async excuteRealDataExcute (data) {
        let mqttRealDataQueue = Vue.prototype.$Veh.mqttRealDataQueue
        if (data.basicdata == null) return
        if (data.basicdata.vehicleid == null) return
        // 判断 当前推送 的车辆位置信息 是否是最新数据
        let cd = store.getters.monitorData.filter(function (item) {
          if (item.basicdata.vehicleid === data.realdata.vehicleid) { return item }
        })
        if (cd.length == 0) return
        let ngpstime = utils.formatDate.getDateStringTime(cd[0].gpsTime)
        let mgpstime = utils.formatDate.getDateStringTime(data.realdata.gpstime)
        if (mgpstime < ngpstime) return
        // end
        // 图形
        var realdata = data.realdata
        if (realdata != null && realdata.lng > 0) {
          // 纠偏
          var gcj_02_point = utils.transformWGStoGCJ(realdata.lng, realdata.lat)
          realdata.lng = gcj_02_point[0]
          realdata.lat = gcj_02_point[1]
          // 更新数据
          data.realdata = realdata
          mqttRealDataQueue.push(data)
          // Vue.prototype.$Veh.updateVehicledetail({ data })
          let index = store.getters.monitorData.IndexOf(data.basicdata.vehicleid, d => d.vehicleid)
          if (index !== -1) {
            // 如果有多个设备
            if (data.proddata.length > 1) {
              let index = data.proddata.IndexOf('有线', d => d.prodspec)
              // 如果不在第一个
              if (index !== 0) {
                let yx = {...data.proddata[index]}
                // 那么就要替换位置
                data.proddata[index] = data.proddata[0]
                data.proddata[0] = yx
              }
            }

            store.dispatch('reloadMonitorData', {data, index})
          }
          if (this.moveing) {
            let vehdata = mqttRealDataQueue.shift()
            this.moveing = false//
            this.moveing = await utils.moveVehicle({ state: store.state, realdata: realdata, vehdata: vehdata })
          }
          // 图形
          // store.commit("createCarMarkerToMap",{map:Vue.prototype.$map,vehicleid:realdata.vehicleid,data});
        } else {
          console.log(data)
        }
      }
    }
    function CreateVeh () {
      let Veh = {
        mqttRealDataQueue: [],
        updateVehicledetail: function ({ data, resolves }) {
          // 更新DB
          function updataDB (newData) {
            Vue.prototype.$indexedDB.putData('vehicleDetail', newData, function (res) {
              if (resolves) {
                resolves(newData)
                resolves = null
              }
              store.dispatch('addMonitorData', { data: newData })
            })
          }
          // 获取DB
          function getDB (call) {
            return new Promise(resolve => {
              Vue.prototype.$indexedDB.getDataById('vehicleDetail', data.basicdata.vehicleid, function (res) {
                resolve(res.data)
              })
            })
          }
          // 获取地址
          function getAdd (newData) {
            let { realdata } = { ...newData }
            var gcj02point = utils.transformWGStoGCJ(realdata.lng, realdata.lat)
            let point = [gcj02point[0], gcj02point[1]]
            Vue.prototype.$map.$methods.getPointAddress(point, function (address) {
              newData = { ...newData, address }
              updataDB(newData)
            })
          }
          async function transformData () {
            let { basicdata, proddata, realdata } = { ...data }
            // 基础数据
            basicdata.carNo = basicdata.carno + '/' + basicdata.ownername
            basicdata.appointDataStr = utils.transformTime(basicdata.appointdate)
            if (basicdata.serviceexpdate) {
              basicdata.serviceexpdateStr = utils.transformTime(basicdata.serviceexpdate).split(' ')[0]
            }

            // 存在实时数据
            if (realdata) {
              let dataDB = await getDB()
              // 首次存入DB
              if (!dataDB) {
                let newData = { basicdata, proddata, realdata, vehicleid: basicdata.vehicleid, address: '获取中。。。' }
                getAdd(newData)
                updataDB(newData)
              } else {
                // 存在数据判断gpstime
                let timeDB = utils.formatDate.getDateStringTime(dataDB.realdata.gpstime)
                let timett = utils.formatDate.getDateStringTime(realdata.gpstime)
                if (timeDB > timett) return
                let newData = { basicdata, proddata, realdata, vehicleid: basicdata.vehicleid, address: '加载中。。。' }
                getAdd(newData)
                updataDB(newData)
              }
            } else {
              let newData = { basicdata, proddata, realdata }
              newData.vehicleid = basicdata.vehicleid
              // let dataDB = await getDB()
              updataDB(newData)
            }
          }

          transformData()
        }
      }
      return Veh
    }
    // 车辆全局对象
    Vue.prototype.$Veh = { ...CreateVeh() }

    function createIndexedDB () {
      return {
        indexedDB: window.indexedDB || window.webkitindexedDB,
        db: null, // 如果数据库初始化成功 全局db实例
        // 初始化数据库
        initIndexedDB (userID, cdata, cb, versionDB = 1) {
          var _self = this
          if (!window.indexedDB) {
            alert('前端数据库初始化失败！请更换浏览器，建议最新谷歌浏览器...')
            return
          }
          // 更新版本，打开版本为2的数据库
          var request = _self.indexedDB.open('vpsdb' + userID, versionDB)
          // 错误信息，打印日志
          request.onerror = function (e) {
            console.log(e)
          }
          // 数据库打开成功
          request.onsuccess = function (e) {
            _self.db = e.target.result
            if (cb != null) cb(0)
          }
          // 数据库最新版本进入
          request.onupgradeneeded = function (e) {
            var db = _self.db = e.target.result
            Object.values(_self.db.objectStoreNames).forEach(name => {
              _self.db.deleteObjectStore(name)
            })
            // 创建车辆总数
            if (!db.objectStoreNames.contains('vehicleTotal')) {
              db.createObjectStore('vehicleTotal', { keyPath: 'version' })
            }
            // 创建标签表
            if (!db.objectStoreNames.contains('tag')) {
              var tag = db.createObjectStore('tag', { keyPath: 'id' })
              tag.createIndex('corpid', 'corpid', { unique: false })
              tag.createIndex('tagid', 'tagid', { unique: false })
            }
            // 创建车辆详情表
            if (!db.objectStoreNames.contains('vehicleDetail')) {
              var vehicleDetail = db.createObjectStore('vehicleDetail', { keyPath: 'vehicleid' })
            }
            // 创建历史轨迹详情表
            if (!db.objectStoreNames.contains('vehHistory')) {
              var vehHistory = db.createObjectStore('vehHistory', { keyPath: 'id' })
              vehHistory.createIndex('vehicleidIndex', 'vehicleid', { unique: false })
            }
            // 创建公司分组表
            if (!db.objectStoreNames.contains('company')) {
              var company = db.createObjectStore('company', { keyPath: 'corpid' })
              company.createIndex('corpname', 'corpname', { unique: false })
            }
            // 创建设备表
            if (!db.objectStoreNames.contains('company')) {
              var company = db.createObjectStore('company', { keyPath: 'corpid' })
              company.createIndex('corpname', 'corpname', { unique: false })
            }
            // 根据公司建车辆表
            cdata.forEach((item, index) => {
              if (!db.objectStoreNames.contains('cveh' + item.corpid)) {
                var vehicle = db.createObjectStore('cveh' + item.corpid, { keyPath: 'vehicleid' })
                vehicle.createIndex('name', 'name', { unique: false })
                vehicle.createIndex('ownername', 'ownername', { unique: false })
                vehicle.createIndex('corpid', 'corpid', { unique: false })
                vehicle.createIndex('label', 'label', { unique: false })
                vehicle.createIndex('prod', 'prod', { unique: false })
              }
            })
          }
        },
        // 添加数据 覆盖相同id的数据
        putData (tableName, data, cb) {
          if (!this.db.objectStoreNames.contains(tableName)) {
            let data = { error: 1, data: '没有表存在' }
            cb(data)
            return
          };
          var transaction = this.db.transaction(tableName, 'readwrite')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.put(data)
          request.onsuccess = function (e) {
            if (cb) {
              let datas = { error: 0, data: data }
              cb(datas)
            }
          }
          request.onerror = function (e) {
            if (cb) {
              let data = { error: 1 }
              cb(data)
            }
          }
        },
        // 添加数据
        addData (tableName, data, cb) {
          var transaction = this.db.transaction(tableName, 'readwrite')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.add(data)
          request.onsuccess = function (e) {
            if (cb) {
              let datas = { error: 0, data: data }
              cb(datas)
            }
          }
          request.onerror = function (e) {
            if (cb) {
              let data = { error: 1 }
              cb(data)
            }
          }
        },
        // 游标删除 对应数据
        cursorDeldteData (tableName, keyname, keywords) {
          // 通过游标删除记录
          var transaction = this.db.transaction(tableName, 'readwrite')
          var objectStore = transaction.objectStore(tableName)
          var boundKeyRange = IDBKeyRange.only(keywords)
          var request = objectStore.index(keyname).openCursor(boundKeyRange)
          request.onsuccess = function (e) {
            var cursor = e.target.result

            var value

            var deleteRequest
            if (cursor) {
              if (cursor.key == keywords) {
                deleteRequest = cursor.delete()// 请求删除当前项
                deleteRequest.onerror = function () {
                  cursor.continue()
                }
                deleteRequest.onsuccess = function () {
                  cursor.continue()
                }
              } else {
                cursor.continue()
              }
            }
          }
        },
        // 删除数据根据id
        deleteData (tableName, id, cb) {
          var transaction = this.db.transaction(tableName, 'readwrite')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.delete(parseInt(id))
          request.onsuccess = function (e) {
            if (cb) {
              let data = { error: 0, data: parseInt(id) }
              cb(data)
            }
          }
          request.onerror = function (e) {
            if (cb) {
              let data = { error: 1 }
              cb(data)
            }
          }
        },
        // 获取全部数据
        getDataAll (tableName, cb) {
          var transaction = this.db.transaction(tableName, 'readonly')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }

          var objectStore = transaction.objectStore(tableName)
          var rowData = []
          objectStore.openCursor(IDBKeyRange.lowerBound(0)).onsuccess = function (event) {
            var cursor = event.target.result
            if (!cursor && cb) {
              let data = { error: 0, data: rowData }
              cb(data)
              return
            }

            rowData.push(cursor.value)
            cursor.continue()
          }
        },
        // 根据公司获取 所有车
        getCorpDataAll (tableName, tagid, cb) {
          var transaction = this.db.transaction(tableName, 'readonly')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }
          var objectStore = transaction.objectStore(tableName)
          var rowData = []
          // let keyRangeValue = IDBKeyRange.bound(start, end, false, false)
          let keyRangeValue = IDBKeyRange.lowerBound(0)
          objectStore.openCursor(keyRangeValue).onsuccess = function (event) {
            var cursor = event.target.result
            if (!cursor && cb) {
              let data = { error: 0, data: rowData }
              cb(data)
              return
            }

            if (tagid === -1) {
              rowData.push(cursor.value)
            } else {
              if (cursor.value.tagid === tagid) {
                rowData.push(cursor.value)
              }
            }
            cursor.continue()
          }
        },
        // 根据id获取数据
        getDataById (tableName, id, cb) {
          var transaction = this.db.transaction(tableName, 'readwrite')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.get(id)
          request.onsuccess = function (e) {
            if (cb) {
              let data = { error: 0, data: e.target.result }
              cb(data)
            }
          }
          request.onerror = function (e) {
            if (cb) {
              let data = { error: 1 }
              cb(data)
            }
          }
        },
        // 根据公司 tagid查询 对应tag标签组
        getDataBySearchTagID (tableName, tagid, keyname, keywords, cb) {
          var transaction = this.db.transaction(tableName, 'readwrite')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }
          var objectStore = transaction.objectStore(tableName)
          var rowData = []
          objectStore.index(keyname).openCursor().onsuccess = function (event) {
            var cursor = event.target.result
            if (!cursor) {
              if (cb) {
                let data = { error: 0, data: rowData }
                cb(data)
              }
              return
            }
            if (tagid == -1 && cursor.value[keyname] == keywords) {
              rowData.push(cursor.value)
            } else {
              if (cursor.value.parenttagid == tagid && cursor.value[keyname] == keywords) {
                rowData.push(cursor.value)
              }
            }
            cursor.continue()
          }
        },
        // 模糊查询车辆
        getDataBySearchLike (tableName, keyname, keywords, cb) {
          try {
            var transaction = this.db.transaction(tableName, 'readwrite')
          } catch (error) {
            console.debug('查无此表' + tableName + '==>' + keywords)
            let o = {error: 1}
            cb(o)
            return
          }
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }

          var objectStore = transaction.objectStore(tableName)
          var rowData = []
          objectStore.index('label').openCursor().onsuccess = function (event) {
            var cursor = event.target.result
            if (!cursor || rowData.length >= 20) {
              if (cb) {
                let data = { error: 0, data: rowData }
                cb(data)
              }
              return
            }
            // if (cursor.value.name.indexOf('005453') !== -1) {
            // }
            let words = pm.module.search.m.wordOfSearchFilter
            let label = ''
            let customStr = '\/|\\'
            words.forEach(word => {
              switch (word) {
                case 'name':
                  label += (cursor.value['ownername'] + customStr)
                  break
                case 'vehicle':

                  label += (cursor.value['licenseplatenum'] + customStr)
                  label += (cursor.value['vin'] + customStr)
                  break
                case 'prod':
                  // label += (cursor.value['vin'] + customStr)
                  break
                default:
                  break
              }
            })
            // let label =

            let reg = /^\d{8,}$/
            let bool = reg.test(keywords)
            bool && (keyname = 'prod')

            if (keyname === 'prod' && words.indexOf(keyname) !== -1) {
              let prodData = JSON.parse(cursor.value[keyname])
              let arrProd = prodData.map(d => d.prodnum)
              let isJump = false
              arrProd.forEach(num => {
                if (!isJump) {
                  if (num.indexOf(keywords) !== -1) {
                    rowData.push(cursor.value)
                    isJump = true
                  }
                }
              })
            } else {
              // if (cursor.value[keyname].indexOf(keywords) != -1) { rowData.push(cursor.value) }
              let regLabel = new RegExp(keywords)
              let boolLabel = regLabel.test(label)
              if (boolLabel) {
              }
              boolLabel && (rowData.push(cursor.value))
            }
            cursor.continue()
          }
        },
        // 根据关键词索引获取数据
        getDataBySearch (tableName, keyname, keywords, cb) {
          var transaction = this.db.transaction(tableName, 'readwrite')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }

          var objectStore = transaction.objectStore(tableName)
          var boundKeyRange = IDBKeyRange.only(keywords)
          var rowData = []
          objectStore.index(keyname).openCursor(boundKeyRange).onsuccess = function (event) {
            var cursor = event.target.result
            if (!cursor) {
              if (cb) {
                cb({ error: 0, data: rowData })
              }
              return
            }
            rowData.push(cursor.value)
            cursor.continue()
          }
        },
        // 更新数据
        updateData (tableName, id, udata, cb) {
          var transaction = this.db.transaction(tableName, 'readwrite')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }
          var objectStore = transaction.objectStore(tableName)
          var request = objectStore.get(id)
          request.onsuccess = function (e) {
            var thisDB = e.target.result
            if (thisDB == undefined) return
            for (var key in udata) {
              thisDB[key] = udata[key]
            }
            objectStore.put(thisDB)
            if (cb) {
              cb({ error: 0, data: thisDB })
            }
          }
          request.onerror = function (e) {
            if (cb) {
              cb({ error: 1 })
            }
          }
        },
        // 根据页码获取数据
        getDataByPager (tableName, start, end, cb) {
          var transaction = this.db.transaction(tableName, 'readwrite')
          transaction.oncomplete = function () {
          }
          transaction.onerror = function (event) {
            console.dir(event)
          }
          var objectStore = transaction.objectStore(tableName)
          var boundKeyRange = IDBKeyRange.bound(start, end, false, true)
          var rowData = []
          objectStore.openCursor(boundKeyRange).onsuccess = function (event) {
            var cursor = event.target.result
            if (!cursor && cb) {
              let params = { error: 0, data: rowData }
              cb(params)
              return
            }
            rowData.push(cursor.value)
            cursor.continue()
          }
        },
        /**
         * 清除整个对象存储(表)
         */
        clear (tableName) {
          var request = this.db.transaction(tableName, 'readwrite').objectStore(tableName).clear()
          request.onsuccess = function () {
            console.log('清除成功')
          }
        }
      }
    }
    // 前端数据库初始化
    Vue.prototype.$indexedDB = createIndexedDB()

    function CreateRequest () {
      // 获取当前车辆信息
      function vehicleDetailNow (vehData) {
        return new Promise(resolve => {
          let vehicleId = vehData.vehicleid
          vehicledetail({ id: +vehicleId })
            .then(res => {
              if (res.data.result.code === 0) {
                let dataDetails = res.data.data
                if (!dataDetails) {
                  if (dataDetails.realdata != null && dataDetails.realdata.lng > 0) {
                    // 纠偏
                    var gcj_02_point = utils.transformWGStoGCJ(dataDetails.realdata.lng, dataDetails.realdata.lat)
                    dataDetails.realdata.lng = gcj_02_point[0]
                    dataDetails.realdata.lat = gcj_02_point[1]
                  }
                  resolve({ dataDetails, isUpDB: false })
                } else {
                  // 如果有多个设备
                  if (dataDetails.proddata.length > 1) {
                    let index = dataDetails.proddata.IndexOf('有线', d => d.prodspec)
                    // 如果不在第一个
                    if (index !== 0) {
                      let yx = {...dataDetails.proddata[index]}
                      // 那么就要替换位置
                      dataDetails.proddata[index] = dataDetails.proddata[0]
                      dataDetails.proddata[0] = yx
                    }
                  }
                  resolve({ dataDetails, isUpDB: true })
                }
              }
            })
        })
      }
      function getVehicleDetail (vehData) {
        return new Promise(resolve => {
          let vehicleId = vehData.vehicleid
          Vue.prototype.$indexedDB.getDataById('vehicleDetail', vehicleId, function (result) {
            let dataDetails = result.data
            if (dataDetails !== undefined) {
              resolve({ dataDetails, isUpDB: false })
            } else {
              vehicledetail({ id: +vehicleId })
                .then(res => {
                  if (res.data.result.code === 0) {
                    let dataDetails = res.data.data
                    // dataDetails.realdata = dataDetails.realdata || {}
                    if (!dataDetails) {
                      resolve({ dataDetails, isUpDB: false })
                    } else {
                      resolve({ dataDetails, isUpDB: true })
                    }
                  }
                })
            }
          })
        })
      }

      let packageDB = {
        getVehicleDetail,
        vehicleDetailNow
      }
      let vehicle = {
        getEfenceList: function (vehicleId) {
          let params = {
            condition: +vehicleId,
            userid: +store.getters.user.userid
          }
          return searchVEbyvehicleid(params)
        },
        addEfence: function (param) {
          return addVehicleefence(param)
        },
        getFollowList: function (param) {
          return getAlreadyFollow(param)
        },
        deleteEfence: function (param) {
          return deleteVehicleefence(param)
        },
        getYDSF: function (vehicleid) {
          let param = {
            id: vehicleid,
            userid: store.getters.user.userid
          }
          return getYdsfInfo(param)
        },
        addYDSF: function (params) {
          return addYdsf(params)
        },
        updateYDSF: function (params) {
          return updateYdsf(params)
        },
        deleteYDSF: function (params) {
          return delYdsf(params)
        }
      }
      let efence = {
        getList: function () {
          let params = {
            index: 0,
            pagesize: 40,
            condition: '',
            userid: store.getters.user.userid
          }
          return searchefence(params)
        },
        getListForVehicleId: function (vehicleId) {
          let params = {
            condition: +vehicleId,
            userid: +store.getters.user.userid
          }
          return searchVEbyvehicleid(params)
        }
      }
      let follow = {
        // 添加关注类型
        add (params) {
          let { Groupid, vehicleid, ...option } = { ...params }
          let Vehicleid = vehicleid || store.getters.selectVhID
          let Createdate = utils.formatDate.formatTime(new Date().getTime())
          let Shareind = 0
          let Createby = store.getters.user.userid
          // let Groupid
          let Groupname = ''
          let remark = option.remark || ''
          let name = ''
          let corpcode = ''
          let corpname = ''
          let updateDate = utils.formatDate.formatTime(new Date().getTime())
          let resParam = { Vehicleid, Createdate, Shareind, Createby, Groupid, Groupname, remark, name, corpcode, corpname, updateDate }
          resParam = {...resParam, ...params}
          return confirmFollow(resParam)
        },
        // 删除关注类型
        delete (prop) {
          let _this = this
          let key = prop[0] + '@' + prop[1] + '@' + store.getters.user.userid
          let param = {
            condition: key
          }
          removeFollow(param)
            .then(response => {
              if (response.data.result.code === 0) {
                store.commit('SET_FOLLOWLISTLOADING', {
                  boole: true,
                  content: '取消关注中'
                })
                _this.update()
                // 删除关注同时删除事件
                let vehicleid = prop[0]
                if (prop[2]) {
                  return
                }
                switch (prop[1]) {
                  case '350':
                    Vue.prototype.$request.vehicle.getEfenceList(prop[0])
                      .then(res => {
                        if (res.data.result.code === 0) {
                          let VE = res.data.data || []
                          VE.forEach(cell => {
                            let paraDeleteEfence = {
                              condition: vehicleid + '@' + cell.EfenceId,
                              userid: store.getters.user.userid
                            }
                            Vue.prototype.$request.vehicle.deleteEfence(paraDeleteEfence)
                              .then(res => {
                                if (res.data.result.code === 0) {
                                  // _this.message({
                                  //   message: '删除电子围栏成功',
                                  //   type: 'success'
                                  // })
                                }
                              })
                          })
                        }
                      })
                    break
                  case '351':
                    Vue.prototype.$request.vehicle.deleteYDSF({
                      id: prop[0],
                      userid: store.getters.user.userid
                    })
                      .then(function (res) {
                        if (res.data.result.code === 0) {
                          store.commit('delete_ydsfMarker')
                        }
                      })
                      .catch(function (error) {
                        if (error) {
                        }
                      })
                    break
                  default:
                    break
                }
              }
            })
            .catch(error => {
              if (error) {
                console.error(error)
              }
            })
        },
        update () {
          let para = {
            userid: store.getters.user.userid,
            condition: '',
            id: -1
          }
          queryfollowdata(para).then(res => {
            if (res.data.result.code === 0) {
              store.commit('SET_FOLLOWLISTLOADING', {
                boole: false,
                content: '更新关注列表'
              })
              let followData = {
                arrCarInfos: res.data.data || []
              }
              store.dispatch('mergeFollowData', followData)
            }
          })
        },
        // 更新关注树
        init () {
          let param = {
            userid: store.getters.user.userid,
            condition: '',
            id: -1
          }
          store.commit('SET_FOLLOWLISTLOADING', {
            boole: true,
            content: '关注列表加载中...'
          })
          getFollowData(param)
            .then(res => {
              function isSucceed (obj) {
                // 获取数据成功判断有问题o
                // 参数错误: code代码返回正常值0,data=null
                // 数据库无关注车辆信息时：同样返回值。
                // 无法区分处理,后者影响影响业务逻辑，暂先按后者处理
                // XXX001:潜伏期的BUG
                // return obj.data.result.code === 0;
                return !!(
                  obj.data &&
                  obj.data.result.code === 0
                )
              }
              let followData = {
                arrType: '',
                arrCarInfos: ''
              }
              // 并发请求是否成功
              let isRun = true
              res.forEach((data, i) => {
                let bloor = isSucceed(data)
                let key = i === 0 ? 'arrType' : 'arrCarInfos'
                isRun = isRun & bloor
                if (bloor) {
                  // XXX001:潜伏期的BUG
                  followData[key] = data.data.data || []
                }
              })

              // 成功则继续运行
              if (isRun) {
                store.commit('SET_FOLLOWLISTLOADING', {
                  boole: false,
                  content: '关注列表加载中...'
                })
                // store.commit('SET_FOLLOWDATA', followData);
                store.dispatch('mergeFollowData', followData)
              } else {
                store.commit('SET_FOLLOWLISTLOADING', {
                  boole: true,
                  content: '服务器错误...'
                })
              }
            })
            .catch(error => {
              if (error) {
                store.commit('SET_FOLLOWLISTLOADING', {
                  boole: true,
                  content: '请求失败'
                })
              }
            })
        },
        // 根据vehId获取所有关注
        getListForId (params = {}) {
          let id = params.id || store.getters.selectVhID
          let userid = store.getters.user.userid
          return followinfobyid({ id, userid })
        },
        getList (vehicleid) {
          return getFollow({ id: store.getters.user.userid })
        },
        getInfo (params) {
          let _this = this
          let key = params[0] + '@' + params[1] + '@' + store.getters.user.userid
          let param = {
            condition: key
          }
          return followinfo(param)
        }
      }

      return { vehicle, follow, efence, packageDB }
    }

    // 针对业务封装请求
    Vue.prototype.$request = CreateRequest()
  }
}

// 创建标识符`
function uuid (len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid = []; var i
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix]
  } else {
    var r
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16
        uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}
// 给服务器发送消息
function sendMessageToMqttServer (destinationName, topicName) {
  var objStr = JSON.stringify({
    clientid: clientuuid,
    topicname: topicName
  })
  var msg = new Messaging.Message(objStr)
  msg.destinationName = destinationName
  mqttClient.send(msg)
  // console.log(destinationName + "-" + objStr);
}
