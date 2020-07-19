import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'

import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';

import firebase from 'firebase/app'
import 'firebase/database'

Vue.use(Antd);

firebase.initializeApp({
	apiKey: "AIzaSyBha4mcbQX96CwqAvl2j-1ja3E-N8ExKmk",
	authDomain: "sw-721.firebaseapp.com",
	databaseURL: "https://sw-721.firebaseio.com",
	projectId: "sw-721",
	storageBucket: "sw-721.appspot.com",
	messagingSenderId: "30613357636",
	appId: "1:30613357636:web:4b2b178ab9168ad5766811"
});


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
