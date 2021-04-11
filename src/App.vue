<template>
  <a-layout id="components-layout" style="min-height: 100vh" :style="{'padding-left': '80px'}" ref="root">
    <a-layout-sider v-model="collapsed" collapsible :style="{'position': 'fixed', 'height': '100%', 'left': 0, 'z-index': 2}">
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
					<router-link to="/">
						<a-icon type="calendar" />
						<span>{{$t('Schedule')}}</span>
					</router-link>
        </a-menu-item>
        <a-menu-item key="Teachers">
					<router-link to="/teachers">
						<a-icon type="team" />
						<span>{{$t('Teachers')}}</span>
					</router-link>
        </a-menu-item>
        <a-menu-item key="Lessons">
					<router-link to="/lessons">
						<a-icon type="book" />
						<span>{{$t('Lessons')}}</span>
					</router-link>
        </a-menu-item>
        <a-menu-item key="Auth">
					<router-link to="/auth">
						<a-icon type="user" />
						<span>{{$t('Auth')}}</span>
					</router-link>
        </a-menu-item>
        <a-menu-item v-if="user.isDrive" key="Google drive">
					<a :href="user.drive">
						<a-icon type="cloud-download" />
						<span>{{$t('Google drive')}}</span>
					</a>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{$t(current[0]) | capitalize}}</a-breadcrumb-item>
        </a-breadcrumb>
        <div class="mainView">
					<router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        {{$t('Schedule') | capitalize}} ©2020 Created by <a href="tg://resolve?domain=dowellkin">Korolev Alexandr</a>
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'app',
	data(){
		return {
			collapsed: true,
			visible: false,
			current: ["Schedule"],
			weeks: [1,2,3,4],
			history: []
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
		}
	},
	created(){
		this.$router.onReady(() => {
			this.current[0] = this.$router.currentRoute.name;
    });
		this.$store.dispatch("loadAll");
		this.$store.dispatch("updateTime")
		this.$router.beforeEach((to, from, next) => {
			this.current[0] = to.name;
			next();
		})
	},
	computed: {
		...mapGetters(['getWeekNum', 'getWeek', 'user']),
		visiblePopup(){
			return this.collapsed && this.visible;
		}
	},
}
</script>

<style>

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
