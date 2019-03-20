/*
* @description: 入口文件配置
* @author: wp
* @update: 2018-04-12
-------------------------------- */
import Vue from 'vue'
import App from './App'
import router from './router'

import echarts from 'echarts'
import {PM} from '@/plugin/permissionManage'
import myPlugin from '@/plugin/common' // mqtt,veh 插件

import 'static/css/reset.css' // 引入reset 初始化基础样式
import 'static/css/common.css' // 引入公用样式

import 'static/css/contextmenu.css' // 右键菜单样式

import 'static/iconfont/iconfont.css' // 引入字体图标iconfont
import 'static/iconfont/iconfont.js'

// import 'assets/theme/default/index.css'  //引入Element自定义主题
import ElementUI from 'element-ui'

import store from './vuex/index' // 初始化状态树为全局对象

import 'iview/dist/styles/iview.css';// iview样式——按需引入
import 'static/script/debug'

Vue.prototype.$echarts = echarts;
Vue.config.productionTip = false;
store.state.echaerObj = echarts;
// test

Array.prototype.IndexOf = function (value, call) {
  return this.map(call).indexOf(value);
};
Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
}
Vue.prototype.$PM = PM
// var a = [{a:1},{a:2}]
// a.IndexOf(2,d=>{d.a})

// 添加全局注册事件，用来监听滚动事件*start*/
Vue.directive('loadmore', {
  bind (el, binding) {
    const selectWrap = el.querySelector('.el-table__body-wrapper')
    selectWrap.addEventListener('scroll', function () {
      let sign = 10; // 如果高度小于10就加载更多
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight
      if (scrollDistance <= sign) {
        binding.value()
      }
    })
  }
})
// 添加全局注册事件，用来监听滚动事件*end*/

Vue.use(myPlugin, {
  store
});
Vue.use(ElementUI, {
  size: 'medium'
});

// 实现导航守卫（路由跳转前验证登录等）
router.beforeEach((to, from, next) => {
  document.title = to.name;
  let userinfo = localStorage.getItem('uid');
  if (to.path != '/' && !userinfo) {
    next({ path: '/' });
  } else {
    next();
  }
});

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
});

