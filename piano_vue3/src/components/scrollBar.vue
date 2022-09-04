<template>
	<div>rate :{{ props.rate }}</div>
	<div class="rc scroll-width" ref="scroll">
		<div class="child-width"></div>
	</div>
	<slot :cc='scrollBarValue'></slot>
</template>
<script lang='ts'>
import { popScopeId, ref } from 'vue';
import { onMounted } from 'vue';
export default {
	name: 'scrollbar',
	emits:['valueChanged'],
	props:{
		rate: { type: Number, required: true }
	},
	setup(props: any, { emit }: any) {
		let scroll = ref();
		let scrollBarValue = ref();
		console.log(emit);
		onMounted(() => {
			console.log(props);
			scroll.value.addEventListener('scroll', (e: Event) => {
				scrollBarValue.value = scroll.value.scrollLeft;
				emit('valueChanged', scrollBarValue);
			})

		})

		return { props, scroll, scrollBarValue };
	}
}
</script>

<style lang="less">
.scroll-width {
	@parent-width: 300px;
	overflow: auto;
	width: @parent-width;

	.child-width {
		width: @parent-width * 11;
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
