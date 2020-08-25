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
		display: grid;
		flex-wrap: wrap;
		justify-content: space-around;
		justify-items: center;
		grid-gap: 20px;
		grid-template-columns: repeat(3, 1fr);
	}

	@media screen and (max-width: 1100px){
		.schedule{
			grid-template-columns: repeat(2, 1fr);
		}
	}
	@media screen and (max-width: 768px){
		.schedule{
			grid-template-columns: 1fr;
		}
	}
</style>