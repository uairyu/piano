<template>
  <div>
    <button @click="changeStyle('./note/', 0)" :style="styleList[activeStyleIndex[0]]">style1</button>
    <button @click="changeStyle('./note1/', 1)" :style="styleList[activeStyleIndex[1]]">style2</button>
    <div class="key-container1">
      <div style="position: relative" v-for="i in 5">
        <div v-for="(item, index) in 2" :style="{ left: blackPos[index] + 'px' }" class='white-key' :ref="processBlackEl">
        </div>
        <div v-for='(item, index) in 3' class='black-key' :ref="processWhiteEl"></div>
        <div v-for="(item, index) in 3" :style="{ left: blackPos[index + 2] + 'px' }" class='white-key'
          :ref="processBlackEl">
        </div>
        <div v-for='(item, index) in 4' class='black-key' :ref="processWhiteEl"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Global from "../common-js/Global";
import { computed, reactive, ref } from "vue";
export default {
  props:{
    controlVolume:{type: Number, required: true}
  },
  name: "KeyGroup",
  setup(props: any , { emit }: any) {
    let keyMapWhite = [
      'C2.ogg', 'D2.ogg', 'E2.ogg', 'F2.ogg', 'G2.ogg', 'A2.ogg', 'B2.ogg', 'C3.ogg', 'D3.ogg', 'E3.ogg', 'F3.ogg', 'G3.ogg', 'A3.ogg', 'B3.ogg', 'C4.ogg', 'D4.ogg', 'E4.ogg', 'F4.ogg', 'G4.ogg', 'A4.ogg', 'B4.ogg', 'C5.ogg', 'D5.ogg', 'E5.ogg', 'F5.ogg', 'G5.ogg', 'A5.ogg', 'B5.ogg', 'C6.ogg', 'D6.ogg', 'E6.ogg', 'F6.ogg', 'G6.ogg', 'A6.ogg', 'B6.ogg', 'C7.ogg',
    ]
    let keyMapBlack = [
      'D2b.ogg', 'E2b.ogg', 'G2b.ogg', 'A2b.ogg', 'B2b.ogg', 'D3b.ogg', 'E3b.ogg', 'G3b.ogg', 'A3b.ogg', 'B3b.ogg', 'D4b.ogg', 'E4b.ogg', 'G4b.ogg', 'A4b.ogg', 'B4b.ogg', 'D5b.ogg', 'E5b.ogg', 'G5b.ogg', 'A5b.ogg', 'B5b.ogg', 'D6b.ogg', 'E6b.ogg', 'G6b.ogg', 'A6b.ogg', 'B6b.ogg',
    ]
    let map: any = {}
    const maxVolumn = 4

    let audioCtx:AudioContext = new AudioContext();

    function getData(name: string){
      if(map[name] === undefined){
        fetch(name).then(r=>  {
          r.arrayBuffer().then(r2=>{
            let decodeData = audioCtx.decodeAudioData(r2);
            decodeData.then(audioBuffer =>{
              map[name]=audioBuffer;
            })
          })
        })
      }
    }
    function play(audioBuffer: AudioBuffer){
      let bufferNode: AudioBufferSourceNode = audioCtx.createBufferSource();
      let gainNode = audioCtx.createGain();
      bufferNode.buffer = audioBuffer;
      // bufferNode.connect(audioCtx.destination)

      gainNode.gain.value = Math.min(props.controlVolume, maxVolumn);
      bufferNode.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      bufferNode.start(0, 0);
    }
    const notePath = computed(()=>Global.KeyNotePath.value);
    function changeStyle(path: string, index: number){
      if(activeStyleIndex[index] !== 1){
        Global.KeyNotePath.value = path;
        activeStyleIndex[index] ^= 1;
        activeStyleIndex[index ^ 1] ^= 1;
      }
    }
    function controlPlay(fullPath: string){
      play(map[fullPath])
    }
    let blackPos = [13, 43, 82, 111, 140];
    let iterWhite = 0, iterBlack = 0;
    function processWhiteEl(el: HTMLElement) {
      if(!el){
        return
      };
      if(el && el.id === ""){
        el.id = iterWhite + '';
        iterWhite++;
      }
      // console.log(newLocal);
      const newLocal = notePath.value + keyMapWhite[Number(el.id)];
      getData(newLocal);
      el.onclick = el.onclick? el.onclick: (ev) =>{
        play(map[notePath.value + keyMapWhite[Number(el.id)]]);
      }
    }

    function processBlackEl(el: HTMLElement) {
      if(!el){
        return
      };
      if (el && el.id === "") {
        el.id = iterBlack + '';
        iterBlack++;
      }
      const newLocal = notePath.value + keyMapBlack[Number(el.id)];
      // console.log(newLocal);
      getData(newLocal);
      el.onclick = (ev) => {
        play(map[newLocal]);
      }
    }
    let styleList = [
      {
        backgroundColor: 'grey',
        color: 'aliceblue'
      },
      {
        backgroundColor: 'green',
        color: 'aliceblue'
      },
    ]
    let activeStyleIndex = reactive([0,1]);
    return {styleList, activeStyleIndex, changeStyle, processWhiteEl, processBlackEl, blackPos, controlPlay };
  },
};
</script>

<style lang="less">
@width: 20px;

.key-container1 {
  width: 1000px;
  height: 150px;
  background-color: rgb(92, 87, 86);
  display: flex;
  // justify-content: ;
}

.white-key {
  &:hover {
    background-color: darkgray;
  }

  width: @width;
  height:75px;
  top: 0;
  background-color: black;
  // margin-left: 4px;
  // margin-right: 4px;
  position: absolute;
  display: inline-block;
}

.black-key {
  &:hover {
    background-color: darkgray;
  }

  width: @width;
  height:150px;
  background-color: rgb(209, 205, 205);
  margin-left: 4px;
  display: inline-block;
}
</style>
