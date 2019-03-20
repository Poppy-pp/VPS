/*
 * @description: vps状态树
 * @author: wp
 * @update: wp (2018-04-04)
 ---------------------------------------- */
import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

Vue.use(Vuex);
let settingPolice
if (localStorage.getItem('settingPolice')) {
  let str = localStorage.getItem('settingPolice')
  settingPolice = JSON.parse(str)
} else {
  settingPolice = {
    soundsOn: true,
    tipOn: true,
    followOn: true,
    savaFollow: true,
    weizhibaojing: true,
    didianbaojing: true,
    kaiguanjibaojing: true,
    shebeichaixiebaojing: true,
    tianxianguzhangbaojing: true,
    wudingweibaojing: true,
    ACCjiancebaojing: true,
    jinjibaojing: true,
    zidingyibaojing: true,
    dianyuanyichangbaojing: true,
    zhuangtaibaojing: true,
    dzwlbaojing: true,
    ydsfbaojing: true,
    codes: ['5', '']
  }
  localStorage.setItem('settingPolice', JSON.stringify(settingPolice))
}
const state = {
  count: { // 数据图表-总数统计
    alarmAll: '', // 报警
    mileAll: '', // 里程
    driveAll: '', // 行车
    onLineAll: '' // 在线
  },
  user: null, // 登录用户信息
  signalState: 1, // 用户通信状态 默认为离线1,0为通信中
  city: '成都市', // 设置当前用户默认城市
  mapObj: null, // 获取地图对象
  searchVal: {type: 'mohu', sval: ''}, // 搜索最新值
  map: {
    MAPTYPE: 0 // 地图类型默认0为高德地图,1为百度地图
  },
  curLoading: {
    hidden: false, // 地图加载过渡 缓冲效果
    pval: 0, // 进度条进度0-100
    isShowText: true, // 是否显示文字
    text: '数据读取中...' // 文本信息
  },
  hisZoom: { // 历史缩放窗体
    info: []
  },
  setCurVehInfo: [], // 当前操作的车辆信息
  GroupStatistics: [], // 分组统计信息
  carMarkerList: [], // 车辆点标注集合
  carlabelList: [], // 车辆点对应的label集合
  dataList: [], // 公用数据列表 tabletoken: ''
  TrajectoryTable: [], // 历史轨迹列表数据
  frameBoxAll: {
    fortificationBox: false, // 设防弹框
    enclosureBox: false, // 电子围栏弹框,
    instructionsBox: false, // 指令弹框
    followFrameBox: false, // 关注弹框
    removeFollowBox: false, // 取消关注
    remarkFrameBox: false, // 备注弹框
    followInfoFrameBox: false, // 关注信息
    addCarFrameBox: false, // 电子围栏添加车辆弹框
    taskNoticeFrameBox: false // 关于公共弹窗
  },
  taskNoticeData: [],
  defaultCheckedKeysList: [], // 默认选中树keys列表
  trajectoryFrameBox: false, // 历史轨迹弹框
  trajectoryDataS: [], // 历史轨迹数据组
  trajectoryActualData: null, // 历史轨迹显示的数据
  ThumbnailArrReplace: false, // 代替滚动显示隐藏
  addtransitionRight02: false, // 代替滚动过渡时间
  // monitorListState: true, // 监控列表状态
  // monitorlsitDetailsState: false, // 监控列表详情状态
  loadingMoni: false, // 监控列表详情加载
  monitorData: [], // 监控列表信息
  indexOfMonitorDetails: [0, 0],
  // 监控列表详情数据
  monitorDataDetails: {
    // basicdata: {
    //   carno: '',
    //   ownername: '',
    //   vin: '',
    //   corpname: '',
    //   appointdate: ''
    // },
    // proddata: [],
    // realdata: {
    //   istate: '',
    //   gpstime: '',
    //   veo: ''
    // }
  },
  // end
  echaerObj: '',
  // policeListState: true, // 报警列表状态
  // policeListDetailsState: false, // 报警列表详情状态
  policeData: [], // 报警列表
  thisAllpoliceDataList: [], // 当前车辆报警数据列表
  policeDataNum: {num: 0, obj: undefined}, // 报警列表个数
  policeRightFrame: '', // 报警信息右侧推送
  // 报警列表详情
  policeDataDetails: {
    basicdata: {
      carno: '',
      ownername: '',
      vin: '',
      corpname: '',
      appointdate: ''
    },
    proddata: [],
    realdata: {
      istate: '',
      gpstime: '',
      veo: ''
    }
  },
  // end
  // abnormaListState: true, // 异常列表状态
  // abnormaListDetailsState: false, // 异常列表详情状态
  abnormalData: [], // 异常列表
  thisAllabnormalDataList: [], // 当前车辆异常数据列表
  hisData: false,
  // 异常列表详情
  abnormalDetails: {
    basicdata: {
      carno: '',
      ownername: '',
      vin: '',
      corpname: '',
      appointdate: ''
    },
    proddata: [],
    realdata: {
      istate: '',
      gpstime: '',
      veo: ''
    }
  },
  abnormalNum: {num: 0, obj: undefined}, // 异常列表个数
  abnormalRightFrame: '', // 异常信息右侧推送
  /* 行为分析 年月日时间状态 */
  timeState: 1, // 1:天 2:月 3年
  /* end */
  /* 鼠标划过车辆获取当前一些信息 */
  moveCarInfo: {
    vehicleid: '', // 车辆标识ID
    lng: '', // 当前车辆经度
    lat: '', // 当前车辆纬度
    carno: '', // 车架号
    ownername: '' // 车主
  },
  coverArr: [], // 覆盖物数组集合
  /* 指令数据 */
  instructionsInfo: [], // 车辆设备编码
  instructionsArr: [], // 设备指令组
  /* end */
  zoom: 0, // 图表数据放大缩小 判断 0 全屏模式  1窗口模式
  echartsInstance: {
    speed: '',
    dayMileage: '',
    driveTime: '',
    risk: '',
    stopElectric: '',
    alarm: ''
  },
  arrDZWLList: [], // 电子围栏
  loadingDZWLList: true,
  selectVhID: '',
  arrFollowList: [],
  loadingFollowList: {
    boole: true,
    content: '关注列表加载中...'
  },
  arrCheck: [], // XXX:dev-tree-state
  treeState: {
    follow: {
      arrCheck: [],
      arrExpand: [],
      objVehicleState: {}
    },
    tree: {
      arrCheck: [],
      arrExpand: []
      // objVehicleState: {}
    }
  },
  objTransfer: {
    complate: '',
    isTransfer: true
  },
  arrFollowType: [],
  arrFollowCarInfo: [],
  tabsState: {index: 0, state: false},
  dictYDSFMarker: {},
  home: null,
  readNoteInfo: [], // 备注记录
  fenceInfoForAddCar: {},
  arrDataForAddCarTree: [],
  deviceInfos: [],
  filterTree: {unProdG: true, unVehG: true},
  treeLoading: false,
  sounds: {
    abnormal: false,
    police: false,
    timeA: undefined,
    timeP: undefined
  },
  setting: {
    police: settingPolice
  },
  screenText: '',
  screenCorp: '',
  rightBtnObj: {},
  loadingObj: {
    monitorDetails: true,
    ECSpeed: true,
    ECDriveTime: true,
    ECDayMileage: true,
    ECRisk: true,
    ECParkingTime: true

  },
  listPolice: [],
  arrCuNotify: [],
  statusNotify: false
  // filterT


};

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  actions
});

export default store;
