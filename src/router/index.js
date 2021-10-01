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
		path: '/g/:group',
		name: 'groupSchedule',
		component: schedule,
		meta: {
			specialGroup: true
		}
	},
	{
		path: '/g',
		redirect: {
			name: 'Schedule'
		}
	},
	{
		path: '/auth',
		name: 'Auth',
		component: () => import('../views/auth.vue')
	},
	{
		path: '/db',
		name: 'Database',
		component: () => import('../views/db.vue')
	},
	{
		path: '/db/teachers',
		name: 'Teachers',
		component: () => import('../views/teachers.vue'),
		meta: {
			breadcrumbs: [
				{
					name: 'Database'
				}
			]
		}
	},
	{
		path: '/db/lessons',
		name: 'Lessons',
		component: () => import('../views/lessons.vue'),
		meta: {
			breadcrumbs: [
				{
					name: 'Database'
				}
			]
		}
	},
	{
		path: '/links',
		name: 'Links',
		component: () => import('../views/links.vue')
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
  base: process.env.BASE_URL,
	routes
})

export default router
