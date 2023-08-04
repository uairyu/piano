<script setup lang="ts">
  import {onMounted, ref, reactive, markRaw, shallowRef} from 'vue';
  import ScrollBar from './components/scrollBar.vue';
  import PerfectPitchComponent from './components/PerfectPitch.vue'
  import KeyGroup from './components/KeyGroup.vue';
  import IntervalComponent from '@/components/Interval.vue';
  import ComplexToneComponent from '@/components/ComplexTone.vue';
  let kk = ref();
  let volume = ref(100);
  const keyGroup = ref()

  function getRate(newValue: number): void{
    volume.value = Number((newValue*100 + '').substring(0,5));
  }
  function wantPlay(noteFullPath:string): any;
  function wantPlay(noteFullPath: any){
    if(typeof noteFullPath ==='string' ){
      keyGroup.value.controlPlay([noteFullPath]);
    }else{
      keyGroup.value.controlPlay(noteFullPath);
    }
  }
  let tabComp = shallowRef(null);

  let tabNameClick = function(o: any){
    tabComp.value = o
  }
  let isHideKeyboard = ref(false)
  function hideKeyboard(){
    isHideKeyboard.value = isHideKeyboard.value == true? false: true;
  }
</script>

<template>
  <button @click="hideKeyboard">Hide Keyboard</button>
  <KeyGroup v-show="isHideKeyboard" :controlVolume="volume" ref="keyGroup"></KeyGroup>
  <br/>
  <ScrollBar :initRate="1.5" :maxRate="4" v-slot="kk" @valueChanged="getRate"></ScrollBar>
  <p>volume{{volume}}</p>
  <div>
    <button @click="tabNameClick(PerfectPitchComponent)" id="PerfectPitch">Perfect Pitch</button>
    <button @click="tabNameClick(ComplexToneComponent)" id="Complextone">Complex Tone</button>
    <button @click="tabNameClick(IntervalComponent)" id="Interval">Interval</button>
    <component :is="tabComp" @wantPlay = "wantPlay"></component>
  </div>
  <!-- <PerfectPitch @wantPlay="wantPlay"></PerfectPitch> -->
  <!-- <Interval @wantPlay="wantPlay"></Interval> -->
</template>

<style lang='less'>
</style>
