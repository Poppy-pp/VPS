<template>
  <section id="monitorListDetails"
            v-loading="moniLoading"
            element-loading-text="车辆详情加载中···"
            element-loading-background="rgba(0, 0, 0, 0.8)"
  >
    <!--异常列表详情-->
    <div class="monitorInfo setion1">
      <!--图表展示-->
      <p class="monitorHead">
        <span class="carBrandSpan">
           <span class="carBrand" v-text="monitorDataDetailsPute.basicdata.carno"></span>
        </span>
        <span class="carOwnerName" v-text="monitorDataDetailsPute.basicdata.ownername"></span>
        <!--信息图标-->
        <!-- <i :class="alliconfont.gender" style="color: #009bfb"></i>
        <i :class="alliconfont.collections" style="color: #fcd300"></i>
        <i :class="alliconfont.insurance" style="color: #fd6c18"></i>
        <i :class="alliconfont.blacklist" style="color: red"></i>
        <i :class="alliconfont.wallet" style="color: #f7645c"></i>
        <i :class="alliconfont.card" style="color: #ff6a1b"></i> -->
        <!--end-->
      </p>
      <div class="monitorContent">
        <!--车主信息-->
        <div class="equipment">
          <img :src="imgSrc" class="images">
          <div class="infoBox">
            <p>车架: <span v-text="monitorDataDetailsPute.basicdata.vin"></span></p>
            <p>车主身份证号: <span></span></p>
            <p>公司分组: <span v-text="monitorDataDetailsPute.basicdata.corpname"></span></p>
            <p v-if='remarkscontent'>备注: <span>{{remarkscontent}}</span></p>
          </div>
          <div class="infoBox">
            <p>车辆状态:
              <!-- <span v-if="(monitorDataDetailsPute.realdata.istate != 1 && monitorDataDetailsPute.realdata.istate > 0) || monitorDataDetailsPute.realdata.istate == 0">
                在线
              </span>
              <span v-else>离线
              </span> -->
              <span v-if="!monitorDataDetailsPute.realdata || monitorDataDetailsPute.realdata.istate === 1">离线</span>
              <span v-else>在线</span>
            </p>
            <!-- <p>服务开始时间: <span v-text="monitorDataDetailsPute.realdata.recvtime"></span></p> -->
            <p>接入平台时间: <span v-text="utils.formatDate.formatTime(monitorDataDetailsPute.basicdata.appointdate)"></span></p>
            <p v-if="monitorDataDetailsPute.address">地址: <span v-text="monitorDataDetailsPute.address"></span></p>
          </div>
        </div>
        <!--设备信息-->
        <div class="equipment" v-for="(item,index) in arrDeviceInfo" :key="index" @dblclick="OnLocation(arrDeviceInfo[index],index)">
          <img :src="getImgForProd(item.prodspec)" class="images">
          <div class="infoBox">
            <p>设备状态:
              <span v-if='arrDeviceInfo[index].istate == 1' v-text="'离线'+utils.formatDate.countTime( utils.formatDate.formatTime(new Date().getTime()) ,arrDeviceInfo[index].gpstime)"></span>
              <span v-else-if='arrDeviceInfo[index].istate == 1 || arrDeviceInfo[index].veo == 0' v-text="'停车'+utils.formatDate.countTime( utils.formatDate.formatTime(new Date().getTime()) ,arrDeviceInfo[index].gpstime)"></span>
              <span v-else v-text="'行驶'+utils.formatDate.countTime( utils.formatDate.formatTime(new Date().getTime()) ,arrDeviceInfo[index].gpstime)"></span>
            </p>
            <!-- <p>有效定位: <span v-text=""></span></p> -->
            <p>定位方式: <span v-text="'GPS'"></span></p>
            <!-- <p>设备定位: <span>
              <i class="iconfont"
              :class="arrDeviceInfo[index].show ? 'icon-iconfontguanbi' : 'icon-78'"
              style='font-size:14px;'
              :style="arrDeviceInfo[index].show ? 'color:red;' : 'color:green;'"

              ></i>
              </span></p> -->
            <p v-if="item.address">地址: <span v-text="item.address"></span></p>
            <!-- <p>服务器时间: <span v-text="monitorDataDetailsPute.realdata.recvtime"></span></p> -->
          </div>
          <div class="infoBox">
            <p>
              设备安装时间:
              <span v-if="monitorDataDetailsPute.proddata[index].installtime === null">
                暂无
              </span>
              <span v-else>
                {{ utils.formatDate.formatTime(monitorDataDetailsPute.proddata[index].installtime) }}
              </span>
            </p>
            <p>通讯时间: <span v-text="arrDeviceInfo[index].gpstime"></span></p>
            <!-- <p v-if="detailsAdress">地址: <span v-text="detailsAdress"></span></p> -->
          </div>
          <div class="infoBox">
            <p>SIM: <span v-text="monitorDataDetailsPute.proddata[index].simcard"></span></p>
            <p>设备编号: <span v-text="monitorDataDetailsPute.proddata[index].prodnum"></span></p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import utils from '@/utils/tool'; // 引入工具
import { vehicleremarks } from '@/Api/mapApi.js'
export default {
  name: 'detail',
  computed: {
    monitorDataDetailsPute () {
      return this.$store.getters.monitorDataDetails;
    },
    moniLoading () {
      let bool = this.$store.state.loadingMoni
      if (bool) {
        this.clearMarker()
      }
      return bool
    },
    arrDeviceInfo () {
      let data = this.$store.getters.deviceInfos
      return data
    },
    remarkscontent () {
      this.remarksData();
      return this.$store.getters.remarkscontent;
    }

  },
  data () {
    return {
      utils: utils,
      // 监控列表详情
      imgSrc: '/static/images/carDetails/carsImg.png', // 汽车图片假数据
      imgSrc2: '/static/images/carDetails/shebei.png', // 设备图片假数据
      alliconfont: {
        gender: 'iconfont icon-nan', // 性别icon
        collections: 'iconfont icon-guanzhu2', // 收藏icon
        insurance: 'iconfont icon-baozhang-copy', // 保险icon
        blacklist: 'iconfont icon-4fayuanheimingdan272636', // 黑名单icon
        wallet: 'iconfont icon-qiandai', // 钱包icon
        card: 'iconfont icon-yinxingqia3' // 卡icon
      },
      dictMarker: []
      // arrDeviceInfo: []
    };
  },
  created () {
    this.clearMarker()
  },
  destroyed () {
    this.clearMarker()
  },
  methods: {
    getImgForProd (type) {
      return type === '无线' ? '/static/images/carDetails/shebeiwuxian.png' : '/static/images/carDetails/shebeiyouxian.png'
    },
    clearMarker () {
      for (const id in this.dictMarker) {
        if (this.dictMarker.hasOwnProperty(id)) {
          const marker = this.dictMarker[id];
          marker && marker.setMap(null)
          let index = marker.getExtData().index
          // this.$store.commit('change')
          this.$store.commit('changeDeviceInfos', {index, bool: 0})
          delete this.dictMarker[id]
        }
      }
    },
    remarksData () {
      let vehicleid = this.$store.getters.monitorDataDetails.vehicleid;
      let parms = {}
      let _this = this;
      var remarkcon = [];
      parms.index = 0;
      parms.pagesize = 100000;
      parms.id = vehicleid;
      parms.userid = this.$store.getters.user.userid;
      vehicleremarks(parms).then(function (res) {
        let info = res.data;
        if (info.result.code == 0 && info.data) {
          info.data.forEach((item, index) => {
            remarkcon.push(item.Content ? item.Content : ' - ');
          })
          _this.$store.state.remarkscontent = remarkcon.join(' ; ')
        } else {
          _this.$store.state.remarkscontent = '';
        }
      });
    },
    createDeviceMarker (row, index) {
      let map = this.$store.getters.mapObj
      let [lng, lat] = utils.transformWGStoGCJ(row.lng, row.lat)
      let iconStr = row.prodspec === '无线' ? 'icon-iconset0250' : 'icon-hekriconshebeichatou2'
      var marker = new SvgMarker(
        new SvgMarker.Shape.IconFont({
          symbloJs: null,
          // icon: 'icon-youxianshebei',
          // icon: 'icon-cheliangzhuangtaibaojing',
          icon: iconStr,
          size: 30,
          offset: [-15, -23],
          fillColor: 'green'
        }),
        {map,
          position: [lng, lat],
          showPositionPoint: false,
          extData: {...row, index}
        }
      )
      marker.show = 1
      this.dictMarker[index] = marker
    },
    // 报警信息显示
    showOfMap (row, index) {
      let map = this.$store.getters.mapObj
      if (!this.dictMarker[index]) {
        this.createDeviceMarker(row, index)
      } else {
        let marker = this.dictMarker[index]
        marker.show = 1
        marker.setMap(map)
      }
      let arrMarker = this.dictMarker.filter(d => {
        return d.show === 1
      })
      map.setFitView(arrMarker)
      if (arrMarker.length > 1) {
        let zoom = map.getZoom()
        map.setZoom(zoom - 3)
      }
    },
    hiddleOfMap (row, index) {
      let marker = this.dictMarker[index]
      marker.show = 0
      marker && marker.setMap(null)
    },
    OnLocation (info, index) {
      if (!info.show) {
        this.$store.commit('changeDeviceInfos', {index, bool: 1})
        this.showOfMap(info, index)
      } else {
        this.$store.commit('changeDeviceInfos', {index, bool: 0})
        this.hiddleOfMap(info, index)
      }
    }

  },

  mounted () {
    // var data = utils.formatDate.countTime(
    //   utils.formatDate.formatTime(new Date().getTime()),
    //   this.monitorDataDetailsPute.realdata.gpstime
    // );
  }
};
</script>
