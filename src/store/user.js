import firebase from 'firebase/app'
import 'firebase/database'
export default {
	state: {
			user: {
				loggedIn: false,
				isDrive: false,
				data: null,
				permissions: null,
				userinfo: null,
				groups: null,
				drive: null
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
			SET_GROUPS(state, data) {
				state.user.groups = data;
			},
			SET_DRIVE(state, data) {
				state.user.drive = data;
			},
			SET_ISDRIVE(state, data) {
				state.user.isDrive = data;
			},
			SET_USERINFO(state, data) {
				state.user.userinfo = data;
			},
		},
		actions: {
			fetchUser({commit}, user) {
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
			},
			fetchParams(ctx){
				const db = firebase.database();
				const groupRef = db.ref('groups/');
				groupRef.once("value")
					.then(groups => {
						if (groups.val() != undefined) {
							ctx.commit("SET_GROUPS", groups.val());
							const driveRef = db.ref('drive/' + ctx.state.user.groups[+ctx.state.user.userinfo.group]);
							driveRef.once("value")
								.then(drive => {
									if (drive.val() != undefined) {
										ctx.commit("SET_DRIVE", drive.val());
										ctx.commit("SET_ISDRIVE", true);
									}
								})
						}
					})
			}
		}
}