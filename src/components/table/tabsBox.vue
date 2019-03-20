<!--*
* @description: tabs 选项卡
* @author: wp
* @update: 2018-05-3
-->
<template>
  <section id="carInfo">
    <div id="carListOpen"
      :class="boxClass" style="z-index:2;">
      <div class="headInfo">
        <div class="labelInfo"
          :class="'t'+index == tabsType ? labelInfoActive : (item.classStr || '') "
          @click="tabInfo(item,index,$event)"
          v-for="(item,index) in headInfoArr"
          :key="item.headLabel">
          <div v-if="index == 1 && policeDataLength && policeDataLength.num != 0"
            class="policeBadgeSty"
            v-text="policeDataLength"></div>
          <div v-if="index == 2 && abnormalDataLength && abnormalDataLength != 0"
            class="abnomalBadgeSty"
            v-text="abnormalDataLength"></div>
          <div class="left-top"></div>
          <div class="right-top"></div>
          <div class="let-bottom"></div>
          <div class="right-bottom"></div>
          {{item.name}}
        </div>

        <div class="rightTab"
          v-if="witchCar">
          <span @click="changeCar('up')">上一辆</span>
          <span @click="changeCar('down')">下一辆</span>
        </div>
      </div>

      <div class="content">
        <div class="left-top"></div>
        <div class="right-top"></div>
        <div class="let-bottom"></div>
        <div class="right-bottom"></div>
        <slot :name="tabsType"></slot>
      </div>

      <div class="carInfoOpen "
        @click="openAndHide">
        <i class="xiangxiaIcon iconfont icon-web_xiangxiazhankai"></i>
      </div>
    </div>
  </section>
</template>

<script>
import { policeType } from '@/Api/mapApi.js'
export default {
  name: 'tabsBox',
  props: {
    treeStateProps: {
      type: Number,
      default: 0
    }
  },

  computed: {

    tabsType () {
      return 't' + this.$store.getters.tabsState.index
    },
    boxClass () {
      let dc = 'carInfo transitionAll';
      if (this.carsInfosHeight) {
        dc += ' ' + this.carsInfosHeight;
      }
      if (this.treeStateProps == 0) {
        dc += ' tuptree';
      }
      return dc;
    },
    // 报警次数
    policeDataLength () {
      if (this.$store.getters.policeData.length && this.$store.getters.policeData.length > 99) {
        return 99 + '+';
      } else {
        return this.$store.getters.policeData.length;
      }
    },
    // 异常次数
    abnormalDataLength () {
      if (this.$store.getters.abnormalData.length && this.$store.getters.abnormalData.length > 99) {
        return 99 + '+';
      } else {
        return this.$store.getters.abnormalData.length;
      }
    }
  },
  data () {
    return {
      // 头部tab
      headInfoArr: [{
        headLabel: 0,
        name: '监控列表'
      },
      {
        headLabel: 1,
        name: '车辆报警',
        classStr: 'redLabelInfo'
      },
      {
        headLabel: 2,
        name: '车辆异常'
      }
      ],
      labelInfoActive: 'labelInfoActive',
      // 所有列表和详情
      // 点击上一辆 和 下一辆车切换，需要获取index和headtab信息
      indexAndSetion: {
        currentIndex: 0,
        Setion: 1 // 1 监控详情 2 报警详情 3 异常详情
      },
      carsInfosHeight: 'tup',
      witchCar: false // 上一辆 下一辆显示隐藏
    }
  },
  methods: {
    // 切换表格显示类型
    tabInfo (item, index, event) {
      let $ev = $(event.target);
      if (!$ev.hasClass('labelInfo')) return;
      $ev
        .addClass('labelInfoActive')
        .siblings()
        .removeClass('labelInfoActive');
      /* 关闭表格详情，显示列表 */
      let obj = {};
      // this.tabsType = 't' + index;
      obj.states = false;
      obj.index = index;
      this.$store.commit('listOrDeails', obj);
      /* end */
    },
    // 切换汽车
    changeCar (t) {

    },
    openAndHide () {
      this.carsInfosHeight = (this.carsInfosHeight == '' ? 'tup' : '');
    }
  }
}
</script>

<style>
.vps-custom-default #carInfo .labelInfo.redLabelInfo {
  background: #b11717;
}
.vps-custom-normal #carInfo .labelInfo.redLabelInfo {
  background: #b11717;
  color: aliceblue;
}
/* .vps-custom-default #carInfo .labelInfo.redLabelInfo {
  background: #b11717;
} */
</style>
