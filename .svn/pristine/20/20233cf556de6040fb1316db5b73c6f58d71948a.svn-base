<!--*
* @description: css3d loading
* @author: wp
* @update: 2018-05-5
-->
<template>
   <section class="c3DLoading" v-if="curLoading.hidden">
    <div class="progress">
      <div v-if="showPval" class="progress-bar progress-bar-info progress-bar-striped active" :style="'width:'+curLoading.pval+'%;'">
        <div class="progress-value">{{curLoading.pval + '%'}}</div>
      </div>
      <div v-else  class="progress-bar2 progress-bar-info progress-bar-striped" :style="'width:100%;'">
      </div>
      <div class="text" :id="!showPval && 'tops'" v-if="curLoading.isShowText">{{curLoading.text}}</div>
    </div>
  </section>
</template>


<script>
  export default {
    name: 'c3dloading',
    computed: {
      curLoading () {
        return this.$store.getters.curLoading;
      },
      showPval () {
        let curLoading = this.$store.getters.curLoading
        let pval = curLoading.pval
        return !!pval
      }
    },
    data () {
      return {
      }
    },
    methods: {
    }
  }
</script>

<style scoped>
.text#tops{
  top:100%;
  color:#000;
      top: 2px;
}
  section.c3DLoading{
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 111111111111111;
    background-color: #2626267d;
    left: 0;
    top: 0;

    display: flex;
    align-items:center;/*垂直居中*/
    justify-content: center;/*水平居中*/
    flex-direction: row;
    flex-wrap: wrap;
  }
  .progress-bar {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    -webkit-transition: width .6s ease;
    -o-transition: width .6s ease;
    transition: width .6s ease;
  }
   .progress-bar2 {
    float: left;
    width: 0;
    height: 100%;
    font-size: 12px;
    line-height: 20px;
    color: #fff;
    text-align: center;
    background-color: #337ab7;
    -webkit-box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    box-shadow: inset 0 -1px 0 rgba(0,0,0,.15);
    -webkit-transition: width .6s ease;
    -o-transition: width .6s ease;
    transition: width .6s ease;
border-radius: 20px;
  }
  .progress-bar-info {
    background-color: #5bc0de;
  }

  .progress-striped .progress-bar, .progress-bar-striped {
      background-image: -webkit-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
      background-image: -o-linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
      background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
      -webkit-background-size: 40px 40px;
      background-size: 40px 40px;
  }
  .progress{
    width: 50%;
    height: 25px;
    background: #262626;
    padding: 5px;
    overflow: visible;
    border-radius: 20px;
    border-top: 1px solid #000;
    border-bottom: 1px solid #7992a8;
    position: relative;
  }
  .progress div.text{
    position: absolute;
    top: 26px;
    color: #00BCD4;
    left: 50%;
    margin-left: -47px;
    letter-spacing:1px;
    font-size: 14px;
    font-style: italic;
  }
  .progress .progress-bar{
    border-radius: 20px;
    position: relative;
    animation: animate-positive 2s;
  }
  .progress .progress-value{
    display: block;
    padding: 3px 7px;
    font-size: 13px;
    color: #fff;
    border-radius: 4px;
    background: #191919;
    border: 1px solid #000;
    position: absolute;
    top: -40px;
    right: -10px;
  }
  .progress .progress-value:after{
    content: "";
    border-top: 10px solid #191919;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    position: absolute;
    bottom: -6px;
    left: 26%;
  }
  .progress.active .progress-bar, .progress-bar.active {
    -webkit-animation: progress-bar-stripes 2s linear infinite;
    -o-animation: progress-bar-stripes 2s linear infinite;
    animation: progress-bar-stripes 2s linear infinite;
  }

  .progress-bar.active {
    animation: reverse progress-bar-stripes 0.40s linear infinite, animate-positive 2s;
  }
  @-webkit-keyframes animate-positive{
    0% { width: 0; }
  }
  @keyframes animate-positive{
    0% { width: 0; }
  }
  @-webkit-keyframes progress-bar-stripes {
    from {
        background-position: 40px 0
    }
    to {
        background-position: 0 0
    }
  }

  @-o-keyframes progress-bar-stripes {
    from {
        background-position: 40px 0
    }
    to {
        background-position: 0 0
    }
  }

  @keyframes progress-bar-stripes {
    from {
        background-position: 40px 0
    }
    to {
        background-position: 0 0
    }
  }
/*  .base {
    height: 9em;
    left: 50%;
    margin: -7.5em;
    padding: 3em;
    -webkit-box-sizing: initial;
    box-sizing: initial;
    position: absolute;
    top: 50%;
    width: 9em;
    transform: rotateX(45deg) rotateZ(45deg);
    transform-style: preserve-3d;
  }

  .cube,
  .cube:after,
  .cube:before {
    content: '';
    float: left;
    height: 3em;
    position: absolute;
    width: 3em;
  }

  /* Top
  .cube {
    background-color: #05afd1;
    position: relative;
    transform: translateZ(3em);
    transform-style: preserve-3d;
    transition: .25s;
    box-shadow: 13em 13em 1.5em rgba(0, 0, 0, 0.1);
    animation: anim 1s infinite;
  }
  .cube:after {
    background-color: #049dbc;
    transform: rotateX(-90deg) translateY(3em);
    transform-origin: 100% 100%;
  }
  .cube:before {
    background-color: #048ca7;
    transform: rotateY(90deg) translateX(3em);
    transform-origin: 100% 0;
  }
  .cube:nth-child(1) {
    animation-delay: 0.05s;
  }
  .cube:nth-child(2) {
    animation-delay: 0.1s;
  }
  .cube:nth-child(3) {
    animation-delay: 0.15s;
  }
  .cube:nth-child(4) {
    animation-delay: 0.2s;
  }
  .cube:nth-child(5) {
    animation-delay: 0.25s;
  }
  .cube:nth-child(6) {
    animation-delay: 0.3s;
  }
  .cube:nth-child(7) {
    animation-delay: 0.35s;
  }
  .cube:nth-child(8) {
    animation-delay: 0.4s;
  }
  .cube:nth-child(9) {
    animation-delay: 0.45s;
  }

  @keyframes anim {
    50% {
      transform: translateZ(0.5em);
    }
  }*/
</style>
