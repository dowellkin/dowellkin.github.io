<template>
	<div class="database">
		<a-button v-for="table in tables" :key="table.name" @click="() => $router.push({name: table.routeName})">{{$t(table.routeName)}}</a-button>
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
					routeName: 'Teachers'
				},
				{
					name: 'lessons',
					routeName: 'Lessons'
				},
			]
		}
	}
}
</script>

<style>
.database{
	display: flex;
	flex-direction: column;
	grid-gap: 10px;
	max-width: 300px;
}
</style>