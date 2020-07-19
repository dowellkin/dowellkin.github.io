<template>
	<div class="schedule">
		<day v-for="(day, index) in fullScheldue" :key="index" :day='day' :index='index' />
	</div>
</template>

<script>
import day from './day.vue'
import {mapGetters} from "vuex"

export default {
	name: "schedule",
	components: {
		day
	},
	computed: mapGetters(['fullScheldue'])
}
</script>

<style>
	.schedule {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
	}
</style>