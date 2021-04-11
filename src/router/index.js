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
		component: () => import('../views/auth.vue')
	},
	{
		path: '/teachers',
		name: 'Teachers',
		component: () => import('../views/teachers.vue')
	},
	{
		path: '/lessons',
		name: 'Lessons',
		component: () => import('../views/lessons.vue')
	},
	{
		path: '/*',
		redirect: {
			name: 'Schedule'
		}
	}
]

const router = new VueRouter({
	mode: 'history',
	routes
})

export default router
