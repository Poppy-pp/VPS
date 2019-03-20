<!--*
* @description: 电子围栏维护
* @author: wp
* @update: 2018-05-5
-->
<template>
    <aside id="efStyle" class="enclosureDiv comFontSize">
      <div v-if="eftype && efinfo"
          v-loading="encloLoading"
          element-loading-text="电子围栏列表加载中···"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.7)" style="height: calc(100% - 24px);">
        <h3>电子围栏列表
          <slot name="iconCha"></slot>
          <i v-if="pm.changeBool" class="add iconfont icon-jiahao" @click="addEnclosure"></i>
          </h3>
          <div style="height:calc(100% - 55px);height: calc(100% - 18px);
    overflow: auto;">
        <div class="line" v-for="(arl,index) in arrEnclosure" :key="index">
            <el-checkbox class="ef_checkbox" v-model="arl.checked" @change="encloChange(arl)">{{ arl.EfenceName }}</el-checkbox>
            <div style="float: right">
                <i v-if="pm.changeBool"  class="option iconfont icon-yduigantanhaoshixin" @click="modifyEnclosure(index,arl)"></i>
                <i class="option iconfont icon-jiahao" @click="addCarTofence(index,arl)"></i>
                <!-- <i class="option iconfont icon-fenxiang"></i> -->
                <i v-if="pm.changeBool" class="option iconfont icon-lajitong" @click="delEnclosure(index,arl)"></i>
            </div>
        </div>
        </div>
      </div>

      <div v-if="!efinfo">
        <div class="title fs18"><i class="iconfont icon-xiangzuojiantou mr10" @click="modifyEnclosure"></i>电子围栏信息</div>
        <div class="efeName">
          <label class="fs16 mt15">名称：</label>
          <input type="text" v-model="efenceinfo.EfenceName" class="fs16 mt15" />
        </div>
        <div class="efenceStyle">
             <p v-if="efenceinfo.EfenceType==='polygon'"  class="mt15 fs14">
                 类型：<i class="iconfont icon-zidingyixingzhuang mr10 ml10"></i>自定义形状
             </p>
             <p v-else-if="efenceinfo.EfenceType==='circle'"  class="mt15 fs14">
                 类型：<i class="iconfont icon-yuan mr10 ml10"></i>圆形
             </p>
             <p v-else class="mt15 fs14">
                 类型：<i class="iconfont icon-sichuan mr10 ml10"></i>行政区域
             </p>
        </div>
        <div class="mt15 fs14">
            创建人：<span v-text="efenceinfo.CreateBy"></span>
        </div>
        <div class="mt15 fs14">
            创建日期：<span v-text="efenceinfo.CreateDate"></span>
        </div>
        <div class="regular mt15">
            <label class="fs16">规则：</label>
            <el-select v-model="efenceinfo.EfenceRule" placeholder="请选择">
                <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="noteColumn mt15">
          <label class="fs16">备注：</label>
          <textarea class="efenceNote" v-model="efenceinfo.Remarks"></textarea>
        </div>
        <div class="commit mt15"
            @click="modifyFence"
        >
            提 交
        </div>
      </div>

      <div class="form" v-if="!eftype">
        <div class="title fs20"><i class="iconfont icon-xiangzuojiantou mr10" @click="addEnclosure"></i>电子围栏绘制</div>
        <div class="name">
          <label class="fs16">名称：</label>
          <input type="text" v-model="formData.name" class="dzwl-name fs16" />
        </div>
        <div class="graphical">
          <p @click="graphicalClick">
            <i class="iconfont icon-zidingyixingzhuang"></i>
            自定义形状
          </p>
          <p @click="graphicalClick">
            <i class="iconfont icon-yuan"></i>
            圆形
          </p>
          <p v-if="pm.region"  @click="graphicalClick">
            <i class="iconfont icon-sichuan"></i>
            行政区域
          </p>
        </div>
        <div v-if="typevalue === 'xzqh'" class="pdl40">
          <el-select v-model="province" filterable clearable :loading="provinceLoading" value-key="adcode" placeholder="请选择省" @change="provinceChange">
              <el-option
                v-for="item in provinceList"
                :key="item.properties.name"
                :label="item.properties.name"
                :value="item.properties">
              </el-option>
            </el-select>
            <el-select v-model="city" value-key="adcode" filterable clearable placeholder="请选择市/区" @change="cityChange">
              <el-option
                v-for="item in cityList"
                 :key="item.properties.name"
                :label="item.properties.name"
                :value="item.properties">
              </el-option>
            </el-select>
            <el-select v-model="area" filterable clearable value-key="adcode" placeholder="请选择区/县" @change="areaChange">
              <el-option
                v-for="item in areaList"
                :key="item.properties.name"
                :label="item.properties.name"
                :value="item.properties">
              </el-option>
          </el-select>
          </div>
          <div class="rule">
            <label class="fs16">规则：</label>
            <el-checkbox-group
                v-model="formData.rule"
                @change="ruleChange"
                class="ruleCgro">
                <el-checkbox v-for="rule in ruleList" :key="rule.name" :label="rule.id" :value="rule.id">
                    {{ rule.name }}
                </el-checkbox>
              </el-checkbox-group>
          </div>
        <div class="addvhe fs16">
          <!-- <label>车辆：</label> -->
          <!-- <span>
            <i class="iconfont icon-tianjia mr5"></i>添加车辆
          </span> -->
        </div>
        <div class="remark mt15">
          <label class="fs16">备注：</label>
          <textarea class="dzwl-remarks"></textarea>
        </div>
        <div class="commit mt15"
        :class = 'isCommit?"testComit":""'
        @click="commitFence">
        提 交
        </div>
      </div>
    </aside>
</template>

<script>
import Vue from 'vue';
import utils from '@/utils/tool';
import { addfence, searchefence, deletefence, getefencebyid, updateefence, searchVEbyefenceid } from '@/Api/mapApi.js';
export default {
  name: 'Efence',
  components: {
    utils
  },
  data () {
    return {
      formData: {
        name: '',
        rule: [1]
      },

      /* 地区切换 start */
      provinceLoading: false,
      province: null,
      area: null,
      city: null,
      provinceList: [],
      areaList: [],
      cityList: [],
      /* 地区切换 end */
      // encloLoading: true,
      eftype: true, // 是否显示电子围栏列表
      efinfo: true, // 是否显示电子围栏信息

      currentAreaNode: null, // 当前聚焦的区域
      districtExplorer: null,
      District: null,
      DistrictPolygons: null,
      polygonForDraw: null,
      circleForDraw: null,
      addCarEfenceName: '',
      typevalue: 'polygon',
      ruleList: [
        { id: 1, name: '入' },
        { id: 2, name: '出' },
        { id: 3, name: '出入' }
      ],
      // arrEnclosure: [],
      isCommit: false,
      adcode: 100000,
      efenceinfo: {}, // 电子围栏信息
      CreateById: '',
      options: [{
        value: '1',
        label: '围栏内报警'
      }, {
        value: '2',
        label: '围栏外报警'
      }, {
        value: '3',
        label: '进出报警'
      }], // 电子围栏信息下拉框内容
      pm: {}
    };
  },
  // computed: {
  // },
  methods: {
    modifyFence () {
      let _this = this;
      let parms = {};
      parms.ID = this.efenceinfo.ID;
      parms.EfenceType = '';
      parms.EfenceName = this.efenceinfo.EfenceName;
      parms.EfenceRule = +this.efenceinfo.EfenceRule;
      // parms.EfenceRule = this.efenceinfo.EfenceRule.value;
      // if (this.efenceinfo.EfenceRule === '围栏内报警') {
      //   parms.EfenceRule = 1;
      // } else if (this.efenceinfo.EfenceRule === '围栏外报警') {
      //   parms.EfenceRule = 2;
      // } else if (this.efenceinfo.EfenceRule === '进出报警') {
      //   parms.EfenceRule = 3;
      // }
      parms.EfenceValue = ''
      parms.IsDelete = 0
      parms.Remarks = this.efenceinfo.Remarks;
      parms.CreateDate = this.efenceinfo.CreateDate;
      parms.CreateBy = this.CreateById;
      parms.UpdateDate = utils.formatDate.formatTime(new Date().getTime());
      parms.UpdateBy = this.$store.state.user.userid;
      if (this.efenceinfo.EfenceName !== '') {
        updateefence(parms).then(res => {
          if (res.data.result.code === 0) {
            _this.$message({
              message: '电子围栏修改成功',
              center: true,
              type: 'success'
            });
            _this.efinfo = !_this.efinfo;
            let para = {};
            para.condition = ''
            para.index = 0
            para.pagesize = 40
            para.userid = _this.$store.state.user.userid;
            searchefence(para).then(res => {
              if (res.data.result.code === 0) {
                var data = res.data.data.map((item, index) => {
                // _this.arrEnclosure[index].EfenceName = item.EfenceName;
                  return item;
                });
                _this.$store.commit('SET_DZWLLIST', data);
              }
            });
          }
        })
      } else {
        _this.$message({
          message: '名称不能为空！',
          center: true,
          type: 'error'
        });
      }
    },
    commitFence () {
      if (this.formData.name !== '') {
        if (this.isCommit) {
          this.formData.rule.forEach((item, index) => {
            if (item) {
              if (!isSameName.call(this)) {
                commiting.call(this);
              } else {
                this.$message({
                  message: '名称不能重复，请重新输入',
                  center: true,
                  type: 'error'
                });
              }
            } else {
              this.$message({
                message: '规则不能为空',
                center: true,
                type: 'error'
              });
            }
          })
        } else {
          this.$message({
            message: '请选择区域',
            center: true,
            type: 'error'
          });
        }
      } else {
        this.$message({
          message: '名称不能为空',
          center: true,
          type: 'error'
        });
      }

      function commiting () {
        let _this = this;
        let ID = -1;
        let EfenceName = $('.dzwl-name').val();
        console.debug('type', this.typevalue);
        let EfenceType = this.typevalue;
        let EfenceRule = this.formData.rule[0];
        let EfenceValue =
          this.typevalue === 'polygon'
            ? formatPolygon(this.polygonForDraw)
            : this.typevalue === 'circle'
              ? formatCircle(this.circleForDraw)
              : '[]';
        let IsDelect = 0;
        let Remarks = $('.dzwl-remarks').val();
        let CreateDate = getNowFormatDate();
        let CreateBy = this.$store.state.user.userid;
        let UpdateDate = '';
        let UpdateBy = CreateBy;
        let DistrictCode = this.typevalue === 'xzqh' ? this.adcode : null;
        let param = {
          ID,
          EfenceName,
          EfenceType,
          EfenceRule,
          EfenceValue,
          IsDelect,
          Remarks,
          CreateBy,
          CreateDate,
          UpdateDate,
          UpdateBy,
          DistrictCode
        };
        addfence(param, {
          // dataType: "ajax"
        })
          .then(function (response) {
            console.debug(response);
            _this.adcode = 100000;
            _this.addEnclosure();
            _this.searchList();
            // }
          })
          .catch(function (error) {
            console.debug(error);
          });
      }
      function isSameName () {
        let EfenceName = $('.dzwl-name').val();
        let index = this.arrEnclosure.IndexOf(EfenceName, function (d) {
          return d.EfenceName;
        });
        return !(index === -1);
      }
      function formatCircle (data) {
        let obj = {};
        let center = data.getCenter();
        let radius = data.getRadius();
        obj.point = { lng: center.lng, lat: center.lat };
        obj.radius = radius;
        return JSON.stringify([obj]);
      }
      function formatPolygon (data) {
        let path = data.getPath();
        let obj = path.map(d => {
          let sub = {};
          sub.lat = d.lat;
          sub.lng = d.lng;
          return sub;
        });
        return JSON.stringify([obj]);
      }
      function getNowFormatDate () {
        var date = new Date();
        var seperator1 = '-';
        var seperator2 = ':';
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
          month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
          strDate = '0' + strDate;
        }
        var currentdate =
          date.getFullYear() +
          seperator1 +
          month +
          seperator1 +
          strDate +
          ' ' +
          date.getHours() +
          seperator2 +
          date.getMinutes() +
          seperator2 +
          date.getSeconds();
        return currentdate;
      }
    },
    searchList () {
      var _this = this;
      this.$request.efence.getList()
        .then(function (res) {
        // this.encloLoading = false;
          if (res.data.result.code === 0) {
            var data = res.data.data.map(function (item) {
              item.checked = false;
              return item;
            });
            _this.$store.commit('SET_DZWLLIST', data);
            console.debug(data, _this.$store.state.arrDZWLList);
          }
        })
        .catch(res => {
        });
    },
    // 选择当前电子围栏区域
    encloChange (row) {
      if (row.checked) {
        var datas = JSON.parse(row.EfenceValue);
        if (datas != null || datas !== undefined) {
          if (row.EfenceType === 'circle') {
            for (let i = 0, len = datas.length; i < len; i++) {
              // var point = JSON.parse(datas[i].point);
              var point = datas[i].point;
              // 绘制
              this.$map.$methods.showDZWLCircle(
                [point.lng, point.lat],
                datas[i].radius,
                row.ID
              );
            }
          } else if (row.EfenceType === 'polygon') {
            var paths = [];
            var curp = [];
            for (let i = 0, len = datas.length; i < len; i++) {
              // var data = JSON.parse(datas[i]);
              var data = datas[i];
              paths.push(data);
            }
            // 重构 绘画行政区域 和 多边形数据结构
            paths.forEach(function (path, index) {
              path.forEach(function (p, ind) {
                curp.push([p.lng, p.lat]);
              });
            });
            this.$map.$methods.showDZWLPolygon(curp, row.ID);
          } else {
            this.localToArea(row.DistrictCode, row.ID);
          }
        }
      } else {
        this.$map.$methods.showDZWLPolygonCacle_set(row.ID);
      }
    },
    clearCheck () {
      this.arrEnclosure.forEach(row => {
        this.$map.$methods.showDZWLPolygonCacle_set(row.ID);
      })
    },
    // 清空行政区域选择列表
    clearAreaSelect () {
      this.cityList = [];
      this.city = null;
      this.areaList = [];
      this.area = null;
      this.province = null;
      this.provinceList = [];
    },
    // 省市切换
    provinceChange (v) {
      this.districtExplorer.clearFeaturePolygons();
      this.cityList = [];
      this.city = null;
      this.areaList = [];
      this.area = null;
      if (!v) return;
      this.adcode = v.adcode;
      this.switch2AreaNode(v.adcode);
    },
    // 城市切换
    cityChange (v) {
      this.districtExplorer.clearFeaturePolygons();
      this.areaList = [];
      this.area = null;
      if (!v) {
        this.switch2AreaNode(this.province.adcode);
        return;
      }
      this.adcode = v.adcode;
      if (v.level === 'district') {
        this.localToArea(v.adcode);
      } else {
        this.switch2AreaNode(v.adcode);
      }
    },
    // 区域切换
    areaChange (v) {
      this.districtExplorer.clearFeaturePolygons();
      if (!v) {
        if (this.city.level === 'district') {
          this.localToArea(this.city.adcode);
        } else {
          this.switch2AreaNode(this.city.adcode);
        }
        return;
      }
      console.debug(v.adcode);
      this.adcode = v.adcode;
      this.localToArea(v.adcode);
      // this.switch2AreaNode(v.adcode)
    },
    // 切换电子围栏图形
    graphicalClick (e) {
      this.isCommit = false;
      let index = 1;
      if ($(e.target).is('p')) {
        $(e.target)
          .addClass('cur')
          .siblings()
          .removeClass('cur');
        index = $(e.target).index() + 1;
      } else {
        $(e.target)
          .parent('p')
          .addClass('cur')
          .siblings()
          .removeClass('cur');
        index =
          $(e.target)
            .parent('p')
            .index() + 1;
      }
      // this.MousetoolElectronicFence && this.MousetoolElectronicFence.close(true)
      this.clearElectroninFence();
      this.clearAreaSelect();
      if (index === 1) this.typevalue = 'polygon';
      if (index === 2) this.typevalue = 'circle';
      if (index === 3) {
        this.typevalue = 'xzqh';
        this.initDistrictExplorer();
        return;
      }
      this.electronicFence(this.typevalue);
    },
    // 根据行政区域绘画地图样式
    localToArea (cityCode, _id) {
      var that = this;
      // 加载行政区划插件
      AMap.service('AMap.DistrictSearch', function () {
        var opts = {
          subdistrict: 1, // 返回下一级行政区
          extensions: 'all', // 返回行政区边界坐标组等具体信息
          showbiz: false
        };
        // 实例化DistrictSearch
        if (that.District === null) {
          that.District = new AMap.DistrictSearch(opts);
        }
        // 行政区查询
        console.debug('cityCode', cityCode);
        that.District.search(cityCode + '', function (status, result) {
          if (status === 'complete') {
            if (!result.districtList[0].boundaries) return;
            console.debug('jieguo', result.districtList[0].adcode);
            var option = {
              map: that.$map,
              strokeWeight: 1,
              path: result.districtList[0].boundaries,
              fillOpacity: 0.7,
              fillColor: '#067816',
              strokeColor: '#CC66CC'
            };
            if (_id) {
              option.extData = { dzwlid: _id };
            }
            var polygon = new AMap.Polygon(option);
            that.DistrictPolygons = polygon;
            polygon.setMap(that.$map);
            that.$map.setBounds(that.DistrictPolygons.getBounds());
          } else {
            this.$message({
              message: '未获取到该城市的空间区域信息！',
              type: 'error'
            });
          }
        });
      });
    },
    // 切换区域
    switch2AreaNode (adcode, callback) {
      var _this = this;
      console.debug('switch', adcode);
      this.districtExplorer.loadAreaNode(adcode + '', function (
        error,
        areaNode
      ) {
        if (error) {
          if (callback) {
            callback(error);
          }
          console.error(error);
          return;
        }
        var props = areaNode.getProps();


        var subFeatures = areaNode.getSubFeatures();
        if (props.level === 'country' && _this.provinceList.length === 0) {
          _this.provinceList = subFeatures;
        }
        if (props.level === 'province') {
          _this.cityList = subFeatures;
        }
        if (props.level === 'city') {
          _this.areaList = subFeatures;
        }
        _this.renderAreaPolygons(areaNode);
        if (callback) {
          callback(null, areaNode);
        }
      });
    },
    // 绘制某个区域的边界
    renderAreaPolygons (areaNode) {
      var districtExplorer = this.districtExplorer;


      var colors = [
        '#3366cc',
        '#dc3912',
        '#ff9900',
        '#109618',
        '#990099',
        '#0099c6',
        '#dd4477',
        '#66aa00',
        '#b82e2e',
        '#316395',
        '#994499',
        '#22aa99',
        '#aaaa11',
        '#6633cc',
        '#e67300',
        '#8b0707',
        '#651067',
        '#329262',
        '#5574a6',
        '#3b3eac'
      ];
      // 更新地图视野
      this.$map.setBounds(areaNode.getBounds(), null, null, true);
      // 绘制子区域
      districtExplorer.renderSubFeatures(areaNode, function (feature, i) {
        var fillColor = colors[i % colors.length];
        var strokeColor = colors[colors.length - 1 - i % colors.length];
        if (areaNode.adcode !== 100000) {
          fillColor = '#067816';
          strokeColor = '#CC66CC';
        }
        return {
          cursor: 'default',
          bubble: true,
          strokeColor: strokeColor, // 线颜色
          strokeOpacity: 1, // 线透明度
          strokeWeight: 1, // 线宽
          fillColor: fillColor, // 填充色
          fillOpacity: 0.35 // 填充透明度
        };
      });
      // 绘制父区域
      districtExplorer.renderParentFeature(areaNode, {
        cursor: 'default',
        bubble: true,
        strokeColor: '#067816', // 线颜色
        strokeOpacity: 1, // 线透明度
        strokeWeight: 1, // 线宽
        fillColor: null, // 填充色
        fillOpacity: 0.35 // 填充透明度
      });
    },
    // 切换区域后刷新显示内容
    refreshAreaNode (areaNode) {
      this.renderAreaPolygons(areaNode);
    },
    // 加载行政区实例
    initDistrictExplorer () {
      var _this = this;
      _this.provinceLoading = true;
      console.debug('加载i行政区');
      if (this.districtExplorer) this.districtExplorer.clearAreaNodeCache();
      AMapUI.loadUI(['geo/DistrictExplorer'], function (DistrictExplorer) {
        // 创建一个实例
        _this.districtExplorer = new DistrictExplorer({
          map: _this.$map
        });
        // 初始化全国电子围栏信息
        _this.switch2AreaNode(_this.adcode, function () {
          _this.provinceLoading = false;
        });
        _this.isCommit = true;
      });
    },
    // 初始化电子围栏绘制
    electronicFence (typevalue) {
      this.$map.setDefaultCursor('crosshair');
      if (this.districtExplorer) this.districtExplorer.clearFeaturePolygons();
      // 类型判断
      if (!this.MousetoolElectronicFence) {
        var that = this;
        this.$map.plugin(['AMap.MouseTool'], function () {
          that.MousetoolElectronicFence = new AMap.MouseTool(that.$map);
          switch (typevalue) {
            case 'polygon':
              that.MousetoolElectronicFence.polygon();
              break;
            case 'circle':
              that.MousetoolElectronicFence.circle();
              break;
            default:
              that.MousetoolElectronicFence.polygon();
              break;
          }
          // 事件注册
          that.MousetoolElectronicFence.on('draw', function (event) {
            switch (typevalue) {
              case 'polygon':
                console.debug(event, event.obj);
                that.polygonForDraw = event.obj;
                break;
              case 'circle':
                that.circleForDraw = event.obj;
                console.debug(event, event.obj);
                break;
              default:
                break;
            }
            that.$map.setDefaultCursor('');
            that.MousetoolElectronicFence.close(false);
            that.DrawCompletePolygon = event.obj;
            that.isCommit = true;
          });
        });
      }
    },
    // 改变电子围栏规则
    ruleChange (val) {
      console.debug(val);
      this.formData.rule = [val[val.length - 1]];
    },
    // 增加电子围栏 显示电子围栏表单 eftype为true显示电子围栏列表 反之
    addEnclosure () {
      this.clearElectroninFence();
      this.eftype = !this.eftype;
      console.debug(this.eftype);
      if (this.eftype) {
        this.formData.name = '';
        this.typevalue = 'polygon';
        this.clearAreaSelect();
        this.clearElectroninFence();
      }
    },
    // 修改电子围栏，efinfo为true显示电子围栏列表，反之显示电子围栏信息
    modifyEnclosure (index, row) {
      this.efinfo = !this.efinfo;
      let _this = this;
      if (!this.efinfo) {
        this.CreateById = row.CreateBy;
        getefencebyid({id: row.ID}).then(res => {
          console.log(res.data.data, 'res.data.data')
          if (res.data.result.code === 0) {
            _this.efenceinfo = res.data.data;
            _this.efenceinfo.CreateDate = utils.formatDate.formatTime(res.data.data.CreateDate);
            _this.efenceinfo.CreateBy = res.data.data.CreateBy;
          }
        });
      }
    },
    // 删除电子围栏
    delEnclosure (index, row) {
      let parms = {};
      let _this = this;
      parms.condition = row.ID;
      parms.userid = row.CreateBy;
      searchVEbyefenceid(parms).then(res => {
        if (res.data.result.code === 0 && res.data.data.length <= 0) {
          var result = window.confirm('请问确认删除电子围栏吗？');
          if (result === true) {
            var paradox = {...row}
            console.debug(...index);
            var id = this.arrEnclosure[index].ID;
            var userid = this.$store.getters.user.userid;
            deletefence({ id, userid })
              .then(function (response) {
                console.debug(response);
                if (row.checked) {
                  paradox.checked = !paradox.checked;
                  _this.encloChange(paradox);
                }
              })
              .catch(function (error) {
                console.debug(error);
              });

            console.debug(index, id);
            this.arrEnclosure.splice(index, 1);
          }
        } else {
          _this.$message({
            message: '该电子围栏下还有相关车辆！请删除车辆后再删除该电子围栏！',
            center: true,
            type: 'info'
          });
        }
      })
    },
    // 清空电子围栏绘画工具
    clearElectroninFence () {
      console.debug('clear');
      if (this.districtExplorer) {
        this.districtExplorer.clearFeaturePolygons();
        this.districtExplorer = null;
      }
      if (this.MousetoolElectronicFence) {
        this.$map.setDefaultCursor('');
        this.MousetoolElectronicFence.close(true);
        this.MousetoolElectronicFence = null;
      }
    },
    // 初始化电子围栏列表数据
    initEncloListData () {
      // let para = {
      //   index: 0,
      //   pagesize: 40,
      //   condition: '',
      //   userid: this.$store.getters.user.userid
      // };
      // this.encloLoading = true;
      // let that = this;
      console.debug(this);
      // searchefence(para).then(res => {
      //   this.encloLoading = false;
      //   if (res.data.result.code === 0) {
      //     this.arrEnclosure = res.data.data.map(function(item) {
      //       item.checked = false;
      //       return item;
      //     });
      //     console.debug(that.arrEnclosure);
      //   }
      // });
    },
    // 给电子围栏添加车辆
    addCarTofence (index, row) {
      this.$store.commit('changeFenceInfo', row)
      //   this.$store.commit('setSelectVhID', vhId);
      this.$store.commit('carBoxOpenOrClose', {
        openState: true,
        $class: 'addCar'
      });
    }
  },
  created () {
    console.debug('createDZWL')
    this.pm = this.$PM.module.dzwl.v
    Vue.prototype.$DZWL = this;
    this.initEncloListData();
  },
  computed: {
    arrEnclosure () {
      // this.encloLoading = false;
      return this.$store.state.arrDZWLList;
    },
    encloLoading () {
      return this.$store.state.loadingDZWLList
    }
  },
  // destroyed () {
  //   console.debug('zhuxiao')
  // }
  // 电子围栏组件销毁后 清空操作 动作
  destroyed () {
    this.clearElectroninFence();
  }
};
</script>

<style scoped>
   .vps-custom-default #efStyle input{
       border: solid 1px rgb(255, 255, 255);
       border-radius:4px;
       width: 262px;
       text-indent: 10px;
       margin-bottom: 15px;
   }
   .vps-custom-normal #efStyle input{
       border: solid 1px #000;
       border-radius:4px;
       width: 262px;
       text-indent: 10px;
       margin-bottom: 15px;
   }
   .vps-custom-satellite #efStyle input{
       border: solid 1px #000;
       border-radius:4px;
       width: 262px;
       text-indent: 10px;
       margin-bottom: 15px;
   }
   .vps-custom-default #efStyle .efeName input{
       background-color: transparent;
       color: #fff;
       margin-bottom: 0;
   }
   .vps-custom-normal #efStyle .efeName input{
       background-color: transparent;
       color: #000;
       margin-bottom: 0;
   }
   .vps-custom-satellite #efStyle .efeName input{
       background-color: transparent;
       color: #000;
       margin-bottom: 0;
   }

   .vps-custom-default #efStyle .noteColumn .efenceNote{
       background-color: transparent;
       border: solid 1px #fff;
       color: #fff;
       padding: 5px 10px;
   }
    .vps-custom-normal #efStyle .noteColumn .efenceNote{
       background-color: transparent;
       border: solid 1px #000;
       color: #000;
       padding: 5px 10px;
   }
   .vps-custom-satellite #efStyle .noteColumn .efenceNote{
       background-color: transparent;
       border: solid 1px #000;
       color: #000;
       padding: 5px 10px;
   }
   .vps-custom-default #efStyle .el-checkbox {
       margin-left: 30px!important;
   }
   .vps-custom-default #efStyle .commit{
       width: 80px;
       height: 30px;
       margin-left:234px;
       margin-top:30px;
       text-align: center;
       line-height: 30px;
       font-size: 16px;
       border:1px solid #fff;
       border-radius: 4px;
   }
   .vps-custom-normal #efStyle .commit{
       width: 80px;
       height: 30px;
       margin-left:234px;
       margin-top:30px;
       text-align: center;
       line-height: 30px;
       font-size: 16px;
       border:1px solid #000;
       border-radius: 4px;
   }
   .vps-custom-satellite #efStyle .commit{
       width: 80px;
       height: 30px;
       margin-left:234px;
       margin-top:30px;
       text-align: center;
       line-height: 30px;
       font-size: 16px;
       border:1px solid #000;
       border-radius: 4px;
   }
</style>
