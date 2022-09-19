<script setup lang="ts">
  import {onMounted, ref, reactive, markRaw, shallowRef} from 'vue';
  import ScrollBar from './components/scrollBar.vue';
  import PerfectPitch from './components/PerfectPitch.vue'
  import KeyGroup from './components/KeyGroup.vue';
  import Interval from '@/components/Interval.vue';
  let kk = ref();
  let volume = ref(100);
  const keyGroup = ref()
  function getRate(newValue: number): void{
    volume.value = Number((newValue*100 + '').substring(0,5));
  }
  function wantPlay(noteFullPath:string){
    keyGroup.value.controlPlay(noteFullPath);

  }
  let tabComp = shallowRef(null);

  let tabNameClick = function(o: any){
    tabComp.value = o
  }
</script>

<template>
  <KeyGroup :controlVolume="volume" ref="keyGroup"></KeyGroup>
  <br/>
  <ScrollBar :initRate="1.5" :maxRate="4" v-slot="kk" @valueChanged="getRate"></ScrollBar>
  <p>volume{{volume}}</p>
  <div>
    <button @click="tabNameClick(PerfectPitch)" id="PerfectPitch">Perfect Pitch</button>
    <button @click="tabNameClick(Interval)" id="PerfectPitch">Interval</button>
    <component :is="tabComp" @wantPlay = "wantPlay"></component>
  </div>
  <!-- <PerfectPitch @wantPlay="wantPlay"></PerfectPitch> -->
  <!-- <Interval @wantPlay="wantPlay"></Interval> -->
</template>

<style lang='less'>
</style>
