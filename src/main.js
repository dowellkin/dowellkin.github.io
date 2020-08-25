import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import firebase from 'firebase/app'
import 'firebase/database'
import i18n from './i18n'

Vue.use(Antd);

firebase.initializeApp({
	apiKey: "AIzaSyAjCGyDv1sCKpl4UoCvy9jVrA5NG3j0Yp8",
	authDomain: "dowellkin-schedule.firebaseapp.com",
	databaseURL: "https://dowellkin-schedule.firebaseio.com",
	projectId: "dowellkin-schedule",
	storageBucket: "dowellkin-schedule.appspot.com",
	messagingSenderId: "164186141581",
	appId: "1:164186141581:web:e9a87433e89080ee5e43c4",
	measurementId: "G-7BQXZ95QYH"
});


Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')
