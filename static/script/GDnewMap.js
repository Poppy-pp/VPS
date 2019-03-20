var GDMap = function () {
  var that = this;
  // 地图状态值相关
  this.mapState = {
    MapCenter: null,
    MapZoomLevel: 12,
    // 车辆信息窗口
    IsShowInfoWindow: false,
    ShowInfoWindowMarker: null,
    ShowInfoWindowMarkerLngLat: null,
    // 图层
    ShowImageLayer: false,
    ShowTrafficLayer: false,
    ShowRouteLayer: false,
    // 地图上车辆图标类型：car|arrow
    MapCarType: 'car'
  }
  // 全局地图对象
  this.Map = null;
  this.Map_DZWL = null;
  // 地图相关图层
  this.ImageLayer = [];
  this.TrafficLayer = [];
  this.RouteLayer = [];
  // 信息窗口
  this.CarInfoWindow = new AMap.InfoWindow({
    offset: new AMap.Pixel(10, -10),
    autoMove: false
  });
  // 绘制工具对象
  this.MousetoolElectronicFence = null;
  this.MousetoolPolygonSelect = null;
  this.MousetoolMeasure = null;
  this.MousetoolSign = null;
  // 当前点标记
  this.currentSignMarker = null;
  // 定位工具
  this.IsLocal = false;
  this.IsLocalMarker = null;
  this.geolocation = null;
  // 搜索工具
  this.placeSearch = null
  // 监控车辆列表
  this.carDirectMarkerList = [];// {vehicleid:"",marker:null,data:null,points:[]}
  // 初始化
  this.InitMap = function () {
    if (this.Map == null) {
      this.Map = new AMap.Map('mapDiv', {
        resizeEnable: true,
        zoom: this.mapState.MapZoomLevel
        // mapStyle: 'amap://styles/dark'
      });
      // 点击事件
      var that = this;
      this.Map.on('click', function (e) {
        // 关闭窗口
        that.CarInfoWindow.close();
      });
      // 缩放事件
      var that = this;
      this.Map.on('zoomend', function (e) {
        if (!isShowCarIconInMap) return;

        var level = that.Map.getZoom();
        if (level >= 10) {
          // 显示文字
          that.showNoInfoCarLable();
          // 变大图标
          if (carIconSize != '40px') {
            carIconSize = '40px';
            that.changeCarIconSizeToMap();
          }
        } else {
          // 隐藏文字
          that.hideNoInfoCarLable();
          if (level > 5) {
            // 缩小图标
            if (carIconSize != '30px') {
              carIconSize = '30px';
              that.changeCarIconSizeToMap();
            }
          } else {
            // 缩小图标
            if (carIconSize != '20px') {
              carIconSize = '20px';
              that.changeCarIconSizeToMap();
            }
          }
        }
      });
      // 平移完成事件
      this.Map.on('dragend', function (e) {

      });
      // 平移事件
      this.Map.on('dragstart', function (e) {
        onclickNodeToZoomMapVehicleId = null;
      });

      // 电子围栏设置小地图
      this.Map_DZWL = new AMap.Map('dzwl_map', {
        resizeEnable: true,
        zoom: this.mapState.MapZoomLevel
      });
      // 跟踪车辆小地图
      this.Map_tracking = new AMap.Map('tracking_map', {
        resizeEnable: true,
        zoom: this.mapState.MapZoomLevel
      });
      // 跟踪车辆小地图
      this.Map_SBLocal = new AMap.Map('SBLocal_map', {
        resizeEnable: true,
        zoom: this.mapState.MapZoomLevel
      });
      // 地图工具
      AMap.plugin(['AMap.Scale'], function () {
        that.Map.addControl(new AMap.Scale());
      });
      AMap.plugin(['AMap.ToolBar'], function () {
        that.Map.addControl(new AMap.ToolBar({
          offset: new AMap.Pixel(20, 40)
        }));
      });
      // 地图类型
      if (this.mapState.ShowImageLayer) {
        this.mapState.ShowImageLayer = false;
        this.showImageMap();
      }
      // 实时路况
      if (this.mapState.ShowTrafficLayer) {
        this.mapState.ShowTrafficLayer = false;
        this.showRouteTraffic();
      }
      // 实时路况
      if (this.mapState.ShowRouteLayer) {
        this.mapState.ShowRouteLayer = false;
        this.showRoute();
      }
      // 地图车辆要素
    }
  }
  // 关闭信息窗口
  this.closeCarInfoWindow = function () {
    this.CarInfoWindow.close();
  }
  // 地图切换
  this.showImageMap = function () {
    if (this.mapState.ShowImageLayer) {
      this.ImageLayer[0].hide();
      this.mapState.ShowImageLayer = false;
    } else {
      if (this.ImageLayer.length == 0) {
        this.ImageLayer.push(new AMap.TileLayer.Satellite());
        this.Map.add(this.ImageLayer);
      } else {
        this.ImageLayer[0].show();
      }
      this.mapState.ShowImageLayer = true;
    }
  }
  // 实时路况
  this.showRouteTraffic = function () {
    if (this.mapState.ShowTrafficLayer) {
      this.TrafficLayer[0].hide();
      this.mapState.ShowTrafficLayer = false;
    } else {
      if (this.TrafficLayer.length == 0) {
        this.TrafficLayer.push(new AMap.TileLayer.Traffic());
        this.Map.add(this.TrafficLayer);
      } else {
        this.TrafficLayer[0].show();
      }
      this.mapState.ShowTrafficLayer = true;
    }
  }
  // 路线图
  this.showRoute = function () {
    if (this.mapState.ShowRouteLayer) {
      this.RouteLayer[0].hide();
      this.mapState.ShowRouteLayer = false;
    } else {
      if (this.RouteLayer.length == 0) {
        this.RouteLayer.push(new AMap.TileLayer.RoadNet());
        this.Map.add(this.RouteLayer);
      } else {
        this.RouteLayer[0].show();
      }
      this.mapState.ShowRouteLayer = true;
    }
  }
  // 创建点
  this.createMapPoint = function (lng, lat) {
    return new AMap.LngLat(lng, lat)
  }
  // 定位车辆
  this.zoomToCarByCarId = function (carId) {
    var markers = this.Map.getAllOverlays('marker');
    var marker = null;
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getExtData().vehicleid == carId) {
        marker = markers[i];
        break;
      }
    }
    if (marker == null) {
      // 获取最后一条位置信息
      // requestCarInfo(carId, this.zoomToOutlineCarByCarId);
      showMessageModal('该车辆无位置信息！', 3000);

      onclickNodeToZoomMapVehicleId = null;
    } else {
      // this.Map.setZoomAndCenter(16, marker.getPosition());
      this.Map.setZoomAndCenter(4, marker.getPosition());
      this.Map.setZoomAndCenter(18, marker.getPosition())

      onclickNodeToZoomMapVehicleId = carId;
    }
  }
  // 坐标转换
  this.pointTranseformWgs2Gcj_02 = function (lng, lat, callback) {
    AMap.convertFrom([lng, lat], 'gps', function (status, result) {
      var value = [lng, lat];
      if (status == 'complete') {
        value = [result.locations[0].getLng(), result.locations[0].getLat()];
      }
      callback(value);
    });
  }
  // 定位离线车辆
  var that = this;
  this.zoomToOutlineCarByCarId = function (data) {
    if (data.lng == 0 || data.lat == 0) {
      showMessageModal('无法获取到该车辆最后一条定位信息！', 3000);
    } else {
      that.Map.panTo([data.lng, data.lat]);
    }
  }
  // 根据车辆id获取车辆数据
  this.getMarkerDataById = function (carId) {
    var markers = this.Map.getAllOverlays('marker');
    var carData = null;
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getExtData().VehicleID == carId) {
        carData = markers[i].getExtData();
        break;
      }
    }
    return carData;
  }
  /** **********************************定位***************************/
  // 当前位置定位
  this.toCurrentLocal = function () {
    if (this.IsLocal) {
      this.IsLocalMarker.setMap(null);
      $('#tip').css('display', 'none');
      this.IsLocal = false;
    } else {
      if (this.geolocation == null) {
        var that = this;
        this.Map.plugin('AMap.Geolocation', function () {
          that.geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 10000, // 超过10秒后停止定位，默认：无穷大
            buttonOffset: new AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB'
          });
          that.geolocation.getCurrentPosition();
          AMap.event.addListener(that.geolocation, 'complete', function (data) { onComplete(data, that); });// 返回定位信息
          AMap.event.addListener(that.geolocation, 'error', function (data) { onError(data, that); }); // 返回定位出错信息
          that.IsLocal = true;
        });
      } else {
        this.geolocation.getCurrentPosition();
        AMap.event.addListener(this.geolocation, 'complete', function (data) { onComplete(data, that); });// 返回定位信息
        AMap.event.addListener(this.geolocation, 'error', function (data) { onError(data, that); }); // 返回定位出错信息
        this.IsLocal = true;
      }
    }
  }
  // 解析定位结果
  function onComplete (data, that) {
    var str = ['定位成功！'];
    str.push('经度：' + data.position.getLng());
    str.push('纬度：' + data.position.getLat());
    if (data.accuracy) {
      str.push('精度：' + data.accuracy + ' 米');
    }// 如为IP精确定位结果则没有精度信息
    str.push('是否经过偏移：' + (data.isConverted ? '是' : '否'));
    document.getElementById('tip').innerHTML = str.join('<br>');
    // 显示提示框
    $('#tip').css('display', 'block');
    $('#tip').fadeOut(5000);
    // 定位过去
    var position = [data.position.getLng(), data.position.getLat()];
    that.Map.setCenter(position);
    that.Map.setZoom(16);
    if (that.IsLocalMarker == null) {
      that.IsLocalMarker = new AMap.Marker({
        icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
        position: position
      });
      that.IsLocalMarker.setMap(that.Map);
    } else {
      that.IsLocalMarker.setMap(that.Map);
    }
    that.IsLocalMarker.setAnimation('AMAP_ANIMATION_BOUNCE');
  }
  // 解析定位错误信息
  function onError (data, that) {
    document.getElementById('tip').innerHTML = '定位失败';
    showMessageModal('定位失败！', 3000);
    that.IsLocal = false;
    $("span[onclick='toCurrentLocal()']").removeClass('selected_maptool');
  }
  /** **********************************设备定位***************************/
  this.SBMarker = null;
  this.toSBLocal = function (point, data) {
    var that = this;
    if (this.SBMarker == null) {
      that.SBMarker = new AMap.Marker({
        // icon: "http://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
        content: '<i class="fa fa-ticket" style="color:red;font-size:40px; transform:rotate(30deg);"  title="设备"></i>',
        position: point,
        extData: data
      });
      that.SBMarker.setMap(that.Map);
      var content = '<div>' +
                '<span>设备编号：' + data.realdata.prodnum + '</span></br>' +
                '<span>通讯时间：' + data.realdata.gpstime + '</span></br>' +
                '<span>服务器时间：' + data.realdata.recvtime + '</span></br>' +
                '</div>';
      that.SBMarker.setLabel({
        offset: new AMap.Pixel(15, 15), // 修改label相对于maker的位置
        content: content
      });
    } else {
      that.SBMarker.setPosition(point);
    }
    // that.SBMarker.setAnimation('AMAP_ANIMATION_BOUNCE');
    // that.SBMarker.setAnimation('AMAP_ANIMATION_DROP');
    that.Map.setCenter(point);
  }
  // 清除设备标记
  this.clearSBLocal = function () {
    if (this.SBMarker != null) {
      this.SBMarker.setMap(null);
      this.SBMarker = null;
    }
  }
  /** **********************************兴趣点搜索***************************/
  this.searchPalce = function () {
    if (this.placeSearch == null) {
      var that = this;
      AMap.service(['AMap.PlaceSearch'], function () {
        that.placeSearch = new AMap.PlaceSearch({ // 构造地点查询类
          pageSize: 5,
          pageIndex: 1,
          extensions: 'all',
          map: that.Map,
          panel: 'panelSearch'
        });
      });
    }
    var searchPlaceTextValue = $('#searchPlaceText').val();
    if (searchPlaceTextValue != '') {
      // this.placeSearch.setCity($('#selectCity option:selected').val());
      this.placeSearch.search(searchPlaceTextValue);
      $('#panelSearch').css('display', 'block');
    } else {
      $('#panelSearch').css('display', 'none');
      // 清楚搜索结果
      this.placeSearch.clear();
    }
  }

  /** **********************************距离量测***************************/
  this.IsMeasure = false;
  this.measureLength = function () {
    if (this.IsMeasure) {
      this.Map.setDefaultCursor('');
      this.MousetoolMeasure.close(true);
      this.IsMeasure = false;
    } else {
      // 关闭其他工具
      closeTools('measure', this);
      this.Map.setDefaultCursor('crosshair');
      if (this.MousetoolMeasure == null) {
        var that = this;
        this.Map.plugin(['AMap.MouseTool'], function () {
          that.MousetoolMeasure = new AMap.MouseTool(that.Map);
          that.MousetoolMeasure.rule();
          that.IsMeasure = true;
        });
      } else {
        this.MousetoolMeasure.rule();
        this.IsMeasure = true;
      }
    }
  }
  // 关闭可能冲突的工具
  function closeTools (type, that) {
    if (type == 'sign') {
      if (that.mousetoolMeasure != null && that.IsMeasure) {
        that.mousetoolMeasure.close(false);
      }
    } else if (type == 'measure') {
      if (that.mousetoolSign != null && that.IsSign) {
        that.mousetoolSign.close(false);
      }
    } else { }
  }

  /** **********************************用户标记***************************/
  this.IsSign = false;
  this.currentSignMarker = null;
  this.signMarkerInfoWindow = null;
  this.pointSign = function () {
    if (this.IsSign) {
      this.Map.setDefaultCursor('');
      this.MousetoolSign.close(true);
      this.IsSign = false;
      // 关闭信息窗口
      if (this.signMarkerInfoWindow != null) {
        this.signMarkerInfoWindow.close();
      }
    } else {
      // 关闭其他工具
      closeTools('sign', this);
      if (this.MousetoolSign == null) {
        var that = this;
        this.Map.setDefaultCursor('crosshair');
        this.Map.plugin(['AMap.MouseTool'], function () {
          that.MousetoolSign = new AMap.MouseTool(that.Map);
          // 标记框
          that.MousetoolSign.on('draw', function (even) {
            if (that.signMarkerInfoWindow == null) {
              that.signMarkerInfoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30) });
            }
            // 获取要素
            var marker = even.obj;
            marker.content = '<div style="width:300px;">' +
                            '<div style="width:100%;">标注名称：<input style="width: 220px;" value="新标注" oninput="markerTitleChangeCallback(this)" onpropertychange="markerTitleChangeCallback(this)"/></div>' +
                            '<div style="width:100%;padding-top:10px;padding-left: 16px;"><span style="float: left;">备&nbsp;&nbsp;&nbsp;注：</span><textarea style="width: 220px;height: 60px;" oninput="markerInfoChangeCallback(this)" onpropertychange="markerInfoChangeCallback(this)"></textarea> </div>' +
                            '</div>';
            marker.on('mouseover', function (e) {
              // 获取当前标记点
              that.currentSignMarker = e.target;
              that.signMarkerInfoWindow.setContent(e.target.content);
              that.signMarkerInfoWindow.open(that.Map, e.target.getPosition());
            });
            marker.emit('mouseover', { target: marker });
          });
          that.MousetoolSign.marker();
          that.IsSign = true;
        });
      } else {
        this.MousetoolSign.marker();
        this.IsSign = true;
      }
    }
  }
  // 标记属性改变
  this.markerTitleChange = function (dom) {
    this.currentSignMarker.content = '<div style="width:300px;">' +
            '<div style="width:100%;">标注名称：<input style="width: 220px;" value="' + $(dom).val() + '"oninput="markerTitleChange(this)" onpropertychange="markerTitleChange(this)"/></div>' +
            '<div style="width:100%;padding-top:10px;padding-left: 16px;"><span style="float: left;">备&nbsp;&nbsp;&nbsp;注：</span><textarea style="width: 220px;height: 60px;" oninput="markerInfoChange(this)" onpropertychange="markerInfoChange(this)"">' + $($(dom).parent().parent().find('textarea')).val() + '</textarea> </div>' +
            '</div>';
  }
  this.markerInfoChange = function (dom) {
    this.currentSignMarker.content = '<div style="width:300px;">' +
            '<div style="width:100%;">标注名称：<input style="width: 220px;" value="' + $($(dom).parent().parent().find('input')).val() + '"oninput="markerTitleChange(this)" onpropertychange="markerTitleChange(this)"/></div>' +
            '<div style="width:100%;padding-top:10px;padding-left: 16px;"><span style="float: left;">备&nbsp;&nbsp;&nbsp;注：</span><textarea style="width: 220px;height: 60px;" oninput="markerInfoChange(this)" onpropertychange="markerInfoChange(this)">' + $(dom).val() + '</textarea> </div>' +
            '</div>';
  }

  /** **********************************车辆监控***************************/
  // 车辆图标
  this.createCarMarkerToMap = function (vehicleid) {
    var marker = null; var data = null; var item = null;
    // 查找对应的数据
    for (var i = 0; i < this.carDirectMarkerList.length; i++) {
      if (this.carDirectMarkerList[i].vehicleid == vehicleid) {
        marker = this.carDirectMarkerList[i].marker;
        data = this.carDirectMarkerList[i].data;
        item = this.carDirectMarkerList[i];
        break;
      }
    }
    // 创建marker
    if (marker == null) {
      var basicdata = data.basicdata;
      var realdata = data.realdata;
      // 获取图标类型
      var content = getMapIconTypeDom(realdata.istate);
      var marker = new AMap.Marker({
        map: this.Map,
        position: [realdata.lng, realdata.lat],
        content: content,
        angle: data.realdata.direct,
        extData: { vehicleid: vehicleid, isdriving: false }
        // autoRotation: true
      });
      // 事件注册
      var that = this;
      marker.on('click', function (e) {
        that.showCarInfoWindow(e.target.getExtData().vehicleid);
      });
      marker.on('mouseover', function (e) {
        that.showCarInfoWindow(e.target.getExtData().vehicleid);
      });
      marker.on('dblclick', function (e) {
        // 定位树
        localTreeToCarByVehicleId(e.target.getExtData().vehicleid);
        // 置顶表格中的数据行
        localToFancyRow(e.target.getExtData().vehicleid);
      });
      marker.on('moveend', function () {
        for (var i = 0; i < that.carDirectMarkerList.length; i++) {
          if (this.getExtData().vehicleid == that.carDirectMarkerList[i].vehicleid) {
            // 特效状态
            this.getExtData().isdriving = false;
            // 车辆状态
            // 获取图标类型
            var content = getMapIconTypeDom(that.carDirectMarkerList[i].data.realdata.istate);
            this.setContent(content);
            this.setAngle(that.carDirectMarkerList[i].data.realdata.direct);
            // 有堆积数据(直接移过去)
            if (that.carDirectMarkerList[i].points.length > 5 && !this.getExtData().isdriving) {
              // 移动(类似于直接移动过去)
              this.getExtData().isdriving = true;
              this.moveTo(that.carDirectMarkerList[i].points[that.carDirectMarkerList[i].points.length - 1].point, 120000);
              that.carDirectMarkerList[i].points = [];
            } else {
              // 继续播放
              if (that.carDirectMarkerList[i].points.length > 0 && !this.getExtData().isdriving) {
                this.getExtData().isdriving = true;
                this.setContent(getMapIconTypeDom(0));
                // 取数组第一个点
                var point = that.carDirectMarkerList[i].points.shift().point;
                // 判断移动过去还是直接定位过去
                var distance = this.getPosition().distance(point);
                if (distance > 3000)
                // 移动(类似于直接移动过去)
                { this.moveTo(point, 120000); } else {
                  // 移动
                  this.setAngle(get2PointAngle(this.getPosition().lng, this.getPosition().lat, point.lng, point.lat));
                  this.moveTo(point, 120);
                  // this.moveAlong([this.getPosition(),point],120);
                }
              }
            }

            break;
          }
        }
      });
      // 事件(改变状态)
      marker.on('moving', function (obj) {
        // 修改对应label的位置
        var markers = map.Map.getAllOverlays('marker');
        for (var i = 0; i < markers.length; i++) {
          if (markers[i].getExtData().id == 'lable_' + this.getExtData().vehicleid) {
            markers[i].setPosition(this.getPosition());
          }
        }
      });
      // lable
      var dt = { vehicleid: vehicleid, licenceplatenum: basicdata.carno, ownername: basicdata.ownername, point: [realdata.lng, realdata.lat] };
      map.createCarLable(dt);
      // 定位到
      if (realdata.datasource == 'history') { map.Map.setZoomAndCenter(16, [realdata.lng, realdata.lat]); }
    } else {
      // 平滑移动
      if (item.points.length > 0 && !item.marker.getExtData().isdriving) {
        marker.getExtData().isdriving = true;
        marker.setContent(getMapIconTypeDom(0));
        // 取数组第一个点
        var point = item.points.shift().point;
        // 判断移动过去还是直接定位过去
        var distance = marker.getPosition().distance(point);
        if (distance > 3000)
        // 移动(类似于直接移动过去)
        { marker.moveTo(point, 12000000); } else {
          // 移动
          marker.setAngle(get2PointAngle(marker.getPosition().lng, marker.getPosition().lat, point.lng, point.lat));
          marker.moveTo(point, 120);
          // marker.moveAlong([marker.getPosition(),point], 120);
        }
      }
    }

    // 写回数据
    for (var i = 0; i < this.carDirectMarkerList.length; i++) {
      if (this.carDirectMarkerList[i].vehicleid == vehicleid) {
        this.carDirectMarkerList[i].marker = marker;
        break;
      }
    }
  }

  // 创建lable
  this.createCarLable = function (data) {
    if (data.ownername == null || data.ownername == undefined) data.ownername = '';
    var lableContent = "<div style='font-size: 12px;width: 120px;text-align: center; background-color: #2a3a49;opacity: 0.6;color: white;padding: 3px 7px;border-radius: 5px;'>" + data.licenceplatenum + ' ' + data.ownername + '</div>';
    // 创建
    var marker_lable = new AMap.Marker({
      map: map.Map,
      position: data.point,
      content: lableContent,
      extData: { id: 'lable_' + data.vehicleid },
      autoRotation: false,
      topWhenClick: true,
      bubble: false,
      offset: new AMap.Pixel(5, 5)
    });
    if (that.Map.getZoom() < 10) {
      marker_lable.hide();
    }
  }

  // 移除未获取到车辆信息的lable
  this.removeNoInfoCarLable = function (id) {
    var markers = map.Map.getAllOverlays('marker');
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getExtData().id == 'lable_' + id) {
        markers[i].setMap(null);
      }
    }
  }

  // 重新设置车辆信息的lable
  this.resetCarLable = function (id, point) {
    var markers = map.Map.getAllOverlays('marker');
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getExtData().id == 'lable_' + id) {
        markers[i].setPosition(point);
      }
    }
  }

  // 显示车辆信息的lable
  this.showNoInfoCarLable = function () {
    var markers = that.Map.getAllOverlays('marker');
    for (var i = 0; i < markers.length; i++) {
      var lableId = '';
      try {
        lableId += markers[i].getExtData().id.toString();
      } catch (e) { continue; }
      if (lableId != null && lableId != undefined && lableId.indexOf('lable_') > -1) {
        markers[i].show();
      }
    }
  }

  // 隐藏车辆信息的lable
  var that = this;
  this.hideNoInfoCarLable = function () {
    var markers = that.Map.getAllOverlays('marker');
    for (var i = 0; i < markers.length; i++) {
      var lableId = '';
      try {
        lableId += markers[i].getExtData().id.toString();
      } catch (e) { continue; }
      if (lableId != null && lableId != undefined && lableId.indexOf('lable_') > -1) {
        markers[i].hide();
      }
    }
  }

  // 移除车辆信息的lable
  var that = this;
  this.deleteNoInfoCarLable = function (vehicleId) {
    var markers = that.Map.getAllOverlays('marker');
    for (var i = 0; i < markers.length; i++) {
      var lableId = '';
      try {
        lableId += markers[i].getExtData().id.toString();
      } catch (e) { continue; }
      if (lableId != null && lableId != undefined && lableId == 'lable_' + vehicleId) {
        markers[i].setMap(null);
        break;
      }
    }
  }

  // 添加label
  this.showMarkerLabel = function (data) {
    setInterval(function () {
      var markers = map.Map.getAllOverlays('marker');
      for (var i = 0; i < markers.length; i++) {
        if (markers[i].getExtData().VehicleID == data.vehicleid) {
          markers[i].setLabel({// label默认蓝框白底左上角显示，样式className为：amap-marker-label
            offset: new AMap.Pixel(20, 30), // 修改label相对于maker的位置
            content: data.licenceplatenum + ' ' + data.ownername
          });
        }
      }
    }, 10);
  }

  // 显示方式切换同步
  this.changeCarIconToMap = function () {
    for (var i = 0; i < this.carDirectMarkerList.length; i++) {
      var marker = that.carDirectMarkerList[i].marker;

      marker.stopMove();
      // 设置状态
      marker.setContent(getMapIconTypeDom(that.carDirectMarkerList[i].data.realdata.istate));
      // 设置位置
      marker.setPosition(marker.getPosition());
      // 清空残留数据
      that.carDirectMarkerList[i].points = [];
    }
  }

  // 改变图标大小
  this.changeCarIconSizeToMap = function () {
    for (var i = 0; i < this.carDirectMarkerList.length; i++) {
      var marker = that.carDirectMarkerList[i].marker;
      if (isShowCarIconInMap) {
        var content = "<img style='width:" + carIconSize + ';height:' + carIconSize + ";' src='" + $(marker.getContent()).attr('src') + "'/>";
        marker.setContent(content);
      }
    }
  }

  // 显示信息框
  this.showCarInfoWindow = function (vehicleid) {
    if (this.CarInfoWindow.getIsOpen() && this.mapState.ShowInfoWindowMarker != null && vehicleid == this.mapState.ShowInfoWindowMarker.getExtData().vehicleid) return;
    // 查找对应的数据
    var item = null;
    for (var i = 0; i < this.carDirectMarkerList.length; i++) {
      if (this.carDirectMarkerList[i].vehicleid == vehicleid) {
        item = this.carDirectMarkerList[i];
        break;
      }
    }
    var basicdata = item.data.basicdata;
    var proddata = item.data.proddata;
    var realdata = item.data.realdata;
    // 赋值保险
    var dqx = '无';
    if (basicdata.hastheftinsurance == 1) {
      dqx = '有';
    }
    // 有效定位
    var isTrueLocal_ = isTrueLocal(realdata.lng, realdata.lat);
    // 设备编号
    var sbs = '';
    for (var i = 0; i < proddata.length; i++) {
      sbs = sbs + "<span style='color:blue;cursor: pointer;' onclick='showSBInfoModal(this)'>" + proddata[i].prodnum + '</span>&nbsp;&nbsp;';
    }
    // 设备定位
    sbs += "<a style='color:red;cursor: pointer;margin-left: 20px;' onclick='showSBInMap(" + vehicleid + ")'>设备定位</a>";
    // 车身颜色
    var vehicleColor = '';
    if (basicdata.color != null) {
      vehicleColor = "<span style='width:100px;height:12px;margin-top:2px;position:absolute;background-color:" + basicdata.color + ";border:1px solid #929292;'></span>";
    }
    // 车辆类型
    var vehicletype = basicdata.vehicletype;
    if (vehicletype == null) vehicletype = '';
    // 构造
    var dom = '<div style="width:440px;border-bottom: 2px solid red;font-size:16px;" id="carInfowindow_carNo">' + basicdata.carno + '/' + basicdata.ownername + '</div>' +
            '<div style="font-size: 12px;padding-top: 3px;" id="carInfowindow_content_item">' +
            '<span class="col-md-6">车主姓名:&nbsp;<span id="carInfowindow_userName">' + basicdata.ownername + '</span></span>' +
            '<span class="col-md-6">车辆类型:&nbsp;<span id="carInfowindow_carType">' + vehicletype + '</span></span>' +
            '<span class="col-md-6">购买盗抢险:&nbsp;<span id="carInfowindow_dqx">' + dqx + '</span></span>' +
            '<span class="col-md-6">车辆型号:&nbsp;<span id="carInfowindow_carModel">' + basicdata.model + '</span></span>' +
            '<span class="col-md-6">车身颜色:&nbsp;<span id="carInfowindow_carColor">' + vehicleColor + '</span></span>' +
            '<span class="col-md-6">通讯时间:&nbsp;<span id="carInfowindow_gpsTime">' + transformTime(realdata.gpstime) + '</span></span>' +
            '<span class="col-md-6">服务器时间:&nbsp;<span id="carInfowindow_serverTime">' + transformTime(realdata.recvtime) + '</span></span>' +
            '<span class="col-md-6">速度:&nbsp;<span id="carInfowindow_carSpeed">' + realdata.veo + '</span></span>' +
            '<span class="col-md-6">有效定位:&nbsp;<span id="carInfowindow_isTrueLocal">' + isTrueLocal_ + '</span></span>' +
            '<span class="col-md-6">定位方式:&nbsp;<span id="carInfowindow_localType">' + realdata.locationmodel + '</span></span>' +
            '<span class="col-md-6">车辆状态:&nbsp;<span id="carInfowindow_carState">' + getCarStateText(parseInt(realdata.istate)) + '</span></span>' +
            '<span class="col-md-6">经度:&nbsp;<span id="carInfowindow_lng">' + realdata.lng.toFixed(6) + '</span></span>' +
            '<span class="col-md-6">纬度:&nbsp;<span id="carInfowindow_lat">' + realdata.lat.toFixed(6) + '</span></span>' +
            '<span class="col-md-6">所属公司:&nbsp;<span id="carInfowindow_company">' + basicdata.corpname + '</span></span>' +
            '<span class="col-md-6">围栏信息:&nbsp;<span id="carInfowindow_dzwl">' + '</span></span>' +
            '<span class="col-md-6">关注信息:&nbsp;<span id="carInfowindow_care"></span></span>' +
            '<span class="col-md-6" value="' + vehicleid + '" onclick="infowindow_dd(this)" style="color:blue;cursor: pointer;">订单信息<span id="carInfowindow_dd"></span></span>' +
            '<span class="col-md-12">设备编号:&nbsp;<span id="carInfowindow_sbbh">' + sbs + '</span></span>' +
            '<span class="col-md-12">地址:&nbsp;<span id="carInfowindow_address"></span><span style="cursor:pointer;font-size:12px;color:blue;margin-left: 20px;display:none;" onclick="openCarXXInfo(this)">查看车辆详情信息</span></span>' +
            '</div>' +
            '<div style="font-size:12px;" class="map_info_tool col-md-12">' +
            '<span onclick="infowindow_hisRouteNewWindow(' + vehicleid + ')">历史轨迹</span>' +
            '<span onclick="infowindow_pointWarning(' + vehicleid + ')">原地设防</span>' +
            '<span onclick="infowindow_trackingCars(' + vehicleid + ')">跟踪</span>' +
            '<span onclick="infowindow_infowindowCare(' + vehicleid + ')">关注</span>' +
            '<span onclick="infowindow_showZLModal()">指令</span>' +
            '<span onclick="infowindow_simInfo()" style="">SIM&nbsp;<i id="simState" class="fa fa-circle" style="color: green;" title="正常"></i></span>' +
            '</div>';
    if (isShowCarIconInMap) {
      this.CarInfoWindow.setOffset(new AMap.Pixel(10, -10));
    } else {
      this.CarInfoWindow.setOffset(new AMap.Pixel(-3, -18));
    }
    this.CarInfoWindow.setContent(dom);
    this.CarInfoWindow.open(this.Map, item.marker.getPosition());

    // 地理编码
    this.getPoint2Address('', [realdata.lng, realdata.lat], function (carId, data) {
      $('#carInfowindow_address').html(data);
    });
    // 赋值
    this.mapState.ShowInfoWindowMarker = item.marker;
    this.mapState.ShowInfoWindowMarkerLngLat = [realdata.lng, realdata.lat];
    // 获取电子围栏信息
    getDZWLByVehicleId(vehicleid, function (data) {
      // 初始化
      $('#carInfowindow_dzwl').html('');
      if (data == null) return;
      // 组装值
      for (var i = 0; i < data.length; i++) {
        // 请求获取电子围栏名称
        getDZWLInfoById(data[i].EfenceId, function (result) {
          var html = $('#carInfowindow_dzwl').html();
          if (html == '') {
            html = result.EfenceName;
          } else {
            html = html + '  ' + result.EfenceName;
          }
          // 赋值
          $('#carInfowindow_dzwl').html(html);
        });
      }
    });
    // 获取关注信息
    requestCareInfoByCarId(vehicleid, function (data) {
      // 组装值
      var value = '';
      for (var i = 0; i < data.length; i++) {
        value += data[i].pname;
        value += '  ';
      }
      // 赋值
      $('#carInfowindow_care').html(value);
    });
    // 设置显示字段
    infowindowFiedShow();
  }

  /** ****************************报警标识*********************************/
  this.alarmIcon = null;
  this.createAlarmIcon = function (point, offset, data) {
    if (this.alarmIcon != null) {
      this.alarmIcon.setMap(null);
    }
    // 创建标记
    this.alarmIcon = new AMap.Marker({
      map: this.Map,
      position: point,
      content: "<img style='width:30px;height:30px;' src='../public/img/cars/new/car3.png'/>",
      autoRotation: true,
      topWhenClick: true,
      bubble: false
    });
    // 定位过去
    if (offset) {
      this.Map.setZoomAndCenter(15, [point[0] + 0.02, point[1]]);
    } else {
      this.Map.setZoomAndCenter(15, point);
    }
    // lable
    if (data != null && data != undefined) {
      var lableText = '<span>车牌号：</span>' + data.carno + "&nbsp;&nbsp;&nbsp;<a onclick='map.deleteAlarmIcon()'>清除</a></br>" +
                '<span>车主：</span>' + data.ownername + '</br>' +
                '<span>设备号：</span>' + data.prodnum + '</br>' +
                '<span>通讯时间：</span>' + data.gpstime + '</br>' +
                '<span>报警内容：</span>' + data.alarmcontent + '</br>';
      this.alarmIcon.setLabel({// label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel(20, 30), // 修改label相对于maker的位置
        content: lableText
      });
    }
  }
  this.deleteAlarmIcon = function () {
    if (this.alarmIcon != null) {
      this.alarmIcon.setMap(null);
      this.alarmIcon = null;
    }
  }
  /** **********************************报警infowindow***************************/
  this.warnningMarker = null;
  this.showWarnningInfowindow = function (data) {
    // if (data.lng == null || data.lat == null || data.lng<10) {
    //    return;
    // }
    if (this.warnningMarker != null) {
      this.warnningMarker.setMap(null);
      this.warnningMarker = null;
    }
    // 创建marker
    var content = "<img style='width:40px;height:40px;' src='../public/img/cars/轿车超速.png'/>";
    var marker = new AMap.Marker({
      map: this.Map,
      position: [data.lng, data.lat],
      content: content,
      extData: data,
      autoRotation: true,
      topWhenClick: true,
      bubble: false
    });
    this.Map.setZoomAndCenter(20, [data.lng + 0.003, data.lat]);
    var lableText = '<span>车牌信息：</span>' + data.licenseplatenum + '/' + data.ownername + '</br>' +
            '<span>报警信息：</span>' + data.alarmcontent + '</br>';
    marker.setLabel({// label默认蓝框白底左上角显示，样式className为：amap-marker-label
      offset: new AMap.Pixel(20, 30), // 修改label相对于maker的位置
      content: lableText
    });
    this.warnningMarker = marker;
    // 获取文字位置
    this.getPoint2Address('', [data.lng, data.lat], function (carId, data) {
      var localText = '<span>位置信息：</span>' + data;
      var lable = {// label默认蓝框白底左上角显示，样式className为：amap-marker-label
        offset: new AMap.Pixel(20, 30), // 修改label相对于maker的位置
        content: map.warnningMarker.getLabel().content + localText
      }
      map.warnningMarker.setLabel(lable);
    });
  }

  /** **********************************指定车辆修改到离线状态***************************/
  this.changeCarStateToOutline = function (vehicleId) {
    // 获取在线车辆
    var markers = this.Map.getAllOverlays('marker');
    for (var i = 0; i < markers.length; i++) {
      // 修改状态
      if (markers[i].getExtData().id == vehicleId) {
        markers[i].getExtData().istate = 1;
        markers[i].setContent(getMapIconTypeDom(parseFloat(markers[i].getExtData().istate)));
        break;
      }
    }
  }

  /** **********************************小地图设备定位this.Map_SBLocal***************************/
  // 添加设备至地图
  this.addSBToSBLocal = function (data) {
    var marker = new AMap.Marker({
      map: this.Map_SBLocal,
      position: [data.lng, data.lat],
      content: '<i class="fa fa-ticket" style="color:red;font-size:20px;"  title="设备"></i>',
      extData: data,
      autoRotation: true,
      topWhenClick: true,
      bubble: false
    });
    marker.setLabel({
      offset: new AMap.Pixel(15, 15), // 修改label相对于maker的位置
      content: data.id
    });

    // 定位缩放到全部可视
    var points = [];
    var markers = this.Map_SBLocal.getAllOverlays('marker');
    for (var i = 0; i < markers.length; i++) {
      if (markers[i].getExtData() != null && markers[i].getExtData() != undefined) {
        points.push(markers[i].getPosition());
      }
    }
    if (points.length > 1) {
      // 构造线
      var polyline = new AMap.Polyline({
        path: points, // 设置线覆盖物路径
        strokeColor: '#3366FF', // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 5, // 线宽
        strokeStyle: 'solid', // 线样式
        strokeDasharray: [10, 5] // 补充线样式
      });
      this.Map_SBLocal.setBounds(polyline.getBounds());
    } else {
      // 缩放至
      this.Map_SBLocal.setCenter(marker.getPosition());
    }
  }
  // 清空
  this.clearSBLocalSB = function () {
    var markers = this.Map_SBLocal.getAllOverlays('marker');
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
  }

  this.createLineToBounds = function (points) {
    // 构造线
    var polyline = new AMap.Polyline({
      path: points, // 设置线覆盖物路径
      strokeColor: '#3366FF', // 线颜色
      strokeOpacity: 1, // 线透明度
      strokeWeight: 5, // 线宽
      strokeStyle: 'solid', // 线样式
      strokeDasharray: [10, 5] // 补充线样式
    });
    this.Map.setBounds(polyline.getBounds());
  }
  /** **********************************地理编码***************************/
  // 地理编码
  this.geocoder = null;
  this.getPoint2Address = function (carId, point, callback) {
    if (this.geocoder == null) {
      var that = this;
      that.Map.plugin(['AMap.Geocoder'], function () {
        that.geocoder = new AMap.Geocoder({
          radius: 1000,
          extensions: 'base'
        });
        // 获取地址
        that.geocoder.getAddress(point, function (status, result) {
          var data = '';
          if (status === 'complete' && result.info === 'OK') {
            data = result.regeocode.formattedAddress; // 返回地址描述;
            // 执行回调
            callback(carId, data);
          } else {
            data = '获取位置信息失败';
          }
        });
      });
    } else {
      // 获取地址
      this.geocoder.getAddress(point, function (status, result) {
        var data = '';
        if (status === 'complete' && result.info === 'OK') {
          data = result.regeocode.formattedAddress; // 返回地址描述;
          // 执行回调
          callback(carId, data);
        } else {
          data = '获取位置信息失败';
        }
      });
    }
  }

  /** **********************************电子围栏***************************/
  this.DrawCompletePolygon = null;
  // 初始化电子围栏绘制
  this.electronicFence = function (typeValue) {
    this.Map.setDefaultCursor('crosshair');
    // 类型判断
    if (this.MousetoolElectronicFence == null) {
      var that = this;
      this.Map.plugin(['AMap.MouseTool'], function () {
        that.MousetoolElectronicFence = new AMap.MouseTool(that.Map);
        switch (typeValue) {
          case 'polygon': that.MousetoolElectronicFence.polygon(); break;
          case 'circle': that.MousetoolElectronicFence.circle(); break;
          case 'rectangle': that.MousetoolElectronicFence.rectangle(); break;
          default: that.MousetoolElectronicFence.polygon(); break;
        }
        // 事件注册
        that.MousetoolElectronicFence.on('draw', function (event) {
          that.Map.setDefaultCursor('');
          that.MousetoolElectronicFence.close(false);
          that.DrawCompletePolygon = event.obj;
          // 弹出对话框确定是否保存
          $('#adddzwldiv').css('display', 'block');
          // $("#dzwl_main").css("height", (h - $("#left_top").height() - $("#serach_all_dzwl").height()) + "px");
        });
      });
    } else {
      this.MousetoolElectronicFence.close(true);
      switch (typeValue) {
        case 'polygon': this.MousetoolElectronicFence.polygon(); break;
        case 'rectangle': this.MousetoolElectronicFence.rectangle(); break;
        case 'circle': this.MousetoolElectronicFence.circle(); break;
        default: this.MousetoolElectronicFence.polygon(); break;
      }
    }
  }
  // 清除电子围栏
  this.clearElectronicFence = function () {
    if (this.MousetoolElectronicFence != null) {
      this.MousetoolElectronicFence.close(true);
      this.Map.setDefaultCursor('');
    }
  }
  // 获取绘制的电子围栏图形信息
  this.getElectronicFencePoplygon = function () {
    return this.DrawCompletePolygon;
  }
  // 显示
  this.showDZWLPolygon = function (paths, id) {
    var that = this;
    // 显示
    var polygon = new AMap.Polygon({
      path: paths, // 设置多边形边界路径
      strokeColor: '#F33', // 线颜色
      strokeOpacity: 0.2, // 线透明度
      strokeWeight: 3, // 线宽
      fillColor: '#ee2200', // 填充色
      fillOpacity: 0.35, // 填充透明度
      extData: { dzwlid: id }
    });
    polygon.setMap(that.Map);
    // 缩放至
    that.Map.setBounds(polygon.getBounds());
  }
  this.showDZWLCircle = function (center, radius, id) {
    var that = this;
    // 显示
    var circle = new AMap.Circle({
      center: new AMap.LngLat(center[0], center[1]), // 圆心位置
      radius: radius, // 半径
      strokeColor: '#F33', // 线颜色
      strokeOpacity: 0.2, // 线透明度
      strokeWeight: 3, // 线粗细度
      fillColor: '#ee2200', // 填充颜色
      fillOpacity: 0.35, // 填充透明度
      extData: { dzwlid: id }
    });
    circle.setMap(that.Map);
    // 缩放至
    that.Map.setBounds(circle.getBounds());
  }
  // 取消显示
  this.showDZWLPolygonCacle = function (id) {
    // 多边形
    var polygons = this.Map.getAllOverlays('polygon');
    for (var i = 0; i < polygons.length; i++) {
      if (id == '' || id == undefined) {
        if (polygons[i].getExtData().dzwlid != undefined) {
          polygons[i].setMap(null);
        }
      } else {
        if (polygons[i].getExtData().dzwlid == id) {
          polygons[i].setMap(null);
        }
      }
    }
    // 圆
    var circles = this.Map.getAllOverlays('circle');
    for (var i = 0; i < circles.length; i++) {
      if (id == '' || id == undefined) {
        if (circles[i].getExtData().dzwlid != undefined) {
          circles[i].setMap(null);
        }
      } else {
        if (circles[i].getExtData().dzwlid == id) {
          circles[i].setMap(null);
        }
      }
    }
  }
  // 获取显示的电子围栏id集合
  this.getAllDZWL = function () {
    var ids = [];
    // 多边形
    var polygons = this.Map.getAllOverlays('polygon');
    for (var i = 0; i < polygons.length; i++) {
      var dzwlid = polygons[i].getExtData().dzwlid;
      if (dzwlid != undefined) {
        if (!this.arrayContains(ids, dzwlid)) {
          ids.push(dzwlid);
        }
      }
    }
    // 圆
    var circles = this.Map.getAllOverlays('circle');
    for (var i = 0; i < circles.length; i++) {
      var dzwlid = circles[i].getExtData().dzwlid;
      if (dzwlid != undefined) {
        if (!this.arrayContains(ids, dzwlid)) {
          ids.push(dzwlid);
        }
      }
    }
    // 返回
    return ids;
  }
  // 判断数组是否包含某对象
  this.arrayContains = function (arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) {
        return true;
      }
    }
    return false;
  }
  // 显示小地图
  this.showDZWLPolygon_set = function (paths, id) {
    var that = this;
    // 显示
    var polygon = new AMap.Polygon({
      path: paths, // 设置多边形边界路径
      strokeColor: '#F33', // 线颜色
      strokeOpacity: 0.2, // 线透明度
      strokeWeight: 3, // 线宽
      fillColor: '#ee2200', // 填充色
      fillOpacity: 0.35, // 填充透明度
      extData: { dzwlid: id }
    });
    polygon.setMap(that.Map_DZWL);
    // 缩放至
    that.Map_DZWL.setBounds(polygon.getBounds());
  }
  this.showDZWLCircle_set = function (center, radius, id) {
    var that = this;
    // 显示
    var circle = new AMap.Circle({
      center: new AMap.LngLat(center[0], center[1]), // 圆心位置
      radius: radius, // 半径
      strokeColor: '#F33', // 线颜色
      strokeOpacity: 0.2, // 线透明度
      strokeWeight: 3, // 线粗细度
      fillColor: '#ee2200', // 填充颜色
      fillOpacity: 0.35, // 填充透明度
      extData: { dzwlid: id }
    });
    circle.setMap(that.Map_DZWL);
    // 缩放至
    that.Map_DZWL.setBounds(circle.getBounds());
  }
  // 取消显示小地图
  this.showDZWLPolygonCacle_set = function (id) {
    if (id == '' || id == null || id == undefined) {
      // 多边形
      var polygons = this.Map_DZWL.getAllOverlays('polygon');
      for (var i = 0; i < polygons.length; i++) {
        polygons[i].setMap(null);
      }
      // 圆
      var circles = this.Map_DZWL.getAllOverlays('circle');
      for (var i = 0; i < circles.length; i++) {
        circles[i].setMap(null);
      }
    } else {
      // 多边形
      var polygons = this.Map_DZWL.getAllOverlays('polygon');
      for (var i = 0; i < polygons.length; i++) {
        if (polygons[i].getExtData().dzwlid == id) {
          polygons[i].setMap(null);
        }
      }
      // 圆
      var circles = this.Map_DZWL.getAllOverlays('circle');
      for (var i = 0; i < circles.length; i++) {
        if (circles[i].getExtData().dzwlid == id) {
          circles[i].setMap(null);
        }
      }
    }
  }

  /** **********************************原地设防***************************/
  this.pointWarning = function (lon, lat, radius, id) {
    var that = this;
    var circles = this.Map.getAllOverlays('circle');
    var circle = null;
    for (var i = 0; i < circles.length; i++) {
      var ydsfid = circles[i].getExtData().ydsfid;
      if (ydsfid == id) {
        circle = circles[i];
        break;
      }
    }
    if (circle != null) {
      // 修改半径
      circle.setRadius(radius);
    } else {
      circle = new AMap.Circle({
        center: new AMap.LngLat(lon, lat), // 圆心位置
        radius: radius, // 半径
        strokeColor: '#d12222', // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 3, // 线粗细度
        strokeStyle: 'dashed',
        strokeDasharray: [10, 10],
        fillColor: '#fffdfd', // 填充颜色
        fillOpacity: 0.1, // 填充透明度
        extData: { ydsfid: id }
      });
      circle.setMap(that.Map);
    }
  }
  // 取消原地设防
  this.canclePointWarning = function (id) {
    var state = false;
    var that = this;
    var circles = this.Map.getAllOverlays('circle');
    var circle = null;
    for (var i = 0; i < circles.length; i++) {
      var ydsfid = circles[i].getExtData().ydsfid;
      if (ydsfid == id) {
        circle = circles[i];
        break;
      }
    }
    if (circle != null) {
      // 修改半径
      circle.setMap(null);
      state = true;
    }
    return state;
  }

  // 取消全部原地设防
  this.cancleAllPointWarning = function () {
    var that = this;
    var circles = this.Map.getAllOverlays('circle');
    for (var i = 0; i < circles.length; i++) {
      circles[i].setMap(null);
    }
  }

  /** **********************************区域选车***************************/
  // 区域选车
  this.drawPolygonSelectCars = function () {
    // 类型
    var typeValue = $("input[name='polygonSelectRadioOptions']:checked").val();
    this.Map.setDefaultCursor('crosshair');
    if (this.MousetoolPolygonSelect == null) {
      var that = this;
      this.Map.plugin(['AMap.MouseTool'], function () {
        that.MousetoolPolygonSelect = new AMap.MouseTool(that.Map);
        switch (typeValue) {
          case 'polygon': that.MousetoolPolygonSelect.polygon(); break;
          case 'rectangle': that.MousetoolPolygonSelect.rectangle(); break;
          case 'circle': that.MousetoolPolygonSelect.circle(); break;
          default: that.MousetoolPolygonSelect.polygon(); break;
        }
        // 事件注册
        that.MousetoolPolygonSelect.on('draw', function (event) {
          that.Map.setDefaultCursor('');
          // 清空命令
          that.MousetoolPolygonSelect.close(false);
          var polygon = event.obj;
          // 执行空间过滤运算
          that.polygonSelectCarsFilter(polygon);
        });
      });
    } else {
      switch (typeValue) {
        case 'polygon': this.MousetoolPolygonSelect.polygon(); break;
        case 'rectangle': this.MousetoolPolygonSelect.rectangle(); break;
        case 'circle': this.MousetoolPolygonSelect.circle(); break;
        default: this.MousetoolPolygonSelect.polygon(); break;
      }
    }
  }
  // 区域选车执行空间过滤
  var that = this;
  this.polygonSelectCarsFilter = function (polygon) {
    // 空间运算
    var isHaveCount = 0;
    for (var i = 0; i < that.carDirectMarkerList.length; i++) {
      if (that.carDirectMarkerList[i].marker == null) continue;
      if (polygon.contains(that.carDirectMarkerList[i].marker.getPosition())) {
        addRowToFancyTable_carPolygonSelectTable(that.carDirectMarkerList[i].data.realdata.vehicleid);

        isHaveCount += 1;
      }
    }
    if (isHaveCount == 0) {
      showMessageModal('该区域范围无车辆！', 3000);
    }
  }
  // 清除图形和绘制命令
  this.clearDrawPolygonSelectCars = function () {
    if (this.MousetoolPolygonSelect != null) {
      this.Map.setDefaultCursor('');
      this.MousetoolPolygonSelect.close(true);
    }
  }

  /** **********************************行政区划选择***************************/
  this.District = null;
  this.DistrictPolygons = null;
  this.localToArea = function (cityName, showGeometry, callback) {
    // 清除地图上所有覆盖物
    this.clearAreaPolygons();
    // 初始化
    this.DistrictPolygons = null;
    if (cityName != '') {
      var that = this;
      // 加载行政区划插件
      AMap.service('AMap.DistrictSearch', function () {
        var opts = {
          subdistrict: 1, // 返回下一级行政区
          extensions: 'all', // 返回行政区边界坐标组等具体信息
          showbiz: false
        };
        // 实例化DistrictSearch
        if (that.District == null) {
          that.District = new AMap.DistrictSearch(opts);
        }
        // 行政区查询
        that.District.search(cityName, function (status, result) {
          if (status == 'complete') {
            if (!result.districtList[0].boundaries) return;
            var polygon = new AMap.Polygon({
              map: that.Map,
              strokeWeight: 1,
              path: result.districtList[0].boundaries,
              fillOpacity: 0.7,
              fillColor: '#CCF3FF',
              strokeColor: '#CC66CC'
            });
            that.DistrictPolygons = polygon;
            polygon.setMap(that.Map);
            if (!showGeometry) {
              polygon.hide();
            }
            that.Map.setBounds(that.DistrictPolygons.getBounds());
            // 执行回调
            if (callback != null) callback(polygon);
          } else {
            showMessageModal('未获取到该城市的空间区域信息！', 3000);
          }
        });
      });
    }
  }
  this.getAreaPolygonJsonStr = function () {
    // 返回数据
    return JSON.stringify(this.DistrictPolygons.getPath());
  }
  this.clearAreaPolygons = function () {
    // 清除地图上所有覆盖物
    // if (that.DistrictPolygons.length > 0) {
    //    for (var i = that.DistrictPolygons.length - 1; i > -1; i--) {
    //        that.DistrictPolygons[i].setMap(null);
    //    }
    // }
    if (that.DistrictPolygons != null) {
      that.DistrictPolygons.setMap(null);
    }
  }

  /** **********************************获取指定区域内的车辆id集合***************************/
  var that = this;
  this.getCarIdsByPolygon = function (polygon, callback) {
    var treeObj = $.fn.zTree.getZTreeObj('tree_all');
    var datas = [];
    /// /空间运算
    // var markers = that.Map.getAllOverlays("marker");
    // if (markers.length > 0) {
    //    for (var i = 0; i < markers.length; i++) {
    //        if (markers[i].getExtData().VehicleID != null && markers[i].getExtData().VehicleID != undefined) {
    //            if (polygon.contains(markers[i].getPosition())) {
    //                ids.push(markers[i].getExtData().VehicleID);
    //            }
    //        }
    //    }
    // }
    var nodes = treeObj.getNodesByFilter(filter);
    if (nodes != null && nodes != undefined && nodes.length > 0) {
      for (var i = 0; i < nodes.length; i++) {
        var data = nodes[i].data;
        if (polygon.contains([data.lng, data.lat])) {
          datas.push(nodes[i]);
        }
      }
    }
    // 过滤方法
    function filter (node) {
      return (node.type == 'car');
    }
    callback(datas);
  }

  /** **********************************行政区划选择***************************/
  this.DistrictExplorer = null;
  var that = this;
  AMapUI.loadUI(['geo/DistrictExplorer'], function (DistrictExplorer) {
    // 创建一个实例
    that.DistrictExplorer = new DistrictExplorer({
      map: that.Map // 关联的地图实例
    });
  })
  this.getDistrictByCode = function (code, callback) {
    if (this.DistrictExplorer == null) {
      AMapUI.loadUI(['geo/DistrictExplorer'], function (DistrictExplorer) {
        // 创建一个实例
        that.DistrictExplorer = new DistrictExplorer({
          map: that.Map // 关联的地图实例
        });
      })
    } else {
      if (code == null || code == '') code = 100000;
      this.DistrictExplorer.loadAreaNode(code, function (error, areaNode) {
        if (error == null) {
          callback(areaNode._data.geoData.sub.features);
        }
      });
    }
  }
  this.getDistrictGeometryByCode = function (code, callback) {
    if (this.DistrictExplorer == null) {
      AMapUI.loadUI(['geo/DistrictExplorer'], function (DistrictExplorer) {
        // 创建一个实例
        that.DistrictExplorer = new DistrictExplorer({
          map: that.Map // 关联的地图实例
        });
      })
    } else {
      if (code == null || code == '') code = 100000;
      this.DistrictExplorer.loadAreaNode(code, function (error, areaNode) {
        if (error == null) {
          var ids = [];
          var geometry = areaNode._data.geoData.parent.geometry;
          for (var i = 0; i < geometry.coordinates.length; i++) {
            var polygon = new AMap.Polygon({
              map: that.Map,
              strokeWeight: 1,
              path: geometry.coordinates[i],
              fillOpacity: 0.7,
              fillColor: '#CCF3FF',
              strokeColor: '#CC66CC'
            });
            polygon.setMap(that.Map);
          }


          callback(areaNode._data.geoData.sub.features);
        }
      });
    }
  }

  /** **********************************测试偏移数据***************************/
  this.testPolyline = null;
  this.testPolylineConvert = null;
  this.createTestPolyline = function () {
    var test = [[103.713639322917, 27.3343465169271], [103.713492838542, 27.3341430664062], [103.713362630208, 27.3338012695313], [103.713354492188, 27.3337117513021], [103.713102213542, 27.3336954752604],
      [103.712548828125, 27.3338724772135], [103.712231445312, 27.334071858724], [103.711791992188, 27.334228515625], [103.711108398438, 27.3344217936198], [103.710514322917, 27.3346557617188],
      [103.709977213542, 27.3350260416667], [103.709847005208, 27.3353658040365], [103.709602864583, 27.335487874349], [103.709505208333, 27.335459391276], [103.708992513021, 27.335498046875]];
    var testConvert = [[103.7134928, 27.33414307], [103.7133626, 27.33380127], [103.7133545, 27.33371175], [103.7131022, 27.33369548], [103.7125488, 27.33387248]];
    var testConvert = [[103.715726155855, 27.3309163895725], [103.715579402624, 27.3307127165304], [103.715448970925, 27.3303706892519], [103.715440853924, 27.3302811429967], [103.715188127624, 27.330264545556]];
    var testConvert = [];
    for (var i = 0; i < test.length; i++) {
      var p = transformWGStoGCJ(test[i][0], test[i][1]);
      testConvert.push(p);
    }
    // 构造线
    this.testPolyline = new AMap.Polyline({
      path: test, // 设置线覆盖物路径
      strokeColor: '#3366FF', // 线颜色
      strokeOpacity: 1, // 线透明度
      strokeWeight: 5, // 线宽
      strokeStyle: 'solid', // 线样式
      strokeDasharray: [10, 5] // 补充线样式
    });
    // 构造线
    this.testPolylineConvert = new AMap.Polyline({
      path: testConvert, // 设置线覆盖物路径
      strokeColor: '#3226FF', // 线颜色
      strokeOpacity: 1, // 线透明度
      strokeWeight: 5, // 线宽
      strokeStyle: 'solid', // 线样式
      strokeDasharray: [10, 5] // 补充线样式
    });
    this.testPolyline.setMap(this.Map);
    this.testPolylineConvert.setMap(this.Map);
    this.Map.setZoomAndCenter(17, test[0]);
  }
};
