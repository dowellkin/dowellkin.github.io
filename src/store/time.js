export default {
	actions: {
		updateTime(ctx){
			ctx.commit("newDate", new Date());
			setTimeout(() => {
				ctx.dispatch("updateTime")
			}, 20000)
		}
	},

	state: {
		date: new Date()
	},

	mutations: {
		newDate(state, value){
			state.date = value
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
		getWeekNum(){
			let thisYear = new Date().getFullYear();
			let firstDay = new Date(0);
			firstDay.setFullYear(thisYear);
			const day = 8.64e7;
			const weekMil = 6.048e8;

			firstDay = firstDay.getTime() - day * firstDay.getDay();
			let now = new Date().getTime();

			let week = Math.floor((now - firstDay) / weekMil);
			return (week - 2) % 4 ;
		}
	}
}