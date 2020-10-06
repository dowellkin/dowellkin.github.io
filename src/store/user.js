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
			groups(state) {
				return state.user.groups
			},
			userinfo(state) {
				return state.user.userinfo
			},
			groupId(state) {
				return state.user.userinfo.group
			},
			subgroup(state) {
				if (state.user.userinfo)
					return state.user.userinfo.subgroup
				else
					return -1	
			},
			showMySub(state) {
				if (state.user.userinfo)
					return state.user.userinfo.showMySub
				else
					return false
			},
			groupName(state, getters) {
				return getters.groups[getters.groupId];
			},
			permissions(state){
				return state.user.permissions
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
			SET_USERGROUP(state, data) {
				state.user.userinfo.group = data;
			},
			SET_USERSUBGROUP(state, data) {
				state.user.userinfo.subgroup = data;
			},
			SET_SHOWONLYMYSUB(state, data) {
				state.user.userinfo.showMySub = data;
			},
			SET_PERMISSIONS(state, data){
				state.user.permissions = data;
			}
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