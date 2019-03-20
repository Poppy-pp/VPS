<template>
  <section id="instructionsFrame">
    <div class="box bounce-enter-active">
      <div style="padding: 10px 18px;">
        <div class="left-top"></div>
        <div class="right-top"></div>
        <com-frame-box @closeState="closeState" :boxTit="instructionsDatas.boxTit"></com-frame-box>
        <div class="boxContent">
          <p style="margin: 10px 0">
            <span class="plateNumberBgk" style=" display: inline-block;border-radius: 5px;padding: 5px 2px;">
              <span class="plateNumber" v-text="instructionsDatas.plateNumber"></span>
            </span>
            <span class="carOwner" v-text="instructionsDatas.carOwner"></span>
            <span @click="changeHis" style="    user-select: none;
    float: right;margin: 4px 0;">
              <span>查看历史信息</span>
              <i class="iconfont icon-web_xiangxiazhankai" :class="isHis ? 'isHis': ''" style="font-size: 13px;"></i>
            </span>
          </p>
          <div>
            <el-radio v-model="instructionsDatas.phoneCheck" :key="index" :label="index" v-for="(item,index) in instructionsDatas.numberArr" @change="changeProd">{{item.prodnum}} </el-radio>
          </div>
          <div class="screenBox">
            <div v-if="!isHis" class="leftScreen">
              <p class="instructionsLabel" :class="indexIns === indexitem ? 'activeColor' :''" v-for="(item,indexitem) in instructionsDatas.instructionsArr[indexProd]" :key="item.ordercode" v-text="indexitem+1 + '   ' +item.orderdesc" @click="handQuery(item,$event)" style="margin:2px 0;"></p>
            </div>
            <div v-if="isHis" class="hisWrapper">
              <div v-if="!hisDetails" class="hisTreeWrapper"></div>
              <div v-if="hisDetails" class="hisDetailsWrapper"></div>
            </div>
            <!-- <div class="rightScreen">
              <p v-text="instructionsDatas.instructionResult"></p>
            </div> -->
          </div>
        </div>
      </div>
      <div v-if="!isHis" class="sendBtn" @click="sendAjax">
        <span class="iconfont icon-dingwei3">发送</span>
      </div>
    </div>
  </section>
</template>

<script>
import comFrameBox from '@/components/MessageBox/comFrameBox'; // 弹框公用头部
import { sendInstructions } from '@/Api/mapApi.js';
export default {
  name: '',
  components: {
    comFrameBox
  },
  props: ['frameProp'],
  data () {
    return {
      instructionsDatas: this.frameProp, // 传过来的弹框信息
      /* 当前选总的设备指令参数 */
      parms: {
        prodnum: '',
        ordercode: '',
        sendby: ''
      },
      /* end */
      indexProd: 0,
      indexIns: 0,
      isHis: false,
      hisDetails: false,
      arrHis: [],
      indexHis: undefined
    };
  },
  mounted () {
    console.debug('this', this.$props.frameProp);
  },
  methods: {
    changeHis () {
      this.isHis = !this.isHis;
      this.hisDetails = false;
      this.indexIns = 0;
    },
    changeProd (index) {
      this.indexProd = index;
      this.indexIns = 0;
    },
    handQuery (item, e) {
      let _this = this;
      $(e.target)
        .addClass('activeColor')
        .siblings()
        .removeClass('activeColor');
      _this.instructionsDatas.instructionResult = $(e.target).text(); // 指令选择赋值
      /* 当前点击的设备指令参数存放 */
      _this.parms.prodnum =
        _this.instructionsDatas.numberArr[_this.indexProd].prodnum; // 当前选中的设备编码
      _this.parms.ordercode = item.ordercode;
      _this.parms.sendby = _this.$store.getters.user.userid;
      /* end */
    },
    sendAjax () {
      let _this = this;
      if (!_this.instructionsDatas.instructionResult) {
        _this.$message.warning('右侧指令不能为空');
      } else {
        sendInstructions(_this.parms)
          .then(function (response) {
            let info = response.data;
            if (info.result.code == 0) {
              _this.$message.success('发送成功');
              // _this.closeState();
            } else {
              _this.$message.error('发送失败');
            }
          })
          .catch(function (error) {
            if (error) {
              console.error(error);
            }
          });
      }
    },
    // 右上角×关闭指令
    closeState () {
      this.$store.commit('carBoxOpenOrClose', { $closeClass: 'zhiling' });
    }
  },
  filters: {},
  watch: {}
};
</script>


<style>
.isHis {
  transform: rotate(180deg);
}
</style>
