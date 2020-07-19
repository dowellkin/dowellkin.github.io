import Vue from 'vue'
import Vuex from 'vuex'
import schedule from './schedule'
import time from './time'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
		schedule,
		time
  }
})
