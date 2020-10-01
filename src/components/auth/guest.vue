<template>
	<a-result :title="$t('Log into your profile for more options')">
    <template #icon>
      <a-icon type="smile" theme="twoTone" />
    </template>
    <template #extra>
      <a-button icon="google" size="large" type="primary" @click="auth">
        {{$t('login')}}
      </a-button>
    </template>
  </a-result>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import {mapGetters} from 'vuex'
export default {
	name: "AuthPage_guest",
	methods: {
		auth(){
			const provider = new firebase.auth.GoogleAuthProvider();
			firebase.auth().languageCode = 'ru';
			firebase.auth().signInWithPopup(provider)
			.then(() => {
				// console.log("result: ", result);
				this.$message.success("Вы успешно вошли в аккаунт")
			})
			.catch( err => {
				console.error(err);
			})
		},
	},
	computed: {
		...mapGetters(['user']),
	}
}
</script>

<style>

</style>