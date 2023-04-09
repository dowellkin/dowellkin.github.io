<template>
    <div
        class="day__task task"
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
                        {{ isHaveLessonId(task) ? getLessons[task.lessonId].title : task.name }}
                        {{ task.type ? ` (${task.type.toUpperCase()})` : "" }}
                    </div>

                    <div class="popup__row popup__teacher">
                        {{ $t('type') | capitalize }}: {{ getFullType(task.type) || $t('no info') }}
                    </div>

                    <div class="popup__row popup__teacher">
                        {{ $t('teacher') | capitalize }}: <b>{{ getTeacherName(task) || $t('no info') }}</b>
                    </div>

                    <div class="popup__row popup__room">
                        {{ $t('room') | capitalize }}: <b>{{ task.room || $t('no info') }}</b>
                    </div>

                    <a-row v-if="isConfigMode" type="flex" :gutter="[15, 0]">
                        <a-col>
                            <div class="link link__open-lesson" @click="handleButttonEdit(task)">
                                {{ $t("edit") | capitalize }}
                            </div>
                        </a-col>
                    </a-row>
                    <a-row type="flex" :gutter="[15, 0]">
                        <a-col>
                            <div class="link link__open-lesson" @click="handleButtonDetails(task)">
                                {{ $t("details") | capitalize }}
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </template>

            <div class="task__content">
                <div class="pair__info">
                    <span v-if="!isSubgroup(task)" class="task__time">({{ task.startTime }}-{{ task.endTime }})</span>
                    {{ lessonTitle(task) }}
                    <!-- <span class="group" v-if="task.group && !showMySub">
                    {{task.group == 3 ? "1, 2" : task.group}}г.
                </span> -->
                </div>
                <div class="pair__cabinet">
                    {{ task.room }}
                </div>
            </div>

        </a-popover>

    </div>
</template>

<script>
import { mapGetters } from 'vuex'
import options from '@/config.js'

export default {
    name: "day-task",
    props: {
        task: {
            type: Object
        },
        dayStart: {
            type: Number
        },
        dayEnd: {
            type: Number
        },
        columnHeight: {
            type: Number
        },
        dayIndex: {
            type: Number
        }
    },
    data: () => ({
    }),
    computed: {
        ...mapGetters(["getTime", "getDay", "getEncodedTime", "getHours", "getDays", "showMySub", "isConfigMode", "getLessons", "user"])
    },
    methods: {
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
        getTeacherName(task) {
            return task.teacher?.name || task.teacher || undefined
        },
        getFullType(name) {
            return options.types[name]
        },
		isSubgroup(task){
			if(this.user.userinfo){
				return (task.group == 1 || task.group == 2) && this.user.userinfo.showMySub != true;
			} else {
				return task.group == 1 || task.group == 2
			}
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
		getBackgroundColor(task){
			const color = this.parseHexColor(task.color);
			return `rgba(${color[0]},${color[1]},${color[2]},.8)`;
		},
		getBorderColor(task){
			const color = this.parseHexColor(task.color);
			return `rgb(${color[0]},${color[1]},${color[2]})`;
		},
		isHaveLessonId(task){
			return task.lessonId && task.lessonId != -1
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
			if(!task.raw.half) task.raw.half = "0"
			if(!task.raw.group) task.raw.group = "0"
			this.$store.commit('edit/setParams', { ...task.raw, day: this.dayIndex });
		},
		calculateBias(encodedTime) {
            const ret = this.remap(encodedTime, this.dayStart * 60, this.dayEnd * 60, 0, (this.dayEnd - this.dayStart) * this.columnHeight)
            return ret
        },
        remap(value, low1, high1, low2, high2) {
            return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
        },
        parseHexColor(hexColorString) {
            const noStripes = hexColorString.replace("#", "");
            const r = parseInt(noStripes[0] + noStripes[1], 16);
            const g = parseInt(noStripes[2] + noStripes[3], 16);
            const b = parseInt(noStripes[4] + noStripes[5], 16);
            return [r, g, b];
        },
        lessonTitle(task) {
            let title = task.name?.title ?? task.name;
            let lessonFromFirebase = this.getLessons[task.lessonId];
            if (lessonFromFirebase && lessonFromFirebase.shorttitle != undefined) {
                return lessonFromFirebase.shorttitle;
            }
            if (title.length > 22) {
                return title.split(/ |-/).map(el => el.length > 2 ? el[0].toUpperCase() : el[0]).join("");
            } else if (title.length >= 20) {
                return title.split(" ").map(el => {
                    if (el.length > 2) {
                        return el[0].toUpperCase() + el[1] + el[2];
                    } else {
                        return el
                    }
                }).join("");
            }
            if (lessonFromFirebase && lessonFromFirebase.title) {
                return lessonFromFirebase.title
            }
            return title
        },

    }
}
</script>

<style>
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