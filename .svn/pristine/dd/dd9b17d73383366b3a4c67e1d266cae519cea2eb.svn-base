// var PermissionManage
// (function () {
function manage () {
  var nameToId = {
    'search': 101,
    'vehTree': 102,
    'follow': 103,
    'dzwl': 104,
    'ydsf': 105,
    'dctx': 106,
    'un07': 107,
    'vehicleDetails': 108,
    'un09': 109,
    'un10': 110,
    'un11': 111,
    'un12': 112,
    'un13': 113,
    'un14': 114,
    'un15': 115,
    'un16': 116,
    'un17': 117,
    'un18': 118,
    'un19': 119,
    'un20': 120,
    'un21': 121,
    'un22': 122,
    'un23': 123,
    'un24': 124,
    'un25': 125,
    'un26': 126
  }

  var idToName = {
    101: 'search', // '搜索功能'],
    102: 'vehTree', // '车辆列表'],
    103: 'follow', // '关注'],
    104: 'dzwl', // '电子围栏'],
    105: 'ydsf', // '原地设防'],
    106: 'dctx', // '动车提醒'],
    107: 'un07', // '异常报警'],
    108: 'vehicleDetails', // '车辆详情'],
    109: 'un09', // '指令'],
    110: 'un10', // '历史轨迹'],
    111: 'un11', // '车辆监控'],
    112: 'un12', // '报警功能'],
    113: 'un13', // '车辆异常'],
    114: 'un14', // '工作交接'],
    115: 'un15', // '数据更新'],
    116: 'un16', // '数据图表'],
    117: 'un17', // '操作日记'],
    118: 'un18', // '操作手册'],
    119: 'un19', // '清除缓存'],
    120: 'un20', // '主题切换'],
    121: 'un21', // '设置'],
    122: 'un22', // '单车实时跟踪'],
    123: 'un23', // '多车跟踪（后车追前车）'],
    124: 'un24', // '管理后台'],
    125: 'un25', // '备注'],
    126: 'un26' // '工具条']
  }
  this.idToName = (id) => idToName[id]
  this.nameToId = (name) => nameToId[name]
  this.module = {
    '_list': ['search', 'vehTree', 'follow', 'dzwl', 'ydsf', 'dctx', 'vehicleDetails'],
    'search': { v: {}, m: {} },
    'vehTree': { v: {}, m: {} },
    'follow': { v: {}, m: {} },
    'dzwl': { v: {}, m: {} },
    'ydsf': { v: {}, m: {} },
    'dctx': { v: {}, m: {} },
    'vehicleDetails': { v: {}, m: {} }
  }
}
manage.prototype.setAllList = function (dict) {
  this.AllList = dict
}
manage.prototype.setUserList = async function (dict) {
  this.UserList = dict
}
// 取出指定模块的相关权限
manage.prototype.getListForModuleId = function (moduleId) {
  return this.UserList.filter(permission => {
    return permission.moduleid === moduleId
  })
}
manage.prototype.change = function (moduleName, key, key2, value) {
  this.module[moduleName][key][key2] = value
}
manage.prototype.init = function () {
  let _this = this
  return new Promise(resolve => {
    this.module._list.forEach((moduleName, index) => {
      let moduleId = _this.nameToId(moduleName)
      let cuListOfModule = _this.getListForModuleId(moduleId)
      let view
      let model
      switch (moduleName) {
        // search 模块
        case 'search':
          // v 暂时取消。预留
          // m 逻辑模块： 权限转移关键词。search 解析关键词 实现权限功能
          let word = []
          cuListOfModule.forEach(permission => {
            switch (permission.id) {
              case 101001: // 车辆
                word.push('vehicle')
                break
              case 101002: // 车主
                word.push('name')
                break
              case 101003: // 设备
                word.push('prod')
                break
              default:
                break
            }
          })
          _this.module[moduleName].m.wordOfSearchFilter = word
          break
        // 车辆树
        case 'vehTree':
          view = { state: false, type: false, unVehG: false, unProdG: false, filter: false }
          model = {}
          cuListOfModule.forEach(permission => {
            switch (permission.id) {
              case 102001: // 标签分类

                break
              case 102002: // 在线状态
                view.state = true
                break
              case 102003: // 车辆类型
                view.type = true
                break
              case 102004: // 筛选
                view.filter = true
                break
              case 102005: // 设备
                view.unProdG = true
                break
              case 102006: // 未分组设备
                view.unVehG = true
                break
              default:
                break
            }
          })
          _this.module[moduleName].v = view
          _this.module[moduleName].m = model
          break
        case 'follow':
          view = { enable: false, showCustom: false, value: [] }
          model = {}
          cuListOfModule.forEach(permission => {
            switch (permission.id) {
              case 103001: // 关注
                view.enable = true
                break
              case 103002: // 自定义
                // view.value.push('4')
                view.showCustom = true
                break
              case 103003: // 原地设防
                view.value.push('351')
                break
              case 103004: // 电子围栏
                view.value.push('350')
                break
              case 103005: // 扣车
                view.value.push('1')
                break
              case 103006: // 逾期
                view.value.push('2')
                break
              case 103007: // 黑名单
                view.value.push('5')
                break
              case 103008: // 动车
                view.value.push('352')
                break
              case 103009: // 潜在风险
                view.value.push('3')
                break

              default:
                break
            }
          })
          _this.module[moduleName].v = view
          _this.module[moduleName].m = model
          break
        case 'dzwl':
          view = { enable: false, setBool: false, changeBool: false, region: false }
          cuListOfModule.forEach(permission => {
            switch (permission.id) {
              case 104001:
                view.enable = true
                break
              case 104002:
                view.changeBool = true
                break
              case 104003:
                view.region = true
                break
              case 104004:
                view.enable && (view.setBool = true)
                break
              default:
                break
            }
          })
          _this.module[moduleName].v = view
          break
        case 'ydsf':
          view = { enable: false }
          cuListOfModule.forEach(permission => {
            switch (permission.id) {
              case 105001:
                view.enable = true
                break

              default:
                break
            }
          })
          _this.module[moduleName].v = view
          break
        case 'dctx':
          view = { enable: false }
          cuListOfModule.forEach(permission => {
            switch (permission.id) {
              case 106001:
                view.enable = true
                break
              default:
                break
            }
          })
          _this.module[moduleName].v = view
          break
        case 'vehicleDetails':
          view = {levelVehicle: [], levelProd: [], chezhu: false, vehicle: false, vehiclePhoto: false, prod: false, prodPhoto: false}
          cuListOfModule.forEach(permission => {
            switch (permission.id) {
              case 108001:
                view.chezhu = true
                break
              case 108002:
                view.vehicle = true
                break
              case 108003:
                view.vehiclePhoto = true
                break
              case 108004:
                view.prod = true
                break
              case 108005:
                view.prodPhoto = true
                break
              default:
                view.levelVehicle = [1, 1, 1, 1, 1]
                view.levelProd = [1, 1, 1]
                break
            }
          })
          _this.module[moduleName].v = view
          break
        default:
          break
      }
      if (index === _this.module._list.length - 1) {
        resolve(1)
      }
    })
  })
}
let oldSingle = null
function PermissionManage () {
  if (!oldSingle) {
    var single = new manage()
    single.des = '权限管理'
    oldSingle = single
    return single
  } else {
    //   var single = oldSingle
    return oldSingle
  }
}
// })()

window.PermissionManage = PermissionManage
// export  {'PM':a}
var PM = new PermissionManage()

export { PM }
