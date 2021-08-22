<template>
	<div class="schedule-wrapper">
		<div class="admin__buttons" v-if="user.permissions == 'admin'" style="margin-bottom: 20px">
			<a-button-group v-if="isConfigMode">
				<a-button icon="plus" type="primary" @click="() => $store.commit('edit/showEdit')">
					{{$t('Добавить занятие')}}
				</a-button>
			</a-button-group>
			<a-modal
				:title="$t('Lesson config')"
				:visible="isShowfield"
				@ok="() => $store.commit('edit/closeEdit')"
				@cancel="() => $store.commit('edit/closeEdit')"
				:footer="null"
			>
				<lesson-configure @done="() => $store.commit('edit/closeEdit')"/>
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
import day from '../components/day.vue'
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
	created() {
		const update = (newRoute = null) => {
			const route = newRoute ?? this.$route;
			if(route.meta.specialGroup){
				const groupname = route.params.group;
				this.$store.dispatch('loadSchedule', groupname);
			} else {
				const userGroup = this.user.userinfo?.group;
				if(userGroup){
					this.$store.dispatch('loadSchedule', userGroup);
				} else {
					this.$store.dispatch('loadSchedule');
				}
			}
		} 

		update();
		this.$router.beforeEach((to, from, next) => {
			console.log(to)
			update(to);
			next();
		})
	},
	computed: {
		...mapGetters(['fullScheldue', 'isLoading', 'user', 'isConfigMode', 'groups']),
		...mapGetters('edit', ['isShowfield'])
	}
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