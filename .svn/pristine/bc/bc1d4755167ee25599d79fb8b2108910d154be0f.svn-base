<template>

  <section
  id="followCar"
    v-loading="loadingFollow.boole"
    :element-loading-text="loadingFollow.content"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.7)"
    >
    <el-tree
      :data="followTreeData"
      ref="treeVehtree"
      :props="defaultProps"
      node-key="followKey"
      :default-checked-keys="stateForFollowTree.arrCheck"
      :default-expanded-keys="stateForFollowTree.arrExpand"
      show-checkbox
      check-strictly
      :renderContent="treeFollowRenderContent"
      @check="handleCheck"
      @node-click="nodeClick"
      @node-expand="handleNodeClick"
      @node-collapse="collapseNode"
    >
    </el-tree>
  </section>
</template>

<script>
import Vue from 'vue';
import {
  proddetail
} from '@/Api/mapApi.js';
import utils from '@/utils/tool';

function generateUUID () {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = ((d + Math.random() * 16) % 16) | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

export default {
  name: 'followCar',
  computed: {
    stateForFollowTree () {
      let data = this.$store.getters.treeState.follow;
      return data;
    },
    setCurVehInfo () {
      let setCurVehInfo = this.$store.getters.setCurVehInfo;
      return setCurVehInfo;
    },
    loadingFollow () {
      return this.$store.state.loadingFollowList;
    },
    followTreeData () {
      console.debug('bug1,计算followTreeData')
      var _this = this;
      var [...monitorData] = this.$store.getters.monitorData;
      var [...followList] = this.$store.getters.FollowList;
      let data = [];
      // 根据权限过滤
      followList = followList.filter(d => {
        // 第一波过滤： 是否显示默认分组
        let bool = _this.$PM.module.follow.v.value.includes(d.id)
        // 第二波过滤：权限干扰(如果没有*，则不显示*)及 自定义分组
        switch (d.id) {
          case '350':
            if (!_this.$PM.module.dzwl.v.setBool) {
              bool = false
            }
            break;
          case '351':
            if (!_this.$PM.module.ydsf.v.enable) {
              bool = false
            }
            break;
          case '352':
            if (!_this.$PM.module.dctx.v.enable) {
              bool = false
            }
            break;
          // case '***':
          // 完善默认分组的权限后完善此逻辑
          //   break;
          default:
            bool = true;
            break;
        }

        return bool
      })

      followList.forEach(cellType => { // 关注类型
        cellType.children.forEach(cellCorp => { // 公司级
          cellCorp.children.forEach(cellCar => { // 车辆级
            let uuid = generateUUID('aaa');
            cellCar.followKey = cellCar.followKey || uuid;
            // 监听ing
            var checkIndex = monitorData.IndexOf(
              +cellCar.vehicleid,
              d => +d.basicdata.vehicleid
            );
            if (checkIndex !== -1) {
              cellCar.children = monitorData[checkIndex].proddata;
              _this.$store.dispatch('updateVehicleStateTree', {
                vehicleid: cellCar.vehicleid,
                data: cellCar.followKey
              });
              _this.$store.dispatch('addStateTree', {
                tag: 'follow',
                key: 'check',
                value: cellCar.followKey
              });
            }
          });
        });
        data.push(cellType);
      });
      this.$store.commit('arrFollowList', data)
      return data;
    }
  },
  watch: {
  },
  data () {
    return {
      followVehList: [], // 所有关注车列表
      followLoading: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  methods: {
    loadNode (node, resolve) {
      let data = this.followTreeData;
      switch (node.level) {
        case 0:
          let _data = [{ label: '关注车辆', children: data }];
          return resolve(_data);
        case 1:
          break;
        case 2:
          break;
        case 3:
          break;
        default:
          break;
      }
    },
    // 勾选的时候操作
    handleCheck (data, ischeck, cischeck) {
      let objTransfer = this.$store.getters.objTransfer;
      if (objTransfer.isTransfer) {
        let complate = 'follow';
        this.$store.commit('objTransfer', { complate });
        this.$emit('handleCheck', {
          data: data,
          ischeck: ischeck,
          cischeck: cischeck,
          type: 'follow'
        });
      }
    },

    // 节点点击
    nodeClick (data, node, target) {
      // 如果type 等于 1 显示设备详情
      if (data.type === 1) {
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
      } else {
        // 如果当前节点被选择 并且是一个车
        if (node.checked && data.vehicleid) {
          this.$store.dispatch('zoomToCarByCarId', {
            carId: data.vehicleid + '',
            _this: this
          });
        }
      }
    },
    setDeviceInfos (isMasterProd) {
      let _this = this;
      let data = { ...this.$store.getters.monitorDataDetails };

      let arrDeviceInfo = [];
      let bool = true;
      if (!isMasterProd) {
        bool = bool & false;
        let obj = { ...data.realdata, ...{ address: '获取中...' } };
        // let obj
        if (!data.realdata) {
          obj = { ...data.dev };
        }
        arrDeviceInfo = [obj];
        var point = utils.transformWGStoGCJ(obj.lng, obj.lat);
        _this.$map.$methods.getPointAddress(point, function (data) {
          obj.address = data;

          commit(arrDeviceInfo);
        });
      } else {
        arrDeviceInfo = [{ ...data.realdata, ...{ address: data.address } }];
      }
      if (bool) commit(arrDeviceInfo);

      function commit (obj) {
        _this.$store.commit('setDeviceInfos', obj);
        _this.$store.commit('SET_MONILOADING', false);
      }
    },
    collapseNode (row, evt) {
      let _this = this;
      function recursionRemoveState (row) {
        _this.$store.dispatch('removeStateTree', {
          tag: 'follow',
          key: 'expand',
          value: row.followKey
        });
        if (row.children && row.children.length > 0) {
          row.children.forEach(cell => {
            recursionRemoveState(cell);
          });
        }
      }
      recursionRemoveState(row);
    },
    handleNodeClick (row, evt) {
      let _this = this;
      function recursionAddState (row) {
        _this.$store.dispatch('addStateTree', {
          tag: 'follow',
          key: 'expand',
          value: row.followKey
        });
        if (row.children && row.children.length > 0) {
          row.children.forEach(cell => {
            recursionAddState(cell);
          });
        }
      }
      recursionAddState(row);
    },
    // 渲染树内容
    treeFollowRenderContent (h, { node, data, store }) {
      // 如果type为1 设备信息
      if (node.level === 4) {
        let title = data.label || data.prodnum
        return (
          <span class="custom-veh-tree-node">
            <span class="tdevice"> {title} </span>
          </span>
        );
      } else if (data.vehicleid) {
        let key = data.vehicleid + '@' + data.pid;
        return (
          <span class="custom-veh-tree-node1">
            <span vhId={key}>{data.label} </span>
          </span>
        );
      } else {
        let title = data.label || data.prodnum
        return (
          <span class="custom-veh-tree-node2">
            <span>{title} </span>
          </span>
        );
      }
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

    setTreeRightContext () {
      let _this = this;
      this.$context.attach('span.custom-veh-tree-node1', [
        { header: '车辆功能菜单' },
        {
          text: '取消关注',
          action: function (e, doms) {
            let params = $(doms)
              .attr('vhId')
              .split('@');
            let r = confirm('确定删除该车辆的关注吗');
            if (r) {
              _this.$request.follow.delete(params);
            }
          }
        },
        {
          text: '关注信息',
          action: function (e, doms) {
            let vhId = _this.getVhId(doms)
            _this.$store.commit('setSelectVhID', vhId)
            _this.$store.commit('carBoxOpenOrClose', {
              openState: true,
              $class: 'followInfo'
            })
          }
        }
      ]);
    }
  },
  created () {
    // 申明树实例
    this.$nextTick(function () {
      Vue.prototype.$followTree = this.$refs.treeVehtree;
    });
    // this.initFollowTreeData();
  },
  mounted () {
    this.setTreeRightContext();
  }
};
</script>

<style>
#followCar {
  overflow: auto;
}
</style>
