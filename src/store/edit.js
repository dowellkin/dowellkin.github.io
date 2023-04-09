import firebase from 'firebase/app'
import 'firebase/database'


const weeks = [];
const weeksChecked = [];
const weeksCount = 4;
for(let i = 1; i <= weeksCount; i++){
	weeks.push(i);
	weeksChecked.push(false);
}

const blank_data = {
	lessonId: 0,
	teacherId: 0,
	lessonNumber: 0,
	type: '',
	room: '',
	weeks: weeksChecked,
	dayName: '',
	day: 0,
	name: '',
	custom: false,
	half: "0",
	group: "0"
}

blank_data

export default {
	namespaced: true,
	state: {
		fields: {...blank_data},
		edit: false,
		showfield: false,
		loading: false,
		disableAll: false,
	},
	mutations: {
		setParams(state, data){
			state.fields = Object.assign(state.fields, data);
		},
		showForEdit(state){
			state.edit = true;
			state.disableAll = false;
			state.showfield = true;
		},
		showForLook(state){
			state.disableAll = true;
			state.showfield = true;
		},
		showEdit(state){
			state.showfield = true;
			state.disableAll = false;
			state.fields = Object.assign(state.fields, blank_data);
		},
		clear(state){
			state.fields = Object.assign(state.fields, blank_data);
		},
		closeEdit(state){
			state.edit = false;
			state.showfield = false;
		},
		setWeeks(state, data){
			state.fields.weeks = data;
		},
		setLoading(state,data){
			state.loading = data;
		}
	},
	actions: {
		setParams(ctx, data){
			ctx.commit('setParams', data);

			if(data.lessonId != undefined){
				ctx.commit('setParams', {'name': ctx.rootGetters.getLessons[data.lessonId]});
			}
		},
		weeksEdit(ctx, data){
			let {value, week} = data;
			value = value.target.checked; 
			const weeks = ctx.getters.getParams.weeks;
			const set = new Set(weeks);
			if(value){
				set.add(week);
			} else {
				set.delete(week)
			}
			ctx.commit('setWeeks', Array.from(set));
		},
		sendNewData(ctx){
			const data = objCopy(ctx.state.fields);
			let index = data.rawIndex;
			const day = data.day;
			delete data.dayName;
			delete data.day;
			delete data.rawIndex;
			
			if( ~data.lessonId ) {
				data.name = ctx.rootGetters.getLessons[data.lessonId];
			}
			
			if(![1,2].includes(+data.half)){
				delete data.half;
			}

			if(day > 5){
				throw `day must be less, now it's: ${day}`
			}

			const path = `schedule/${ctx.rootGetters.groupId}/${day}`;

			ctx.commit('setLoading', true);

			if(!ctx.state.edit){
				index = firebase.database().ref(path).push().key;
			}
			return sendPair(path, index, data)
				.finally(ctx.commit('setLoading', false));
		},
		lessonDelete(ctx){
			const data = objCopy(ctx.state.fields);
			ctx.commit('setLoading', true);
			const path = `schedule/${ctx.rootGetters.groupId}/${data.day}`;
			return sendPair(path, data.rawIndex, null)
				.finally(ctx.commit('setLoading', false));
		}
	},
	getters: {
		getParams(state){
			return state.fields
		},
		isShowfield(state){
			return state.showfield
		},
		isEdit(state){
			return state.edit
		},
		isLoading(state){
			return state.loading
		},
		isDisableAll(state){
			return state.disableAll
		}
	},
}


function sendPair(path, index, data) {
	if(index == undefined){
		throw 'index is underfined. Can\'t push data.';
	}
	return new Promise( (resolve, reject) => {
		firebase.database().ref(path).update({
			[index]: data
			}, (error) => {
				if(error) {
					console.error(error);
					reject(error);
				} else {
					resolve();
				}
			});
	})
}

function objCopy(obj) {
	return JSON.parse(JSON.stringify(obj));
}