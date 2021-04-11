<template>
	<div class="lessons">

		<a-modal
			:visible="modal.newLesson"
			@cancel="() => closeModal('newLesson')"
			@ok="sendNewLesson"
			:title="$t('lesson')"
			:loading="modalLoading"
		>
			<a-row style="margin-bottom: 15px">
				<a-col :span="9">
					{{$t('Title')}}:
				</a-col>
				<a-col :span="15">
					<a-input :disabled="!edit" v-model="modalFields.title"></a-input>
				</a-col>
			</a-row>
			<a-row style="margin-bottom: 15px">
				<a-col :span="9">
					{{$t('Short title')}}:
				</a-col>
				<a-col :span="15">
					<a-input :disabled="!edit" v-model="modalFields.shorttitle"></a-input>
				</a-col>
			</a-row>
			<a-row v-if="this.modalFields.id != -1">
				<a-col>
					
					<a-popconfirm
						:title="$t('Are you sure delete this lesson?')"
						:ok-text="$t('Yes')"
						:cancel-text="$t('No')"
						@confirm="sendDeleteLesson"
					>
						<a-button :loading='modalLoading' type='danger'>
							{{$t('delete') | capitalize}}
						</a-button>
					</a-popconfirm>
				</a-col>
			</a-row>
		</a-modal>

		<div v-if="user.permissions == 'admin'" style="margin-bottom: 15px">
			<a-button type="primary" icon="plus" @click="openLesson(-1, true)">{{$t('Add lesson')}}</a-button>
		</div>
		<a-table
			:columns="columns"
			:data-source="lessonsParams"
			:pagination="{ pageSize: 15 }"
			tableLayout='auto'
			rowKey="id"
			:scroll="{ x: 700 }"
		>
			
			<span slot="id" slot-scope="id">{{ +id+1 }}</span>
			<span slot="action" slot-scope="text, record">
				<a-button v-if="user.permissions == 'admin'" type="primary" size="small" icon="tool" @click="openLesson(record.id, true)">
					{{$t('Сhange')}}
				</a-button>
				<a-button v-else type="primary" size="small" icon="tool" @click="openLesson(record.id)">
					{{$t('Look')}}
				</a-button>
			</span>
		</a-table>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';
import firebase from 'firebase/app'
import 'firebase/database'

export default {
	name: "lessons-view",
	data(){
		return {
			columns: [
				{
					title: this.$t('Id'),
					dataIndex: 'id',
					width: 60,
					scopedSlots: { customRender: 'id' },
				},
				{
					title: this.$t('Title'),
					dataIndex: 'title',
				},
				{
					title: this.$t('Short title'),
					dataIndex: 'shorttitle',
				},
				{
					title: this.$t('Action'),
					dataIndex: 'action',
					scopedSlots: { customRender: 'action' },
				}
			],
			modalFields: {
				id: -1,
				title: '',
				shorttitle: ''
			},
			modal: {
				newLesson: false
			},
			edit: false,
			modalLoading: false
		}
	},
	methods: {
		showModal(name){
			this.modal[name] = true;
		},
		closeModal(name){
			this.modal[name] = false;
		},
		openLesson(lessonId, edit=false){
			const lesson = this.getLessons[lessonId];
			this.modalFields.id = +lessonId;
			if(lessonId >= 0){
				if(typeof lesson == 'object'){
					this.modalFields.title = lesson.title;
					this.modalFields.shorttitle = lesson.shorttitle;
				} else {
					this.modalFields.title = lesson ? lesson : '';
					this.modalFields.shorttitle = '';
				}
			} else {
				this.modalFields.title = '';
				this.modalFields.shorttitle = '';

			}

			if(edit && this.user.permissions == 'admin'){
				this.edit = true;
			}
			
			this.showModal('newLesson');
		},
		sendNewLesson(){
			if(this.modalFields.title.length < 4){
				this.$message.error('title is too short');
				return;
			}

			this.modalLoading = true;
			let index = this.modalFields.id;
			if(index == -1){
				index = Math.max(...Object.keys(this.getLessons))+1;
			}
			firebase.database().ref('options/lessons/').update({
				[index]: {
					"title": this.modalFields.title,
					"shorttitle": this.modalFields.shorttitle,
					}
				}, (error) => {
					if(error) {
						this.$message.error(this.$t("Something went wrong."));
						console.error(error);
					} else {
						this.modal.newLesson = false;
						this.$message.success(this.$t("lesson updated"));
					}
					this.modalLoading = false;
				});
		},
		sendDeleteLesson(){
			let index = this.modalFields.id;
			firebase.database().ref('options/lessons/').update({
				[index]: null
				}, (error) => {
					if(error) {
						this.$message.error(this.$t("Something went wrong."));
						console.error(error);
					} else {
						this.modal.newLesson = false;
						this.$message.success(this.$t("lesson deleted"));
					}
					this.modalLoading = false;
				});
		}
	},
	computed: {
		...mapGetters(['user', 'getLessons']),
		lessonsParams(){
			return Object.entries(this.getLessons).map( el => {
				if(typeof el[1] == 'string'){
					return {id: el[0], title: el[1]}
				}
				return {id: el[0], ...el[1]}
			})
		}
	}
}
</script>

<style>

</style>