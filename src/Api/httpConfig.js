/*
 * @description: axios公用配置
 * @author: wp
 * @update: wp (2018-04-12)
 */
import axios from 'axios';

// axios 配置
axios.defaults.timeout = 3000000;
/* axios请求拦截器 */
axios.interceptors.request.use((config) => {
  /* 在发送请求之前做某事 */

  // console.log('请求成功'+config)
  return config;
}, (error) => {
  /* 请求错误时做些事 */


  return Promise.reject(error);
});
/* axios响应拦截器 如果token丢失提示用户重新登陆 */
axios.interceptors.response.use((response) => {
  // console.log('响应成功'+response)
  return response;
}, (error) => {
  return Promise.reject(error);
});

export default {
  InitToken (token) {
    axios.defaults.headers.common['token'] = 'd2assa1';
  }
}
