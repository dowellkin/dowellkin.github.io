<template>
	<div class="links">
		&#10024; hello c: &#10024;
		<div class="links__container">
			<div v-for="(link, key) in getLinks" :key="key" class="link">
				<a target="_blank" :href="link">{{key}}</a>
			</div>
		</div>

		<div v-if="(user.permissions == 'admin' || userinfo.headman == getCurrentGroup) && isConfigMode " class="actions">

			<div v-if="(user.permissions == 'admin' || userinfo.headman == getCurrentGroup) && isConfigMode " class="links-action links-add">
				<header class="links-action__header">
					<h3>Add link</h3>
				</header>
				<main class="links-action__main">
					<div class="links-action__item">
						title: <a-input v-model="linkAdd.title"></a-input>
					</div>
					<div class="links-action__item">
						link: <a-input v-model="linkAdd.url"></a-input>
					</div>
					<div class="links-action__item">
						<a-row type="flex" justify="end" :gutter='[10, 10]'>
							<a-col>
								<a-button type="danger" @click='clearAddLink'>Clear</a-button>
							</a-col>
							<a-col>
								<a-button type="primary" @click="sendNewLink">Send</a-button>
							</a-col>
						</a-row>
					</div>
				</main>
			</div>

			<div v-if="(user.permissions == 'admin' || userinfo.headman == getCurrentGroup) && isConfigMode " class="links-action links-remove">
				<header class="links-action__header">
					<h3>Remove link</h3>
				</header>
				<main class="links-action__main">
					<div class="links-action__item">
						title: 
						<a-select show-search v-model="linkRemove.title" style="width: 100%">
							<a-select-option v-for="(link, key) in getLinks" :value="key" :key="key">{{key}}</a-select-option>
						</a-select>
					</div>
					<div class="links-action__item">
						<a-row type="flex" justify="end" :gutter='[10, 10]'>
							<a-col>
								<a-button type="danger" @click='clearRemoveLink'>Clear</a-button>
							</a-col>
							<a-col>
								<a-button type="primary" @click="removeLink">Send</a-button>
							</a-col>
						</a-row>
					</div>
				</main>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase/app'

export default {
	name: 'links-view',
	data(){
		return {
			linkAdd: {
				title: '',
				url: ''
			},
			linkRemove: {
				title: ''
			}
		}
	},
	computed: {
		...mapGetters(['user', 'getLinks', "isConfigMode", 'userinfo', 'getCurrentGroup']),
	},
	created(){
		this.$store.dispatch('loadLinks');
	},
	methods: {
		clearRemoveLink(){
			this.linkRemove.title = '';
		},
		clearAddLink(){
			this.linkAdd.title = '';
			this.linkAdd.url = '';
		},
		sendNewLink(){
			const userGroup = this.user.userinfo?.group;
			if(!userGroup) {
				this.$message.error(this.$t("Failed"));
				return;
			}

			firebase.database().ref('links/' + userGroup).child(this.linkAdd.title).set(this.linkAdd.url, (error) => {
				if(error){
					this.$message.error(this.$t("failed"));
				} else {
					this.$message.success(this.$t("success"));
				}
			});
		},
		removeLink(){
			const userGroup = this.user.userinfo?.group;
			if(!userGroup) {
				this.$message.error(this.$t("Failed"));
				return;
			}
			// console.log('links/' + userGroup);
			firebase.database().ref('links/' + userGroup).child(this.linkRemove.title).set(null, (error) => {
				if(error){
					this.$message.error(this.$t("failed"));
				} else {
					this.$message.success(this.$t("success"));
				}
			});
		}
	}
}
</script>

<style scoped>

.actions{
	display: flex;
	flex-wrap: wrap;
	grid-gap: 20px
}

.links__container{
	display: flex;
	flex-wrap: wrap;
	grid-gap: 10px;
	margin-top: 20px;
}

.link{
	min-width: 120px;
	/* width: 120px; */
	padding: 0 15px;
	height: 60px;
	box-shadow: inset 0px 0px 0px 1px rgb(211, 211, 211);
	border-radius: 6px;
	display: flex;
	justify-content: center;
	align-items: center;
	font-weight: bold;
	overflow: hidden;
	overflow-wrap: nowrap;
	text-overflow: ellipsis;
	text-decoration: none;
	transition: background-color .2s ease, color .2s ease;
}

.link:hover{
	background-color: #1890ff;
	color: #fff;
	box-shadow: none;
}

.link a{
	text-decoration: none;
}

.link:hover a{
	color: #fff;
	text-decoration: none;
}

.links-action{
	margin-top: 20px;
	max-width: 500px;
	min-width: 300px;
	/* box-shadow: inset 0px 0px 0px 1px rgb(233, 233, 233); */
	border: 1px solid rgb(233, 233, 233);
	border-radius: 10px;
	overflow: hidden;
	flex-grow: 1;
}

.links-action__header{
	background: rgb(248, 248, 248);
	border-bottom: 1px solid rgb(233, 233, 233);
	padding: 2px 12px;
	display: flex;
	justify-content: center;
	align-items: center;
}

.links-action__main{
	padding: 15px 10px;
}

.links-action__item:not(:last-child){
	margin-bottom: 20px;
}
</style>