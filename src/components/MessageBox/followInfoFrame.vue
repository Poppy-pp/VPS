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
                <!-- <el-radio class="radioContent" ref="gzInfo" :key="index" v-model="guanzhuTypeRadio" :label="item" v-for="(item,index) in followDatas.guanzhuTypeArr">{{item.name}}</el-radio> -->
                <el-radio class="radioContent" ref="gzInfo" v-model="followDatas.guanzhuInfo.pname" :label="followDatas.guanzhuInfo.pname"
                 disabled checked>
                  {{followDatas.guanzhuInfo.pname}}
                </el-radio>
              </div>
            </div>
            <div class="guanzhuInfo">
              <span style="float: left;margin-right: 6px;margin-top: 5px;">关注信息：</span>
              <el-input
                class="textareaContent"
                type="textarea"
                :rows="3"
                placeholder="请输入关注信息"
                v-model="followDatas.guanzhuInfo.remark">
              </el-input>
            </div>
          </div>
          <hr class="hrColor">
        </div>
        <div class="sendBtn" >
          <button @click="closeState">取消</button>
          <button @click="confirm">保存</button>
        </div>
      </div>
    </section>
</template>

<script>
  import comFrameBox from '@/components/MessageBox/comFrameBox' // 弹框公用头部
  import utils from '@/utils/tool';
  export default {
    name: 'followInfoFrameBox',
    components: {
      comFrameBox
    },
    props: ['frameProp'],
    data () {
      return {
        // followDatas: this.frameProp, // 传过来弹框的值
        guanzhuTypeRadio: null
      }
    },
    computed: {
      followDatas () {
        return this.$store.getters.rightBtnObj
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
        let Vehicleid = this.$store.state.selectVhID
        let parms = {...this.followDatas.guanzhuInfo}

        // parms.Createdate = utils.formatDate.formatTime(new Date().getTime());
        // parms.Shareind = 0;
        parms.Createby = this.followDatas.guanzhuInfo.createby;
        parms.Vehicleid = this.followDatas.guanzhuInfo.id;
        parms.Groupid = this.followDatas.guanzhuInfo.pid
        parms.Groupname = this.followDatas.guanzhuInfo.pname
        parms.remark = _this.followDatas.guanzhuInfo.remark;
        // parms.name = '';
        // parms.corpcode = '';
        // parms.corpname = '';
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
              _this.$request.follow.init(para)

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
