<template>
	<div class="lesson-config">
		<a-row :gutter="[15, 0]" class="leccon-config__line">
			<a-col span=6>
				{{$t('lesson') | capitalize}}: 
			</a-col>
			<a-col span=18>
				<a-select :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :value="getField('lessonId')" @change="(value) => setField('lessonId', value)" style="width: 100%">
					<a-select-option v-for="(lesson, index) in getLessons" :key="lesson.title || lesson" :value="index">
						{{lesson.title || lesson}}
					</a-select-option>
				</a-select>
			</a-col>
		</a-row>

		<a-row :gutter="[10, 0]" class="leccon-config__line">
			<a-col span=6>
				{{$t('teacher') | capitalize}}: 
			</a-col>
			<a-col span=18>
				<a-select :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :value="getField('teacherId')" @change="(value) => setField('teacherId', value)" style="width: 100%">
					<a-select-option v-for="teacher in sortedTeachers" :key="teacher.id" :value="teacher.id">
						{{teacher.name}}
					</a-select-option>
				</a-select>
			</a-col>
		</a-row>

		<a-row :gutter="[10, 0]" class="leccon-config__line">
			<a-col span=6>
				{{$t('day of week') | capitalize}}: 
			</a-col>
			<a-col span=18>
				<a-select :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :value="getField('day').toString()" @change="(value) => setField('day', +value)" style="width: 100%">
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
						{{$t('number') | capitalize}}:
					</a-col>
					<a-col span=14>
						<a-select :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :value="getField('lessonNumber')" @change="(value) => setField('lessonNumber', value)" style="width: 100%">
							<a-select-option v-for="numb in numbers" :key="numb" :value="numb-1">{{numb}}</a-select-option>
						</a-select>
					</a-col>
				</a-row>	
			</a-col>

			<a-col span=8>
				<a-row>
					<a-col span=10>
						{{$t('type') | capitalize}}:
					</a-col>
					<a-col span=14>
						<a-select :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :value="getField('type')" @change="(value) => setField('type', value)" style="width: 100%">
							<a-select-option v-for="type in types" :key="type" :value="type">{{type}}</a-select-option>
						</a-select>
					</a-col>
				</a-row>				
			</a-col>

			<a-col span=8>
				<a-row>
					<a-col span=10>
						{{$t('room') | capitalize}}:
					</a-col>
					<a-col span=14>
						<a-input :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :value="getField('room')" @change="(e) => setField('room', e.target.value)"></a-input>
					</a-col>
				</a-row>	
			</a-col>

		</a-row>

		<a-row :gutter="[10, 0]" class="leccon-config__line">
			<a-col span=6>
				{{$t('weeks') | capitalize}}: 
			</a-col>
			<a-col span=18>
				<a-row>
					<a-col v-for="(week, index) in weeks" :key="week" :span="24 / weeks.length">
						<a-checkbox :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :checked="checkBoxProxy(getField('weeks'))[index]" @change="(value) => $store.dispatch('edit/weeksEdit', {value, week: index+1})">{{week}}</a-checkbox>
					</a-col>
				</a-row>
			</a-col>
		</a-row>
		
		<a-row :gutter="[10, 0]" class="leccon-config__line">
			<a-col :md="5" :xs="10">
				{{$t('half') | capitalize}}:
			</a-col>
			<a-col :md="8" :xs="14">
				<a-select :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :value="getField('half')" @change="(value) => setField('half', value)" style="width: 100%">
					<a-select-option value="0">{{$t('both')}}</a-select-option>
					<a-select-option value="1">1</a-select-option>
					<a-select-option value="2">2</a-select-option>
				</a-select>
			</a-col>
		</a-row>
		
		<a-row :gutter="[10, 0]" class="leccon-config__line">
			<a-col :md="5" :xs="10">
				{{$t('group') | capitalize}}:
			</a-col>
			<a-col :md="8" :xs="14">
				<a-select :disabled="(user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll" :value="getField('group')" @change="(value) => setField('group', value)" style="width: 100%">
					<a-select-option value="0">{{$t('both')}}</a-select-option>
					<a-select-option value="1">1</a-select-option>
					<a-select-option value="2">2</a-select-option>
				</a-select>
			</a-col>
		</a-row>
			
		<div class="footer" style="margin-top: 20px">
			<a-row v-if="!((user.permissions != 'admin' &&  userinfo.headman != getCurrentGroup) || isDisableAll)" type="flex" :gutter="[10, 0]" justify="end">
				<a-col v-if="getField('rawIndex')">
					<a-popconfirm
						title="Are you sure delete this task?"
						ok-text="Yes"
						cancel-text="No"
						@confirm="handleLessonDelete"
					>
						<a-button :loading='isLoading' block type='danger'>
							{{$t('delete') | capitalize}}
						</a-button>
					</a-popconfirm>
				</a-col>
				<a-col>
					<a-button :loading='isLoading' type="primary" icon="save" @click="handleLessonSave">{{$t('send') | capitalize}}</a-button>
				</a-col>
			</a-row>
			<a-row v-else type="flex" :gutter="[10, 0]" justify="end">
				<a-col>
					<a-button @click="$emit('done')" type="primary">Ok</a-button>
				</a-col>
			</a-row>
		</div>
	</div>
</template>

<script>
import {mapGetters} from "vuex"

const numbers = []
const pairCount = 5;
for(let i = 1; i <= pairCount; i++){
	numbers.push(i);
}

const types = ['ЛР', 'ПЗ', 'ЛК', 'Ф', 'none']

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
	data(){
		return {
			numbers,
			types,
			weeks
		}
	},
	methods: {
		handleLessonSave(){
			this.$store.dispatch('edit/sendNewData')
			.then( res => {
				this.$emit("done");
				this.$message.success(this.$t('lesson changes successfully'));
			})
			.catch( err => {
				console.error(err);
				this.$message.error(this.$t('lesson change failed'));
			});
		},
		handleLessonDelete(){
			this.$store.dispatch('edit/lessonDelete')
			.then( res => {
				this.$emit("done");
				this.$message.success(this.$t('lesson deleted successfully'));
			})
			.catch( err => {
				console.error(err);
				this.$message.error(this.$t('lesson delele failed'));
			});
		},
		setField(name, value){
			this.$store.dispatch('edit/setParams', {[name]: value});
		},
		checkBoxProxy(val){
			let result = JSON.parse(JSON.stringify(val));
			weeks.forEach((week, index) => {
				result[index] = val.indexOf(index+1) != -1
			});
			return result;
		}
	},
	computed: {
		...mapGetters(['user', 'getTeachers', 'getLessons', 'getDays', 'userinfo', 'getCurrentGroup']), 
		...mapGetters('edit', ['getParams', 'getWeeks', 'isLoading', 'isEdit', 'isDisableAll']),
		getField(){
			return (name) => this.getParams[name];
		},
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
	}
}
</script>

<style>
.leccon-config__line:not(:last-child){
	margin-bottom: 20px;
}
</style>