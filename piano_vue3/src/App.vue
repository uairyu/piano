<script setup lang="ts">
  import {onMounted, ref, reactive} from 'vue';
  import ScrollBar from './components/scrollBar.vue';
  import PerfectPitch from './components/PerfectPitch.vue'
  import KeyGroup from './components/KeyGroup.vue';
  import { emit } from 'process';
  let kk = ref();
  let volume = ref(100);
  const keyGroup = ref()
  function getRate(newValue: number): void{
    volume.value = Number((newValue*100 + '').substring(0,5));
  } 
  function wantPlay(noteFullPath:string){
    keyGroup.value.controlPlay(noteFullPath);
    
  }
  console.log('vvcv');
  
</script>
 
<template>
  <KeyGroup :controlVolume="volume" ref="keyGroup"></KeyGroup>
  <ScrollBar :initRate="4" :maxRate="4" v-slot="kk" @valueChanged="getRate"></ScrollBar>
  <p>volume{{volume}}</p>
  <PerfectPitch @wantPlay="wantPlay"></PerfectPitch>
</template>

<style lang='less'>
  .asda{

  }
</style>
