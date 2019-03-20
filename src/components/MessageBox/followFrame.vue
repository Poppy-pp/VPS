<template>
    <section id="followFrame">
      <div class="box bounce-enter-active">
        <div style="padding: 10px 18px 0 18px;">
          <div class="left-top"></div>
          <div class="right-top"></div>
          <div class="let-bottom"></div>
          <div class="right-bottom"></div>
          <com-frame-box @closeState="closeState" :boxTit="followDatas.boxTit"></com-frame-box>
          <hr class="hrColor">
          <div class="boxContent">
            <div class="guanzhuType">
              <span style="float: left;margin-right: 6px">关注类型：</span>
              <div class="radioBox">
                <el-radio class="radioContent" ref="gzInfo" :key="index" v-model="guanzhuTypeRadio" :label="item" v-for="(item,index) in followDatas.guanzhuTypeArr">{{item.name}}</el-radio>
              </div>
            </div>
            <div class="guanzhuInfo">
              <span style="float: left;margin-right: 6px;margin-top: 5px;">关注信息：</span>
              <el-input
                class="textareaContent"
                type="textarea"
                :rows="3"
                placeholder="请输入关注信息"
                v-model="followDatas.guanzhuInfo">
              </el-input>
            </div>
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
  import comFrameBox from '@/components/MessageBox/comFrameBox' // 弹框公用头部
  import { getFollowData } from '@/Api/mapApi.js'
  import utils from '@/utils/tool';
  export default {
    name: 'followBox',
    components: {
      comFrameBox
    },
    props: ['frameProp'],
    data () {
      return {
        followDatas: this.frameProp, // 传过来弹框的值
        guanzhuTypeRadio: null
      }
    },
    methods: {
      // 关闭弹框
      closeState () {
        this.$store.commit('carBoxOpenOrClose', {$closeClass: 'follow'});
      },
      // 关注
      confirm () {
        let _this = this;
        // let ydsfInfo = _this.$store.getters.moveCarInfo;                    //车辆自身数据
        let Vehicleid = this.$store.state.selectVhID
        let parms = {}

        parms.Createdate = utils.formatDate.formatTime(new Date().getTime());
        parms.Shareind = 0;
        parms.Createby = _this.$store.getters.user.userid;
        parms.Vehicleid = Vehicleid;
        parms.Groupid = _this.guanzhuTypeRadio.id;
        parms.Groupname = _this.guanzhuTypeRadio.name;
        parms.remark = _this.followDatas.guanzhuInfo;
        parms.name = '';
        parms.corpcode = '';
        parms.corpname = '';
        parms.updatedate = utils.formatDate.formatTime(new Date().getTime());

        // confirmFollow(parms)
        _this.$request.follow.add(parms)
          .then(function (res) {
            let info = res.data;
            if (info.result.code === 0) {
              let para = {
                userid: _this.$store.getters.user.userid,
                condition: '',
                id: -1
              };
              // _this.$store.commit('SET_FOLLOWLISTLOADING', {
              //   boole: true,
              //   content: '关注列表加载中...'
              // });
              // // getFollowData(para)
              _this.$request.follow.init(para)
              // .then(res => {
              //   // 判断请求是否成功
              //   function isSucceed (obj) {
              //   // return obj.data.result.code === 0;
              //     return !!(
              //       obj.data &&
              //     obj.data.data &&
              //     obj.data.data.length > 0
              //     );
              //   }

              //   let followData = {
              //     arrType: '',
              //     arrCarInfos: ''
              //   };
              //   // 并发请求是否成功
              //   let isRun = true;
              //   res.forEach((data, i) => {
              //     let bloor = isSucceed(data);
              //     let key = i === 0 ? 'arrType' : 'arrCarInfos';
              //     isRun = isRun & bloor;
              //     if (bloor) {
              //       followData[key] = data.data.data;
              //     }
              //   });

              //   // 成功则继续运行
              //   if (isRun) {
              //     _this.$store.commit('SET_FOLLOWLISTLOADING', {
              //       boole: false,
              //       content: '关注列表加载中...'
              //     });
              //     _this.$store.commit('SET_FOLLOWDATA', followData);
              //   } else {
              //     _this.$store.commit('SET_FOLLOWLISTLOADING', {
              //       boole: true,
              //       content: '服务器错误...'
              //     });
              //   }
              // })
              // .catch(error => {
              //   _this.$store.commit('SET_FOLLOWLISTLOADING', {
              //     boole: true,
              //     content: '请求失败...'
              //   });
              // });

              _this.$message.success('关注成功！');
              _this.closeState();
            }
          });
      },
      created () {
      }
    }
  }
</script>
