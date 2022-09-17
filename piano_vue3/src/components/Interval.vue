<template>
	<div class="statistic-container">
		<span class='statistic-panel'>Completed: {{completed}}</span>
		<span class='statistic-panel'>错误: {{errorCnt}}</span>
		<span class='statistic-panel'>Score: {{ScorePercent}} %</span>
		<span class='statistic-panel'>时间: {{elapsedTime}} sec</span>
		<span class='statistic-panel'>Avg time: {{avgTime}} sec</span>
			</div>
			<button @click="hearAgain" class="control-item" v-show="isStarted">Hear Again</button>
			<button v-show="passNext && isStarted" @click="nextNote" class="next control-item ">Hear Next</button>
			<div class="key-note-container">
				<button v-show="keyNoteOptionStatus[index] === 0" :style="keyNoteCssFunc(index)" @click="keyNoteClick(index + 1)"
		v-for="(i,index) in plainKeyName" :key="i" :id="String(index + 1)">{{i}}</button>
	</div>
	<div class="control-panel">
		<button class="control-item" v-text="!isStarted? 'Start Quiz': 'Stop Quiz'" @click="startNewTest"></button>
		<div>
			<span>from</span>
			<select v-model.number="range[0]">
				<option>2</option>
				<option>3</option>
				<option>4</option>
				<option>5</option>
				<option>6</option>
			</select>
			<span>to</span>
			<select v-model.number="range[1]">
				<option>2</option>
				<option>3</option>
				<option>4</option>
				<option>5</option>
				<option>6</option>
			</select>
			<span>Speed</span>
			<select v-model="speed">
				<option style="width: 30px" v-for="(i, index) in speedList" :key="index">{{i}}</option>
			</select>
		</div>
		<div>
			<span style=" display: block">Option</span>
			<button :style="keyNoteCssFunc(index + 100)" @click="keyNoteOptionClick(index)" v-for="(i,index) in plainKeyName"
				:key="i" :id="String('open' + (index + 1))">{{i}}</button>
		</div>
	</div>
</template>

<script setup lang = 'ts'>
	import { computed, reactive, ref } from 'vue';
	import Global from '../common-js/Global';
	class rand {
		public seed;
		public be;
    constructor() {
      this.seed =Date.now() % 999999999;
      this.be = 0;
		}
		//生成 min<= x <max
		public next(min: number, max?: number):number {
			if(max === undefined){
				max = min;
				min = 0;
			}
      this.seed = (this.seed * 9301 + 49297 + Date.now() % 999999999) % 233280;
      let val = this.seed / 233280.0;
			return Math.ceil(Number(val * (max - min )) + min - 1);
    }
  }

  const random = new rand();

	let completed = ref(0);
	let errorCnt = ref(0);
	let ScorePercent = computed(()=> Math.ceil(completed.value / (completed.value + errorCnt.value) * 100));
	let plainKeyName = Global.IntervalName;
	let isStarted = ref(false);
	let elapsedTime = ref(0);
	let passNext = ref(false);
	let avgTime = ref(0);
	let validNoteIndex: number[]= []
	let range: number[] = reactive([3,3])
	function resetStatistic(){
		completed.value = 0;
		errorCnt.value = 0;
		elapsedTime.value = 0;
	}
	let currentNoteInfo = {
		ansIndex:0,
		absNoteIndex: 0,
		interval: 0,
		octave: 0,
	}
	let flatNoteAllKey = computed(()=> Global.KeyNoteFullPath.value.flat());
	
	setInterval(()=>{
		if(isStarted.value){
			elapsedTime.value += 1
		}
	},1000)
	function hearAgain(){
		if(isStarted.value){
			console.log(flatNoteAllKey.value[currentNoteInfo.absNoteIndex]);
			console.log(currentNoteInfo);
			emits('wantPlay', flatNoteAllKey.value[currentNoteInfo.absNoteIndex])
			console.log(Global.IntervalName[currentNoteInfo.ansIndex]);
			setTimeout(()=>{
				emits('wantPlay', flatNoteAllKey.value[currentNoteInfo.absNoteIndex + currentNoteInfo.interval])
			}, 400 * (speedList.findIndex(x => x === speed.value) + 1))
		}
	}
	let speed = ref("slow")
	let speedList = ['fast','medium','slow','very slow']
	function genNextVoice(){
		validNoteIndex.splice(0, validNoteIndex.length)
		keyNoteOptionStatus.forEach((value, index) =>{
			if(value === 0){
				validNoteIndex.push(index)
			}
		})
		let a = random.next(validNoteIndex.length);
		let interval = validNoteIndex[a];
		currentNoteInfo.octave = 12 * (random.next(range[0], range[1] + 1) - 1)
		let firstNote = random.next(12);
		let nextAbsIndex = firstNote + currentNoteInfo.octave;
		currentNoteInfo.ansIndex = interval ;
		currentNoteInfo.absNoteIndex = nextAbsIndex;
		currentNoteInfo.interval = interval;
		hearAgain();
		
	}
	function nextNote(){
		passNext.value = false;
		keyNoteStatus.forEach((v, index)=>{
			keyNoteStatus[index] = 0
		})
		genNextVoice()
	}
	const emits = defineEmits(['wantPlay'])
	function startNewTest(){
		if(isStarted.value){
			resetStatistic()
			
			isStarted.value=!isStarted.value;
		}else{
			isStarted.value=!isStarted.value;
			genNextVoice()
		}
	}
	let keyNoteStatus = reactive([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
	let keyNoteOptionStatus = reactive([3,3,3,3,0,3,3,0,3,3,3,3,0,3,3])
	
	let keyNoteStatusCss = [
		{
			backgroundColor: 'rgb(40, 130, 207)',
			color: 'aliceblue'
		},
		{
			backgroundColor: 'green',
			color: 'aliceblue'
		},
		{
			backgroundColor: '#e92a34',
			color: 'aliceblue'
		},
		{
			backgroundColor: 'grey',
			color: 'aliceblue'
		},
	];
	let keyNoteCssFunc = function(index: number) {
		if(index >= 100){
			//Option
			return keyNoteStatusCss[keyNoteOptionStatus[index - 100]] ;
		}
		return keyNoteStatusCss[keyNoteStatus[index]] ;
	}
	function keyNoteOptionClick(index: number){
		if(keyNoteOptionStatus[index] === 3){
			keyNoteOptionStatus[index] = 0
		}else{
			keyNoteOptionStatus[index] = 3;
		}
	}
	function keyNoteClick(absIndex: number){
		console.log(absIndex);
		let index = absIndex - 1;
		if(isStarted.value){
			if(index === currentNoteInfo.ansIndex){
				keyNoteStatus[index] = 1
				completed.value += 1;
				avgTime.value = Number((elapsedTime.value / completed.value).toFixed(2))
				passNext.value = true
			}else{
				if(keyNoteStatus[index] !== 2 && passNext.value !== true){
					keyNoteStatus[index] = 2
					errorCnt.value += 1;
				}
			}
		}
	}
	let bcss = 'red';
</script>
<style lang="less" scoped>
	
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
		max-width:450px;
		justify-content: space-evenly;
		align-items: center;
		align-content: space-around;
		flex-flow: row ;
		margin:auto;
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
		padding: 10px 0;
		margin:auto;
		display: flex;
		width: 275px;
		justify-content: space-evenly;
		flex-flow: row wrap;
		align-items: center;
		align-content: space-around;
	}
</style>