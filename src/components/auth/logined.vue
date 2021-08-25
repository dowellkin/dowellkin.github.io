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

		<div class="settings__fields">
			<template v-if="userinfo != undefined && groups != undefined">
				<a-row type="flex" justify="space-around" style="margin-top: 15px" :gutter="[10, 20]">
					<a-col :span="24">
						<p>
							Группа
						</p>
						<a-select style="width: 100%" :value="userinfo.group" @change="groupChangeHandle" :loading="groupLoading">
							<a-select-option v-for="(groupSelect, index) in groups" :value="groupSelect" :key="groupSelect+index">
								{{userCyrillic(groupSelect.toUpperCase())}}
							</a-select-option>
						</a-select>
					</a-col>

					<a-col :span="24">
						<p>
							Подгруппа
						</p>
						<a-select style="width: 100%" @change="subgroupChangeHandle" :value="subgroup"  :loading="subgroupLoading">
							<a-select-option :value="1">
								1 подгруппа
							</a-select-option>
							<a-select-option :value="2">
								2 подгруппа
							</a-select-option>
						</a-select>
					</a-col>
				</a-row>

				<a-row type="flex" justify="space-around" style="margin-top: 15px" :gutter="[10, 20]">
					<a-col :span="24">
						<a-row type="flex" justify="space-between">
							<a-col>
								{{$t('show pairs only for you subgroup') | capitalize}}
							</a-col>
							<a-col>
								<a-switch :checked="showMySub" @change="MyPairsHandle" :loading="showMySubLoading"/>	
							</a-col>
						</a-row>
					</a-col>
					<a-col v-if="user.permissions == 'admin'" :span="24">
						<a-row type="flex" justify="space-between">
							<a-col>
								{{$t('pair configuration mode') | capitalize}}
							</a-col>
							<a-col>
								<a-switch :checked="isConfigMode" @change="(newState) => {$store.commit('setIsConfigure', newState)}" :loading="showMySubLoading"/>	
							</a-col>
						</a-row>
					</a-col>
				</a-row>

		</template>
		<template v-else>
			<a-row type="flex" justify="space-around">
				<a-col>
					<a-icon style="font-size: 2.5rem" type="loading"></a-icon>
				</a-col>
			</a-row>
		</template>

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

	</div>
</template>

<script>
import firebase from 'firebase/app'
import 'firebase/auth'
import {mapGetters} from 'vuex'
import config from '@/config.js'

export default {
	name: "AuthPage_logined",
	data(){
		return {
			onlyMySubgroup: false,
			showMySubLoading: false,
			subgroupLoading: false,
			groupLoading: false
		}
	},
	methods: {
		userCyrillic(text){
			return config.enToRu(text)
		},
		test(e){
			console.log(e);
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
		},
		changeLanguage(){
			this.$i18n.locale = this.$i18n.locale == "ru" ? "en" : "ru";
		},
		MyPairsHandle(value){
			this.showMySubLoading = true;
			firebase.database().ref('users/' + this.user.data.uid).child('showMySub').set(value, (error) => {
				if(error){
					this.$message.error(this.$t("Failed"));
					this.showMySubLoading = false;
				} else {
					this.$store.commit("SET_SHOWONLYMYSUB", value);
					this.showMySubLoading = false;
				}
			});
		},
		groupChangeHandle(value){
			this.groupLoading = true;
			firebase.database().ref('users/' + this.user.data.uid).child('group').set(""+value, (error) => {
				if(error){
					this.$message.error(this.$t("Failed"));
					this.groupLoading = false;
				} else {
					this.$store.commit("SET_USERGROUP", value);
					this.groupLoading = false;
				}
			});
		},
		subgroupChangeHandle(value){
			this.subgroupLoading = true;
			firebase.database().ref('users/' + this.user.data.uid).child('subgroup').set(value, (error) => {
				if(error){
					this.$message.error(this.$t("Failed"));
					this.subgroupLoading = false;
				} else {
					this.$store.commit("SET_USERSUBGROUP", value);
					this.subgroupLoading = false;
				}
			});
		},

	},
	computed: {
		...mapGetters(['user', 'groups', 'userinfo', 'subgroup', 'showMySub', 'isConfigMode']),
	}
}
</script>

<style>
.logined{
	padding: 10px;
}

.settings__fields{
	max-width: 700px;
}
</style>