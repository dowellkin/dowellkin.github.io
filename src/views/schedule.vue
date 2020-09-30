<template>
	<div class="schedule-wrapper">
		<transition name="loadingAnim">
			<loading v-if="isLoading"></loading>
			<div v-else class="schedule">
				<day v-for="(day, index) in fullScheldue" :key="index" :day='day' :index='index' />
			</div>
		</transition>
	</div>
</template>

<script>
import day from './day.vue'
import loading from '../components/loading'
import {mapGetters} from "vuex"

export default {
	name: "SchedulePage",
	components: {
		day,
		loading
	},
	computed: mapGetters(['fullScheldue', 'isLoading'])
}
</script>

<style>
	.schedule-wrapper{
		height: 100%;
	}
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
	
	
	/* anims */
	.loadingAnim-enter-active, .loadingAnim-leave-active {
		transition: opacity .5s;
	}
	.loadingAnim-enter, .loadingAnim-leave-to /* .fade-leave-active до версии 2.1.8 */ {
		opacity: 0;
	}
	</style>