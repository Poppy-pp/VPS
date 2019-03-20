<template>
  <section id="comFrame">
    <div class="box bounce-enter-active">
      <div style="padding: 10px 18px 0 18px;">
        <div class="left-top"></div>
        <div class="right-top"></div>
        <div class="let-bottom"></div>
        <div class="right-bottom"></div>
        <com-frame-box @closeState="closeState" :boxTit="fortificationDatas.boxTit"></com-frame-box>
        <div class="boxContent">
          <p style="margin: 8px 0">
                  <span class="plateNumberBgk" style=" display: inline-block;border-radius: 5px;padding: 5px 2px;">
                    <span class="plateNumber" v-text="fortificationDatas.carno"></span>
                  </span>
            <span class="carOwner" v-text="fortificationDatas.carOwner"></span>
            <span style="margin-left:20px;color: #00d452;cursor: pointer" v-if="fortificationDatas.showDelSf" @click="delSf">取消原地设防</span>
          </p>
          <p class="lineInfo iconfont icon-78" v-if="fortificationDatas.lg">
            <span class="lg"> 设防经度 :{{fortificationDatas.lg}}</span>&nbsp;&nbsp;
            <span class="lt"> 设防纬度 :{{fortificationDatas.lt}}</span>
          </p>
          <p class="lineInfo iconfont icon-shijian1" v-if="fortificationDatas.CreateDate">
            设防时间:
            <span class="place" v-text="fortificationDatas.CreateDate"></span>
          </p>
          <p class="lineInfo iconfont icon-weizhi" v-if="fortificationDatas.sfplace">
            设防位置: <span class="place" v-text="fortificationDatas.sfplace"></span>
          </p>
          <p class="lineInfo iconfont icon-weizhi">
            当前位置: <span class="place" v-text="fortificationDatas.place"></span>
          </p>
          <p class="lineInfo iconfont icon-juli">
            设防距离: <el-input v-model="fortificationDatas.distance" placeholder=""></el-input> 米
          </p>
        </div>
        <hr class="hrColor">
      </div>
      <div class="sendBtn" @click="confirm">
        <span>确定</span>
      </div>
    </div>
  </section>
</template>

<script>
import comFrameBox from '@/components/MessageBox/comFrameBox'; // 弹框公用头部
import utils from '@/utils/tool'; // 引入工具
import followFrame from '@/components/MessageBox/followFrame';
export default {
  name: '',
  components: {
    comFrameBox,
    followFrame
  },
  props: ['frameProp'],
  data () {
    return {
      // fortificationDatas: this.frameProp // 传过来的弹框信息
    };
  },
  mounted () {},
  methods: {

    // 设防
    confirm () {
      if (!+this.fortificationDatas.distance) {
        this.$message.warning('设防距离应该大于0米！');
        return;
      }
      // 参数
      let ydsfInfo = this.$store.getters.moveCarInfo; // 获取状态树 原地设防数据

      // let [lng, lat] = utils.transformWGStoGCJ(ydsfInfo.lng, ydsfInfo.lat)
      let index_ = this.$store.getters.monitorData.IndexOf(ydsfInfo.vehicleid, d => d.vehicleid)
      let vehdata = this.$store.getters.monitorData[index_]
      let [lng, lat] = [vehdata.realdata.lng, vehdata.realdata.lat]
      let params = {};
      params.VehicleId = ydsfInfo.vehicleid;
      params.LngLat = lng + ',' + lat;
      params.Radius = this.fortificationDatas.distance;
      params.ID = this.fortificationDatas.ID;
      params.IsDelete = 0;
      params.Remarks = '';
      params.CreateDate = utils.formatDate.formatTime(new Date().getTime());
      params.CreateBy = this.$store.getters.user.userid;
      params.UpdateDate = '';
      params.UpdateBy = this.$store.getters.user.userid;

      // 修改
      if (this.fortificationDatas.showDelSf) {
        this.updateSf(params);
      } else {
        // 添加
        this.addSf(params);
      }
    },
    addSf (params) {
      let that = this;
      /* 增加设防 */

      // addYdsf(params)
      that.$request.vehicle.addYDSF(params)
        .then(function (response) {
          if (response.data.result.code === 0) {
            // 设防成功，显示解除原地设防
            that.fortificationDatas.showDelSf = true;
            that.fortificationDatas.sfplace = that.fortificationDatas.place;
            // 请求数据
            // getYdsfInfo({
            //   id: that.$store.getters.moveCarInfo.vehicleid,
            //   userid: that.$store.getters.user.userid
            // })
            that.$request.vehicle.getYDSF(that.$store.getters.moveCarInfo.vehicleid)
              .then(function (response) {
                let info = response.data;
                if (info.result.code === 0) {
                  let data = info.data
                  if (data) {
                    let index_ = that.$store.getters.monitorData.IndexOf(params.VehicleId, d => d.vehicleid)
                    that.$store.dispatch('changeMonitorData', {data,
                      index: index_,
                      changeFun: function (oldData, data, index) {
                        oldData[index].custom.ydsf = data
                        return oldData
                      }})
                  }

                  // let point =
                  // 坐标转码

                  let obj = {
                    id: info.data.ID,
                    lg: info.data.LngLat.split(',')[0],
                    lt: info.data.LngLat.split(',')[1],
                    distance: info.data.Radius,
                    CreateDate: new Date(info.data.CreateDate).toLocaleDateString()
                  }
                  Object.assign(that.fortificationDatas, obj)
                  that.$parent.$refs.rmap.createFortificationMarker(that.fortificationDatas)

                  that.$store.dispatch('zoomYdsf', that.fortificationDatas.vehicleid)
                }
              });
            that.$message.success('设防成功');
            that.$request.follow.add({Groupid: '351', remark: '原地设防'})
              .then(res => {
                if (res.data.result.code === 0) {
                  that.$message({
                    message: '设置原地设防成功！',
                    type: 'success'
                  })
                  that.$request.follow.update()
                }
              })
              .catch(error => {
                if (error) {
                  that.$message({
                    message: '设置原地设防失败！',
                    type: 'error'
                  })
                }
              })

            that.closeState();
            // followFrame.methods.confirm();
          } else {
            that.$message.warning('设防失败');
          }
        })
        .catch(function (error) { if (error) {} });
    },
    updateSf (params) {
      /* 修改设防 */

      let that = this;
      let vehicleid = this.$store.getters.moveCarInfo.vehicleid;
      // updateYdsf(params)
      that.$request.vehicle.updateYDSF(params)
        .then(function (response) {
          let info = response.data;
          if (info.result.code === 0) {
            let index_ = that.$store.getters.monitorData.IndexOf(params.VehicleId, d => d.vehicleid)
            let data = that.$store.getters.monitorData[index_].custom.ydsf
            data.Radius = params.Radius
            data.CreateDate = params.CreateDate
            data.LngLat = params.LngLat
            if (data) {
              that.$store.dispatch('changeMonitorData', {data,
                index: index_,
                changeFun: function (oldData, data, index) {
                  oldData[index].custom.ydsf = data
                  return oldData
                }})
            }


            that.$store.getters.dictYDSFMarker[vehicleid].setRadius(+that.fortificationDatas.distance)
            that.$store.getters.dictYDSFMarker[vehicleid].setExtData(that.fortificationDatas)

            // that.$parent.$refs.rmap.createFortificationMarker(that.fortificationDatas)
            that.$store.dispatch('zoomYdsf', vehicleid)
            that.$message.success('修改原地设防成功');
            that.closeState();
          } else {
            that.$message.warning('修改原地设防失败');
          }
        })
        .catch(function (error) { if (error) {} });
    },
    delSf () {
      let this1 = this;
      let params = {}; // 获取设防信息传值
      let ydsfInfo = this1.$store.getters.moveCarInfo; // 获取状态树 原地设防数据
      params.id = ydsfInfo.vehicleid;
      params.userid = this1.$store.getters.user.userid;
      // delYdsf(params)
      this1.$request.vehicle.deleteYDSF(params)
        .then(function (response) {
          let info = response.data;
          if (info.result.code == 0) {
            this1.fortificationDatas.showDelSf = false;
            delete this1.fortificationDatas.CreateDate
            this1.$store.commit('delete_ydsfMarker')
            // 删除成功取消关注
            this1.$request.follow.delete([params.id, 351, 1])
            this1.$message.success('取消设防成功');
            let data
            let cuIndex = this1.$store.getters.monitorData.IndexOf(params.id, d => d.vehicleid)
            this1.$store.dispatch('changeMonitorData', {data,
              index: cuIndex,
              changeFun: function (oldData, data, index) {
                oldData[index].custom.ydsf = data
                return oldData
              }})

            this1.closeState();
          }
        })
        .catch(function (error) {
          if (error) {}
        });
    },
    // 关闭弹框
    closeState () {
      if (this.fortificationDatas.showDelSf) {
        this.$store.commit('delete_ydsfMarker')
      }

      // 关闭
      this.$store.commit('carBoxOpenOrClose', { $closeClass: 'ydsf' });
    }
  },
  filters: {},
  computed: {
    fortificationDatas () {
      return this.frameProp
    }
  },
  watch: {

  }
};
</script>

<style scoped>
</style>
<style>
</style>
