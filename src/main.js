// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import store from './store/index'
import './assets/css/global.css'
import SocketService from './utils/socket_service'
//进行连接
SocketService.Instance.connect();
axios.defaults.baseURL = 'http://localhost:9000/api'
Vue.prototype.$http = axios;
Vue.prototype.$echarts = window.echarts;
Vue.prototype.$socket = SocketService.Instance

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
