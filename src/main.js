// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import iView from 'iview'
import App from './App'
import router from './router'
import 'iview/dist/styles/iview.css'
import axios from 'axios'
import qs from 'querystring'

global.CONST_apiUrl = 'http://sizhijian.com:3000';
// global.CONST_apiUrl = 'http://192.168.1.91:3000';

this.$http = axios.create({
//   // baseURL: 'http://xxxxxxxxxx',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  // ,
  // transformRequest: [function (data) {
  //   data = qs.stringify(data)
  //   return data
  // }]
})

Vue.config.productionTip = false;

// Vue.use(iView);

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
