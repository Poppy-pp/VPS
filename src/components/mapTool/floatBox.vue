<!--*
* @description: 浮动窗口放大缩小 历史轨迹任务栏
* @author: wp
* @update: 2018-05-21
-->
<template>
  <el-popover
    placement="top"
    width="auto"
    popper-class="curpp"
    trigger="hover">
    <ul class="lsgj_slt">
      <li v-for="(item,index) in hisWindowData" v-bind:key="index" :title="item.name" :hid="item.vehicleid" @click.stop="openHisWin">
        <img width="70" src="/static/images/carDetails/chartDetails.png" v-if="item.windowType ==='chart'">
        <img width="70" src="/static/images/carDetails/lsgjslt.jpg" v-else>
        <span class="wsclose iconfont icon-guanbib" :dataid="item.vehicleid" @click.stop="closeHisWin(item)"></span>
      </li>
    </ul>
    <div slot="reference" class="tra_but">
      <el-badge :value="bnum">
        <!-- <el-button type="primary" icon="iconfont icon-woderenwu01" circle></el-button> -->
        <i class="el-icon-menu taskbar"></i>
      </el-badge>
    </div>
  </el-popover>
</template>

<script>
  export default {
    name: 'floatBox',
    computed: {
      // 初始化地图类型
      bnum () {
        return this.$store.getters.hisZoom.info.length;
      },
      // 历史窗体列表
      hisWindowData () {
        return this.$store.getters.hisZoom.info;
      }
    },
    data () {
      return {
        id: ''
      }
    },
    methods: {
      // 缩小窗口关闭 对应历史窗口
      closeHisWin (e) {
        this.id = 'his' + e.vehicleid;
        $(e.target).parent().remove();
        this.$store.commit('removeHisWind', this);
      },
      // 打开缩小窗体
      openHisWin (e) {
        var hid = '';
        let _this = this;
        if ($(e.target).is('img')) {
          hid = $(e.target).parent().attr('hid');
        } else {
          hid = $(e.target).attr('hid');
        }
        this.$store.commit('isHisWind', {vehicleid: hid,
          callback: (res) => {
            if (!res.isHidden) {
              var shu = $('#his' + hid).attr('isshu');
              this.$store.commit('hiddenHisWind', {vehicleid: hid, ishidden: true});
              if (shu == 1) {
                $('#his' + hid).stop(true).animate({
                  opacity: 1,
                  width: '100%',
                  height: '100%',
                  left: 0,
                  top: 0
                }, 100);
              } else {
                $('#his' + hid).stop(true).animate({
                  opacity: 1,
                  width: '70vw',
                  height: '80vh',
                  left: '50%',
                  top: '50%',
                  marginLeft: '-35vw',
                  marginTop: '-40vh'
                }, 100);

                setTimeout(function () {
                  _this.$store.commit('zoomUpdate', shu);
                }, 100)
              }
            }
          }})
      }
    }
  }
</script>
<style scoped>
  div.tra_but{
    position: absolute;
    right: 15px;
    bottom: 2px;
  }
  ul.lsgj_slt li{
    position: relative;
    width: 55px;
    height: 50px;
    border-radius: 1px;
    overflow: hidden;
    display: inline-block;
    float: left;
    margin-right: 10px;
    border: 1px solid #7ecef4;
  }

  ul.lsgj_slt li:last-child{
    margin-right:0;
  }
  ul.lsgj_slt li span.wsclose{
    position: absolute;
    right: 0;
    top: -2px;
    cursor: pointer;
  }
  ul.lsgj_slt li span.wsclose:hover{
    color: red;
  }
  i.taskbar{
    font-size: 3.5rem;
    color: #067816;
  }
  div.tra_but:hover i.taskbar{
    animation: rotate-infinite160 3s infinite;
  }
</style>
