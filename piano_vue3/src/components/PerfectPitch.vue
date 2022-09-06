<template>
	<div class="statistic-container">
		<span class='statistic-panel'>Completed: {{completed}}</span>
		<span class='statistic-panel'>错误: {{errorCnt}}</span>
		<span class='statistic-panel'>Score: {{ScorePercent}} %</span>
		<span class='statistic-panel'>时间: {{elapsedTime}} sec</span>
		<span class='statistic-panel'>Avg time: {{completed}} sec</span>
	</div>
	<button @click="hearAgain" class="control-item">Hear Again</button>
	<button v-show="passNext" @click="nextNote" class="next control-item ">Hear Next</button>
	<div class="key-note-container">
		<button @click="keyNoteClick(index + 1)" v-for="(i,index) in plainKeyName" :key="i" :id="String(index + 1)">{{i}}</button>
	</div>
	<div class="control-panel">
		<button class="control-item" v-text="!isStarted? 'Start Quiz': 'Stop Quiz'" @click="startNewTest"></button>
	</div>
</template>

<script setup lang = 'ts'>
	import { emit } from 'process';
	import { ref } from 'vue';
	import Global from '../common-js/Global';
	class rand {
		public seed;
		public be;
    constructor() {
      this.seed =Date.now() % 999999999;
      this.be = 0;
    }

    // 取一个随机整数 max=最大值（0开始，不超过该值） 默认10
    next(max: number) {
      max = max || 0;
      this.seed = (this.seed * 9301 + 49297) % 233280;
      let val = this.seed / 233280.0;
      return Number((val * max).toFixed(this.be));
    }
  }

  const random = new rand();

	let completed = ref(0);
	let errorCnt = ref(0);
	let ScorePercent = ref(0);
	let plainKeyName = Global.PlainKeyName;
	let isStarted = ref(false);
	let elapsedTime = ref(0);
	let passNext = ref(true);

	let toVolumn = ref(100);
	let currentNoteInfo = {
		ansIndex:0,
		absNoteIndex: 0,
	}
	let flatNoteAllKey = Global.KeyNoteFullPath.flat();
	
	setInterval(()=>{
		if(isStarted.value){
			elapsedTime.value += 1
		}
	},1000)
	function hearAgain(){
		if(isStarted.value){
			console.log(flatNoteAllKey[currentNoteInfo.ansIndex]);
			console.log(currentNoteInfo.absNoteIndex,currentNoteInfo.ansIndex);
			emits('wantPlay', flatNoteAllKey[currentNoteInfo.ansIndex])
		}
	}
	function nextNote(){
		passNext.value = false;
	}
	const emits = defineEmits(['wantPlay'])
	function startNewTest(){
		if(isStarted.value){
			elapsedTime.value=0
		}else{
			currentNoteInfo.ansIndex = random.next(35) + 12 ;
			currentNoteInfo.absNoteIndex = (currentNoteInfo.ansIndex ) % 12 + 1;
			emits('wantPlay', flatNoteAllKey[currentNoteInfo.ansIndex])
		}
		isStarted.value=!isStarted.value;
	}
	function keyNoteClick(e: number){
		console.log(e);
		if(isStarted.value){
			if(e === currentNoteInfo.absNoteIndex){
				console.log("yes");
				completed.value += 1;
				currentNoteInfo.ansIndex = random.next(35) + 12 ;
				currentNoteInfo.absNoteIndex = (currentNoteInfo.ansIndex ) % 12 + 1;
				emits('wantPlay', flatNoteAllKey[currentNoteInfo.ansIndex])
			}else{
				errorCnt.value += 1;
			}
			ScorePercent.value = completed.value / (completed.value + errorCnt.value) * 100
		}
	}
</script>

<style lang="less">
	.next{
		background-color: rgb(117, 248, 139) !important ;
		color: white !important;
		font-weight: 400;
		font-family: 'Josefin Sans',
			sans-serif;
		white-space: nowrap;
		text-decoration-thickness: auto;
	}

	.control-item{
		background-color: rgb(239, 240, 240);
		color: rgb(90, 90, 90);
	}
	.statistic-container{
		display: flex;
		width:80%;
		justify-content: space-evenly;
		align-items: center;
		align-content: space-around;
		flex-flow: row ;
		.statistic-panel{
			background-color: #5bc0de;
			color: aliceblue;
			padding: 0.5em;
			border-radius: 5px;
			font-size: 75%;
			font-weight: 700;
			white-space: nowrap;
		}
	}
	.key-note-container{
		display: flex;
		width: 275px;
		height: 140px;
		justify-content: space-evenly;
		flex-flow: row wrap;
		align-items: center;
		align-content: space-around;
		.key-note{

		}
	}
</style>