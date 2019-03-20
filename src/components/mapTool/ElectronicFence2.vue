<!--*
* @description: 电子围栏维护
* @author: wp
* @update: 2018-05-5
-->
<template>
  <aside id="efStyle" class="enclosureDiv comFontSize">
    <!-- <div v-if="eftype"> -->
      <div>
      <h3>电子围栏列表
        <slot name="iconCha"></slot>
      <!-- <i class="add iconfont icon-jiahao" @click="addEnclosure"></i> -->
      </h3>
      <div style="width: 100%;height:300px;overflow: auto;">
      <div class="line" v-for="(temp,index) in arrEnclosure" :key="index">
        <el-checkbox class="ef_checkbox" v-model="temp.checked">
          {{ temp.EfenceName }}
          </el-checkbox>
        <div style="float: right">
          <!-- <i class="option iconfont icon-yduigantanhaoshixin"></i> -->
          <i v-if="fenceForId.indexOf(+temp.ID) === -1" class="option iconfont icon-jiahao" @click="btnAddFence(temp)"></i>

          <i v-else class="fence-close option iconfont icon-guanbib" @click="btnDeleteFence(temp)"></i>
          <!-- <i class="option iconfont icon-lajitong" @click="delEnclosure(index)"></i> -->
        </div>
      </div>
</div>
    </div>


  </aside>
</template>

<script>
import {
//   searchefence,
//   addVehicleefence,
//   deleteVehicleefence,
//   getAlreadyFollow,
//   confirmFollow,
//   removeFollow,
//   queryfollowdata
searchVEbyvehicleid
} from '@/Api/mapApi.js';
export default {
  name: 'Efence',
  computed: {
    // addOrDel(){

    // },
    arrEnclosure () {
      return this.$store.getters.DZWLList;
    }
  },
  props: ['ElectronicProp'],
  data () {
    return {
      fenceForId: []
    };
  },
  // mounted(){
  // },
  created () {
    let _this = this;
    this.getSearchVEByVehicleId();
    if (this.$store.getters.DZWLList.length === 0) {
      // searchefence({
      //   index: 0,
      //   pagesize: 40,
      //   condition: '',
      //   userid: this.$store.getters.user.userid
      // })
      this.$request.efence.getList()
        .then(res => {
          if (res.data.result.code === 0) {
            var data = res.data.data.map(function (item) {
              item.checked = false;
              return item;
            });
            // _this.$store.commit("SET_DZWLLISTLOADING", false);
            _this.$store.commit('SET_DZWLLIST', data);
          }
        });
    }
  },
  methods: {
    // 关闭弹框
    closeState () {
      this.$store.commit('carBoxOpenOrClose', { $closeClass: 'dzwk' });
    },
    getNowFormatDate () {
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
    },
    updateFollowListData () {
      let _this = this;
     this.$request.follow.update()
   },
    btnAddFence (data) {
      let _this = this;
      let para = {
        ID: -1,
        VehicleId: this.$store.getters.selectVhID,
        EfenceId: data.ID,
        IsDelete: 0,
        Remarks: '',
        CreateDate: this.getNowFormatDate(),
        CreateBy: this.$store.getters.user.userid,
        UpdateDate: '',
        UpdateBy: this.$store.getters.user.userid
      };
      // 给车辆添加电子围栏
      // addVehicleefence(para)
      this.$request.vehicle.addEfence(para)
        .then(res => {
          // 添加成功则 判断是否添加至关注列表
          if (res.data.result.code === 0) {
            // _this.closeState();
            let para = {
              userid: _this.$store.getters.user.userid,
              condition: _this.$store.getters.selectVhID
            };

  searchVEbyvehicleid(para)
            // _this.$request.vehicle.getFollowList(para)
              .then(res => {
                if (res.data.result.code === 0) {
                  let datas = res.data.data || [];
        let VE = datas // res.data.data || [];
        if(VE.length > 0){
        let cuIndex = _this.$store.getters.monitorData.IndexOf(para.condition,d=>d.vehicleid)
        _this.$store.dispatch('changeMonitorData', {data: VE,
          index: cuIndex,
          changeFun: function (oldData, data, index) {
            oldData[index].custom.dzwl = data
            return oldData
          }})
}
                  let index = datas.IndexOf(350, d => +d.pid);
                  if (index === -1) {
                    let Vehicleid = _this.$store.state.selectVhID;
                    let parms = {};
                    parms.Vehicleid = Vehicleid;
                    parms.Groupid = 350;
                    parms.remark = '添加电子围栏自动关注';

                    // confirmFollow(parms)
                    _this.$request.follow.add(parms)
                      .then(function (res) {
                        let info = res.data;
                        if (info.result.code === 0) {
                          _this.updateFollowListData()
                        }
                      });
                  }
                }
              })
              .catch(error => {
                if (error) {}
              });
            _this.fenceForId.push(data.ID);
            _this.$message({
              message: '添加成功',
              type: 'success'
            });
          }
        })
        .catch(error => {
          if (error) {
            console.error(error)
          }
        });
    },
    btnDeleteFence (data) {
      let _this = this;
      let para = {
        condition: this.$store.getters.selectVhID + '@' + data.ID,
        userid: this.$store.getters.user.userid
      };
      // deleteVehicleefence(para)
      this.$request.vehicle.deleteEfence(para)
        .then(res => {
          if (res.data.result.code === 0) {
            // this.closeState();
            let index = _this.fenceForId.indexOf(data.ID);
            _this.fenceForId.splice(index, 1);
                       let para = {
              userid: _this.$store.getters.user.userid,
              condition: _this.$store.getters.selectVhID
            };

  searchVEbyvehicleid(para)
              .then(res => {
                if (res.data.result.code === 0) {
                  let datas = res.data.data || [];
        let VE = datas // res.data.data || [];
        // if(VE.length > 0){
        let cuIndex = _this.$store.getters.monitorData.IndexOf(para.condition,d=>d.vehicleid)
        _this.$store.dispatch('changeMonitorData', {data: VE,
          index: cuIndex,
          changeFun: function (oldData, data, index) {
            oldData[index].custom.dzwl = data
            return oldData
          }})
// }
               }
              })
              .catch(error => {
                if (error) {}
              });


            if (_this.fenceForId.length === 0) {
              // removeFollow({
              //   condition:
              //     _this.$store.getters.selectVhID +
              //     '@350@' +
              //     this.$store.getters.user.userid
              // })
              this.$request.follow.delete([this.$store.getters.selectVhID, 350])
                .then(res => {
                  if (res.data.result.code === 0) {
                    _this.updateFollowListData()
                  }
                })
            }
            _this.$message({
              message: '删除成功',
              type: 'success'
            });
          }
        })
        .catch(error => {
          console.error(error);
        });
    },
    getSearchVEByVehicleId () {
      let _this = this;
      // this.$request.efence.getListForVehicleId(this.$store.getters.selectVhID)
      this.$request.vehicle.getEfenceList(this.$store.getters.selectVhID)
        .then(res => {
          if (res.data.result.code === 0) {
            let VE = res.data.data || [];
            _this.fenceForId = VE.map(d => +d.EfenceId);
          }
        });
    },
    // 清空电子围栏绘画工具
    clearElectroninFence () {
      if (this.districtExplorer) {
        this.districtExplorer.clearFeaturePolygons();
      }
      if (this.MousetoolElectronicFence) {
        this.$map.setDefaultCursor('');
        this.MousetoolElectronicFence.close(true);
      }
    }
  },
  // 电子围栏组件销毁后 清空操作 动作
  destroyed () {
    this.clearElectroninFence();
  }
};
</script>

<style>
.line i.iconfont:hover {
  /* font-size: 14px; */
  color: red;
}
</style>
