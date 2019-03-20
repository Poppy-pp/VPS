/*
* @description: 小工具方法类
* @author: wp
* @update: 2018-04-12
------------------------------------- */
var SIGN_REGEXP = /([yMdhsm])(\1*)/g;
var DEFAULT_PATTERN = 'yyyy-MM-dd';

function padding (s, len) {
  for (var i = 0, len = len - (s + '').length; i < len; i++) {
    s = '0' + s;
  }
  return s;
};

function transformLat (x, y) {
  var ret = -100 + 2 * x + 3 * y + 0.20000000000000001 * y * y + 0.10000000000000001 * x * y + 0.20000000000000001 * Math.sqrt(Math.abs(x));
  ret += ((20 * Math.sin(6 * x * 3.1415926535897931) + 20 * Math.sin(2 * x * 3.1415926535897931)) * 2) / 3;
  ret += ((20 * Math.sin(y * 3.1415926535897931) + 40 * Math.sin((y / 3) * 3.1415926535897931)) * 2) / 3;
  ret += ((160 * Math.sin((y / 12) * 3.1415926535897931) + 320 * Math.sin((y * 3.1415926535897931) / 30)) * 2) / 3;
  return ret;
}

function transformLon (x, y) {
  var ret = 300 + x + 2 * y + 0.10000000000000001 * x * x + 0.10000000000000001 * x * y + 0.10000000000000001 * Math.sqrt(Math.abs(x));
  ret += ((20 * Math.sin(6 * x * 3.1415926535897931) + 20 * Math.sin(2 * x * 3.1415926535897931)) * 2) / 3;
  ret += ((20 * Math.sin(x * 3.1415926535897931) + 40 * Math.sin((x / 3) * 3.1415926535897931)) * 2) / 3;
  ret += ((150 * Math.sin((x / 12) * 3.1415926535897931) + 300 * Math.sin((x / 30) * 3.1415926535897931)) * 2) / 3;
  return ret;
}
// 获取当前日期 格式为yyy-mm-dd
export default {
  // 关闭所有弹框公共方法
  closeBoxCom (s, close) {
    let storeObj = s.frameBoxAll;
    $('.' + close).removeClass('cur'); // 关闭去除按钮样式
    for (let obj in storeObj) {
      if (storeObj[obj]) {
        storeObj[obj] = false;
        break;
      }
    }
  },
  point2Address (x, y, call, mapObj) {
    // let mapObj = new AMap.Map('mapContainer')
    let MGeocoder
    mapObj.plugin(['AMap.Geocoder'], function () {
      MGeocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      })
      MGeocoder.getAddress([x, y], function (status, result) {
        var data = ''
        if (status === 'complete' && result.info === 'OK') {
          data = result.regeocode.formattedAddress; // 返回地址描述;
        } else {
          data = '获取位置信息失败';
        }
        call(data);
      })
    })
  },
  // 根据车辆状态切换车辆 颜色
  getMapCarStateSrc (state) {
    var src = '';
    switch (state) {
      case 0:
        src = 'static/images/car/carstate0.png';
        break;
      case 1:
        src = 'static/images/car/carstate1.png';
        break;
      case 2:
        src = 'static/images/car/carstate2.png';
        break;
      case 3:
        src = 'static/images/car/carstate3.png';
        break;
      case 4:
        src = 'static/images/car/carstate4.png';
        break;
      default:
        src = 'static/images/car/carstate0.png';
        break;
    }
    return src;
  },
  // 车子平滑移动 到推送位置
  moveVehicle ({
    state,
    realdata,
    vehdata
  }) {
    var speed = 0;
    let s
    var point = new AMap.LngLat(vehdata.realdata.lng, vehdata.realdata.lat);
    var markers = state.carMarkerList;
    var marker_labels = state.carlabelList;
    var marker = null;
    var marker_label = null;
    for (var i = 0, len = markers.length; i < len; i++) {
      if (markers[i].getExtData().vehicleid == realdata.vehicleid) {
        marker = markers[i];
        marker_label = marker_labels[i];
        break;
      }
    }
    // 创建车辆图标
    var cImg = document.createElement('img');
    cImg.className = 'cIcon';
    cImg.style.width = '45px';
    cImg.style.height = '46px';
    cImg.src = this.getMapCarStateSrc(realdata.istate);
    if (marker != null) {
      marker.setContent(cImg);
      // 判断移动过去还是直接定位过去
      // 单位：米
      var distance = marker.getPosition().distance(point);
      if (distance > 500) {
        // 移动(类似于直接移动过去)
        // moveto(point,km/h)
        s = 12000000
        s = 18 / 5 * distance
        marker.moveTo(point, s);
        marker_label.moveTo(point, s);
        // speed = 10;
        // speed = distance / 12000000
        speed = 1 * 1000
      } else {
        // 移动
        // marker.setAngle(this.get2PointAngle(marker.getPosition().lng, marker.getPosition().lat, point.lng, point.lat));
        s = 120
        // s = 100 / 3
        s = 3600 / 1000 * 100
        marker.moveTo(point, s)
        marker_label.moveTo(point, s);
        // speed = 120;
        speed = distance / s * 1000
      }
    }
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(true)
      }, speed);
    });
  },
  // 获取起点到终点角度（正北为0，顺时针0-360）
  get2PointAngle (startX, startY, endX, endY) {
    var result = 0;
    var diff_x = endX - startX;


    var diff_y = endY - startY;
    // 返回角度,不是弧度
    var lineAngel = Math.abs(360 * Math.atan(diff_y / diff_x) / (2 * Math.PI));
    // 判断象限
    if (diff_x > 0 && diff_y > 0) result = 90 - lineAngel; // 一象限
    else if (diff_x > 0 && diff_y < 0) result = 90 + lineAngel; // 四象限
    else if (diff_x < 0 && diff_y < 0) result = 180 + (90 - lineAngel); // 三象限
    else if (diff_x < 0 && diff_y > 0) result = 270 + lineAngel; // 二象限

    return result;
  },
  // wgs84 To GCJ-02
  transformWGStoGCJ (wgLon, wgLat) {
    var dLat = transformLat(wgLon - 105, wgLat - 35);
    var dLon = transformLon(wgLon - 105, wgLat - 35);
    var radLat = (wgLat / 180) * 3.1415926535897931;
    var magic = Math.sin(radLat);
    magic = 1.0 - 0.0066934216229659433 * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180) / ((6335552.7170004258 / (magic * sqrtMagic)) * 3.1415926535897931);
    dLon = (dLon * 180) / ((6378245 / sqrtMagic) * Math.cos(radLat) * 3.1415926535897931);
    var mylonlat = new Array();
    mylonlat.push(wgLon + dLon, wgLat + dLat);
    return mylonlat;
  },

  // 在线状态判断
  isTrueLocal (lon, lat) {
    if (lon != null && lat != null) {
      if (lon > 0 && lat > 0 && lon < 180 && lat < 90) {
        return '是';
      } else {
        return '否';
      }
    } else return '否';
  },
  // 电量判断
  powerTransform (value) {
    var result = '-';
    // 电量
    if (value != undefined && value.power == -1 && value.power != '-1') {
      result = value + '%';
    }
    return result;
  },
  // 获取车辆状态描述
  getCarStateText (code) {
    code = parseFloat(code);
    var value = '';
    switch (code) {
      case 0:
        value = '行驶';
        break;
      case 1:
        value = '离线';
        break;
      case 2:
        value = '停车';
        break;
      case 3:
        value = '报警';
        break;
      case 4:
        value = '无效定位';
        break;
      default:
        value = '停车';
    }
    return value;
  },
  // 方向格式化
  formateFX (value) {
    var result = '';
    switch (value) {
      case 0:
        result = '正北方向';
        break;
      case 90:
        result = '正东方向';
        break;
      case 180:
        result = '正南方向';
        break;
      case 270:
        result = '正西方向';
        break;
      case 360:
        result = '正北方向';
        break;
    }

    if (value > 0 && value < 90) {
      result = '东北方向';
    } else if (value > 90 && value < 180) {
      result = '东南方向';
    } else if (value > 180 && value < 270) {
      result = '西南方向';
    } else if (value > 270 && value < 360) {
      result = '西北方向';
    }

    return result;
  },
  // 时间转化
  transformTime (time) {
    var value = '';
    if (time == undefined || time == null) return '';
    if (time.indexOf('T') > -1) {
      if (time.indexOf('Z') > -1) {
        var dateee = new Date(time).toJSON();
        var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '');
        return date;
      } else {
        return time.replace(/T/g, ' ').replace(/Z/g, ' ');
      }
    }
    if (time.indexOf('Date') > -1) {
      var date = new Date(eval(time.replace(/\/Date\((\d+)\)\//gi, 'new Date($1)')));
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      value = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      return value;
    }
    if (time.length == 13) {
      var date = new Date(parseFloat(time));
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      value = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
      return value;
    }

    return time;
  },
  // 格式化停车时长
  formatTCSC (time) {
    // 计算出相差天数
    var days = Math.floor(time / (24 * 3600 * 1000));
    // 计算出小时数
    var leave1 = time % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
    var hours = Math.floor(leave1 / (3600 * 1000));
    // 计算相差分钟数
    var leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
    var minutes = Math.floor(leave2 / (60 * 1000));
    // 计算相差秒数
    var leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
    var seconds = Math.round(leave3 / 1000);

    var result = days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒';
    if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
      result = '';
    }

    return result;
  },
  // 本地计算获取停车时长
  getTCSC (start, end) {
    if (start == undefined || start == null || end == undefined || end == null) {
      return '';
    } else {
      var time = new Date(end) - new Date(start);
      // 计算出相差天数
      var days = Math.floor(time / (24 * 3600 * 1000));
      // 计算出小时数
      var leave1 = time % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
      var hours = Math.floor(leave1 / (3600 * 1000));
      // 计算相差分钟数
      var leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
      var minutes = Math.floor(leave2 / (60 * 1000));
      // 计算相差秒数
      var leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
      var seconds = Math.round(leave3 / 1000);

      var result = days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒';
      if (days < 0 || hours < 0 || minutes < 0 || seconds < 0) {
        result = '0天0小时0分29秒';
      }

      return result;
    }
  },
  // 数组倒序
  sortArray (array) {
    let temp = [];


    let resList = array;
    for (var i = resList.length - 1; i > 0; i--) {
      temp.push(resList[i]);
    }
    return temp;
  },
  // 判断当前数组中是否存在某个属性
  findElem (arrayToSearch, attr, val) {
    for (var i = 0; i < arrayToSearch.length; i++) {
      if (arrayToSearch[i][attr] == val) {
        return false;
      }
    }
    return true;
  },
  // 自动生成批号
  getDateTime () {
    var d = new Date();
    var year = d.getFullYear() + '';
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var day = d.getDay();
    var Hours = d.getHours();
    var Minutes = d.getMinutes();
    var Seconds = d.getSeconds();
    var c = year;
    c = month < 10 ? c + '0' + month : c + month;
    c = date < 10 ? c + '0' + date : c + date;
    c = Hours < 10 ? c + '0' + Hours : c + Hours;
    c = Minutes < 10 ? c + '0' + Minutes : c + Minutes;
    c = Seconds < 10 ? c + '0' + Seconds : c + Seconds;
    return c;
  },
  // 日期加减一天   days为1加一天  为负数加对应值
  addReduceDate (date, days) {
    var date = new Date(date);
    date.setDate(date.getDate() + days);
    return date;
  },
  // 获取当月最后一天
  getCurrentMonthLast () {
    var date = new Date();
    var currentMonth = date.getMonth();
    var nextMonth = ++currentMonth;
    var nextMonthFirstDay = new Date(date.getFullYear(), nextMonth, 1);
    var oneDay = 1000 * 60 * 60 * 24;
    return new Date(nextMonthFirstDay - oneDay);
  },
  // 获取当月1号
  getDateMonthOne () {
    var date = new Date();


    var year = date.getYear() + 1900;


    var month = date.getMonth() + 1;
    month = month < 10 ? '0' + month : month;
    return year + '-' + month + '-01';
  },
  // js转换金额为中文大写
  changeMoneyToChinese (money) {
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'); // 汉字的数字
    var cnIntRadice = new Array('', '拾', '佰', '仟'); // 基本单位
    var cnIntUnits = new Array('', '万', '亿', '兆'); // 对应整数部分扩展单位
    var cnDecUnits = new Array('角', '分', '毫', '厘'); // 对应小数部分单位
    // var cnInteger = "整"; //整数金额时后面跟的字符
    var cnIntLast = '元'; // 整型完以后的单位
    var maxNum = 999999999999999.9999; // 最大处理的数字

    var IntegerNum; // 金额整数部分
    var DecimalNum; // 金额小数部分
    var ChineseStr = ''; // 输出的中文金额字符串
    var parts; // 分离金额后用的数组，预定义
    if (money == '') {
      return '';
    }
    money = parseFloat(money);
    if (money >= maxNum) {
      $.alert('超出最大处理数字');
      return '';
    }
    if (money == 0) {
      // ChineseStr = cnNums[0]+cnIntLast+cnInteger;
      ChineseStr = cnNums[0] + cnIntLast
      // document.getElementById("show").value=ChineseStr;
      return ChineseStr;
    }
    money = money.toString(); // 转换为字符串
    if (money.indexOf('.') == -1) {
      IntegerNum = money;
      DecimalNum = '';
    } else {
      parts = money.split('.');
      IntegerNum = parts[0];
      DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) { // 获取整型部分转换
      var zeroCount = 0;


      var IntLen = IntegerNum.length;
      for (var i = 0; i < IntLen; i++) {
        var n = IntegerNum.substr(i, 1);


        var p = IntLen - i - 1;


        var q = p / 4;


        var m = p % 4;
        if (n == '0') {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            ChineseStr += cnNums[0];
          }
          zeroCount = 0; // 归零
          ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          ChineseStr += cnIntUnits[q];
        }
      }
      ChineseStr += cnIntLast;
      // 整型部分处理完毕
    }
    if (DecimalNum != '') { // 小数部分
      var decLen = DecimalNum.length;
      for (var i = 0; i < decLen; i++) {
        var n = DecimalNum.substr(i, 1);
        if (n != '0') {
          ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (ChineseStr == '') {
      // ChineseStr += cnNums[0]+cnIntLast+cnInteger;
      ChineseStr += cnNums[0] + cnIntLast;
    }
    /* else if( DecimalNum == '' ){
              ChineseStr += cnInteger;
              ChineseStr += cnInteger;
          } */
    return ChineseStr;
  },
  // 获取距离当前时间三年
  getDateThreeYers (date, num) {
    var pattern = 'yyyy-MM-dd';
    return pattern.replace(SIGN_REGEXP, function ($0) {
      switch ($0.charAt(0)) {
        case 'y':
          return padding(date.getFullYear() + num, $0.length);
        case 'M':
          return padding(date.getMonth() + 1, $0.length);
        case 'd':
          return padding(date.getDate(), $0.length);
        case 'w':
          return date.getDay() + 1;
        case 'h':
          return padding(date.getHours(), $0.length);
        case 'm':
          return padding(date.getMinutes(), $0.length);
        case 's':
          return padding(date.getSeconds(), $0.length);
      }
    });
  },
  // 日期格式化公用方法
  formatDate: {
    format (date, pattern) {
      pattern = pattern || DEFAULT_PATTERN;
      return pattern.replace(SIGN_REGEXP, function ($0) {
        switch ($0.charAt(0)) {
          case 'y':
            return padding(date.getFullYear(), $0.length);
          case 'M':
            return padding(date.getMonth() + 1, $0.length);
          case 'd':
            return padding(date.getDate(), $0.length);
          case 'w':
            return date.getDay() + 1;
          case 'h':
            return padding(date.getHours(), $0.length);
          case 'm':
            return padding(date.getMinutes(), $0.length);
          case 's':
            return padding(date.getSeconds(), $0.length);
        }
      });
    },
    parse (dateString, pattern) {
      var matchs1 = pattern.match(SIGN_REGEXP);
      var matchs2 = dateString.match(/(\d)+/g);
      if (matchs1.length == matchs2.length) {
        var _date = new Date(1970, 0, 1);
        for (var i = 0; i < matchs1.length; i++) {
          var _int = parseInt(matchs2[i]);
          var sign = matchs1[i];
          switch (sign.charAt(0)) {
            case 'y':
              _date.setFullYear(_int);
              break;
            case 'M':
              _date.setMonth(_int - 1);
              break;
            case 'd':
              _date.setDate(_int);
              break;
            case 'h':
              _date.setHours(_int);
              break;
            case 'm':
              _date.setMinutes(_int);
              break;
            case 's':
              _date.setSeconds(_int);
              break;
          }
        }
        return _date;
      }
      return null;
    },
    // 获取字符串日期时间戳
    getDateStringTime (stringTime) {
      let timestamp = new Date(stringTime).getTime();
      return timestamp;
    },
    // 解析时间戳 return 出来为 y-m-d h:m:s
    formatTime (str) {
      let _d;
      if (!str) {
        return str = ''
      } else {
        if (/\d{13}/.test(str)) {
          str = parseInt(str);
        } else {
          str = str.replace(/\./g, '-');
        }
        _d = new Date(str);
        let mo = _d.getMonth() + 1;
        let da = _d.getDate();
        let ho = _d.getHours();
        let mi = _d.getMinutes();
        let se = _d.getSeconds();
        if (mo < 10) {
          mo = '0' + mo
        }
        if (da < 10) {
          da = '0' + da
        }
        if (ho < 10) {
          ho = '0' + ho
        }
        if (mi < 10) {
          mi = '0' + mi
        }
        if (se < 10) {
          se = '0' + se
        }
        return [_d.getFullYear(), '-', mo, '-', da, ' ', ho, ':', mi, ':', se].join('');
      }
    },
    // 解析时间戳 return 出来为 y-m-d
    formatTime2 (str) {
      let _d;
      if (!str) {
        return str
      } else {
        if (/\d{13}/.test(str)) {
          str = parseInt(str);
        } else {
          str = str.replace(/\./g, '-');
        }
        _d = new Date(str);
        let mo = _d.getMonth() + 1;


        let da = _d.getDate();
        if (mo < 10) {
          mo = '0' + mo
        }
        if (da < 10) {
          da = '0' + da
        }
        return [_d.getFullYear(), '-', mo, '-', da].join('');
      }
    },
    // 时间相减
    countTime (st1, st2) {
      let date1 = new Date(st1); // 开始时间
      let date2 = new Date(st2); // 结束时间
      let date3 = date1.getTime() - date2.getTime(); // 时间差秒
      // 计算出相差天数
      let days = Math.floor(date3 / (24 * 3600 * 1000));
      // 计算出小时数
      let leave1 = date3 % (24 * 3600 * 1000); // 计算天数后剩余的毫秒数
      let hours = Math.floor(leave1 / (3600 * 1000));
      // 计算相差分钟数
      let leave2 = leave1 % (3600 * 1000); // 计算小时数后剩余的毫秒数
      let minutes = Math.floor(leave2 / (60 * 1000));
      // 计算相差秒数
      let leave3 = leave2 % (60 * 1000); // 计算分钟数后剩余的毫秒数
      let seconds = Math.round(leave3 / 1000);
      return '(' + days + '天' + hours + '小时' + minutes + '分钟' + seconds + '秒)'
    }
  },
  // 时间戳转换为日期
  //   timestampToTime(timestamp) {
  //     // var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  //     var date = new Date(timestamp);
  //     var Y = date.getFullYear() + '-';
  //     var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  //     var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + ' ';
  //     var h = (date.getHours() < 10 ? "0" + date.getHours() : date.getHours())+ ':';
  //     var m = (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) + ':';
  //     var s = (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()) + ' ';
  //     return Y + M + D + h + m + s;
  //   }
  customGenerateUUID () {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = ((d + Math.random() * 16) % 16) | 0;
      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  },
  getKeyForLS (key) {
    let o = localStorage.getItem(key)
    if (!o) {
      switch (key) {
        case 'uncheckCorp':
          return []

        default:
          break;
      }
    } else {
      switch (key) {
        case 'uncheckCorp':
          return localStorage.getItem(key).split(',')


        default:
          break;
      }
    }
  }
};
