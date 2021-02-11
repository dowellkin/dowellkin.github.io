<template>
	<div class="day" :class="{ current: getDay==index }">
		<div class="day__title">
			{{$t(getDays[index])}}
		</div>
		<div class="day__content">
			<div class="day__time-column">
				<div
					v-if="isNeedToShowMark(index)"
					class="day__time-item day__time-item--current day__time-current"
					:style="{'transform': 'translateY('+getBias+'px)'}"
					>{{getTime}}</div>
				<div class="day__time-item time__row" v-for="(time, index) in getLinesTime" :key="index">{{time}}</div>
			</div>
			<div class="day__main">
				<div class="day__lines-column">
					<div
						v-if="isNeedToShowMark(index)"
						class="day__lines-item day__lines-item--current day__time-current"
						:style="{'transform': 'translateY('+getBias+'px)'}"
						></div>
					<div class="day__lines-item time__row" v-for="(time, index) in getLinesTime" :key="index"></div>
				</div>
				<div class="day__task-wrapper">
					<div class="day__tasks">
						<transition-group name="swing">
						<div
							v-for="(task) in day"
							:key="task.lessonNumber" class="day__task task"
							:style="{
								'top': `${getTopBias(task)}px`,
								'height': `${getTaskHight(task)}px`,
								'background-color': getBackgroundColor(task),
								'border': `1px solid ${getBorderColor(task)}`
							}">
							<a-popover :title="'пол пары (45 мин.)'">
								<template slot="content">
									<div>
										{{task.name}} {{task.type != "none" ? ` (${task.type.toUpperCase()})` : ""}}
									</div>
									<div class="popup__teacher">
										{{task.teacher.name}}
									</div>
									<div class="popup__room">
										{{task.room}}
									</div>
									<!-- <div class="link link--open-lesson">
										{{$t("More")}}
									</div> -->
								</template>
								<div class="task__content">
									<div class="pair__info">
										<span class="task__time">({{task.startTime}}-{{task.endTime}})</span>
										{{lessonTitle(task.name)}}
										<span class="group" v-if="task.group && !showMySub">
											{{task.group == 3 ? "1, 2" : task.group}}г.
										</span>
									</div>
									<div class="pair__cabinet">
										{{task.room}}
									</div>
								</div>
							</a-popover>
						</div>
						</transition-group>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'day',
	props: ['day', 'index'],
	created(){
	},
	data(){
		return {
			dayStart: 8,
			dayEnd: 20,
			columnHeight: 30
		}
	},
	computed:{
		getLinesTime(){
			const ret = [];
			for(let i = this.dayStart; i <= this.dayEnd; i++){
				ret.push(`${i}:00`);
			}
			return ret;
		},
		getBias(){
			return this.calculateBias(this.getEncodedTime)
		},
		...mapGetters(["getTime", "getDay", "getEncodedTime", "getHours", "getDays", "showMySub"])
	},
	methods: {
		isNeedToShowMark(index){
			const rules = [
				index == this.getDay,
				this.getHours >= this.dayStart,
				this.getHours < this.dayEnd
			]
			const result = rules.every(el=> el)
			return result;
		},
		getTeacher(id){
			return this.$store.getters['getTeacher'](id)
		},
		remap(value, low1, high1, low2, high2){
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
		},
		calculateBias(encodedTime){
			// const column = document.querySelectorAll(".day__lines-item")[1];
			// const columnHeight = column.offsetHeight;
			const ret = this.remap(encodedTime, this.dayStart*60, this.dayEnd*60, 0, (this.dayEnd-this.dayStart)*this.columnHeight)
			return ret
		},
		getTopBias(task){
			const time = task.startTime.split(":");
			const encodedTime = parseInt(time[0], 10)*60 + parseInt(time[1], 10);
			
			return this.calculateBias(encodedTime);
		},
		getTaskHight(task){
			const time = task.endTime.split(":");
			const encodedTime = parseInt(time[0], 10)*60 + parseInt(time[1], 10);
			return Math.ceil(this.calculateBias(encodedTime) - this.getTopBias(task));
		},
		parseHexColor(hexColorString){
			const noStripes = hexColorString.replace("#", "");
			const r = parseInt(noStripes[0]+noStripes[1], 16);
			const g = parseInt(noStripes[2]+noStripes[3], 16);
			const b = parseInt(noStripes[4]+noStripes[5], 16);
			return [r,g,b];
		},
		getBackgroundColor(task){
			const color = this.parseHexColor(task.color);
			return `rgba(${color[0]},${color[1]},${color[2]},.8)`;
		},
		getBorderColor(task){
			const color = this.parseHexColor(task.color);
			return `rgb(${color[0]},${color[1]},${color[2]})`;
		},
		lessonTitle(title){
			if(title.length > 22){
				return title.split(" ").map(el => el.length > 2 ? el[0].toUpperCase() : el[0]).join("");
			} else if(title.length >= 20){
				return title.split(" ").map(el => {
					if(el.length > 2){
						return el[0].toUpperCase() + el[1] + el[2];
					} else {
						return el
					}
				}).join("");
			}
			return title
		}
	},
	mounted(){
		// console.log(this.day);
		if(this.index == this.getDay && document.body.clientWidth <= 770){
			// console.log(this.$el);
			this.$el.scrollIntoView({block: "center"});
		}
	}
}
</script>

<style>
	.day{
		width: 300px;
		margin-bottom: 10px;
		overflow: hidden;
		padding: 10px 10px;
		border-radius: 10px;
		box-shadow: 0px 0px 0px 1px rgba(0,0,0,.0);
		transition: box-shadow .1s ease;
	}
	.day.current{
		box-shadow: 0px 0px 0px 1px rgba(0,0,0,.05);
	}
	.day:hover{
		box-shadow: 0px 0px 0px 1px rgba(0,0,0,.2);
	}
	.day__title{
		margin-bottom: 5px;
		text-align: center;
		font-weight: bold;
		font-size: 1rem;
	}
	.current .day__title::before,
	.current .day__title::after{
		content: "~";
	}
	.day__content{
		padding-top: 10px;
		display: flex;
	}
	.day__time-column{
		position: relative;
		margin-right: 5px;
	}
	.day__time-item{
		text-align: right;
		font-size: .8rem;
		position: relative;
		top: -10px;
		user-select: none;
	}

	.day__main{
    flex-grow: 1;
    padding-left: 5px;
    position: relative;
	}
	.day__lines-item{
		border-top: 1px solid lightgray;
	}
	.day__lines-column{
		position: relative;
	}
	.time__row:not(:last-child){
		height: 30px;
	}
	.day__time-item--current{
		position: absolute;
		color: red;
		font-weight: bold;
		right: 0;
		background-color: rgba(255,255,255,.5);
		z-index: 1;
		font-size: .85rem;
	}
	.day__lines-item--current{
		width: 100%;
		height: 2px;
		background: red;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
		border-top: none;
	}

	.day__time-current{
		/* transform: translateY(); */
		transition: transform .1s linear;
	}

	.day__lines-item--current::before{
		content: '';
		width: 10px;
		height: 10px;
		background: red;
		position: absolute;
		left: 0;
		top: 0;
		transform: translateY(-50%);
		border-radius: 50%;
	}

	.day__task-wrapper{
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		padding: 0 0 18px 5px;
		white-space: nowrap;
		text-overflow: ellipsis;
		/* overflow: hidden;  */
	}

	.task{
		box-sizing: border-box;
		position: absolute;
		width: 98%;
		border-radius: 3px;
		padding: 0 5px;
		background-color: rgba(55,74,103, .8);
		border: 1px solid rgb(55,74,103);
		transition: transform .2s ease;
		right: 0;
		left: 50%;
		transform: translateX(-50%);
	}

	.task:hover{
		transform: translateX(-50%) scale(1.02);
	}

	.task__time{
		font-size: .6rem;
		font-weight: bold;
	}

	.day__tasks{
		width: 100%;
		height: 100%;
		position: relative;
	}

	.link {
		color: #1890ff;
		cursor: pointer;
	}
	.link:hover{
		text-decoration: underline;
	}
	/* shitty animations */
	.swing-enter-active, .swing-leave-active {
		transition: opacity .2s ease, top .2s ease, left .2s ease;
	}
	.swing-enter, .swing-leave-to {
		opacity: 0;
	}

	.task__time{
		position: relative;
	}

	.pair__cabinet{
		position: absolute;
		top: 0;
		right: 5px;
	}
</style>