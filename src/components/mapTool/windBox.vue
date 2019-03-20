<!--*
* @description: 浮动窗口放大缩小
* @author: wp
* @update: 2018-05-21
-->
<template>
  <div class="windbox" :id="id">
    <p class="nav">
      <label calss="title">{{ title }}</label>
      <span class="wclose iconfont icon-guanbib" title="关闭窗口"></span>
      <span :class="maxClass" title="缩放窗口"></span>
      <span class="min iconfont icon-zuixiaohua3" title="收到任务栏"></span>
    </p>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'windbox',
    props: ['id', 'title'],
    computed: {
      // 初始化地图类型
      maxClass () {
        var c = 'max iconfont';
        if (this.shu == 1) {
          c += ' icon-suoxiao';
        } else {
          c += ' icon-fangda1';
        }
        return c;
      }
    },
    data () {
      return {
        shu: 0 // 窗体缩放状态 0 全屏模式  1窗口模式
      }
    },
    methods: {
      // 初始化窗体
      initWindboxG () {
        // 定义各个DOM元素及按钮，obj是整个窗口，objcurs窗口的导航，guan是窗口关闭按钮，xiao是缩小到任务栏按钮，max是最大化窗口按钮
        var obj = $('#' + this.id);
        var objcur = obj.find('.nav');
        var guan = obj.find('.wclose');
        var xiao = obj.find('.min');
        var max = obj.find('.max');
        var _this = this;
        // 定义所有变量，tuo为鼠标是否在导航上按下
        var tuo = false;
        var X, Y;
        objcur.on('mousedown', function (e) {
          X = e.pageX - obj.offset().left;
          Y = e.pageY - obj.offset().top;
          tuo = true;
        })

        $(document).on('mousemove', function (e) {
          // 如果当前窗口为100%则不允许拖动
          if (obj.width() == $(window).width()) {
            tuo = false;
          }
          if (tuo) {
            obj.css({
              left: e.pageX - X,
              top: e.pageY - Y,
              margin: 0
            })
            if (e.pageX - X <= 0) {
              obj.css({
                left: 0
              })
            }
            if (e.pageX - X >= 576) {
              obj.css({
                left: '576px'
              })
            }
            if (e.pageY - Y <= 0) {
              obj.css({
                top: 0
              })
            }
            if (e.pageY - Y >= 194) {
              obj.css({
                top: '194px'
              })
            }
          }
        }).on('mouseup', function (e) {
          tuo = false;
        })
        // 双击导航框缩放窗口
        objcur.dblclick(function (e) {
          max.click();
        })
        // 单击缩放按钮缩放窗口
        max.on('click', function (e) {
          e.stopPropagation();
          // 窗口最大化
          var shu = _this.shu;
          if (shu == 0) {
            obj.stop(true).animate({
              width: '100%',
              height: '100%',
              left: 0,
              top: 0,
              margin: 0
            }, 150);
            shu = _this.shu = 1;
            setTimeout(function () {
              _this.$store.commit('zoomUpdate', shu);
            }, 150)
          } else {
            obj.stop(true).animate({
              width: '70vw',
              height: '80vh',
              left: '50%',
              top: '50%',
              marginLeft: '-35vw',
              marginTop: '-40vh'
            }, 150);
            shu = _this.shu = 0;
            setTimeout(function () {
              _this.$store.commit('zoomUpdate', shu);
            }, 150)
          }
        })
        // 关闭窗口，也就删除了DOM元素
        guan.on('click', (e) => {
          e.stopPropagation();
          obj.remove();
          _this.$store.commit('removeHisWind', _this);
          $('.info-top span').removeClass('cur');
        })

        /* 阻击窗口功能件冒泡 start */
        xiao.on('mousedown', function (e) {
          e.stopPropagation();
        })
        guan.on('mousedown', function (e) {
          e.stopPropagation();
        })
        max.on('mousedown', function (e) {
          e.stopPropagation();
        })
        /* 阻击窗口功能件冒泡 end */

        // 缩小到任务栏
        xiao.on('click', function (e) {
          e.stopPropagation();
          var s = $(window).height();
          var w = $(window).width();
          obj.stop(true).animate({
            left: w,
            top: s,
            width: 0,
            height: 0,
            margin: 0,
            opacity: 0
          }, 200, function () {
            _this.$store.commit('hiddenHisWind', {vehicleid: _this.id, ishidden: false});
            $(this).removeClass('hisbounce-enter-active');
          });
        })
      }
    },
    created () {
      this.$nextTick(function () {
        this.initWindboxG();
      })
    }
  }
</script>

<style scoped>
  .windbox{
    width:70vw;
    height:80vh;
    overflow:hidden;
    position:fixed;
    left:50%;
    top:50%;
    opacity:1;
    margin-left: -35vw;
    margin-top: -40vh;
    box-shadow: 0 1px 3px rgba(0,0,0,.3);
    border-radius: 2px;
    z-index: 100;
  }
  .windbox.move{
    margin: 0;
  }
  .windbox p{
    background-color:#067816;
    cursor:default;
    color:#fff;
    margin:0px;
    height:30px;
    line-height:30px;
  }
  .windbox p label{
    text-indent: 10px;
    display:inline-block;
  }
  .windbox p span{
    float:right;
    margin-right:5px;
    cursor: pointer;
    display: inline-block;
  }
</style>
