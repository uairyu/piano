<script setup lang="ts">
  import {onMounted, ref, reactive} from 'vue';
  import ScrollBar from './components/scrollBar.vue';
  let audio = new Audio('/bravest.mp3');
  let scrollBarValue = ref();
  let kk = ref();
  function ff(): void{
    audio.play();
  }
  let volume = 100;
  setInterval(()=>{
      volume = audio.volume.valueOf();
  }, 300)

  onMounted(() => {

  })
function getRate( newValue: any): void{
    
    kk.value = newValue.value;
  }
</script>

<template>
  <ScrollBar :rate='10' v-slot="kk" @valueChanged='getRate'>
  </ScrollBar>
  <p>heh kk: {{kk}}</p>
  <h1>{{volume}}</h1>
  <p>scroll value{{ scrollBarValue }}</p>
  <audio controls>
    <source src='/bravest.mp3' type='audio/mpeg'>
  </audio>
  <button @click="ff"> click </button>
</template>

<style lang='less'>

</style>
