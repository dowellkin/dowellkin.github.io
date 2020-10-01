<template>
	<div class="auth">
		<logined v-if="this.user.loggedIn" ></logined>
		<guest v-else></guest>
  </div>
</template>

<script>
import logined from "../components/auth/logined";
import guest from "../components/auth/guest";
import {mapGetters} from 'vuex'
export default {
	name: "AuthPage",
	components: {
		logined, guest
	},
	// mounted(){
	// 	if(this.user.loggedIn){
	// 		console.log(this.user);
	// 	}
	// },
	computed: {
		...mapGetters(['user'])
	}
}
</script>

<style>

</style>