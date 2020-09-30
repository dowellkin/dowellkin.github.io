export default {
	state: {
			user: {
				loggedIn: false,
				data: null,
				permissions: null
			}
		},
		getters: {
			user(state) {
				return state.user
			},
			permissions(state){
				return state.permissions
			}
		},
		mutations: {
			SET_LOGGED_IN(state, value) {
				state.user.loggedIn = value;
			},
			SET_USER(state, data) {
				state.user.data = data;
			},
			SET_PERMISSIONS(state, data) {
				state.user.permissions = data;
			}
		},
		actions: {
			fetchUser({
				commit
			}, user) {
				commit("SET_LOGGED_IN", user !== null);
				if (user) {
					commit("SET_USER", {
						displayName: user.displayName,
						email: user.email,
						photoURL: user.photoURL,
						uid: user.uid,
					});
				} else {
					commit("SET_USER", null);
				}
			}
		}
}