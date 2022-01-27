export default {
	actions: {
		updateTime(ctx){
			ctx.commit("newDate", new Date());
			const updateTime = process.env.NODE_ENV == "development" ? 200000 : 10000;
			setTimeout(() => {
				ctx.dispatch("updateTime")
			}, updateTime)
		}
	},

	state: {
		date: new Date(),
		savedWeek: 0
	},

	mutations: {
		newDate(state, value){
			state.date = value
		},
		saveWeek(state, value){
			state.savedWeek = value
		}
	},

	getters: {
		getHours(state){
			return state.date.getHours()
		},
		getMinutes(state){
			return state.date.getMinutes().toString().length < 2 
							? "0" + state.date.getMinutes()
							: state.date.getMinutes()
		},
		getTime(state, getters){
			return `${getters.getHours}:${getters.getMinutes}`
		},
		getDay(state) {
			// state
			// return 0
			return state.date.getDay() == 0 ? 6 : state.date.getDay() - 1;
		},
		getEncodedTime(state, getters) {
			return (parseInt(getters.getHours, 10) * 60) + parseInt(getters.getMinutes, 10)
		},
		getSavedWeek(state){
			return state.savedWeek;
		},
		getWeekNum(state, getters, rootState, rootGetters = 0){
			let thisYear = new Date().getFullYear();
			let firstDay = new Date(0);
			firstDay.setFullYear(thisYear);
			const day = 8.64e7;
			const weekMil = 6.048e8;

			firstDay = firstDay.getTime() - day * firstDay.getDay();
			let now = new Date().getTime();

			let week = Math.floor((now - firstDay) / weekMil);
			let ret = ((week - 2) + rootGetters.getOffset) % 4;
			return  ret == 0? 4 : ret;
		},
		getWeek(state, getters) {
			return getters.getSavedWeek || getters.getWeekNum;
		}
	}
}