<template>
	<a-layout id="components-layout" style="min-height: 100vh" :style="{'padding-left': !disableAside ? '80px' : '0'}" ref="root">
		<a-layout-sider v-if="!disableAside" v-model="collapsed" collapsible :style="{'position': 'fixed', 'height': '100%', 'left': 0, 'z-index': 2}">
		<div class="logo">

			<a-popover v-model="visiblePopup" :title="$t('Week choise')" placement="bottomLeft" trigger="focus">
				<div slot="content" @click="weekChoise" style="display: flex; justify-content: space-around; align-items: center">
					<p
						v-for="week in weeks"
						:key="week"
						class="weekChoice"
						:class="{ current:getWeekNum==week, chosen:getWeek==week }"
						@click="makeWeek(week)"
					>
						{{week}}
					</p>
				</div>
				<div @click="weekChoise" :class="{ maxwidth:collapsed, fullsize: !collapsed }">
					<template v-if="collapsed">
						{{getWeek}}
					</template>
					
					<p
						v-else
						v-for="week in weeks"
						:key="week"
						class="weekChoice uncollapsed"
						:class="{ current:getWeekNum==week, chosen:getWeek==week }"
						@click="makeWeek(week, inner)"
					>
						{{week}}
					</p>

				</div>
			</a-popover>
			
		</div>
		<a-menu theme="dark" v-model="current" :default-selected-keys="['Schedule']" mode="inline">
			<a-menu-item key="Schedule">
				<router-link :to="{name: 'Schedule'}">
					<a-icon type="calendar" />
					<span>{{$t('Schedule')}}</span>
				</router-link>
			</a-menu-item>
			<a-menu-item key="Database">
				<router-link :to="{name: 'Database'}">
					<a-icon type="book" />
					<span>{{$t('Database') | capitalize}}</span>
				</router-link>
			</a-menu-item>
			<a-menu-item key="Auth">
				<router-link :to="{name: 'Auth'}">
					<a-icon v-if="isUserLoading" type="loading" />
					<a-icon v-else type="user" />
					<span>{{$t('profile') | capitalize}}</span>
				</router-link>
			</a-menu-item>
			<a-menu-item v-if="!user.isUserLoading && user.userinfo.group != '-1'" key="Links">
				<router-link :to="{name: 'Links'}">
					<a-icon type="link" />
					<span>{{$t('link') | capitalize}}</span>
				</router-link>
			</a-menu-item>
		</a-menu>
		</a-layout-sider>
		<a-layout>
		<a-layout-content style="margin: 0 16px">
			<a-breadcrumb style="margin: 16px 0">
			<a-breadcrumb-item v-for="(breadcrumb, index) in breadcrumbs" :key="index">
				<router-link :to="{name: breadcrumb.name}">
					{{$t(breadcrumb.name) | capitalize}}
				</router-link>
			</a-breadcrumb-item>
			<a-breadcrumb-item>{{$t(currentBreadcrumb) | capitalize}}</a-breadcrumb-item>
			</a-breadcrumb>
			<div class="mainView">
				<router-view />
			</div>
		</a-layout-content>
		<a-layout-footer style="text-align: center">
			{{$t('Schedule') | capitalize}} ©2023 Created by <a href="tg://resolve?domain=dowellkin">Korolev Alexandr</a>
		</a-layout-footer>
		</a-layout>
	</a-layout>
</template>

<script>
import { mapGetters } from 'vuex';
import config from '@/config.js'

export default {
	name: 'app',
	data(){
		return {
			collapsed: true,
			visible: false,
			current: ["Schedule"],
			weeks: [1,2,3,4],
			history: [],
			disableAside: false
		}
	},
	methods: {
		weekChoise(){
			this.visible = !this.visible;
		},
		makeWeek(week, inner = false){
			this.$store.commit('saveWeek', week);
			if(inner){
				this.visible = false;
			}
		},

		breakcrubsText(str){
			if(str.match(/^[a-z]{2}\d{3}$/m)){
				return config.enToRu(str);
			} else {
				return this.$t(str);
			}
		},
		
		skipWaiting(){
			console.log(this.isNeedReloadToBeUpdated);
			let worker = this.isNeedReloadToBeUpdated.worker;
			if(!worker){
				this.$message.error('can\'t get worker. Keep 1 tab of app and reload few times...');
				return;
			}
			console.log('worker', worker);
			if(worker != undefined){
				console.log('send');
				worker.active.postMessage({ type: 'SKIP_WAITING'});
			} else {
				console.log('idk how, but not:', worker);
			}
			this.hideNotification();
			// location.reload();
			console.log('there is must be reload but i commeted it 111');
		},
		
		hideNotification(){
			this.$store.commit('app/setUpdate', {worker: this.isNeedReloadToBeUpdated.worker, status: false})
		},

		openNotification() {
			const key = `open${Date.now()}`;
			this.$notification.open({
				message: 'new content is avaliable',
				description:
					'',
				btn: h => {
					return h(
						'a-button',
						{
							props: {
								type: 'primary',
								size: 'small',
							},
							on: {
								click: () => {
									this.skipWaiting();
									this.$notification.close(key)
								},
							},
						},
						'Reload',
					);
				},
				key,
				onClose: close,
			});
		},
		setCurrent(route){
			this.current[0] = route.name;
		}
	},
	created(){
		this.$router.onReady(() => {
			this.setCurrent(this.$router.currentRoute)
    });
		this.$store.dispatch('loadAll');
		this.$store.dispatch('updateTime')
		this.$router.beforeEach((to, from, next) => {
			this.setCurrent(to)
			// this.current[0] = to.meta?.breadcrumbName || to.name;
			next();
		})
	},
	computed: {
		...mapGetters(['getWeekNum', 'getWeek', 'user', 'isUserLoading']),
		...mapGetters('app', ['isNeedReloadToBeUpdated']),
		visiblePopup(){
			return this.collapsed && this.visible;
		},
		currentBreadcrumb(){
			
			let route = this.$route ?? {}
			if(route.name == 'groupSchedule'){
				return route.params.group.toUpperCase()
			} else {
				return route.meta?.breadcrumbName || route.name;
			}
		},
		breadcrumbs(){
			return this.$route.meta.breadcrumbs ?? []
		}
	},
	watch: {
		isNeedReloadToBeUpdated(needToReload){
			if(needToReload.status){
				// this.openNotification();
				this.skipWaiting();
			}
		}
	}
}
</script>

<style lang="scss">
@import "./main.scss";

#components-layout .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: #fff;
	font-size: 1.4rem;
	cursor: pointer;
}

.maxwidth{
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.fullsize{
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: space-around;

}

.weekChoice{
	position: relative;
	margin: 0;
	padding: 0;
	font-size: 1.2rem;
	width: 30px;
	height: 30px;
	text-align: center;
	line-height: 30px;
	cursor: pointer;
	border-radius: 50%;
	user-select: none;
	transition: background-color .4s ease;
}
.weekChoice.current{
	background-color:#188fff38;
}
.weekChoice.current:before{
	content: '';
	width: 100%;
	height: 1px;
	position: absolute;
	background: rgba(0, 0, 0, 0.1);
	bottom: 0;
	left: 0;
	right: 0;
}
.weekChoice.uncollapsed.current:before{
	background: rgba(255, 255, 255, 0.1);
}
.weekChoice.chosen{
	font-size: 1.25rem;
	background: rgba(0,0,0,.15);
	color: #000;
}
.weekChoice.uncollapsed.chosen{
	color: #fff;
}

.mainView{
	padding: 24px;
	background: #fff;
	min-height: 360px
}

@media screen and (max-width: 862px) {
	.mainView{
		padding: 24px 5px;
	}
}
</style>
