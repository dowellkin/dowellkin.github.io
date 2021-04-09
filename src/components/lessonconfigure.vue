<template>
	<div class="lesson-config">
		<a-row :gutter="[15, 0]" class="leccon-config__line">
			<a-col span=6>
				{{$t('предмет') | capitalize}}: 
			</a-col>
			<a-col span=18>
				<a-select v-model="options.lessonId" style="width: 100%">
					<a-select-option v-for="(lesson, index) in getLessons" :key="lesson" :value="index">
						{{lesson}}
					</a-select-option>
				</a-select>
			</a-col>
		</a-row>

		<a-row :gutter="[10, 0]" class="leccon-config__line">
			<a-col span=6>
				{{$t('преподаватель') | capitalize}}: 
			</a-col>
			<a-col span=18>
				<a-select v-model="options.teacherId" style="width: 100%">
					<a-select-option v-for="teacher in sortedTeachers" :key="teacher.id" :value="teacher.id">
						{{teacher.name}}
					</a-select-option>
				</a-select>
			</a-col>
		</a-row>

		<a-row :gutter="[10, 0]" class="leccon-config__line">
			<a-col span=6>
				{{$t('день недели') | capitalize}}: 
			</a-col>
			<a-col span=18>
				<a-select v-model="day" style="width: 100%">
					<a-select-option v-for="t_day in Object.entries(getDays)" :key="t_day[0]" :value="t_day[0]">
						{{$t(t_day[1])}}
					</a-select-option>
				</a-select>
			</a-col>
		</a-row>

		<a-row :gutter="[15, 0]" class="leccon-config__line">

			<a-col span=8>
				<a-row>
					<a-col span=10>
						{{$t('Номер') | capitalize}}:
					</a-col>
					<a-col span=14>
						<a-select v-model="options.lessonNumber" style="width: 100%">
							<a-select-option v-for="numb in numbers" :key="numb" :value="numb-1">{{numb}}</a-select-option>
						</a-select>
					</a-col>
				</a-row>	
			</a-col>

			<a-col span=8>
				<a-row>
					<a-col span=10>
						{{$t('тип') | capitalize}}:
					</a-col>
					<a-col span=14>
						<a-select v-model="options.type" style="width: 100%">
							<a-select-option v-for="type in types" :key="type" :value="type">{{type}}</a-select-option>
						</a-select>
					</a-col>
				</a-row>				
			</a-col>

			<a-col span=8>
				<a-row>
					<a-col span=10>
						{{$t('кабинет') | capitalize}}:
					</a-col>
					<a-col span=14>
						<a-input v-model="options.room"></a-input>
					</a-col>
				</a-row>	
			</a-col>

		</a-row>

		<a-row :gutter="[10, 0]" class="leccon-config__line">
			<a-col span=6>
				{{$t('недели') | capitalize}}: 
			</a-col>
			<a-col span=18>
				<a-row>
					<a-col v-for="(week, index) in weeks" :key="week" :span="24 / weeks.length">
						<a-checkbox v-model="checkBoxProxy[index]">{{week}}</a-checkbox>
					</a-col>
				</a-row>
			</a-col>
		</a-row>

		<div class="footer">
			<a-row type="flex" justify="end">
				<a-col>
					<a-button type="primary" icon="save" @click="handleLessonSave">{{$t('Отправить') | capitalize}}</a-button>
				</a-col>
			</a-row>
		</div>
	</div>
</template>

<script>
import {mapGetters} from "vuex"
import firebase from 'firebase/app'

const numbers = []
const pairCount = 5;
for(let i = 1; i <= pairCount; i++){
	numbers.push(i);
}

const types = ['ПЗ', 'ЛК', 'none']

const weeks = [];
const weeksChecked = [];
const weeksCount = 4;
for(let i = 1; i <= weeksCount; i++){
	weeks.push(i);
	weeksChecked.push(false);
}
/* eslint-disable */
export default {
	name: "lesson-modal",
	props: {
		options: {
			default() {
				return {
					lessonId: 0,
					teacherId: 0,
					lessonNumber: 1,
					type: '',
					room: '',
					weeks: weeksChecked
				}
			}
		},
		day: {
			default: 0
		}
	},
	data(){
		return {
			numbers,
			types,
			weeks,
		}
	},
	methods: {
		handleLessonSave(){
			firebase.database().ref(`schedule/it042debug/${this.day}`).update({
				[this.options.rawIndex]: this.options
				}, (error) => {
					if(error) {
						this.$message.error(this.$t("Something went wrong."));
						console.error(error);
					} else {
						this.$emit("done");
						this.$message.success(this.$t("Lesson updated"));
					}
				});
			this.$emit("done");
		}
	},
	computed: {
		...mapGetters(['getTeachers', 'getLessons', 'getDays']),
		sortedTeachers(){
			let temp = JSON.parse(JSON.stringify(this.getTeachers));
			temp.sort( (a,b) => {
				if(a.name > b.name)
					return 1

				if(a.name < b.name)
					return -1

				return 0
			});
			return temp
		},
		checkBoxProxy(){
			let result = JSON.parse(JSON.stringify(this.weeks));
			result.forEach((week, index) => {
				result[index] = this.options.weeks.indexOf(index+1) != -1
			});
			return result;
		}
	}
}
</script>

<style>
.leccon-config__line:not(:last-child){
	margin-bottom: 20px;
}
</style>