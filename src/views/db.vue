<template>
	<div class="container">
		<div class="database">
			<a-card
				v-for="table in tables"
				:key="table.name"
				@click="() => $router.push({ name: table.routeName })"
				class="database__item"
			>
				<a-row>
					<a-col :span="24">
						<div class="database__item-icon">
							<a-icon :type="table.icon" />
						</div>
					</a-col>
				</a-row>
				<a-row>
					<a-col :span="24">
						<div class="database__item-title">
							{{ $t(table.routeName) }}
						</div>
					</a-col>
				</a-row>
			</a-card>
			<!-- <a-button v-for="table in tables" :key="table.name" @click="() => $router.push({name: table.routeName})">{{$t(table.routeName)}}</a-button> -->
		</div>
	</div>
</template>

<script>
export default {
	name: "database",
	data(){
		return {
			tables: [
				{
					name: 'teachers',
					routeName: 'Teachers',
					icon: 'user'
				},
				{
					name: 'lessons',
					routeName: 'Lessons',
					icon: 'file'
				},
			]
		}
	}
}
</script>

<style lang="scss">
.database{
	grid-gap: 10px;
	display: grid;
	grid-auto-columns: 90px;
	grid-template-columns: repeat( auto-fit, minmax(250px, 340px) );

	@media screen and (max-width: 862px) {
		grid-template-columns: repeat( auto-fit, minmax(250px, 1fr) );
	}

	&__item  {
		cursor: pointer;

		&:hover {
			color: var(--antd-wave-shadow-color);
		}
	}

	&__item-icon {
		font-size: 42px;
	}

	&__item-icon,
	&__item-title {
		text-align: center;
	}
}
</style>