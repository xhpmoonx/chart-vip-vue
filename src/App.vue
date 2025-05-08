<template>
  <div class="layout">
    <CurriculumGraph />
  </div>
</template>

<script>
import CurriculumGraph from './components/CurriculumGraph.vue';

export default {
  components: {
    CurriculumGraph
  }
};
</script>

<style>
.layout {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  font-family: sans-serif;
  background-color: #f9fafb;
}
html, body {
  overflow-x: hidden;
  margin: 0;
  padding: 0;
}

</style>
