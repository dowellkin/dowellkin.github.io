import firebase from 'firebase/app'
import 'firebase/database'
export default {
	state: {
			user: {
				loggedIn: false,
				data: null,
				permissions: null,
				userinfo: null,
			},
			userLoading: true,
			groups: [],
			isConfigure: false
			// isConfigure: true // это чисто дебажный момент, нельзя коммитить!
		},
		getters: {
			user(state) {
				return state.user
			},
			groups(state) {
				return state.groups
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
			},
			isConfigMode(state){
				return state.isConfigure
			},
			isUserLoading(state){
				return state.userLoading;
			},
			newUserDefaultValues(state, getters){
				console.log(getters.groups);
				const data = {
					permissions: 'user',
					subgroup: 1,
					showMySub: true,
					group: getters.groups[0]
				}
				console.log(data)
				return data;
			}
		},
		mutations: {
			SET_FULL_USER(state, data){
				state.user = data;
				localStorage.setItem('user', JSON.stringify(data));
			},
			SET_LOGGED_IN(state, value) {
				state.user.loggedIn = value;
			},
			SET_USER(state, data) {
				state.user.data = data;
				localStorage.setItem('user', JSON.stringify(state.user));
			},
			SET_GROUPS(state, data) {
				state.groups = data;
			},
			SET_USERINFO(state, data) {
				state.user.userinfo = data;
				localStorage.setItem('user', JSON.stringify(state.user));
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
			},
			setIsConfigure(state, data) {
				return state.isConfigure = data;
			},
			setUserLoading(state, data) {
				return state.userLoading = data;
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
				return new Promise((resolve, reject) => {
					const db = firebase.database();
					const groupRef = db.ref('groups/');
					groupRef.once("value")
						.then(groups => {
							if (groups.val() != undefined) {
								ctx.commit("SET_GROUPS", groups.val().filter(el => !!el));
								resolve(groups.val());
							}
						})
						.catch(err => {
							reject(err)
						})
				})
			}
		}
}