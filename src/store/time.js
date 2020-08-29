export default {
	actions: {
		updateTime(ctx){
			ctx.commit("newDate", new Date());
			setTimeout(() => {
				ctx.dispatch("updateTime")
			}, 1000000)
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
		}
	}
}