import firebase from 'firebase/app'
export default {
	actions: {
		async loadSchedule(ctx, group = "it042debug") {
			const db = firebase.database()
			// ctx.commit('makeIsLoading', true);
			const ref = db.ref('/schedule')
			const ans = await ref.once("value")
			ref.on('value', (snapshot) => {
				ctx.commit('saveSchedule', snapshot.val()[group]);
				localStorage.setItem("schedule", JSON.stringify(snapshot.val()[group]));
			})
			ctx.commit('saveSchedule', ans.val()[group]);
			localStorage.setItem("schedule", JSON.stringify(ans.val()[group]));
		},
		async loadOptions(ctx) {
			function pushData(data){
				ctx.commit('saveColors', data.colors);
				ctx.commit('saveDays', data.days);
				ctx.commit('saveLessons', data.lessons);
				ctx.commit('saveRings', data.rings);
				ctx.commit('saveTeachers', data.teachers);
			}
			const db = firebase.database()
			// ctx.commit('makeIsLoading', true);
			const ref = db.ref('/options');
			const ans = await ref.once("value");
			ref.on('value', (snapshot) => {
				pushData(snapshot.val());
				localStorage.setItem("options", JSON.stringify(snapshot.val()));
			})
			pushData(ans.val());
			localStorage.setItem("options", JSON.stringify(ans.val()));
		},
		async loadAll(ctx, group = "it042debug") {
			ctx.commit('makeIsLoading', true);
			if (localStorage.getItem('schedule') != null && localStorage.getItem('options') != null) {
				ctx.commit('saveSchedule', JSON.parse(localStorage.getItem('schedule')));
				pushData(JSON.parse(localStorage.getItem('options')));
				ctx.commit('makeIsLoading', false);
			}
			function pushData(data) {
				ctx.commit('saveColors', data.colors);
				ctx.commit('saveDays', data.days);
				ctx.commit('saveLessons', data.lessons);
				ctx.commit('saveRings', data.rings);
				ctx.commit('saveTeachers', data.teachers);
			}
			await ctx.dispatch("loadSchedule", group);
			await ctx.dispatch("loadOptions");
			ctx.commit('makeIsLoading', false);
		}
	},

	state: {
		mainSchedule: [],
		colors: {},
		days: [],
		lessons: {},
		rings: [],
		teachers: [],
		isLoading: false
	},

	mutations: {
		saveSchedule(state, data) {
			state.mainSchedule = data
			// console.log('data loaded:', data)
		},
		saveColors(state, data) {
			data.none = "#6ab04c"
			state.colors = data
			// console.log('colors loaded:', data)
		},
		saveDays(state, data) {
			state.days = data
			// console.log('days loaded:', data)
		},
		saveTeachers(state, data) {
			state.teachers = data
			// console.log('days loaded:', data)
		},
		saveLessons(state, data) {
			state.lessons = data
			// console.log('lessons loaded:', data)
		},
		saveRings(state, data) {
			state.rings = data
			// console.log('rings loaded:', data)
		},
		makeIsLoading(state, data){
			state.isLoading = data;
		}
	},
	
	getters: {
		fullScheldue(state, getters){
			const schedule = state.mainSchedule;
			const sch = [];
			let path = [];
			for(let day = 0; day < schedule.length; day++){
				path[0] = day;
				const d = schedule[day];
				const dayArr = [];
				if (d == undefined) schedule[day] = [];
					if (schedule[day] == undefined) schedule[day] = [];
					for (let curTask in d) {
						if(schedule[day][curTask] == undefined) continue
						path[1] = curTask
						const ct = JSON.parse(JSON.stringify(schedule[day][curTask]));
						ct.raw = JSON.parse(JSON.stringify(schedule[day][curTask]));
						ct.raw.rawIndex = curTask;
						ct.path = path;
						const pair = ct;
						if (ct.custom || !ct.weeks.includes(getters.getWeek)) {
							continue;
						} else {
							if (pair.group && (pair.group != 3 && pair.group != getters.subgroup) && getters.showMySub) continue;
							pair.color = state.colors[pair.type] || state.colors["лк"];
							if (pair.lessonId >= 0)
								pair.title = state.lessons[pair.lessonId];
							if (pair.teacherId >= 0)
								pair.teacher = state.teachers[pair.teacherId];
							
							if(pair.half == "1" || pair.half == undefined){
								pair.startTime = state.rings[pair.lessonNumber][0][0];
								pair.endTime = state.rings[pair.lessonNumber][0][1];
								dayArr.push(pair);
							}
							if(pair.half == "2" || pair.half == undefined){
								let anotherPair = JSON.parse(JSON.stringify(pair));
								pair.startTime = state.rings[pair.lessonNumber][1][0];
								pair.endTime = state.rings[pair.lessonNumber][1][1];
								dayArr.push(anotherPair);
							}
						}
					}
				// }
				sch.push(dayArr);
			}
			return sch
		},
		isLoading(state){
			return state.isLoading
		},
		getTeacher: state => id => {
			if(id < 0){
				return undefined;
			}
			return state.teachers[id];
		},
		getDays(state){
			return state.days;
		},
		getTeachers(state) {
			return state.teachers;
		},
		getLessons(state) {
			return state.lessons;
		}
	}
}