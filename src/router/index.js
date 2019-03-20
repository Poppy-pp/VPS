/*
* @description: 路由配置
* @author: wp
* @update: 2018-04-12
-------------------------------- */
import Vue from 'vue'
import Router from 'vue-router'
import Index from '_P_/Login/index'
import MapHome from '_P_/Map/MapHome'
import mapTool from '_P_/mapTool/'
import Frequent from '_P_/Frequent/frequent'
import BI from '_P_/BI/index'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'VPS登录',
      component: Index
    },
    {
      path: '/mph',
      name: 'VPS地图监控',
      component: MapHome
    },
    {
      path: '/mapTool',
      name: '工具栏',
      component: mapTool
    },
    {
      path: '/Frequent',
      name: '常去地点',
      component: Frequent
    },
    {
      path: '/BI',
      name: 'BI',
      component: BI
    }
  ]
})
