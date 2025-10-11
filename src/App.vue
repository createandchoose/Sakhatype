<!-- App.vue -->
<template>
  <div id="app">
    <TypingTest />
  </div>
</template>

<script setup>
import TypingTest from './components/TypingTest.vue';
</script>

<style>
@font-face {
    font-family: 'Benzin-Bold';
    src: url('fonts/Benzin-Bold.woff2') format('opentype');
    font-weight: bold;
}
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  background: #ffffff;
  color: #000000;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}
</style>