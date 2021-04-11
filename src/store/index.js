import Vue from 'vue'
import Vuex from 'vuex'
import schedule from './schedule'
import time from './time'
import user from './user'
import edit from './edit'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
		user,
		schedule,
		time,
		edit
  }
})
