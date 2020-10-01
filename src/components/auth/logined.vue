<template>
	<div class="logined">
		<a-row type="flex" justify="center">
			<a-col>
				<a-avatar :size="96" :src="user.data.photoURL" icon="user" alt="avatar"/>
			</a-col>
		</a-row>
		<a-row type="flex" justify="center" style="margin-top: 15px">
			<a-col>
				<h1 style="font-weight: 400; font-size: 1.5rem; text-align: center">{{$t("You are welcome")}}, {{user.data.displayName}}!</h1>
			</a-col>
		</a-row>
		<a-row type="flex" justify="center" style="margin-top: 15px">
			<a-col>
				<p style="font-size: 1.1rem; text-align: center">{{$t('Adjust the settings to make your use of SCHEDO services even more convenient.')}}</p>
			</a-col>
		</a-row>
		<a-row type="flex" justify="center" style="margin-top: 15px">
			<a-col>
				<a-button @click="changeLanguage">
					Сменить язык / Change Language
				</a-button>
			</a-col>
		</a-row>
		<a-row type="flex" justify="center" style="margin-top: 15px">
			<a-col>
				<a-popconfirm
					:title="$t('Do you really want to leave?')"
					:ok-text="$t('Yes')"
					:cancel-text="$t('No')"
					@confirm="logout"
				>
					<a-button type="danger">{{$t('logout')}}</a-button>
				</a-popconfirm>
			</a-col>
		</a-row>
	</div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import {mapGetters} from 'vuex'
export default {
	name: "AuthPage_logined",
	methods: {
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
		},
		changeLanguage(){
			this.$i18n.locale = this.$i18n.locale == "ru" ? "en" : "ru";
		}
	},
	computed: {
		...mapGetters(['user']),
	}
}
</script>

<style>

</style>