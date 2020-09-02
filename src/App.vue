<template>
  <a-layout id="components-layout" style="min-height: 100vh" :style="{'padding-left': '80px'}">
    <a-layout-sider v-model="collapsed" collapsible :style="{'position': 'fixed', 'height': '100%', 'left': 0, 'z-index': 2}">
      <div class="logo">
				{{getWeekNum}}
			</div>
      <a-menu theme="dark" :default-selected-keys="['Schedule']" mode="inline">
        <a-menu-item key="Schedule" @click="makeCurrent('Schedule')">
					<router-link to="/">
						<a-icon type="calendar" />
						<span>{{$t('Schedule')}}</span>
					</router-link>
        </a-menu-item>
        <a-menu-item key="Test" @click="makeCurrent('Test')">
					<router-link to="test">
						<a-icon type="question" />
						<span>TEST</span>
					</router-link>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{$t(current)}}</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
					<router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        {{$t('Schedule')}} ©2020 Created by <a href="tg://resolve?domain=dowellkin">Korolev Alexandr</a>
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
			current: "Schedule"
		}
	},
	methods: {
		makeCurrent(page){
			this.$router.push({name: page});
			this.current = page;
		}
	},
	created(){
		console.log(this.$router.currentRoute.name);
		console.log(this.$router.currentRoute);
		this.current = this.$router.currentRoute.name;
		this.$store.dispatch("loadAll");
		this.$store.dispatch("updateTime")
	},
	computed: {
		...mapGetters(['getWeekNum'])
	}
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
}
</style>
