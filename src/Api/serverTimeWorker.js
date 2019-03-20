/*
 * @description: 获取服务器时间 worker
 * @author: wp
 * @update: wp (2018-04-04)
 */
 import axios from 'axios';
 export default {
  //每隔2分钟获取一次服务器时间
  getServerTime(store){
    axios.get('/api/serverinfo/servertime')
    .then(function(data){
      if (data != null && data != "") {
        postMessage(data.data);
        setTimeout("getServerTime()",120000);
      }
    });
  }
}
