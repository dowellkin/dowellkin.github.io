<template>
	<div class="about">
		<div v-if="!this.user.loggedIn" class="notAuth">
			<h1>Test page</h1>
			<a-button type="primary" @click="auth">
				Auth
			</a-button>
		</div>
		<div v-else>
			<p>
				Welcome, {{user.data.displayName}}
			</p>
			<a-button type="danger" @click="logout">Logout</a-button>
		</div>
  </div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'

import {mapGetters} from 'vuex'
export default {
	name: "Auth",
	methods: {
		auth(){
			const provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().languageCode = 'ru';
			firebase.auth().signInWithPopup(provider)
			.then(result => {
				console.log("result: ", result);
				this.$message.success("Вы успешно вошли в аккаунт")
			})
			.catch( err => {
				console.error(err);
			})
		},
		logout(){
			firebase
        .auth()
        .signOut()
        .then(() => {
          this.$message.success("Вы успешно вышли из аккаунта")
        })
				.catch( err => {
					console.error(err);
				});
		}
	},
	mounted(){
		if(this.user.loggedIn){
			console.log(this.user);
		}
	},
	computed: {
		...mapGetters(['user'])
	}
}
</script>

<style>

</style>