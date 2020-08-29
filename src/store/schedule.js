import firebase from 'firebase/app'
export default {
	actions: {
		async loadSchedule(ctx) {
			const db = firebase.database()
			ctx.commit('makeIsLoading', true);
			const ans = await db.ref('/').once("value")
			console.log(ans.val());
			ctx.commit('saveSchedule', ans.val().schedule.it042);
			ctx.commit('saveColors', ans.val().colors);
			ctx.commit('saveDays', ans.val().days);
			ctx.commit('saveLessons', ans.val().lessons);
			ctx.commit('saveRings', ans.val().rings);
			ctx.commit('makeIsLoading', false);
		},
	},

	state: {
		mainSchedule: [],
		colors: {},
		days: [],
		lessons: [],
		rings: [],
		isLoading: false
	},

	mutations: {
		saveSchedule(state, data) {
			state.mainSchedule = data
			console.log('data loaded:', data)
		},
		saveColors(state, data) {
			data.none = "#6ab04c"
			state.colors = data
			console.log('colors loaded:', data)
		},
		saveDays(state, data) {
			state.days = data
			console.log('days loaded:', data)
		},
		saveLessons(state, data) {
			state.lessons = data
			console.log('lessons loaded:', data)
		},
		saveRings(state, data) {
			state.rings = data
			console.log('rings loaded:', data)
		},
		makeIsLoading(state, data){
			state.isLoading = data;
		}
	},
	
	getters: {
		fullScheldue(state){
			const schedule = state.mainSchedule;
			for(let day = 0; day < schedule.length; day++){
				const d = schedule[day].tasks;
				for(let task = 0; task < d.length; task++){
					const t = d[task];
					if(t.custom){
						continue;
					} else {
						t.color = state.colors[t.type];
						t.startTime = state.rings[t.lessonNumber][t.half][0];
						t.endTime = state.rings[t.lessonNumber][t.half][1];
						t.title = state.lessons[t.title.replace("lessonIndex_", "")];
					}
				}
			}
			console.log("~~~", schedule);
			return schedule
		},
		isLoading(state){
			return state.isLoading
		}
	}
}