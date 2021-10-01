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
						<div
							v-for="(task, index) in day"
							:key="task.lessonNumber + '' + index" class="day__task task"
							:class="getClassesFromTask(task)"
							:style="{
								'top': `${getTopBias(task)}px`,
								'height': `${getTaskHight(task)}px`,
								'background-color': getBackgroundColor(task),
								'border': `1px solid ${getBorderColor(task)}`
							}">

							<a-popover :title="'Академический час ' + `(${task.startTime}-${task.endTime})`">

								<template slot="content">
									<div class="popup__container">
										<div class="popup__row">
											{{isHaveLessonId(task) ? getLessons[task.lessonId].title : task.name}}
											{{task.type ? ` (${task.type.toUpperCase()})` : ""}}
										</div>

										<div class="popup__row popup__teacher">
											{{$t('type') | capitalize}}: {{getFullType(task.type) || $t('no info')}}
										</div>

										<div class="popup__row popup__teacher">
											{{$t('teacher') | capitalize}}: <b>{{getTeacherName(task) || $t('no info')}}</b>
										</div>

										<div class="popup__row popup__room">
											{{$t('room') | capitalize}}: <b>{{task.room || $t('no info')}}</b>
										</div>

										<a-row v-if="isConfigMode" type="flex" :gutter="[15, 0]">
											<a-col>
												<div class="link link__open-lesson" @click="handleButttonEdit(task)">
													{{$t("edit") | capitalize}}
												</div>
											</a-col>
										</a-row>
										<a-row type="flex" :gutter="[15, 0]">
											<a-col>
												<div class="link link__open-lesson" @click="handleButtonDetails(task)">
													{{$t("details") | capitalize}}
												</div>
											</a-col>
										</a-row>
									</div>
								</template>

								<div class="task__content">
									<div class="pair__info">
										<span v-if="!isSubgroup(task)" class="task__time">({{task.startTime}}-{{task.endTime}})</span>
										{{lessonTitle(task)}}
										<!-- <span class="group" v-if="task.group && !showMySub">
											{{task.group == 3 ? "1, 2" : task.group}}г.
										</span> -->
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
import options from '@/config.js'

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
		...mapGetters(["getTime", "getDay", "getEncodedTime", "getHours", "getDays", "showMySub", "isConfigMode", "getLessons", "user"])
	},
	methods: {
		getTeacherName(task){
			return task.teacher?.name || task.teacher || undefined
		},
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
		isSubgroup(task){
			if(this.user.userinfo){
				return (task.group == 1 || task.group == 2) && this.user.userinfo.showMySub != true;
			} else {
				return task.group == 1 || task.group == 2
			}
		},
		isHaveLessonId(task){
			return task.lessonId && task.lessonId != -1
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
		getTeacher(id){
			return this.$store.getters['getTeacher'](id)
		},
		remap(value, low1, high1, low2, high2){
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
		},
		calculateBias(encodedTime){
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
		lessonTitle(task){
			let title = task.name?.title ?? task.name;
			let lessonFromFirebase = this.getLessons[task.lessonId];
			if(lessonFromFirebase && lessonFromFirebase.shorttitle != undefined){
				return lessonFromFirebase.shorttitle;
			}
			if(title.length > 22){
				return title.split(/ |-/).map(el => el.length > 2 ? el[0].toUpperCase() : el[0]).join("");
			} else if(title.length >= 20){
				return title.split(" ").map(el => {
					if(el.length > 2){
						return el[0].toUpperCase() + el[1] + el[2];
					} else {
						return el
					}
				}).join("");
			}
			if(lessonFromFirebase && lessonFromFirebase.title){
				return lessonFromFirebase.title
			}
			return title
		},
		handleButttonEdit(task){
			this.$store.commit('edit/showForEdit');
			this.loadParams(task);
		},
		handleButtonDetails(task){
			this.$store.commit('edit/showForLook');
			this.loadParams(task);
		},
		loadParams(task){
			//отвратительный костыль
			console.log(`teasss`, task);
			if(!task.raw.half) task.raw.half = "0"
			if(!task.raw.group) task.raw.group = "0"
			this.$store.commit('edit/setParams', {...task.raw, day: this.index});
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

.task--subgroup{
	width: calc(50% - 2px);
	transform: none;
}

.task--subgroup:hover{
	transform: scale(1.02);
}

.task--subgroup-first{
	left: 0;
}

.task--subgroup-second{
	left: auto;
	right: 0;
}

.task__time{
	font-size: .6rem;
	font-weight: bold;
}

.task__time--big{
	font-size: .8rem;
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

.pair__info{
	text-overflow: ellipsis;
	overflow: hidden;
}

.popup__row{
	margin-bottom: 5px;
}

.popup__container{
	max-width: 350px;
}
</style>