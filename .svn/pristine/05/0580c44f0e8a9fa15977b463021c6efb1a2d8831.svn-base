<!--*
* @description: 左侧树
* @author: wp,wqh
* @update: 2018-05-5
-->
<template>
  <section id="treeSty"
      v-loading="loadingSearch"
  >
    <el-tree v-show="isTree"
      v-loading="loading2"
      element-loading-text="拼命加载中"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0)"
      ref="vehtree"
      id="trees"
      node-key="cid"
      :props="props"
      :filter-node-method='loadFilter'
      :load="loadNode"
      accordion
      :auto-expand-parent="autoExpandParent"
      lazy
      show-checkbox
      check-strictly
      :default-checked-keys="arrTreeCheck"
      :renderContent="renderContent"
      @check="handleCheck"
      @node-expand="handleNodeClick"
      @node-click="nodeClick"
      @node-collapse="collapseNode">
    </el-tree>
    <!-- :auto-expand-parent="autoExpandParent" -->
    <el-tree v-show="!isTree"
      :data="searchData"
      ref="searchVehtree"
      node-key="cid"
      id="searchTree"
      :props="defaultProps"
      accordion
      default-expand-all
      show-checkbox
      check-strictly
      :renderContent="searchRenderContent"
      @check="handleCheck1"
      @node-expand="handleNodeClick"
      @node-click="nodeClick"
      @node-collapse="collapseNode">
    </el-tree>
    <!-- 在父组件调用子组件的方法 -->
    <MonitorData v-show="false"
      ref="childMethod"></MonitorData>
  </section>
</template>

<script>
import Vue from 'vue';
import utils from '@/utils/tool';
import 'static/script/jquery.nicescroll';
import {
  getChildrenCar,
  getvehiclesstatus,
  proddetail,
  vehiclesCount,
  getunProd
} from '@/Api/mapApi.js';
import MonitorData from '@/components/table/monitorList'// 监控列表

export default {
  name: 'tree',
  components: {
    MonitorData
  },
  computed: {
    // 默认选中keys列表
    // defaultCheckedKeysList () {
    //   return this.$store.state.defaultCheckedKeysList;
    // },
    GroupStatistics () {
      return this.$store.getters.GroupStatistics;
    },
    // 最新 查询的树关键字
    searchVal () {
      return this.$store.getters.searchVal;
    },
    arrTreeCheck () {
      return this.$store.getters.treeState.tree.arrCheck
    },
    loadingSearch () {
      return this.$store.getters.treeLoading
    }
    // arrTreeCheck () {
    //   let arr = this.$store.getters.monitorData.map(d => {
    //     return 'v' + d.vehicleid;
    //   });
    //   if (arr.length === 0 && this.$parent.$parent.$refs.tabbox) {
    //     this.$parent.$parent.$refs.tabbox.carsInfosHeight = 'tup'
    //   }
    //   return arr;
    // }
  },
  watch: {
    // 实时监听树节点值的变化查询的树关键字
    searchVal (newval) {
      this.isTree = !newval.sval;
      if (!this.isTree) {
        this.filterVehTree(newval);
      } else {
        // this.searchData = []
        this.st && clearTimeout(this.st)
      }
    }
  },
  data () {
    return {
      searchData: [],
      isTree: true,
      autoExpandParent: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      curSearchType: '',
      st: null,
      currEl: null,
      /* 树形数据 */
      loading2: true,
      // loadingSearch: false,
      props: {
        label: 'label',
        children: 'name',
        isLeaf: 'leaf'
      },
      tIndex: 0,
      dataForUnProd: [],
      showDataForUnProd: [],
      dataForVeh: {},
      showDataFOrVeh: {}
      /* end */
    };
  },
  methods: {
    // 筛选车辆树
    filterVehTree (sinfo) {
      let _this = this;
      _this.searchData = []
      this.curSearchType = sinfo.type;
      if (this.st != null) clearTimeout(this.st);
      this.searchData.length = 0 // [];
      let time = sinfo.sval.length > 2 ? 2000 : 4000
      this.st = setTimeout(function () {
        clearTimeout(_this.st)
        // _this.loadingSearch = true
        _this.$store.dispatch('treeLoading', { bool: true })
        // _this.searchData.length = 0
        _this.$indexedDB.getDataAll('company', function (res) {
          if (res.data.length > 0) {
            let i = 1
            res.data.forEach(function (corp, index) {
              corp.children = corp.children || []
              _this.$indexedDB.getDataBySearchLike(
                'cveh' + corp.corpid,
                sinfo.type,
                sinfo.sval,
                function (resS) {
                  i++
                  if (res.error) {
                    return
                  }

                  if (resS.data === undefined) {
                    // _this.$store.dispatch('treeLoading', { bool: false })
                    return;
                  }
                  _this.searchDatabuffer(resS.data, corp);
                  if (i === res.data.length) {
                    // _this.loadingSearch = false
                    _this.$store.dispatch('treeLoading', { bool: false })
                  }
                }
              );
            });
          } else {
          }
        });
      }, time);
    },
    // 递归 拼接 标签组
    tagBuffer (item, tag) {
      let index = item.tagnamepath.split('|').length;
      this.tIndex++;
      let name = item.tagnamepath.split('|')[this.tIndex];
      tag.label = name;
      if (this.tIndex === index - 1) {
        this.tIndex = 0;
        tag.children.push(item);
        return;
      }
      tag.children.push({ label: '', disabled: true, children: [] });
      this.tagBuffer(item, tag.children[0]);
    },
    // 前端查询 返回的查询数据模型构建
    searchDatabuffer (sdata, corp) {
      this.setSearchVehStatus(sdata); // 设置查询树状态
      if (sdata.length > 0) {
        let tsdata = [];
        let vehicleids = [];
        corp.children = sdata
        sdata.forEach((item, index) => {
          if (item.tagid != null) {
            let tag = {
              children: [],
              disabled: true,
              label: ''
            };
            this.tagBuffer(item, tag);
            item = tag;
          }
          item.istate = item.istate || undefined
          tsdata.push(item);
          vehicleids.push(item.vehicleid);
        });
        corp.stotal = sdata.length;
        this.searchData.push(corp);
      }
    },

    // 默认加载对应车辆实时状态
    setSearchVehStatus (vehData) {
      vehData.length > 0 && getvehiclesstatus({ vehicleids: vehData.map(d => d.vehicleid).join(',') }).then(res => {
        if (res.data.result.code === 0) {
          res.data.data.forEach(function (item, index) {
            vehData[index].istate = item.istate
          });
        }
      });
    },
    // 节点点击
    nodeClick (data, node, target) {
      // 如果type 等于 1 显示设备详情
      if (data.type === 1) {
        let para = {
          id: data.prodnum
        };
        let _this = this;
        let index = this.$store.getters.monitorData.IndexOf(data.vehicleid, d => d.vehicleid)
        // let monitorData =
        let cuIndex = this.$store.getters.monitorData[index].proddata.IndexOf(data.prodnum, d => d.prodnum)
        this.$store.dispatch('changeMonitorData', {data: true,
          index: index,
          changeFun: function (oldData, data, index) {
            oldData[index].custom.isDetails = data
            return oldData
          }})
        this.$store.dispatch('setLoadingObj', {key: 'monitorDetails', bool: true})
        this.$store.commit('listOrDeails', { states: true, index: 0 }); // 跳转到详情
        this.$store.dispatch('setIndexOfMonitorDetails', [index, cuIndex])
        this.$indexedDB.getDataById('vehicleDetail', data.vehicleid, function (result) {
          let row = result.data;
          if (row) {
            _this.$store.dispatch('reloadMonitorData', {data: row})

            _this.$store.dispatch('setLoadingObj', {key: 'monitorDetails', bool: false})
          }
        }
        );

        // this.$store.commit('SET_MONILOADING', true)
        // 请求设备信息
        // proddetail(para).then(function (res) {
        //   function re () {
        //     let devices = _this.$store.getters.monitorData[index].custom.devices
        //     if (!devices) {
        //       re()
        //       return
        //     }
        //     devices[cuIndex] = {...data}
        //     _this.$store.dispatch('changeMonitorData', {data: devices,
        //       index: index,
        //       changeFun: function (oldData, data, index) {
        //         oldData[index].proddata = [...data]
        //         return oldData
        //       }})
        //   }
        //   if (res.data.result.code === 0) {
        //     //     res.data.data.proddata = [res.data.data.proddata];
        //     let data = res.data.data.realdata
        //     if (!data) return
        //     // data.vehicleid = res.data.data.basicdata.vehicleid

        // re()
        //     _this.$store.dispatch('setLoadingObj', {key: 'monitorDetails', bool: true})
        //     // 取车辆信息
        //     _this.$indexedDB.getDataById(
        //       'vehicleDetail',
        //       prodData.basicdata.vehicleid,
        //       function (result) {
        //         let vehData = result.data;
        //         if (vehData) {
        //           let DetailData = { ...vehData, ...prodData }
        //           if (!prodData.realdata) {
        //             // let NOLOCAL = '无定位'
        //             let noLocal = { address: '无定位信息', ...prodData.proddata[0] }
        //             let newData = [{ ...DetailData, ...noLocal }]
        //             DetailData = { ...DetailData, ...{ gpsTime: '暂无' } }
        //             _this.$store.commit('monitorDataDetails', {
        //               map: _this.$map,
        //               result: newData
        //             });

        //             _this.$store.commit('setDeviceInfos', newData)
        //             _this.$store.dispatch('setLoadingObj', {key: 'monitorDetails', bool: false})
        //             _this.$store.commit('SET_MONILOADING', false)
        //             return
        //           }
        //           let isMasterProd = vehData.realdata.prodnum === prodData.realdata.prodnum
        //           _this.$store.commit('monitorDataDetails', {
        //             map: _this.$map,
        //             result: DetailData
        //           });
        //           _this.setDeviceInfos(isMasterProd);
        //         }
        //         // }
        //       })
        //   }
        // });
      } else {
        // 如果当前节点被选择 并且是一个车
        if (node.checked && data.vehicleid) {
          this.$store.commit('listOrDeails', {
            states: false, index: 0
          })
          this.$store.dispatch('zoomToCarByCarId', {
            carId: data.vehicleid,
            _this: this
          });
        }
      }
    },
    setDeviceInfos (isMasterProd) {
      let _this = this
      let data = { ...this.$store.getters.monitorDataDetails }

      let arrDeviceInfo = []
      let bool = true
      if (!isMasterProd) {
        bool = bool & false
        let obj = { ...data.realdata, ...{ address: '获取中...', ...data.proddata[0] } }
        // let obj
        if (!data.realdata) {
          obj = { ...data.dev }
        }
        arrDeviceInfo = [obj]
        var point = utils.transformWGStoGCJ(obj.lng, obj.lat)
        _this.$map.$methods.getPointAddress(point, function (data) {
          obj.address = data

          commit(arrDeviceInfo)
        })
      } else {
        arrDeviceInfo = [{ ...data.realdata, ...{address: data.address}, ...data.proddata[0] }]
      }
      if (bool) commit(arrDeviceInfo)

      function commit (obj) {
        _this.$store.commit('setDeviceInfos', obj)
        _this.$store.dispatch('setLoadingObj', {key: 'monitorDetails', bool: false})
      }
    },
    // 勾选的时候操作
    handleCheck (data, ischeck, cischeck) {
      let objTransfer = this.$store.getters.objTransfer
      if (objTransfer.isTransfer) {
        let complate = 'tree'
        this.$store.commit('objTransfer', { complate })
        this.$emit('handleCheck', {
          data: data,
          ischeck: ischeck,
          cischeck: cischeck,
          type: 'tree'
        });
      }
    },
    handleCheck1 (data, ischeck, cischeck) {
      if (this.searchVal.sval.length === 0) return
      // data.checkType = 0;

      let objTransfer = this.$store.getters.objTransfer
      if (objTransfer.isTransfer) {
        let complate = 'searchVehtree'
        this.$store.commit('objTransfer', { complate })
        this.$emit('handleCheck', {
          data: data,
          ischeck: ischeck,
          cischeck: cischeck,
          type: 'searchVehtree'
        });
        // setTimeout(() => {
        //   _this.$searchVehtree.setCheckedKeys(_this.arrTreeCheck, true)
        // }, 1000)
      }
    },
    CheckedKeys (keys, leafOnly) {
    },
    // 节点被展开时候操作 加载子节点
    handleNodeClick (data, node, t) {
      $('div.movecell').hide();
      let tp = $(t.$el).find('div.movecell');
      if (tp.length > 0) {
        tp.show();
      } else {
        this.currEl = $(t.$el);
      }
    },
    // 节点被折叠时候操作 加载子节点
    collapseNode (data, node, t) {
      let tp = $(t.$el).find('div.movecell');
      if (tp.length > 0) {
        tp.hide();
      }
    },
    loadFilter (obj, data, node) {
      let value = this.$store.getters.screenText
      // let value
      let corp = this.$store.getters.screenCorp.split(',')
      value = value || ''
      if (node.level === 2) {
        if (corp.length === 0) {
          if (!value) {
            return 1
          } else {
            return data.corpname.indexOf(value) !== -1
          }
        } else {
          if (corp.indexOf(data.corpid + '') !== -1) {
            return 0
          } else {
            if (!value) {
              return 1
            } else {
              return data.corpname.indexOf(value) !== -1
            }
          }
        }
      }
      // let { value, corp } = JSON.parse(obj)
      if (corp.length === 0) {
        if (!value) {
          return 1
        } else {
          return data.corpname.indexOf(value) !== -1
        }
      } else {
        if (corp.indexOf(data.corpid + '') !== -1) {
          return 0
        } else {
          if (!value) {
            return 1
          } else {
            return data.corpname.indexOf(value) !== -1
          }
        }
      }
    },
    nextUnProd (i) {
      return this.dataForUnProd.slice(i * 100, (i + 1) * 100)
    },
    onNextUnProd (e) {
      let _this = this

      e.stopPropagation();
      let node = $(e.target)
        .prevAll('div.el-tree-node__content')
        .find('span.custom-tree-node');
      let index = parseInt(node.attr('pagenum'))
      index++

      if ((index + 1) * 100 >= _this.dataForUnProd.length) {
        $(e.target).remove();
        _this.$message({
          message: '没有更多数据了哦！',
          type: 'success'
        });
      } else {
        let data = this.nextUnProd(index)
        node.attr('pagenum', index);
        let json = JSON.parse(node.attr('jspn'));
        data.forEach(item => {
          _this.$refs.vehtree.append(item, json.cid);
        })
      }
    },
    // 加载树节点
    loadNode (node, resolve) {
      let _this = this;

      if (node.level === 0) {
        // 加载树形列表
        // 如果公司本地数据库 存在公司列表立即 去除显示
        this.$indexedDB.getDataAll('company', function (res) {
          if (res.data.length > 0) {
            // XXX:未分组设备
            let test1 = {
              cid: 'cprod',
              corpid: 'un',
              corpname: '未知设备',
              disabled: true,
              label: '未知设备'
            };
            let test2 = {
              cid: 'cvehicle',
              corpid: 'un',
              corpname: '未分组车辆',
              disabled: true,
              label: '未分组车辆'
            };
            if (_this.$PM.module.vehTree.v.filter && _this.$store.getters.filterTree.unVehG) {
              res.data.push(test2);
            }
            if (_this.$PM.module.vehTree.v.filter && _this.$store.getters.filterTree.unProdG) {
              res.data.push(test1);
            }
            // XXX: 未分组设备 end
            let filterCorp
            // if (_this.$PM.module.vehTree.v.filter) {
            //   filterCorp = res.data.filter(d => {
            //     if (_this.uncheckCorp.indexOf(d.corpid) !== -1) {
            //       return 0
            //     }
            //     return 1
            //   })
            // } else {
            filterCorp = res.data
            // }
            return resolve(filterCorp)
          } else {
            resolve([]);
          }
        });
      } else {
        if (node.data.isCar) return resolve([]); // 如果层级位车辆就不加载了
        let tagid;
        if (node.level === 1) {
          tagid = '-1';
        } else {
          tagid = node.data.tagid;
        }

        // XXX:未分组设备
        if (node.data.cid === 'cprod') {
          let params = {
            index: 0,
            pageSize: 10000
          }
          getunProd(params)
            .then(response => {
              let results = response.data
              if (results.result.code === 0) {
                let getData = results.data || []
                _this.dataForUnProd = getData.map(d => {
                  return { leaf: true, label: d, unProd: 1 }
                })
                let newData = _this.nextUnProd(0)
                _this.showDataForUnProd = _this.showDataForUnProd.concat(newData)

                // 更多设备
                if (newData.length === 100) {
                  let movecell = document.createElement('div');
                  movecell.className = 'movecell';
                  movecell.onclick = _this.onNextUnProd;
                  movecell.innerHTML =
                    "<i class='iconfont icon-web_xiangxiazhankai'></i> 查看更多";
                  setTimeout(() => {
                    _this.currEl.append(movecell);
                  }, 50);
                }
                _this.resolveForVeh(_this.showDataForUnProd, resolve)
              } else {
                _this.resolveForVeh(_this.showDataForUnProd, resolve)
              }
            })
            .catch(error => {
              if (error) {
                _this.resolveForVeh([], resolve)
              }
            })
          return
        }
        if (node.data.cid === 'cvehicle') {
          let params2 = {
            userid: this.$store.getters.user.userid,
            corpid: 10252,
            tagid: -1,
            pagenum: 0,
            pagesize: 100
          };
          // _this.$indexedDB.getDataAll('veh'+corp)
          /* 获取未分组车辆信息 */
          getChildrenCar(params2)
            .then(response => {
              let results = response.data;
              // loading.close();
              if (results.result.code === 0) {
                let data = results.data
                data.forEach(d => {
                  d.isCar = 1
                  d.label = d.name + '/' + d.ownername
                  d.leaf = true
                  d.treeKey = utils.customGenerateUUID('tree')
                  d.AddCarKey = utils.customGenerateUUID('addCar')
                })
                // 更多车辆
                if (data.length === 100) {
                  let movecell = document.createElement('div');
                  movecell.className = 'movecell';
                  // movecell.onclick = _this.nextTreePageHandle;
                  movecell.onclick = function (e) {
                  }
                  movecell.innerHTML =
                    "<i class='iconfont icon-web_xiangxiazhankai'></i> 查看更多";
                  setTimeout(() => {
                    _this.currEl.append(movecell);
                  }, 50);
                }
                _this.resolveForVeh(data, resolve)
              } else {
                _this.resolveForVeh([], resolve)
              }
            })
            .catch(function (error) {
              console.log(error);
              _this.resolveForVeh([], resolve)
              // loading.close();
            });
          return
        }

        // XXX:未分组设备车辆 end
        let corpid = node.data.corpid
        // 如果公司本地数据库 存在公司列表立即 去除显示
        this.$indexedDB.getDataBySearchTagID(
          'tag',
          +tagid,
          'corpid',
          corpid,
          function (res) {
            let childrenArrObj1 = [];
            let childrenArrObj2 = [];
            if (res.data.length > 0) {
              childrenArrObj1 = res.data;
            }
            _this.$indexedDB.getCorpDataAll(
              // _this.$indexDB.getDataByPager(
              'cveh' + node.data.corpid,
              +tagid,
              function (res) {
                if (res.data.length > 0) {
                  _this.dataForVeh[corpid] = res.data;
                  childrenArrObj2 = _this.dataForVeh[corpid].slice(0, 100)

                  if (res.data.length >= 100 && _this.searchVal.sval === '') {
                    let movecell = document.createElement('div');
                    movecell.className = 'movecell';
                    movecell.onclick = _this.nextTreePageHandle;
                    movecell.innerHTML =
                      "<i class='iconfont icon-web_xiangxiazhankai'></i> 查看更多";
                    setTimeout(() => {
                      _this.currEl.append(movecell);
                    }, 50);
                  }
                }
                // XXX: tag
                if (childrenArrObj1.length !== 0 || childrenArrObj2.length !== 0) {
                  // resolve(childrenArrObj1.concat(childrenArrObj2)); // 合并展示
                } else {
                  resolve([]);
                }

                // _this.defaultSelVehtree(childrenArrObj2); // 默认选中树

                _this.setVehStatus(childrenArrObj1, childrenArrObj2, resolve); // 设置对应车辆状态
              }
            );
          }
        );
      }
    },
    resolveForVeh (params, resolve) {
      let _this = this
      params.forEach(d => {
        d.istate = _this.$PM.module.vehTree.v.state ? d.istate : 1
        d.vehicletype = _this.$PM.module.vehTree.v.type ? d.vehicletype : 'noType'
      })
      resolve(params)
    },

    // 默认加载对应车辆实时状态
    setVehStatus (taglist, vehlist, resolve) {
      let _this = this
      let tmpvehlist = vehlist;
      let tmptaglist = taglist;
      let vehids = vehlist
        .map(function (item) {
          return item.vehicleid;
        })
        .join(',');
      if (_this.$PM.module.vehTree.v.state) {
        getvehiclesstatus({ vehicleids: vehids }).then(res => {
          if (res.data.result.code === 0) {
            let vehlist1 = res.data.data.map(function (item, index) {
              tmpvehlist[index].istate = item.istate;
              if (!_this.$PM.module.vehTree.v.type) {
                tmpvehlist[index].vehicletype = 1
              }
              return vehlist[index];
            });
            resolve(tmptaglist.concat(vehlist1));
          }
        });
      } else {
        tmpvehlist.forEach(d => {
          d.istate = 1
          d.vehicletype = _this.$PM.module.vehTree.v.type ? d.vehicletype : 'noType'
        })
        resolve(tmptaglist.concat(tmpvehlist))
      }
    },
    // 默认选中树
    // defaultSelVehtree (childrenArrObj) {
    //   let _this = this;
    //   this.$nextTick(function () {
    //     childrenArrObj.forEach((item, index) => {
    //       _this.defaultCheckedKeysList.forEach((ch, index) => {
    //         if (item.vehicleid === ch) {
    //           // XXX:?????????
    //           _this.$refs.vehtree.setChecked('v' + ch, true);
    //           // _this.$refs.searchVehtree.setChecked('v'+ch,true)
    //         }
    //       });
    //     });
    //   });
    // },
    // 获取当前分组 或者标签组 更多的车辆
    nextTreePageHandle (e) {
      let _this = this
      e.stopPropagation();
      let node = $(e.target)
        .prevAll('div.el-tree-node__content')
        .find('span.custom-tree-node');
      let json = JSON.parse(node.attr('jspn'));
      let params2 = {
        userid: this.$store.getters.user.userid,
        corpid: json.corpid,
        tagid: node.attr('tagid'),
        pagesize: 100
      };
      // 获取当前页码
      let p = parseInt(node.attr('pagenum'));
      params2.pagenum = ++p;
      const loading = this.$loading({
        lock: true,
        text: '',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.5)',
        target: e.target
      });

      if ((params2.pagenum + 1) * 100 > this.dataForVeh[json.corpid].length) {
        $(e.target).remove();
        this.$message({
          message: '没有更多数据了哦！',
          type: 'success'
        });
      } else {
        node.attr('pagenum', params2.pagenum); // 更新最新页码
      }
      let data = this.dataForVeh[json.corpid].slice(params2.pagenum * 100, (params2.pagenum + 1) * 100)
      // start
      let vehids = data
        .map(function (item) {
          return item.vehicleid;
        })
        .join(',');
      if (_this.$PM.module.vehTree.v.state) {
        getvehiclesstatus({ vehicleids: vehids }).then(res => {
          if (res.data.result.code === 0) {
            let newData = res.data.data.map(function (item, index) {
              data[index].istate = item.istate;
              if (!_this.$PM.module.vehTree.v.type) {
                data[index].vehicletype = 1
              }
              return data[index];
            });
            newData.forEach((item, index) => {
              _this.$refs.vehtree.append(item, json.cid);
              if (index === data.length - 1) {
                loading.close()
              }
            })
            // resolve(tmptaglist.concat(vehlist1));
          }
        });
      } else {
        data.forEach(d => {
          d.istate = 1
          d.vehicletype = _this.$PM.module.vehTree.v.type ? d.vehicletype : 'noType'
        })
        data.forEach((item, index) => {
          _this.$refs.vehtree.append(item, json.cid);
          if (index === data.length - 1) {
            loading.close()
          }
        })
        // resolve(tmptaglist.concat(tmpvehlist))
      }

      // end
    },
    // 获取对应车辆类型 的iconfont图标
    getVehIconfont (vehicletype) {
      let icontClass = '';
      switch (vehicletype) {
        case 2:
          icontClass = 'icon-chuzuche';
          break;
        case 3:
          icontClass = 'icon-dkw_qiche';
          break;
        case 4:
          icontClass = 'icon-daxingkeche';
          break;
        case 5:
          icontClass = 'icon-zhongxingkeche';
          break;
        case 6:
          icontClass = 'icon-tubiao-keche';
          break;
        case 8:
          icontClass = 'icon-dahuoche';
          break;
        case 9:
          icontClass = 'icon-daxinghuoche1';
          break;
        case 10:
          icontClass = 'icon-xiaoxinghuoche-copy';
          break;
        case 13:
          icontClass = 'icon-jiaobanche';
          break;
        case 14:
          icontClass = 'icon-gongchengjixie';
          break;
        case 21:
          icontClass = 'icon-zhuangxieshebei';
          break;
        case 29:
          icontClass = 'icon-131231221';
          break;
        case 30:
          icontClass = 'icon-jiuyuancheliang';
          break;
        case 33:
          icontClass = 'icon-che5';
          break;
        case 'noType':
          icontClass = 'icon-che'
          break;
        default:
          icontClass = 'icon-che';
          break;
      }
      return icontClass;
    },
    // 渲染树内容
    renderContent (h, { node, data, store }) {
      var oneGroupStatistics = this.GroupStatistics.filter(function (item) {
        if (!data.tagid) return item.corpid === data.corpid;
      });
      // 如果存在对应分组车辆数量信息就添加
      if (oneGroupStatistics.length > 0) {
        data.vehicleonlinetotal = oneGroupStatistics[0].vehicleonlinetotal;
        data.vehicletotal = oneGroupStatistics[0].vehicletotal;
      }

      // 车辆
      if (data.isCar) {
        let iconStr
        if (data.istate === undefined) {
          iconStr = 'el-icon-loading'
        } else if (data.istate === 1) {
          let iconClass = this.getVehIconfont(data.vehicletype)
          let iconColor = ' color848484'
          iconStr = 'iconfont ' + iconClass + iconColor
        } else {
          let iconClass = this.getVehIconfont(data.vehicletype)
          let iconColor = ' color067816'
          iconStr = 'iconfont ' + iconClass + iconColor
        }

        return (
          <span class="custom-veh-tree-node-car">
            <span vhId={JSON.stringify(data.vehicleid).slice(1, -1)}>
              <i class={iconStr} />
              {' '}
              <span>{data.label}</span>
              {' '}
            </span>
          </span>
        )
      }
      // 设备
      if (data.type === 1) {
        let type = data.str.split('/')[0]
        let classStr = 'iconfont ' + (type === '无线' ? 'icon-iconset0250' : 'icon-hekriconshebeichatou2') + ' color067816'
        return (
          <span class="custom-veh-tree-node">
            <i class={classStr} style="text-indent: 13px;"></i>
            <span class="tdevice"> {data.label} </span>
          </span>

        )
      }
      if (data.unProd === 1) {
        return (
          <span class="custom-veh-tree-node">
            <span class="tdevice"
              pagenum="0"
            > {data.label} </span>
          </span>
        )
      }

      // 公司
      if (node.level === 1) {
        return (
          <span
            class="custom-tree-node"
            jspn={JSON.stringify(data)}
            tagid="-1"
            pagenum="0"
          >
            <span>
              {data.label}(<span class="color067816">
                {data.vehicleonlinetotal | 0}
              </span>/{data.vehicletotal | 0})
            </span>
          </span>

        )
      }
      // 标签
      if (data.tagid) {
        return (
          <span
            class="custom-tree-node"
            jspn={JSON.stringify(data)}
            tagid={data.tagid}
            pagenum="0"
          >
            <span>{data.label}</span>
          </span>

        )
      }
    },
    // 渲染树内容
    searchRenderContent (h, { node, data, store }) {
      // Car
      if (data.isCar) {
        let iconStr
        if (data.istate === undefined) {
          iconStr = 'el-icon-loading'
        } else if (data.istate === 1) {
          let iconClass = this.getVehIconfont(data.vehicletype)
          let iconColor = ' color848484'
          iconStr = 'iconfont ' + iconClass + iconColor
        } else {
          let iconClass = this.getVehIconfont(data.vehicletype)
          let iconColor = ' color067816'
          iconStr = 'iconfont ' + iconClass + iconColor
        }

        this.$searchVehtree.setCheckedKeys(this.arrTreeCheck, true)
        let arrStr = []
        switch (this.searchVal.type) {
          case 'prod': // 设备号不显示高亮
            arrStr.push(data.label)
            arrStr.push('')
            arrStr.push('')
            break;
          default:
            // 搜索label关键字
            let reg = new RegExp(this.searchVal.sval, 'g')
            var regEnd = 'start'
            var valLength = this.searchVal.sval.length
            var ii = 0
            let _str = this.searchVal.sval
            while (regEnd !== null) {
              regEnd = reg.exec(data.label)
              if (!regEnd) {
                // 搜不到搜vin。
                if (ii === 0) {
                  let str1 = data.label
                  let vin = '(' + data.vin + ')'
                  let regEndVin = 'start'
                  var jj = 0
                  while (regEndVin !== null) {
                    regEndVin = reg.exec(vin)
                    if (!regEndVin) {
                      // let strvin1 = vin.slice(ii)
                      // str1 += strvin1
                      let prods = JSON.parse(data.prod)
                      let boolProdNum = false
                      // let prodnum = ''
                      // let prodnumend = ''
                      let sval = this.searchVal.sval
                      prods.forEach(obj => {
                        if (!boolProdNum) {
                          var prodi = obj.prodnum.indexOf(sval)
                          if (prodi !== -1) {
                            // if(prodnum!== ''){

                            arrStr.push(str1 + '(' + obj.prodnum.slice(0, prodi))
                            arrStr.push(sval)
                            arrStr.push(obj.prodnum.slice(prodi + sval.length) + ')')
                            // prodnum = sval
                            // prodnumend = obj.prodnum
                            // }
                            boolProdNum = true
                          }
                        }
                      })
                      // arrStr.push(prodnum)
                      // arrStr.push(')')
                    } else {
                      let strvin1 = vin.slice(jj, regEndVin.index)
                      str1 += strvin1
                      let strvin2 = vin.slice(jj + regEndVin.index + _str.length)
                      arrStr.push(str1)
                      arrStr.push(_str)
                      arrStr.push(strvin2)
                    }
                  }
                } else if (ii + 1 < data.label.length) {
                  let str1 = data.label.slice(ii)
                  arrStr.push(str1)
                }
              } else {
                if (regEnd.index === 0) {
                  arrStr.push('')
                  arrStr.push(_str)
                  ii = valLength
                } else {
                  // ii
                  let str1 = data.label.slice(ii, regEnd.index)
                  let str2 = data.label.slice(ii + regEnd.index + _str.length)
                  arrStr.push(str1)
                  arrStr.push(_str)
                  arrStr.push(str2)
                  ii = regEnd.index + valLength
                }
              }
              // reg.lastIndex
            }


            break;
        }

        return (
          <span class="custom-veh-tree-node-car">
            <span vhId={JSON.stringify(data.vehicleid).slice(1, -1)}>
              <i class={iconStr} />
              {' '}
              <span>{arrStr[0]}</span>
              <span class="gl-search">{arrStr[1]}</span>
              <span>{arrStr[2]}</span>
              {' '}
            </span>
          </span>
        )
      }

      // 公司
      if (node.level === 1) {
        return (
          <span class="custom-tree-node" jspn={JSON.stringify(data)} tagid="-1" pagenum="0">
            <span>
              {data.label}
              (<span class="color067816">{data.stotal}</span>)
            </span>
          </span>
        )
      }
      // tag
      if (data.tagid) {
        return (
          <span class="custom-tree-node" jspn={JSON.stringify(data)} tagid={data.tagid} pagenum="0">
            <span>{data.label}</span>
          </span>
        )
      }
      // 设备
      if (data.type === 1) {
        //   return (
        //     <span class="custom-veh-tree-node">
        //       <span class="tdevice">
        //         {data.label}
        //       </span>
        //     </span>
        //   )
        let type = data.str.split('/')[0]
        let classStr = 'iconfont ' + (type === '无线' ? 'icon-iconset0250' : 'icon-hekriconshebeichatou2') + ' color067816'
        return (
          <span class="custom-veh-tree-node">
            <i class={classStr} style="text-indent: 13px;"></i>
            <span class="tdevice"> {data.label} </span>
          </span>

        )
      }
    },
    // 设置树节点右键事件
    setTreeRightContext () {
      let _this = this;
      let arr = [
        { header: '车辆功能菜单', t: 'title' },
        {
          text: '关注',
          t: 'follow',
          fid: ['1', '2', '3', '4', '5'],
          action: _this.clickFollow
        },
        {
          text: '备注',
          action: _this.clickRemark
        },
        {
          text: '电子围栏',
          t: 'dzwl',
          fid: '350',
          action: _this.clickDZWL
        },
        {
          text: '动车提醒',
          fid: '352',
          t: 'dctx',
          action: _this.clickDCTX
        }
        // ,
        // {
        //   text: '原地设防',
        //   t: 'ydsf',
        //   action: _this.clickYDSF
        // }
      ]
      let filterArr = arr.filter(d => {
        // return d.t
        switch (d.t) {
          case 'follow':
            if (!_this.$PM.module.follow.v.enable) {
              return 0
            } else {
              // 是否显示关注 无权限时隐藏
              if (Array.isArray(d.fid)) {
                let arr = d.fid.filter(v => _this.$PM.module.follow.v.value.includes(v))
                return arr.length
              } else {
                return _this.$PM.module.follow.v.value.indexOf(d.fid) !== -1
              }
            }
          case 'dzwl':
            return _this.$PM.module.dzwl.v.setBool
          case 'ydsf':
            return _this.$PM.module.ydsf.v.enable
          case 'dctx':
            return _this.$PM.module.dctx.v.enable
          default:
            return 1
          // break;
        }
        // this.$PM.module
        // return 1
      })
      if (filterArr.length > 1) {
        this.$context.attach('span.custom-veh-tree-node-car', filterArr);
      }
    },
    clickFollow (e, doms) {
      // let vhId = JSON.parse($(doms).attr('vhId'));
      let vhId = this.getVhId(doms)
      this.$store.commit('setSelectVhID', vhId);
      this.$store.commit('carBoxOpenOrClose', {
        openState: true,
        $class: 'follow'
      });
    },
    clickRemark (e, doms) {
      // let vhId = JSON.parse($(doms).attr('vhId'));
      let vhId = this.getVhId(doms)
      this.$store.commit('setSelectVhID', vhId);
      this.$store.commit('carBoxOpenOrClose', {
        openState: true,
        $class: 'remark'
      });
    },
    clickDZWL (e, doms) {
      // let vhId = JSON.parse($(doms).attr('vhId'));
      let vhId = this.getVhId(doms)
      this.$store.commit('setSelectVhID', vhId);
      this.$store.commit('carBoxOpenOrClose', {
        openState: true,
        $class: 'dzwl'
      });
    },
    clickDCTX (e, doms) {
      let _this = this
      let vhId = this.getVhId(doms)
      this.$store.commit('setSelectVhID', vhId)
      this.$request.follow.getListForId()
        .then(res => {
          if (res.data.result.code === 0) {
            let list = res.data.data || []
            if (list.IndexOf(352, d => d.pid) === -1) {
              _this.$request.follow.add({ Groupid: '352', remark: '动车提醒' })
                .then(res => {
                  if (res.data.result.code === 0) {
                    _this.$message({
                      message: '设置动车提醒成功！',
                      type: 'success'
                    })
                    _this.$request.follow.update()
                  }
                })
                .catch(error => {
                  if (error) {
                    _this.$message({
                      message: '设置动车提醒失败！',
                      type: 'error'
                    })
                  }
                })
            } else {
              _this.$message({
                message: '设置动车提醒失败！添加失败,已设置',
                type: 'success'
              })
            }
          }
        })
        .catch(error => {
          if (error) { }
        })
    },
    clickYDSF (e, doms) {
      let vhId = this.getVhId(doms)

      this.$store.commit('setSelectVhID', vhId)
      this.$store.commit('carBoxOpenOrClose', {
        openState: true,
        $class: 'ydsf'
      })
    },
    getVhId (doms) {
      let i = 0
      while (doms.attr('vhId') === undefined && i !== 3) {
        doms = doms.parent()
        i++
        if (doms[0].tagName === 'DIV') {
          let dom = doms.children()[2]
          doms = $(dom).children()
          i = 3
          break
        }
      }
      // if(i === 3){

      // }
      return doms.attr('vhId')
    },
    // 设置树双击事件
    showDetails () {
      // 双击时打开列表详情
      // let vehicleid = this.monitorData[0].vehicleid;
      // var _this = this;
      // this.$store.commit("listOrDeails", { states: true, index: 0 }); //跳转到详情
      // this.$indexedDB.getDataById(
      //     "vehicleDetail",
      //     parseInt(vehicleid),
      //     function(result) {
      //     let res = result.data;
      //     if (res) {
      //         _this.$store.commit("monitorDataDetails", {
      //         map: _this.$map,
      //         result: res
      //         });
      //     }
      //     }
      // );
    },
    // 获取所有车辆基础数据数量
    getVehiclesCount () {
      vehiclesCount({ userid: localStorage.getItem('uid') }).then(function (
        res
      ) {
      });
    }
  },
  created () {
    // let pm = new PermissionManage()
    this.uncheckCorp = utils.getKeyForLS('uncheckCorp')
  },
  mounted () {
    let _this = this
    $('#trees,#searchTree').niceScroll({
      autohidemode: 'hidden' // 隐藏滚动条的方式, 可用的值:
      //   true, // 无滚动时隐藏
      // "cursor" | // 隐藏
      // false | // 不隐藏,
      // "leave" | // 仅在指针离开内容时隐藏
      // "hidden" | // 一直隐藏
      // "scroll", // 仅在滚动时显示
    });
    // 设置树节点
    this.setTreeRightContext();
    this.getVehiclesCount();
    // 申明树实例
    Vue.prototype.$tree = this.$refs.vehtree;
    Vue.prototype.$searchVehtree = this.$refs.searchVehtree;
    let uncheck = utils.getKeyForLS('uncheckCorp')
    let obj = { corp: uncheck }
    this.$nextTick(function (d) {
      setTimeout(() => {
        _this.loading2 = false;
        _this.$tree.filter(JSON.stringify(obj))
      }, 2000);
    })
  }
};
</script>
<style>
.gl-search {
  background: #ffff00;
  color: #000;
}
</style>

