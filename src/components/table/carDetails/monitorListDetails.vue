<template>
  <section id="monitorListDetails">
    <!-- 最外层包裹 -->
    <div class="vehicleDetails-wrapper" v-if="!loadingObj.monitorDetails">
      <!-- 车辆信息包裹 -->
      <div class="vehivleDetails-vehicle-wrapper">
        <!-- <ban :title="1"></ban> -->
        <div class="vehicle-cell" v-for="(block_,index1) in basicData" :key="index1">
          <div v-if="block_" v-for="(item,index) in block_" :key="index">
            <!-- 车辆图片 -->
            <img v-if="item.type === 'imgInfo'" :src="item.imgSrc" width="260px" height="110px" alt="车辆图片">
            <!-- 图片包含基础信息 -->
            <div class="label-wrapper" v-if="item.type === 'imgInfo'">
              <i id="baozhang-i" v-if="item.hastheftinsurance" class="iconfont" :class="item.hastheftinsurance"></i>
              <p id="carno-p">{{item.carno}}</p>
              <i v-if="item.sex" class="iconfont " :class="item.sex"></i>
              <p id="name-p">{{item.ownername}}</p>
            </div>
            <div v-if="item.type === 'colorInfo'" class="text-wrapper">
              <p class="title-p ">{{item.title}}</p>
              <p v-if="item.content" :style="'background:'+item.content+';width:40px;'"></p>
              <p v-else class="content-p">暂无数据</p>
            </div>
            <!-- text for -->
            <div v-if="item.type === 'textInfo'" class="text-wrapper">
              <p class="title-p ">{{item.title}}</p>
              <i v-if="item.fx" class="iconfont " :class="item.fx" style="margin-right:4px;color:#067816"></i>
              <p class="content-p ">{{item.content}}</p>
            </div>
            <div v-if="item.type === 'listInfo'" class="list-wrapper">
              <p class="title-p">{{item.title}}</p>
              <div v-if="item.title === '关注类型'" style="overflow: hidden;
    padding: 0 10px 0 0;">
                <p class="content-p" v-for="(listItem,listIndex) in item.list" :key="listIndex">
                  {{listItem.pname}}
                </p>
              </div>
              <div v-if="item.title === '备注'" style="overflow: hidden;
    padding: 0 10px 0 0;">
                <p class="content-p" v-for="(listItem,listIndex) in item.list" :key="listIndex">
                  <!-- {{listItem.Id}}  -->
                  {{listIndex + 1}}
                  :
                  {{listItem.Content}}
                </p>
              </div>
              <div v-if="item.title === '电子围栏'" style="overflow: hidden;
    padding: 0 10px 0 0;">
                <p class="content-p" v-for="(listItem,listIndex) in item.list" :key="listIndex">
                  {{listItem.EfenceName}}
                </p>
              </div>
              <div v-if="item.title === '原地设防'" style="overflow: hidden;
    padding: 0 10px 0 0;">
                <p class="content-p" v-for="(listItem,listIndex) in item.list" :key="listIndex">
                  {{listItem.Radius}}
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      <!-- 设备信息包裹 -->
      <div class="vehivleDetails-prods-wrapper">
        <!-- 设备选择包裹 -->
        <div v-if="prodData.length > 0" class="vehicleDetails-select-prods-wrapper">
<!-- {{selectIndexForProd}} -->
          <div v-for=" (item,index) in prodData.devices" :key="index" class="prodImg" :class="index === selectIndexForProd ? 'selectProd':''" @click="onProdSelect(index)">
            <img :src="item.imgSrc" width="80px" height="80px" style="position: relative;
    left: 2px;
    border-radius: 10px;
    top: 2px;" alt="设备默认图片">
          </div>
        </div>
        <div v-if="prodData.length > 0" class="vehicleDetails-prod-wrapper"  @dblclick="OnLocation(prodData,selectIndexForProd)">
          <div v-for="(item,index) in prodData.deviceInfos[selectIndexForProd]" :key="index" class="prodItemWrapper" >
            <!-- {{item}} -->
            <p class="title-p">{{item.title}}</p>
            <i class="iconfont " v-if="item.icon" :class="item.icon" style="color:#0b6a26"></i>
            <p class="content-p">{{item.value}}</p>
          </div>
        </div>
      </div>
      <!-- prodData.length -->
      <ban v-if="prodData.length === 0" title="无设备">
        ban
      </ban>

    </div>
    <div v-else class="vehicleDetails-wrapper" v-loading="loadingObj.monitorDetails" element-loading-text="车辆详情加载中···" element-loading-background="rgba(0, 0, 0, 0.8)">

    </div>

  </section>
</template>

<script>
import utils from '@/utils/tool'; // 引入工具
import {
  vehicleremarks
  // proddetail
} from '@/Api/mapApi.js';
import ban from '@/components/common/ban.vue';
export default {
  name: 'detail',
  components: { ban },
  computed: {
    loadingObj () {
      return this.$store.getters.loadingObj;
    },
    prodData () {
      let _this = this;

      let olddata = this.$store.getters.monitorData[this.$store.getters.indexOfMonitorDetails[0]];
      let prodData = {};
      let data = olddata.proddata || [];
      if (this.oldVeh.vehicleid && this.oldVeh.vehicleid !== olddata.basicdata.vehicleid) {
        this.clearMarker()
      }
      this.oldVeh.vehicleid = olddata.basicdata.vehicleid
      data.forEach((d, prodindex) => {
        d.imgSrc =
          d.prodspec === '无线'
            ? '/static/images/carDetails/shebeiwuxian.png'
            : '/static/images/carDetails/shebeiyouxian.png';
        // 有权限
        if (this.$PM.module.vehicleDetails.v.vehiclePhoto) {
          // 有图片
          if (olddata.custom.photoProd && olddata.custom.photoProd.length > 0) {
            if (olddata.custom.photoProd[prodindex]) {
              let pIndex = olddata.custom.photoProd[prodindex].IndexOf(9, d => +d.piccode)
              // pIndex = olddata.custom.photoVeh.IndexOf(5, d => +d.piccode)
              // pIndex = olddata.custom.photoVeh.IndexOf(5, d => +d.piccode)
              pIndex = pIndex === -1 ? 0 : pIndex
              d.imgSrc = olddata.custom.photoProd[prodindex][pIndex].piclink
            }
          }
        }
      });
      prodData.devices = data;
      olddata.custom.devices.forEach((d, i) => {
        prodData.devices[i].realdata = {...d}
        prodData.devices[i].show = prodData.devices[i].show === undefined ? false : prodData.devices[i].show
      })
      prodData.deviceInfos = olddata.custom.devices.map((item, index) => {
        let arr = [];
        let obj = { title: '设备号', value: item.prodnum };
        arr.push({ ...obj });
        obj = { title: '设备类型', value: data[index].prodspec };
        arr.push({ ...obj });
        obj = { title: '通讯时间', value: item.gpstime || '-' };
        arr.push({ ...obj });
        // obj = {title: '定位方式', value: item.gpstime}
        obj = { title: '地址', value: item.address || '-' };
        if (item.locationmodel) {
          let localObj = {
            GPS: 'icon-gps',
            LBS: 'icon-lbslocation'
          };
          obj.icon = localObj[item.locationmodel];
        }
        arr.push({ ...obj });
        obj = { title: '可信度', value: '100%' };
        arr.push({ ...obj });
        obj = { title: '经纬度', value: item.gpstime };
        if (item.lng) {
          obj.value =
          (item.lng + '').slice(0, 9) + ',' + (item.lat + '').slice(0, 9);
        } else {
          obj.value = '-'
        }
        // obj.value =
        // (item.lng + '').slice(0, 9) + ',' + (item.lat + '').slice(0, 9);
        arr.push({ ...obj });

        obj = { title: 'sim卡号', value: data[index].simcard };
        arr.push({ ...obj });
        obj = {
          title: '安装时间',
          value: data.installtime ? data.installtime : '暂无'
        };
        arr.push({ ...obj });
        obj = { title: '首次登陆时间', value: item.sbbysbid ? item.sbbysbid.Firstonlinedate : '-' };
        arr.push({...obj});
        obj = { title: '首次登陆地点', value: item.sbbysbid ? item.sbbysbid.Firstonlineaddress : '-' };
        arr.push({...obj});
        obj = {title: '电量', value: item.power || '-'}
        if (data[index].prodspec !== '有线') {
          arr.push({...obj});
        }
        // obj = {title: '电量', value: item.power}
        // arr.push({...obj});
        return arr;
      })
      prodData.length = data.length
      return prodData;
    },
    basicData () {
      let _this = this;
      let olddata = this.$store.getters.monitorData[this.$store.getters.indexOfMonitorDetails[0]];
      let data1 = [];
      let data = [];
      // if(olddata)
      // 图片信息
      let obj = {
        type: 'imgInfo',
        class: 'vehicle-cell-end'
        // imgSrc: '/static/images/carDetails/carsImg.png',
        // ownername: olddata.basicdata.ownername,
        // carno: olddata.basicdata.carno
      };
      if (this.isLevel(1)) {
        obj.imgSrc = '/static/images/carDetails/carsImg.png';
        // 有权限
        if (this.$PM.module.vehicleDetails.v.vehiclePhoto) {
          // 有图片
          if (olddata.custom.photoVeh && olddata.custom.photoVeh.length > 0) {
            let pIndex = olddata.custom.photoVeh.IndexOf(5, d => +d.piccode)
            // pIndex = olddata.custom.photoVeh.IndexOf(5, d => +d.piccode)
            // pIndex = olddata.custom.photoVeh.IndexOf(5, d => +d.piccode)
            pIndex = pIndex === -1 ? 0 : pIndex
            obj.imgSrc = olddata.custom.photoVeh[pIndex].piclink
          }
        }
      }
      if (this.isLevel(2)) {
        obj.ownername = olddata.basicdata.ownername;
      }
      if (this.isLevel(1)) {
        obj.carno = olddata.basicdata.carno;
      }

      if (this.isLevel(2)) {
        if (olddata.basicdata.ownersex) {
          let o = {
            男: 'iconSex iconfont icon-nan',
            女: 'iconSex iconfont icon-nv'
          };
          obj.sex = o[olddata.basicdata.ownersex];
        }
      }
      if (this.isLevel(3)) {
        if (olddata.basicdata.hastheftinsurance) {
          // obj.hastheftinsurance = olddata.basicdata.hastheftinsurance ?  ''
          obj.hastheftinsurance = 'icon-baozhang-copy ';
        }
      }
      data.push({ ...obj });
      data1.push([...data]);
      data = [];

      function getState (data) {
        let { realdata } = { ...data };
        if (realdata) {
          if (realdata.istate === 1) {
            return (
              '离线' +
              utils.formatDate.countTime(
                utils.formatDate.formatTime(new Date().getTime()),
                realdata.gpstime
              )
            );
          } else {
            if (realdata.veo === 0) {
              let fxo1 = {
                正北方向: 'iconfont icon-jiantou-n',
                正东方向: 'iconfont icon-jiantou-e',
                正南方向: 'iconfont icon-jiantou-s',
                正西方向: 'iconfont icon-jiantou-w',
                西南方向: 'iconfont icon-jiantou-sw',
                西北方向: 'iconfont icon-jiantou-nw',
                东南方向: 'iconfont icon-jiantou-se',
                东北方向: 'iconfont icon-jiantou-ne'
              };
              let fx1 = utils.formateFX(realdata.direct);
              obj.fx = fxo1[fx1];

              return (
                '停车' +
                utils.formatDate.countTime(
                  utils.formatDate.formatTime(new Date().getTime()),
                  realdata.gpstime
                )
              );
            }
            let fxo = {
              正北方向: 'iconfont icon-jiantou-n',
              正东方向: 'iconfont icon-jiantou-e',
              正南方向: 'iconfont icon-jiantou-s',
              正西方向: 'iconfont icon-jiantou-w',
              西南方向: 'iconfont icon-jiantou-sw',
              西北方向: 'iconfont icon-jiantou-nw',
              东南方向: 'iconfont icon-jiantou-se',
              东北方向: 'iconfont icon-jiantou-ne'
            };
            let fx = utils.formateFX(realdata.direct);
            obj.fx = fxo[fx];
            return (
              '行驶' +
              utils.formatDate.countTime(
                utils.formatDate.formatTime(new Date().getTime()),
                realdata.gpstime
              )
            );
          }
        } else {
          return '离线';
        }
      }

      if (this.isLevel(1)) {
        obj = {
          type: 'textInfo',
          title: '车辆状态'
        };
        obj.content = getState(olddata);
        data.push({ ...obj });
      }

      if (this.isLevel(1)) {
        obj = {
          type: 'colorInfo',
          title: '车辆颜色',
          content: olddata.basicdata.color
        };
        data.push({ ...obj });
      }
      obj = {
        type: 'textInfo',
        title: '车驾号',
        content: olddata.basicdata.vin || '暂无数据'
      };
      this.isLevel(1) && data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '车辆类型',
        content: olddata.basicdata.vehicletype || '暂无数据'
      };
      this.isLevel(1) && data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '车辆型号',
        content: olddata.basicdata.model || '暂无数据',
        class: 'vehicle-cell-end'
      };
      this.isLevel(1) && data.push({ ...obj });
      data1.push([...data]);
      data = [];
      obj = {
        type: 'textInfo',
        title: '身份证号',
        content: olddata.basicdata.idcard || '暂无数据'
      };

      this.isLevel(2) && data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '手机号',
        content: olddata.basicdata.ownermobile || '暂无数据'
      };

      this.isLevel(2) && data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '公司分组',
        content: olddata.basicdata.corpname || '暂无数据',
        class: 'vehicle-cell-end'
      };
      this.isLevel(1) && data.push({ ...obj });
      data1.push([...data]);
      data = [];
      obj = {
        type: 'textInfo',
        title: '驾驶员姓名',
        content: olddata.basicdata.corpname || '暂无数据'
      };
      // data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '接入平台时间',
        content:
          olddata.basicdata.appointDataStr ||
          (olddata.realdata
            ? utils.formatDate.formatTime(olddata.basicdata.appointdate)
            : '暂无数据')
      };
      this.isLevel(3) && data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '通讯时间',
        content: olddata.realdata ? olddata.realdata.gpstime : '暂无数据'
      };
      this.isLevel(1) && data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '可信度',
        content: '100%' // olddata.realdata ? olddata.realdata.lng : "暂无数据"
      };
      this.isLevel(1) && data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '经纬度',
        content: olddata.realdata
          ? (olddata.realdata.lng + '').slice(0, 9) +
            ',' +
            (olddata.realdata.lat + '').slice(0, 9)
          : '暂无数据'
      };
      this.isLevel(1) && data.push({ ...obj });
      obj = {
        type: 'textInfo',
        title: '地址',
        content:
          olddata.address ||
          (olddata.realdata ? olddata.realdata.address : '暂无数据'),
        class: 'vehicle-cell-end'
      };

      this.isLevel(1) && data.push({ ...obj });
      data1.push([...data]);
      data = [];
      // data1.push([...data]);
      // _this.getDistance('today');
      obj = {
        type: 'textInfo',
        title: '日里程',
        content: olddata.custom.todaymile // olddata.realdata ? olddata.realdata.address : "暂无数据"
      };
      // obj.shuaxin = {
      //   text: '刷新',
      //   onClick: function () {
      //     // _this.updateDistance();
      //   }
      // };
      this.isLevel(3) && data.push({ ...obj });
      // _this.getDistance('total');
      obj = {
        type: 'textInfo',
        title: '总里程',
        content: olddata.custom.totalmile,
        class: 'vehicle-cell-end'
      };

      this.isLevel(3) && data.push({ ...obj });
      data = [];
      // data.push({ ...obj });
      obj = {
        type: 'listInfo',
        title: '备注',
        list: olddata.custom.remark
      };
      this.isLevel(4) && data.push({ ...obj });
      obj = {
        type: 'listInfo',
        title: '关注类型',
        list: olddata.custom.follow
      };

      this.isLevel(4) && data.push({ ...obj });
      data1.push([...data]);
      data = [];

      obj = {
        type: 'listInfo',
        title: '电子围栏',
        list: olddata.custom.dzwl
      };
      this.isLevel(4) && data.push({ ...obj });

      obj = {
        type: 'textInfo',
        title: '原地设防(米)',
        content: olddata.custom.ydsf ? olddata.custom.ydsf.Radius : ''
      };
      this.isLevel(4) && data.push({ ...obj });
      data1.push([...data]);
      data = [];
      // data.push({ ...obj });
      // data.push({ ...obj });
      // data.push({ ...obj });
      // data.push({ ...obj });
      return data1;
    },
    moniLoading () {
      let bool = this.$store.state.loadingMoni;
      if (bool) {
        this.clearMarker();
      }
      return bool;
    },
    selectIndexForProd () {
      return this.$store.getters.indexOfMonitorDetails[1]
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
      dictMarker: [],
      distanceObj: { total: 0, today: 0 },
      oldVeh: {
        vehicleid: undefined,
        prodNum: undefined
      }

    };
  },
  created () {
    this.clearMarker();
  },
  destroyed () {
    let cuIndex = this.$store.getters.indexOfMonitorDetails[0]; // .IndexOf(vehicleid, d => d.vehicleid)
    this.$store.dispatch('changeMonitorData', {
      data: false,
      index: cuIndex,
      changeFun: function (oldData, data, index) {
        oldData[index] && (oldData[index].custom.isDetails = data);
        return oldData;
      }
    });
    this.clearMarker();
    this.prodData.devices.forEach(d => {
      d.realdata.show = false
    })
    this.$store.dispatch('setIndexOfMonitorDetails', [0, 0])
  },
  methods: {
    isLevel (num, _class) {
      _class = _class ? 'levelProd' : 'levelVehicle';
      let pm = this.$PM.module.vehicleDetails.v[_class];
      return pm[num - 1];
    },
    onProdSelect (index) {
      let old = this.$store.getters.indexOfMonitorDetails
      old[1] = index
      this.$store.dispatch('setIndexOfMonitorDetails', [...old])
    },
    getImgForProd (type) {
      return type === '无线'
        ? '/static/images/carDetails/shebeiwuxian.png'
        : '/static/images/carDetails/shebeiyouxian.png';
    },
    clearMarker () {
      for (const id in this.dictMarker) {
        if (this.dictMarker.hasOwnProperty(id)) {
          const marker = this.dictMarker[id];
          marker && marker.setMap(null);
          let index = marker.getExtData().index;
          // this.$store.commit('change')
          // this.$store.commit('changeDeviceInfos', { index, bool: 0 });
          delete this.dictMarker[id];
        }
      }
    },
    createDeviceMarker (row, index) {
      let map = this.$store.getters.mapObj;
      let [lng, lat] = utils.transformWGStoGCJ(row.realdata.lng, row.realdata.lat);
      let iconStr =
        row.prodspec === '无线'
          ? 'icon-iconset0250'
          : 'icon-hekriconshebeichatou2';
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
        {
          map,
          position: [lng, lat],
          showPositionPoint: false,
          extData: { ...row, index }
        }
      );
      marker.show = 1;
      this.dictMarker[index] = marker;
    },
    // 报警信息显示
    showOfMap (row, index) {
      let map = this.$store.getters.mapObj;
      if (!this.dictMarker[index]) {
        this.createDeviceMarker(row, index);
      } else {
        let marker = this.dictMarker[index];
        let [lng, lat] = utils.transformWGStoGCJ(row.realdata.lng, row.realdata.lat)
        marker.setPosition([lng, lat])
        marker.show = 1;
        marker.setMap(map);
      }
      let arrMarker = this.dictMarker.filter(d => {
        return d.show === 1;
      });
      map.setFitView(arrMarker);
      if (arrMarker.length > 1) {
        let zoom = map.getZoom();
        map.setZoom(zoom - 3);
      }
    },
    hiddleOfMap (row, index) {
      let marker = this.dictMarker[index];
      marker.show = 0;
      marker && marker.setMap(null);
    },
    OnLocation (info, index) {
      if (!info.devices[index].show) {
        // this.$store.commit('changeDeviceInfos', { index, bool: 1 });
        this.showOfMap(info.devices[index], index);
      } else {
        // this.$store.commit('changeDeviceInfos', { index, bool: 0 });
        this.hiddleOfMap(info.devices[index], index);
      }
      info.devices[index].show = !info.devices[index].show
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
<style>
.vehicle-cell-end {
  margin-bottom: 10px !important;
}
</style>
