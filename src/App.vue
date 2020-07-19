<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh" :style="{'padding-left': '80px'}">
    <a-layout-sider v-model="collapsed" collapsible :style="{'position': 'fixed', 'height': '100%', 'left': 0, 'z-index': 1}">
      <div class="logo" />
      <a-menu theme="dark" :default-selected-keys="['1']" mode="inline">
        <a-menu-item key="1" @click="makeCurrent('Schedule')">
          <a-icon type="calendar" />
          <span>Расписание</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item>{{current}}</a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
					<router-view />
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Schedule ©2020 Created by Korolev Alexandr
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>

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
			this.current = page;
		}
	},
	created(){
		this.$store.dispatch("loadSchedule");
		this.$store.dispatch("updateTime")
	}
}
</script>

<style>

#components-layout-demo-side .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
</style>
