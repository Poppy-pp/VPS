<!--*
* @description: 左侧车辆操作 切换框
* @author: wp,wqh
* @update: 2018-05-5
-->
<template>
  <section id="toolBox" :style="autoIndex">
     <div class="treeDiv transitionHeight02" id="treeOpenS" :style="autoheight">

     <!-- <div class="treeDiv transitionHeight02" id="treeOpenS" :style="autoStyle"> -->
       <div class="left-top"></div>
       <div class="right-top"></div>
       <div class="let-bottom"></div>
       <div class="right-bottom"></div>
      <div class="navs" id="navs">
        <span class="navTit">车辆</span>
        <!-- <i class="iconfont icon-juxingkaobei cur" @click="boxClick" title="详情列表"></i>
        <i class="iconfont icon-dianziweilan" @click="boxClick" title="电子围栏"></i>
        <i class="iconfont icon-guanzhu" @click="boxClick" title="关注列表"></i>
        <i class="iconfont icon-shaixuan" @click="boxClick" title="筛选"></i> -->
        <div style="float:right;">
        <i v-for=" (obj,index) in arrButton" :key="index"  class="iconfont" :class="index === actionButton ? 'cur '+obj.icon : obj.icon" @click="boxClick(index)" :title="obj.text">
        </i>
        </div>
      </div>
      <!-- 缓存指定组件 -->
      <keep-alive include="tree,Efence,followCar">
        <slot :name="type"></slot>
      </keep-alive>
    </div>
  </section>
</template>

<script>
import { searchefence, getFollowData } from '@/Api/mapApi.js';
let _arrButton = [
  {type: 'ls1', text: '详情列表', icon: 'icon-juxingkaobei'},
  {type: 'ls2', text: '电子围栏', icon: 'icon-dianziweilan'},
  {type: 'ls3', text: '关注列表', icon: 'icon-guanzhu'},
  {type: 'ls4', text: '筛选', icon: 'icon-shaixuan'}
]
export default {
  name: 'box',
  props: {
    treeStateProps: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      // _arrButton: ,
      actionButton: 0,
      type: 'ls1'
    };
  },
  computed: {
    arrButton () {
      let _this = this
      let arr = _arrButton ? _arrButton.filter((d, i) => {
        switch (i) {
          case 1:
            return _this.$PM.module.dzwl.v.enable
          case 2:
            return _this.$PM.module.follow.v.enable
          case 3:
            return _this.$PM.module.vehTree.v.filter

          default:
            return 1
            // break;
        }
      }) : []
      return arr
    },
    autoheight () {
      return this.treeStateProps === 1 ? 'height:calc(100vh - 135px);' : 'height:0px;';
    },
    autoIndex () {
      return this.treeStateProps === 1 ? 'z-index:1;' : 'z-index:-1;'
    },
    autoStyle () {
      return this.treeStateProps === 1 ? 'height:calc(100vh - 135px); z-index:1;' : 'height:0px; z-index:-1;'
    }
  },
  methods: {
    // 点击按钮切换板块 显示指定类型 内容
    boxClick (i) {
      if (this.type === 'ls2') {
        this.$DZWL.clearCheck()
      }
      this.actionButton = i
      this.type = this.arrButton[i].type
      var _this = this;
      _this.$store.commit('SET_DZWLLISTLOADING', true);
      // var

      switch (this.type) {
        case 'ls2':
          searchefence({
            index: 0,
            pagesize: 40,
            condition: '',
            userid: this.$store.getters.user.userid
          }).then(res => {
            // this.encloLoading = false;
            if (res.data.result.code === 0) {
              var data = res.data.data.map(function (item) {
                item.checked = false;
                return item;
              });
              _this.$store.commit('SET_DZWLLISTLOADING', false);
              _this.$store.commit('SET_DZWLLIST', data);
            }
          });

          break;

        case 'ls3':
          // 首次点击获取followData。减小服务器压力
          if (_this.$store.getters.FollowList.length === 0) {
            this.$request.follow.init()
          }
          break;
        default:
          break;
      }
    }
  }
};
</script>
