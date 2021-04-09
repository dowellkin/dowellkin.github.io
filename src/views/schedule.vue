<template>
	<div class="schedule-wrapper">
		<div class="admin__buttons" v-if="user.permissions = 'admin'" style="margin-bottom: 20px">
			<a-button-group>
				<a-button icon="plus" type="primary" @click="() => modal.lessonsConfigure = true">
					{{$t('Добавить занятие')}}
				</a-button>
			</a-button-group>
			<a-modal
				title="Lesson config"
				:visible="modal.lessonsConfigure"
				@ok="(params) => handleModalOk('lessonsConfigure', ...params)"
				@cancel="(params) => handleModalOk('lessonsConfigure', ...params)"
				:footer="null"
			>
				<lesson-configure :day="lessonConfig.day" :options="lessonConfig.task" :edit="lessonConfig.edit" @done="(params) => handleModalOk('lessonsConfigure', ...params)"/>
			</a-modal>
		</div>
		<transition name="loadingAnim">
			<loading v-if="isLoading"></loading>
			<div v-else class="schedule">
				<day v-for="(day, index) in fullScheldue" :key="index" :day='day' :index='index' @configlesson="handleDayConfigLesson"/>
			</div>
		</transition>
	</div>
</template>

<script>
import day from './day.vue'
import loading from '../components/loading'
import lessonConfigure from '../components/lessonconfigure.vue'
import {mapGetters} from "vuex"

export default {
	name: "SchedulePage",
	components: {
		day,
		loading,
		lessonConfigure
	},
	data(){
		return {
			modal: {
				lessonsConfigure: false
			},
			lessonConfig: {
				day: 0,
				edit: false,
				task: {
					lessonId: 0,
					teacherId: 0,
					lessonNumber: 1,
					type: '',
					room: '',
					weeks: [false, false, false, false]
				}
			}
		}
	},
	methods: {
		handleModalOk(name, ...param){
			this.closeModal(name);
			param
		},
		closeModal(name){
			this.modal[name] = false;
		},
		handleDayConfigLesson(params){
			this.lessonConfig.day = params.dayindex;
			this.lessonConfig.task = params.task.raw;
			this.modal.lessonsConfigure = true
		}
	},
	computed: mapGetters(['fullScheldue', 'isLoading', 'user'])
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