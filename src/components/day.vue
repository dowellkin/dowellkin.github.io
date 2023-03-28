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
				<div class="day__time-item time__row" v-for="(time, index) in getLinesTime" :key="time + index">{{time}}</div>
			</div>
			<div class="day__main">
				<div class="day__lines-column">
					<div
						v-if="isNeedToShowMark(index)"
						class="day__lines-item day__lines-item--current day__time-current"
						:style="{'transform': 'translateY('+getBias+'px)'}"
						></div>
					<div class="day__lines-item time__row" v-for="(time, index) in getLinesTime" :key="time + index"></div>
				</div>
				<div class="day__task-wrapper">
					<div class="day__tasks">
						<transition-group name="swing">
							<dayTask
								v-for="(task, index) in day"
								:key="task.lessonNumber + '' + index"
								:task="task"
								:dayStart="dayStart"
								:dayEnd="dayEnd"
								:columnHeight="columnHeight"
							></dayTask>
						</transition-group>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
import options from '@/config.js'
import dayTask from './parts/day-task.vue'

export default {
	name: 'day',
	props: ['day', 'index'],
	components: {
		dayTask
	},
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
		...mapGetters(["getTime", "getDay", "getEncodedTime", "getHours", "getDays", "showMySub", "isConfigMode", "getLessons", "user"])
	},
	methods: {
		getFullType(name){
			return options.types[name]
		},
		getClassesFromTask(task){
			const classes = [];
			if(this.isSubgroup(task)){
				classes.push('task--subgroup');
				if(task.group == 1){
					classes.push('task--subgroup-first');
				} else if(task.group == 2){
					classes.push('task--subgroup-second');
				}
			}
			return classes
		},
		isNeedToShowMark(index){
			const rules = [
				index == this.getDay,
				this.getHours >= this.dayStart,
				this.getHours < this.dayEnd
			]
			const result = rules.every(el=> el)
			return result;
		},
		remap(value, low1, high1, low2, high2){
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
		},
		calculateBias(encodedTime){
			const ret = this.remap(encodedTime, this.dayStart*60, this.dayEnd*60, 0, (this.dayEnd-this.dayStart)*this.columnHeight)
			return ret
		}
	},
	mounted(){
		if(this.index == this.getDay && document.body.clientWidth <= 770){
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
	border-top: 1px solid #e1e1e1;
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
</style>