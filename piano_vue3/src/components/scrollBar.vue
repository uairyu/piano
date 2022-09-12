<template>
	<div class="rc scroll-width" ref="scroll">
		<div class="child-width"></div>
	</div>
</template>
<script lang='ts'>
import { popScopeId, ref } from 'vue';
import { onMounted } from 'vue';
export default {
	name: 'scrollbar',
	emits:['valueChanged'],
	props:{
		maxRate: { type: Number},
		initRate:{type : Number}
	},
	setup(props: any, { emit }: any) {
		let scroll = ref();
		let scrollBarValue = ref();
		const maxRate = props.maxRate;
		const initRate = props.initRate;
		scrollBarValue.value = initRate;
		onMounted(() => {
			let scrollEl: HTMLElement = scroll.value;
			
			// console.log(scrollEl.offsetWidth);
			console.log(scrollEl.scrollWidth);
			scrollEl.scrollLeft = initRate / maxRate * scrollEl.scrollWidth;
			console.log(scrollEl.scrollLeft);
			function f(){
				scrollBarValue.value =  scrollEl.scrollLeft;
				emit('valueChanged', scrollBarValue.value / (scrollEl.scrollWidth - scrollEl.offsetWidth) * maxRate / 100);
			}
			f();
			scroll.value.addEventListener('scroll', (e: Event) => {
				f()
			})

		})

		return { props, scroll, scrollBarValue, maxRate };
	}
}
</script>

<style lang="less">
.scroll-width {
	@parent-width: 150px;
	overflow: auto;
	width: @parent-width;
	padding-top: 5px;
	.child-width {
		height: 1px;
		width: @parent-width * 10;
	}
}

.rc {
	height: 10px;

	&::-webkit-scrollbar {
		width: 10px;
		height: 10px;
	}

	&::-webkit-scrollbar-thumb {
		border-radius: 20px;
		background: #535353;
	}

	&::-webkit-scrollbar-track {
		border-radius: 30px;
		background: #ededed;
	}
}
</style>
