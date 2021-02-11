<template>
	<div class="teachers">
		<a-modal
      :title="$t(modal.title)"
      :visible="modal.visible"
      :confirm-loading="modal.confirmLoading"
			:cancelText="$t('Cancel')"
      @ok="handleOk"
      @cancel="handleCancel"
			:forceRender="true"
    >
			<a-form :form="modal.formVariable" layout="vertical">
				<a-form-item
					:label="this.$t('Name')"
					:validate-status="modal.nameStatus"
					:help="modal.help">
					<a-input
						v-decorator="['name', { rules: [{ required: true, message: 'Please input your note!' },
																	{ validator: lenthMoreThan5, message: 'Length must be more than 5!' }] }]"
						:disabled="permissions != 'admin'"
					/>
				</a-form-item>
				<a-form-item :label="this.$t('Link')">
					<a-input
						v-decorator="['link', { rules: [{}] }]"
						type="url" :disabled="permissions != 'admin'"
					/>
				</a-form-item>
			</a-form>
		</a-modal>
		<div v-if="permissions == 'admin'" class="teachers__actions" style="margin-bottom: 15px">
			<a-button type="primary" icon="plus" @click='showModal("Add teacher")'>{{$t('Add teacher')}}</a-button>
		</div>
		<a-table
			:columns="columns"
			:data-source="getTeachers"
			:pagination="{ pageSize: 20 }"
			tableLayout='auto'
			:rowKey="getRowKey"
			:loading="isLoading"
			:scroll="{ x: 700 }"
		>
			<a slot="name" slot-scope="text">{{ text }}</a>
			<span slot="id" slot-scope="id">{{ id+1 }}</span>
			<span slot="link" slot-scope="link">
				<a v-if="link.length > 0" :href="link" target="_blank">
					<a-button size="small" type="link">
						Страница на сайте академии
					</a-button>
				</a>
				<a-button v-else size="small" type="link">
					Страница не найдена
				</a-button>
			</span>
			<span slot="action" slot-scope="text, record">
				<a-button v-if="permissions == 'admin'" type="primary" size="small" icon="tool"  @click='showModal("Сhange", record.id)'>
					{{$t('Сhange')}}
				</a-button>
				<a-button v-else type="primary" size="small" icon="tool"  @click='showModal("Сhange", record.id)'>
					{{$t('Look')}}
				</a-button>
				</span>
				<div
				slot="filterDropdown"
				slot-scope="{ setSelectedKeys, selectedKeys, confirm, clearFilters, column }"
				style="padding: 8px"
			>
				<a-input
					v-ant-ref="c => (searchInput = c)"
					:placeholder="`Search ${column.dataIndex}`"
					:value="selectedKeys[0]"
					style="width: 188px; margin-bottom: 8px; display: block;"
					@change="e => setSelectedKeys(e.target.value ? [e.target.value] : [])"
					@pressEnter="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
				/>
				<a-button
					type="primary"
					icon="search"
					size="small"
					style="width: 90px; margin-right: 8px"
					@click="() => handleSearch(selectedKeys, confirm, column.dataIndex)"
				>
					Search
				</a-button>
				<a-button size="small" style="width: 90px" @click="() => handleReset(clearFilters)">
					Reset
				</a-button>
			</div>
			<a-icon
				slot="filterIcon"
				slot-scope="filtered"
				type="search"
				:style="{ color: filtered ? '#108ee9' : undefined }"
			/>
			<template slot="customRender" slot-scope="text, record, index, column">
				<span v-if="searchText && searchedColumn === column.dataIndex">
					<template
						v-for="(fragment, i) in text
							.toString()
							.split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i'))"
					>
						<mark
							v-if="fragment.toLowerCase() === searchText.toLowerCase()"
							:key="i"
							class="highlight"
							>{{ fragment }}</mark
						>
						<template v-else>{{ fragment }}</template>
					</template>
				</span>
				<template v-else>
					{{ text }}
				</template>
			</template>
		</a-table>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import firebase from 'firebase/app'
export default {
	name: "TeachersPage",
	data() {
		return {
			columns: [
				{
					title: this.$t('Id'),
					dataIndex: 'id',
					key: 'id',
					width: 60,
					scopedSlots: { customRender: 'id' },
				},
				{
					title: this.$t('Name'),
					dataIndex: 'name',
					key: 'name',
          scopedSlots: {
            filterDropdown: 'filterDropdown',
            filterIcon: 'filterIcon',
            customRender: 'customRender',
          },
          onFilter: (value, record) =>
            record.name
              .toString()
              .toLowerCase()
              .includes(value.toLowerCase()),
          onFilterDropdownVisibleChange: visible => {
            if (visible) {
              setTimeout(() => {
                this.searchInput.focus();
              }, 0);
            }
          },
				},
				{
					title: this.$t('Link'),
					dataIndex: 'link',
					key: 'link',
					scopedSlots: { customRender: 'link' },
				},
				{
					title: this.$t('Action'),
					dataIndex: 'action',
					key: 'action',
					scopedSlots: { customRender: 'action' },
				}
			],
			modal: {
				title: "",
				visible: false,
				confirmLoading: false,
				id: -1,
				name: "",
				link: "",
				formVariable: this.$form.createForm(this, { name: 'coordinated' }),
				nameStatus: "",
				help: "",
			},
      searchText: '',
      searchInput: null,
      searchedColumn: '',
		}
	},
	computed: {
		...mapGetters(['getTeachers', 'isLoading', 'user', 'permissions'])
	},
	methods: {
		getRowKey(text, index){
			return index;
		},
    showModal(from, id = -1) {
			this.modal.id = id;
			if(id >= 0){
				const teacher = this.$store.getters['getTeacher'](id);
				this.modal.formVariable.setFieldsValue({"name": teacher.name, "link": teacher.link})
			} else {
				this.modal.formVariable.setFieldsValue({"name": "", "link": ""})
			}
			this.modal.title = from;
      this.modal.visible = true;
    },
    handleOk() {
			if(this.user.userinfo.permissions != 'admin'){
				this.modal.visible = false;
				return;
			}
			this.modal.confirmLoading = true;
			this.modal.formVariable.validateFields()
				.then( res => {
					let teacherid = NaN
					if(this.modal.id > -1){
						teacherid = this.modal.id;
					} else {
						teacherid = Math.max(...this.getTeachers.map(el => el.id))+1;
					}
					firebase.database().ref('options/teachers/').update({
						[teacherid]: {
							"id": teacherid,
							"name": res.name,
							"link": res.link
							}
						}, (error) => {
							if(error) {
								this.modal.confirmLoading = false;
								this.$message.error(this.$t("Something went wrong."));
								console.error(error);
							} else {
								this.modal.confirmLoading = false;
								this.modal.visible = false;
								this.$message.success(this.$t("Teacher updated"));
							}
						});
				})
				.catch( err => {
					console.error(err);
					this.modal.confirmLoading = false;
					this.modal.nameStatus = "error";
					this.modal.help = this.$t(err.errors.name.errors[0].message);
				})
			
    },
    handleCancel() {
      this.modal.visible = false;
		},
		lenthMoreThan5(rule, value, callback){
			// console.log(form.validateFields());
			if(value.length > 5){
				callback();
			} else {
				callback(rule.message);
			}
		},
    handleSearch(selectedKeys, confirm, dataIndex) {
      confirm();
      this.searchText = selectedKeys[0];
      this.searchedColumn = dataIndex;
    },

    handleReset(clearFilters) {
      clearFilters();
      this.searchText = '';
    },
	}
}
</script>

<style>

</style>