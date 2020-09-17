import Vue from 'vue'
import VueRouter from 'vue-router'
import schedule from '../views/schedule.vue'

Vue.use(VueRouter)

	const routes = [
	{
		path: '/',
		name: 'Schedule',
		component: schedule
	},
	{
		path: '/auth',
		name: 'Auth',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import( /* webpackChunkName: "about" */ '../views/auth.vue')
	}
]

const router = new VueRouter({
	mode: 'history',
	routes
})

export default router
