<!-- 数据图表-个人信息 -->
<template>
  <section class='personalInfo' :id="personalInfo" style="font-size:12px;">
    <div class="left-top"></div>
    <div class="right-top"></div>
    <div class="let-bottom"></div>
    <div class="right-bottom"></div>
    <div class="monitorHead">
      <!-- 车牌号/车架号 -->
      <span class="carBrandSpan">
        <span class="carBrand">{{ listData.carNo}}</span>
      </span>
    </div>
    <div class="corpName">
      <!-- 姓名 -->
      <span class="carOwnerName">{{ listData.ownername }}</span>
      <!--信息图标-->
      <i class="iconfont " v-if="listData.ownersex" :class="arrSexToIcon[listData.ownersex]" style="color: #009bfb;font-size: 18px"></i>
      <i class="iconfont " v-if="listData.hastheftinsurance" :class="listData.hastheftinsurance ? 'icon-baozhang-copy' : ''" style="color: #ff6a1a"></i>
    </div>
    <div class="timeTable">
      <span>默认统计时间段:</span>
      <!-- <span class="timeSpan activeTime" @click="choiceTime(1,$event)">日</span>
      <span class="timeSpan" @click="choiceTime(2,$event)">月</span>
      <span class="timeSpan" @click="choiceTime(3,$event)">年</span> -->
      <span v-for="(item,index) in timeData" class="timeSpan " :class="item.index === cuIndex ? 'activeTime' : ''" :key="index" @click="choiceTime(index)">
        {{item.text}}
      </span>
    </div>
    <div class="infoContent">
      <!-- 当为【车辆异常】或【车辆报警】时 -->
      <template v-if="listData.policeType">
        <div class="line">
          <p class="leftTits">车架号:</p>
          <p title="" class="rightData">{{ listData.frameNumber ? listData.frameNumber : '暂无' }}{{listData.frameNumber}}</p>
        </div>
        <div class="line">
          <p class="leftTits">设备号:</p>
          <p class="rightData">{{ listData.equipmentNo ? listData.equipmentNo : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">通讯时间:</p>
          <p title="" class="rightData">{{ listData.GPSTime ? listData.GPSTime : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">报警时间:</p>
          <p title="" class="rightData">{{ listData.serverTime ? listData.serverTime : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">地址:</p>
          <p title="" class="rightData">{{ listData.adress ? listData.adress : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">异常类型:</p>
          <p title="" class="rightData">{{ listData.policeType ? listData.policeType : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">异常信息:</p>
          <p title="" class="rightData">{{ listData.policeInfo ? listData.policeInfo : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">异常次数:</p>
          <p title="" class="rightData">{{ listData.policeSecond ? listData.policeSecond : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">经度:</p>
          <p title="" class="rightData">{{ listData.point[0] ? listData.point[0] : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">纬度:</p>
          <p title="" class="rightData">{{ listData.point[1] ? listData.point[1] : '暂无' }}</p>
        </div>
      </template>
      <!-- 当为【监控列表】时 -->
      <template v-else>
        <div class="line">
          <p class="leftTits">车架号:</p>
          <p title="" class="rightData">{{ listData.vin}}</p>
        </div>
        <div class="line">
          <p class="leftTits">设备号:</p>
          <p class="rightData" v-for="(item,index) in listData.proddata" :key="index">{{ item.prodnum }}</p>
        </div>
        <div class="line">
          <p class="leftTits">SIM:</p>
          <p title="" class="rightData" v-for="(item,index) in listData.proddata" :key="index">{{ item.simcard }}</p>
        </div>
        <div class="line">
          <p class="leftTits">所属公司:</p>
          <p title="" class="rightData">{{ listData.corpname ? listData.corpname : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">车辆类型:</p>
          <p title="" class="rightData">{{ listData.vehicletype ? listData.vehicletype : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">型号:</p>
          <p title="" class="rightData">{{ listData.model ? listData.model : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">车身颜色:</p>
          <p title="" class="rightData">{{ listData.color ? listData.color : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">联系电话:</p>
          <p title="" class="rightData">{{ listData.ownermobile ? listData.ownermobile : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">身份证号:</p>
          <p title="" class="rightData">{{ listData.idcard ? listData.idcard : '暂无' }}</p>
        </div>
        <div class="line">
          <p class="leftTits">接入时间:</p>
          <p title="" class="rightData">{{ listData.appointDataStr ? listData.appointDataStr : '暂无'}}</p>
        </div>
      </template>
    </div>

  </section>
</template>

<script>
export default {
  name: '',
  components: {},
  props: [],
  data () {
    return {
      // listData: [],
      // personalInfo: 'personalInfo',
      cuIndex: 0,
      timeData: [
        { index: 0, text: '日' },
        { index: 1, text: '月' },
        { index: 2, text: '年' }
      ],
      arrSexToIcon: {
        '男': 'iconSex iconfont icon-nan',
        '女': 'iconSex iconfont icon-nv'
      }
    };
  },
  mounted () {
    // this.getDataDetail();
  },
  destroyed(){
this.choiceTime(0)
  },
  computed: {
    // cuIndex () {
    //   let obj = [...this.$store.state.hisZoom.info].pop();
    //   return 0; // obj ? 0 :
    // },
    personalInfo () {
      this.cuIndex = 0
      let obj = [...this.$store.state.hisZoom.info].pop();
      let id = obj ? obj.basicdata.vehicleid : '';
      return 'personalInfo' + id;
    },
    listData () {
      let obj = [...this.$store.state.hisZoom.info].pop();
      if (obj.basicdata.carNo) {
        console.debug(obj.basicdata)
        let data =
         {
           carNo: obj.basicdata.carNo.split('/')[0] || '暂无',
           ownername: obj.basicdata.ownername || '暂无',
           ownersex: obj.basicdata.ownersex === null ? false : obj.basicdata.ownersex,
           hastheftinsurance: obj.basicdata.hastheftinsurance,
           vin: obj.basicdata.vin,
            proddata: obj.proddata, // .map(item=>item.prodnum)
           corpname: obj.basicdata.corpname,
           vehicletype: obj.basicdata.vehicletype,
           model: obj.basicdata.model,
           color: obj.basicdata.color === null ? '暂无' : obj.basicdata.color,
           ownermobile: obj.basicdata.ownermobile,
           idcard: obj.basicdata.idcard,
           appointDataStr: obj.basicdata.appointDataStr
         };
        return data
      } else {
        return [];
      }
    }
  },
  methods: {
    choiceTime (timeState) {
      this.cuIndex = timeState;
      // let $this = $(e.target);
      // $this
      //   .addClass('activeTime')
      //   .siblings()
      //   .removeClass('activeTime');
      this.$store.commit('timeState', timeState+1);
    },
    // 获取当前点击行的数据详情
    getDataDetail () {
      let obj = [...this.$store.state.hisZoom.info].pop();
      this.personalInfo = 'personalInfo' + obj.basicdata.vehicleid;
      this.listData = {
        carNo: obj.basicdata.carNo.split('/')[0] || '暂无',
        ownerName: obj.basicdata.ownername || '暂无'
      };
    }
  },
  filters: {},
  watch: {}
};
</script>
