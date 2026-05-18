<script setup lang="ts">
import { TresCanvas } from "@tresjs/core"
import Globe from "./components/Globe.vue";
import {  OrbitControls } from "@tresjs/cientos";
</script>

<template>
  <TresCanvas window-size antialias clear-color="#040d21">
    <TresPerspectiveCamera :position="[ 0, 0, 400 ]" >
      <TresAmbientLight :color="0xbbbbbb" :intensity="1" />
      <TresDirectionalLight :color="0xffffff" :intensity="8" :position="[ -800, 2000, 400 ]" />
      <TresDirectionalLight :color="0xffffff" :intensity="10" :position="[ -200, 500, 200 ]" />
      <TresPointLight :color="0x7982f6" :intensity="50" :position="[ -200, 500, 200 ]" />
    </TresPerspectiveCamera>
    <Globe />
    <OrbitControls
      :enableDamping="true"
      :dampingFactor="0.01"
      :enablePan="false"
      :min-distance="200"
      :max-distance="500"
      :rotate-speed="0.8"
      :zoom-speed="1"
      :auto-rotate="true" 
      :min-polar-angle="Math.PI / 3.5"
      :max-polar-angle="Math.PI - Math.PI / 3"
    />
  </TresCanvas>
</template>

<style scoped>
html,
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}
#app {
  height: 100%;
  width: 100%;
}
</style>