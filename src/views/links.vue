<template>
	<div class="links">
		hello c:
		<br>
		ur google drive link:
		<br>
		<a :href="user.drive">CLICK ME!</a>
	</div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	name: 'links-view',
	computed: {
		...mapGetters(['user']),
	}
}
</script>

<style>

</style>