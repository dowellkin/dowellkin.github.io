<template>
	<div class="loading-wrapper">
		<a-icon type="loading" />
	</div>
</template>

<script>
export default {
	name: 'loading'
}
</script>

<style>
	.loading-wrapper{
		position: absolute;
		background: rgba(0,0,0,.2);
		color: #fff;
		top: 0;
		left: 0;
		width: 100%;
		font-size: 4.5rem;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>