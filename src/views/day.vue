<template>
	<div class="day">
		<div class="day__title">
			{{day.name}}
		</div>
		<div class="day__content">
			<div class="day__time-column">
				<div
					v-if="index == getDay"
					class="day__time-item day__time-item--current day__time-current"
					:style="{'transform': 'translateY('+getBias+'px)'}"
					>{{getTime}}</div>
				<div class="day__time-item time__row" v-for="(time, index) in getLinesTime" :key="index">{{time}}</div>
			</div>
			<div class="day__lines-column">
				<div
					v-if="index == getDay"
					class="day__lines-item day__lines-item--current day__time-current"
					:style="{'transform': 'translateY('+getBias+'px)'}"
					></div>
				<div class="day__lines-item time__row" v-for="(time, index) in getLinesTime" :key="index"></div>
			</div>
		</div>
	</div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
	name: 'day',
	props: ['day', 'index'],
	created(){
	},
	data(){
		return {
			dayStart: 8,
			dayEnd: 20
		}
	},
	computed:{
		getLinesTime(){
			const ret = [];
			for(let i = this.dayStart; i <= this.dayEnd; i++){
				ret.push(`${i}:00`);
			}
			return ret;
		},
		getBias(){
			const column = document.querySelectorAll(".day__lines-item")[1];
			const columnHeight = column.offsetHeight;
			const ret = this.remap(this.getEncodedTime, this.dayStart*60, this.dayEnd*60, 0, (this.dayEnd-this.dayStart)*columnHeight)
			return ret
		},
		isNeedToShowMark(index){
			return index == this.getDay && this.getHours >= this.dayStart && this.getHours <= this.dayEnd
		},
		...mapGetters(["getTime", "getDay", "getEncodedTime", "getHours"])
	},
	methods: {
		remap(value, low1, high1, low2, high2){
			return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
		}
	}
}
</script>

<style>
	.day{
		width: 300px;
		margin-bottom: 10px;
		overflow: hidden;
		padding: 10px 10px;
		border-radius: 5px;
		box-shadow: 0px 0px 0px 1px rgba(0,0,0,.0);
		transition: box-shadow .1s ease;
	}
	.day:hover{
		box-shadow: 0px 0px 0px 1px rgba(0,0,0,.2);
	}
	.day__title{
		margin-bottom: 5px;
		text-align: center;
		font-weight: bold;
		font-size: 1rem;
	}
	.day__content{
		padding-top: 10px;
		display: flex;
	}
	.day__time-column{
		position: relative;
		margin-right: 5px;
	}
	.day__time-item{
		text-align: right;
		font-size: .8rem;
		position: relative;
		top: -10px;
		user-select: none;
	}
	.day__lines-item{
		border-top: 1px solid lightgray;
	}
	.day__lines-column{
		flex-grow: 1;
		padding-left: 5px;
		position: relative;
	}
	.time__row:not(:last-child){
		height: 30px;
	}
	.day__time-item--current{
		position: absolute;
		color: red;
		font-weight: bold;
		right: 0;
		background-color: rgba(255,255,255,.5);
		z-index: 1;
		font-size: .85rem;
	}
	.day__lines-item--current{
		width: 100%;
		height: 2px;
		background: red;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: 1;
	}

	.day__time-current{
		/* transform: translateY(); */
		transition: transform .1s linear;
	}

	.day__lines-item--current::before{
		content: '';
		width: 10px;
		height: 10px;
		background: red;
		position: absolute;
		left: 0;
		top: 0;
		transform: translateY(-50%);
		border-radius: 50%;
	}
</style>