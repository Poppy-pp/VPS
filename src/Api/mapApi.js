/*
 * @description: vps地图首页请求
 * @author: wp
 * @update: wp (2018-04-04)
 */
import axios from 'axios';
import Qs from 'qs';
window.axios = axios

var gisapiservice = '/gisapiservice';
var api = '/api';
var newApi = '/newApi'
var vehicle = '/vehicle';
var chart = '/chart'
var photo = '/photo'

// 搜索框搜索
export const seachList = params => {
  return axios.post(`${gisapiservice}/Vehicle/queryvehicle`, params);
};
// 地图左侧列表树
export const getCorpList = params => {
  return axios.post(`${gisapiservice}/Corp/corpdetail`, params);
};
// 列表树子节点标签信息加载
export const getChildrenTag = params => {
  return axios.post(`${gisapiservice}/Tag/gettag`, params);
};
// 列表树子节点车辆信息加载
export const getChildrenCar = params => {
  return axios.post(`${gisapiservice}/Tag/getvehicle`, params);
};
// 根据车辆id获取备注信息
export const vehicleremarks = params => {
  return axios.post(`${api}/remark/vehicleremarks`, params);
};
// 确认备注
export const remarkvehicle = params => {
  return axios.post(`${api}/remark/remarkvehicle`, Qs.stringify(params));
};
// 删除备注
export const deleteremark = params => {
  return axios.post(`${api}/remark/deleteremark`, params);
};
// 获取车辆详情
export const vehicledetail = params => {
  return axios.post(`${gisapiservice}/Vehicle/vehicledetail`, params);
};
// 根据车辆id查询对应的电子围栏
export const searchVEbyvehicleid = params => {
  return axios.post(`${api}/dzwl/searchVEbyvehicleid`, params);
};
// 根据车辆id查询对应的电子围栏的车辆信息
export const searchVEbyefenceid = params => {
  return axios.post(`${api}/dzwl/searchVEbyefenceid`, params);
};
// 根据车辆id获取所有关注
export const followinfobyid = params => {
  return axios.post(`${api}/follow/followinfobyid`, params);
};
export const followinfo = params => {
  return axios.post(`${api}/follow/followinfo`, params)
}
// 跟据车辆id查找对应原地设防信息
export const getydsfbyvehicleid = params => {
  return axios.post(`${api}/ydsf/getydsfbyvehicleid`, params);
};

// 根据车辆id和设备id获取设备信息
export const getvehicletotaldistance = params => {
  return axios.post(`${api}/vehicledistance/getvehicletotaldistance`, params);
};
export const getvehicletodaydistance = params => {
  return axios.post(`${api}/vehicledistance/getvehicletodaydistance`, params);
};
// 根据车辆id获取车辆监控列表详情
export const monitorlsitDetailsAxios = params => {
  return axios.post(`${gisapiservice}/Vehicle/vehicledetail`, Qs.stringify(params));
};
// 获取报警类型
export const policeType = params => {
  return axios.post(`${api}/alarm/alarmparms`, params);
};
// 获取指定用户的所有车
export const getvehiclessimple = params => {
  return axios.post(`${api}/basicdatainfo/getvehiclessimple`, params);
};
// 获取指定用户的车
export const getalltags = params => {
  return axios.post(`${api}/basicdatainfo/getalltags`, params);
};
// 获取服务器当前时间
export const currentServerTime = params => {
  return axios.post(`${api}/serverinfo/servertime`, params);
};
// ********原地设防************************** start

// 获取是否原地设防 信息
export const getYdsfInfo = params => {
  return axios.post(`${api}/ydsf/getydsfbyvehicleid`, params);
};

// 增加原地设防
export const addYdsf = params => {
  return axios.post(`${api}/ydsf/addydsf`, params);
};
// 修改原地设防
export const updateYdsf = params => {
  return axios.post(`${api}/ydsf/updateydsf`, params);
};
// 删除原地设防
export const delYdsf = params => {
  return axios.post(`${api}/ydsf/deleteefencebyvehicleid`, params);
};
/** ******原地设防**********************end */


/** ******历史轨迹**********************start */

// 获取所有车辆历史GPS位置
export const gethistorybyvehicleidandprodnum = params => {
  return axios.post(`${api}/vehiclesb/gethistorybyvehicleidandprodnum`, params);
};


/** ******历史轨迹**********************end */

/** ******设备指令**********************start */

// 获取所有设备指令
export const getInstructions = params => {
  return axios.post(`${api}/order/orders`, params);
};
export const getInstructionsDX = params => {
  return axios.post(`${api}/order/dxorders`, params)
}

// 发送指令接口
export const sendInstructions = params => {
  return axios.post(`${gisapiservice}/Prod/sendcommand`, params);
};
/** ******设备指令**********************end */

/** ******关注信息**********************start */

// 获取全部关注类型
export const getFollow = params => {
  return axios.post(`${api}/followgroup/getfollowgroups`, params);
};
// 获取关注数据
export const queryfollowdata = params => {
  return axios.post(`${api}/follow/queryfollowdata`, params);
};
export const getFollowData = params => {
  return axios.all([getFollow({id: params.userid}), queryfollowdata(params)])
}
// 获取已关注类型
export const getAlreadyFollow = params => {
  return axios.post(`${api}/follow/followinfobyid`, params);
};
// 确认关注
export const confirmFollow = params => {
  return axios.post(`${api}/follow/followvehicle`, Qs.stringify(params));
};
// 取消关注
export const removeFollow = params => {
  return axios.post(`${api}/follow/removefollow`, params);
}
/** ******关注信息**********************end */

export const addfence = params => {
  return axios.post(`${api}/dzwl/addefence`, params)
}
export const deletefence = params => {
  return axios.post(`${api}/dzwl/deleteefence`, params)
}
// 获取电子围栏
export const searchefence = params => {
  return axios.post(`${api}/dzwl/searchefence`, params);
};
export const addVehicleefence = params => {
  return axios.post(`${api}/dzwl/addvehicleefence`, params)
}
// 更新电子围栏信息
export const updateefence = params => {
  return axios.post(`${api}/dzwl/updateefence`, params)
}
// 查询所有电子围栏信息
export const getveinfobyuserid = params => {
  return axios.post(`${api}/dzwl/getveinfobyuserid`, params)
}
export const deleteVehicleefence = params => {
  return axios.post(`${api}/dzwl/deletevehicleefence`, params)
}

export const getefencebyid = params => {
  return axios.post(`${api}/dzwl/getefencebyid`, params)
}
/** ******电子围栏**********************end */
export const mergePost = (arr) => {
  return axios.all(arr)
}

// 获取指定车辆的状态
export const getvehiclesstatus = params => {
  return axios.post(`${gisapiservice}/Vehicle/getvehiclesstatus`, params);
};
/** ******车辆状态**********************end */


// 获取指定设备详情
export const proddetail = params => {
  return axios.post(`${gisapiservice}/Prod/proddetail`, params);
};
/** ******车辆状态**********************end */

// 获取所有车辆基础数据数量
export const vehiclesCount = params => { //  需要传用户的id
  return axios.post(`${api}/basicdatainfo/getvehiclessimplecount`, params);
};
/** ******车辆数量**********************end */


/** ******数据图表**********************start */
// 里程公里数
export const mileAge = params => {
  return axios.get(`${vehicle}/data/findGross`, {params: params});
};
// 平均速度
export const speedAvg = params => {
  return axios.get(`${vehicle}/data/findVeo`, {params: params});
};
// 车辆报警
export const alarmVeh = params => {
  return axios.get(`${vehicle}/findAlarm`, {params: params});
};
// 历史轨迹
export const historyDraw = params => {
  return axios.get(`${vehicle}/data/findHistory`, {params: params});
};
// 停车时长
export const parkingLength = params => {
  return axios.get(`${vehicle}/data/findStop`, {params: params});
};
// 行车时长
export const driveLength = params => {
  return axios.get(`${vehicle}/data/findRun`, {params: params});
};

/** ******数据图表**********************end */
export const getvehiclessimpleFile = params => {
  return axios.post(`${newApi}/basicdatainfo/getvehiclessimple_toFile`, params)
};
export const getprodssimpleFile = params => {
  return axios.post(`${newApi}/basicdatainfo/getprodssimple_toFile`, params)
}

export const getvehiclessimpleNew = params => {
  return axios.get('http://gisserver.wwvas.com:9209' + params)
}
export const getprodssimpleNew = params => {
  return axios.get('http://gisserver.wwvas.com:9209' + params)
}

// 权限
export const getpermissionsAll = params => {
  return axios.post(`${api}/permissions/getallresource`, params)
}

export const getpermissionsForUser = params => {
  return axios.post(`${api}/permissions/getuserresource`, params)
}

// 获取用户权限
export const getPermissions = userid => {
  return axios.all([getpermissionsAll({userid}), getpermissionsForUser(userid)])
}

// 列表未知设备
export const getunProd = params => {
  return axios.post(`${gisapiservice}/Prod/getunknownprod`, params);
};


export const chartForSpeed = params => {
  let {type, vehicleid} = {...params}
  switch (type) {
    case 1:
      return axios.post(`${chart}/vehicleAverageSpeedByDay`, {vehicleid})
    case 2:
      return axios.post(`${chart}/vehicleAverageSpeedByMouth`, {vehicleid})
    case 3:
      return axios.post(`${chart}/vehicleAverageSpeedByYear`, {vehicleid})
    default:
      return axios.post(`${chart}/vehicleAverageSpeedByDay`, {vehicleid})
  }
}

export const chartForDriveLength = params => {
  let {type, vehicleid} = {...params}
  switch (type) {
    case 1:
      return axios.post(`${chart}/vehicleDriveLengthByDay`, {vehicleid})
    case 2:
      return axios.post(`${chart}/vehicleDriveLengthByMouth`, {vehicleid})
    case 3:
      return axios.post(`${chart}/vehicleDriveLengthByYear`, {vehicleid})
    default:
      return axios.post(`${chart}/vehicleDriveLengthByDay`, {vehicleid})
  }
}

export const chartForDistance = params => {
  let {type, vehicleid} = {...params}
  switch (type) {
    case 1:
      return axios.post(`${chart}/vehicleDistanceByDay`, {vehicleid})
    case 2:
      return axios.post(`${chart}/vehicleDistanceByMouth`, {vehicleid})
    case 3:
      return axios.post(`${chart}/vehicleDistanceByYear`, {vehicleid})
    default:
      return axios.post(`${chart}/vehicleDistanceByDay`, {vehicleid})
  }
}
export const chartForParkTime = params => {
  let {type, vehicleid} = {...params}
  switch (type) {
    case 1:
      return axios.post(`${chart}/vehicleStopTimeByDay`, {vehicleid})
    case 2:
      return axios.post(`${chart}/vehicleStopTimeByMouth`, {vehicleid})
    case 3:
      return axios.post(`${chart}/vehicleStopTimeByYear`, {vehicleid})
    default:
      return axios.post(`${chart}/vehicleStopTimeByDay`, {vehicleid})
  }
}
export const getTaskNotice = params => {
  return axios.post(`${api}/tasknotice/gettasknotice`, params)
}

export const getsbbysbid = params => {
  return axios.post(`${api}/vehiclesb/getsbbysbid`, params)
}
export const getPhoto = params => {
  // return axios.get('http://www.wwvas.com:9119/vasms-web/gis/declaration?vehicleId=565989')
  return axios.get('photo/gis/declaration?vehicleId=' + params)
  // + params)
}

// 获取报警信息
export const getalarms = params => {
  return axios.post(`${api}/alarm/alarms`, params)
}

/**
 * 添加follow分组
 * @param {object} params
 * {Createdate,CreateBy,Groupname}
 * Demo:
 * {
 *   Createdate:2018-11-05 13:24:34',
 *   CreateBy:'10680',
 *   Groupname:'test1'
 * }
 */
export const addFollowGroup = params => {
  return axios.post(`${api}/followgroup/addfollowgroup`, params)
}

/**
 * 删除follow分组
 * @param {object} params
 * {id}
 * demo:
 * {
 *   id:'10860,770'
 * }
 */
export const removeFollowGroup = params => {
  return axios.post(`${api}/followgroup/deletefollowgroup`, params)
}
