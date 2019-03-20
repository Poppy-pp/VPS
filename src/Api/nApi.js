/*
 * @description: vps nodejs服务请求
 * @author: wp
 * @update: wp (2018-04-04)
 */
import axios from 'axios';
var HOST = 'http://localhost:3000';
var base = '/vpsweb';

// 获取当前公司
export const getcorprate = params => {
  return axios.get(`${HOST}${base}/getcorprate`, params);
};

// 获取所有车子
export const getvehicle = params => {
  return axios.get(`${HOST}${base}/getvehicle`, params);
};
