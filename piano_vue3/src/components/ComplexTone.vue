<template>
	<div class="statistic-container">
		<span class="statistic-panel">Completed: {{ completed }}</span>
		<span class="statistic-panel">错误: {{ errorCnt }}</span>
		<span class="statistic-panel">Score: {{ ScorePercent }} %</span>
		<span class="statistic-panel">时间: {{ elapsedTime }} sec</span>
		<span class="statistic-panel">Avg time: {{ avgTime }} sec</span>
	</div>
	<button @click="hearAgain" class="control-item" v-show="isStarted">Hear Again</button>
	<button v-show="passNext && isStarted" @click="nextNote" class="next control-item">
		Hear Next
	</button>
	<div class ="key-note-multicontainer">
		<div class="key-note-container"
		v-for="i in config_singleLayout? 1: (config_range[1] - config_range[0]) + 1"
		:key="i">
			<div class="scale-name">
				C{{i - 1 + config_range[0]}}
				<span v-if="config_singleLayout" v-for="j in (config_range[1] - config_range[0] ) " :key="j">
				C{{i + j + config_range[0] - 1}}
				</span>
			</div>
			<div class="key-button-layout">
				<button v-show="keyNoteOptionStatus[index] === 0"
				class="key-note"
				:style="{...keyNoteCssFunc(index, getMultiLayoutKey(String(i - 1 + config_range[0])))}"
				 @click="keyNoteClick((index + 1), getMultiLayoutKey(String(i - 1 + config_range[0])))"
				 v-for="(j, index) in plainKeyName" :key="j" :id="String(index + i + 12 * index )">
					{{ j }}
				</button>
			</div>
		</div>
		<!-- <div class="key-note-container">
			<div class="scale-name">
				C3
			</div>
			<div class="key-button-layout" >
			<button v-show="keyNoteOptionStatus[index] === 0" class="key-note" :style="{...keyNoteCssFunc(index)}"
				@click="keyNoteClick(index + 1)" v-for="(i, index) in plainKeyName" :key="i" :id="String(index + 1)">
				{{i}}
			</button>
			</div>
		</div> -->
	</div>

	<div class="control-panel">
		<button style="margin-top: 45px" class="control-item" v-text="!isStarted ? 'Start Quiz' : 'Stop Quiz'"
			@click="startNewTest"></button>
		<div>
			复音数：<select v-model.number="complextCnt">
				<option>1</option>
				<option>2</option>
				<option>3</option>
				<option>4</option>
				<option>5</option>
				<option>6</option>
				<option>7</option>
				<option>8</option>
				<option>9</option>
				<option>10</option>
			</select>
		</div>

		<div>
			<select v-model.number="config_range[0]" @change="rangeChange(0)">
				<option>2</option>
				<option>3</option>
				<option>4</option>
				<option>5</option>
				<option>6</option>
			</select>
			<select v-model.number="config_range[1]" @change="rangeChange(1)">
				<option>2</option>
				<option>3</option>
				<option>4</option>
				<option>5</option>
				<option>6</option>
			</select>
		</div>
		<div>
			<span style="display: block">Option</span>

			<span style="display: block">
				<input type="checkbox" v-model="config_autoNext" />autoNext
				<input type="checkbox" v-model="config_sameCurKeyNote" />允许相同键位
				<input type="checkbox" v-model="config_singleLayout" />单键布局
			</span>
			<button :style="keyNoteCssFunc(index + 100)" @click="keyNoteOptionClick(index)" v-for="(i, index) in plainKeyName"
				:key="i" :id="String('open' + (index + 1))">
				{{ i }}
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import Global from "../common-js/Global";
import { ref, computed, reactive } from "vue";
const emits = defineEmits(["wantPlay"]);
function resetStatistic() {
	completed.value = 0;
	errorCnt.value = 0;
	elapsedTime.value = 0;
}

function getMultiLayoutKey(keyScale: string): string{
	return 'C' + keyScale;
}
function rangeChange(leftOrRight: number) {
	console.log(config_range[0], config_range[1], leftOrRight);
	if (leftOrRight == 0 && config_range[0] > config_range[1]) {
		config_range[1] = config_range[0];
	}
	if (leftOrRight == 1 && config_range[0] > config_range[1]) {
		config_range[0] = config_range[1];
	}
	for(let i = config_range[0]; i <= config_range[1]; ++i){
		let key: string = getMultiLayoutKey(String(i));
		if(!keyNoteStatus[key]){
			keyNoteStatus[key] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		}
	}
}

function startNewTest() {
	isStarted.value = !isStarted.value;
	if (!isStarted.value) {
		resetStatistic();
	} else {
		// genNextVoice();
		nextNote()
	}
}
let keyNoteCssFunc = function (index: number, rangeKey?: string) {
	if (index >= 100) {
		//Option
		return keyNoteStatusCss[keyNoteOptionStatus[index - 100]];
	}
	let j = rangeKey? rangeKey: "";
	return keyNoteStatusCss[keyNoteStatus[j][index]];
};
function keyNoteOptionClick(index: number) {
	if (keyNoteOptionStatus[index] === 3) {
		keyNoteOptionStatus[index] = 0;
	} else {
		keyNoteOptionStatus[index] = 3;
	}
}
let successCnt = ref(0);
function keyNoteClick(keyCurIndex: number, rangeKey: string) {
	console.log(keyCurIndex);
	let index = keyCurIndex - 1;
	console.log(successCnt.value === complextCnt.value && passNext && isStarted.value);
	if (isStarted.value) {
		let absIndex = validNoteIndex[index] + ((Number(rangeKey[1])) -1) * 12;
		console.log("after cal for " + keyCurIndex + " is " + absIndex);

		let isCorrectNote =
			config_singleLayout.value ? currentNoteInfo.curNoteAnsIndex.find((item) => item === keyCurIndex)
				: currentNoteInfo.absNoteIndex.includes(absIndex);

		if (isCorrectNote) {
		// if (currentNoteInfo.curNoteAnsIndex.find((item) => item === keyCurIndex) !== undefined) {
			if (keyNoteStatus[rangeKey][index] !== 1) {
				// if (absIndex === currentNoteInfo.absNoteIndex) {
				keyNoteStatus[rangeKey][index] = 1;
				completed.value += 1;
				avgTime.value = Number((elapsedTime.value / completed.value).toFixed(2));
				successCnt.value++;
				if (successCnt.value === complextCnt.value) {
					passNext.value = true;
					if (config_autoNext.value) {
						nextNote();
					}
				}
			}
		} else {
			if (keyNoteStatus[rangeKey][index] !== 2 && passNext.value !== true) {
				keyNoteStatus[rangeKey][index] = 2;
				errorCnt.value += 1;
			}
		}
	}
}
function nextNote() {
	passNext.value = false;
	successCnt.value = 0;
	Object.entries(keyNoteStatus).forEach(([rangeKey, value]) => {
		value.fill(0, 0, value.length)
	});
	genNextVoice();
}
function genNextVoice() {
	validNoteIndex.splice(0, validNoteIndex.length);
	keyNoteOptionStatus.forEach((value, index) => {
		if (value === 0) {
			validNoteIndex.push(index);
		}
	});
	currentNoteInfo.reset();
	for (let i: number = 0; i < complextCnt.value; ++i) {
		let a = random.next(validNoteIndex.length);
		let b = 12 * (random.next(config_range[0], config_range[1] + 1) - 1);
		console.log("ab", a, b);
		let nextAbsIndex = validNoteIndex[a] + b;
		let curNoteIndex = (nextAbsIndex % 12) + 1;
		if (!config_sameCurKeyNote.value && currentNoteInfo.curNoteAnsIndex.includes(curNoteIndex)) {
			--i;
			continue;
		}
		currentNoteInfo.absNoteIndex.push(nextAbsIndex);
		currentNoteInfo.curNoteAnsIndex.push(curNoteIndex);
		console.log(flatNoteAllKey[currentNoteInfo.absNoteIndex[i]]);
		// currentNoteInfo.ansIndex = random.next(35) + 12 ;
		// currentNoteInfo.absNoteIndex = (currentNoteInfo.ansIndex ) % 12 + 1;
	}
	let tmp = currentNoteInfo.absNoteIndex.map(x => {
		return flatNoteAllKey[x];
	}
	);
	emits("wantPlay", tmp);
}
class rand {
	public seed;
	public be;
	constructor() {
		this.seed = Date.now() % 999999999;
		this.be = 0;
	}
	//生成 min<= x <max
	public next(min: number, max?: number): number {
		if (max === undefined) {
			max = min;
			min = 0;
		}
		this.seed =
			(this.seed * 9301 + 49297 + ((Date.now() * Math.random()) % 999999999)) % 233280;
		let val = this.seed / 233280.0;
		return Math.ceil(Number(val * (max - min)) + min - 1);
	}
}
interface KeyNoteStatus{
	[scaleName: string]: number[]
}
let keyNoteStatus: KeyNoteStatus = reactive({
	// 'C2': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	'C3': [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	// ...
});
let keyNoteOptionStatus = reactive([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
const random = new rand();
let complextCnt = ref(2);
let completed = ref(0);
let errorCnt = ref(0);
let ScorePercent = computed(() =>
	Math.ceil((completed.value / (completed.value + errorCnt.value)) * 100)
);
let plainKeyName = Global.PlainKeyName;
let isStarted = ref(false);
let elapsedTime = ref(0);
let passNext = ref(false);
let validNoteIndex: number[] = [];
let config_range: number[] = reactive([3, 3]);
let avgTime = ref(0);

let config_autoNext = ref(true);
let config_sameCurKeyNote = ref(false);
let config_singleLayout = ref(true)
let keyNoteStatusCss = [
	{
		backgroundColor: "rgb(40, 130, 207)",
		color: "aliceblue",
	},
	{
		backgroundColor: "green",
		color: "aliceblue",
	},
	{
		backgroundColor: "#e92a34",
		color: "aliceblue",
	},
	{
		backgroundColor: "grey",
		color: "aliceblue",
	},
];
interface CurrentNoteInfo {
	absNoteIndex: Array<number>;
	curNoteAnsIndex: Array<number>;
	reset: () => void;
}
let currentNoteInfo: CurrentNoteInfo = {
	absNoteIndex: [],
	curNoteAnsIndex: [],
	reset() {
		this.absNoteIndex.splice(0);
		this.curNoteAnsIndex.splice(0);
	},
};

function hearAgain() {
	if (isStarted.value) {
		for (let i = 0; i < complextCnt.value; ++i) {
			console.log(flatNoteAllKey[currentNoteInfo.absNoteIndex[i]]);
			console.log(
				"curNoteIndex " + currentNoteInfo.curNoteAnsIndex,
				"absNote " + currentNoteInfo.absNoteIndex
			);
			// emits("wantPlay", flatNoteAllKey[currentNoteInfo.absNoteIndex[i]]);
		}
		emits("wantPlay", currentNoteInfo.absNoteIndex.map(x => {
			return flatNoteAllKey[x];
		}
		));
	}
}
let flatNoteAllKey = Global.KeyNoteFullPath.value.flat();
// let flatNoteAllKey = computed(() => Global.KeyNoteFullPath.value.flat());
</script>

<style scoped lang="less">
.key-note-multicontainer{
	width: 100%;
	display: flex;
	flex-flow: row wrap;
	justify-content: space-evenly;
}
.key-note-container {
	@parent-width: 50%;
	@scale-width: 10%;
	@key-layout-width: @parent-width - @scale-width;
	margin: auto;
	display: flex;
	width: @parent-width;
	justify-content: space-evenly;
	flex-flow: row wrap;
	align-items: center;
	align-content: space-around;
	height: 130px;
	padding-bottom: 5px;
	.key-note {
		width: 40px;
		text-align: center;
		padding: 5px;

	}
	.key-button-layout{
		width: 100% - 2* @scale-width;
	}
	.scale-name{
		display: block;
		width: @scale-width;
		font-size: large;
		font-weight: bold;
	}
}

.statistic-container {
	display: flex;
	max-width: 450px;
	justify-content: space-evenly;
	align-items: center;
	align-content: space-around;
	flex-flow: row;
	margin: auto;

	.statistic-panel {
		background-color: #5bc0de;
		color: aliceblue;
		padding: 0px 0.5em;
		height: 20px;
		line-height: 20px;
		// vertical-align: middle;
		text-align: center;
		border-radius: 5px;
		font-size: 80%;
		font-weight: 700;
		white-space: nowrap;
	}
}
</style>
