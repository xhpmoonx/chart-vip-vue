<template>
  <div class="layout">
    <div class="graph-wrapper">
      <div class="controls">
        <MetricDropdown v-model:mode="mode" />
      </div>

      <div class="grid" id="curriculum">
  <ArrowLines :arrows="arrowPositions" /> 
  <div
    v-for="course in curriculum"
    :key="course.id"
    class="course-node"
    :style="{
      gridColumn: course.term,
      gridRow: course.row || 'auto',
      position: 'relative',
      zIndex: 1
    }"
  >
  <CourseNode
  :course="course"
  :mode="mode"
  :highlighted-id="highlightedId"
  @hover="onHover"
  @leave="clearHighlights"
  @select="selectCourse"
/>
  </div>
</div>

    </div>

    <SidebarKey class="sidebar-fixed" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import CourseNode from './CourseNode.vue';
import ArrowLines from './ArrowLines.vue';
import MetricDropdown from './MetricDropdown.vue';
import SidebarKey from './SidebarKey.vue';
import curriculumData from '../assets/curriculum.json';

const curriculum = ref([]);
const arrowPositions = ref([]);
const highlightedId = ref(null);
const selectedCourse = ref(null);
const mode = ref('none');

function computeArrows() {
  arrowPositions.value = curriculum.value.flatMap(course => {
    return (course.prereqs || []).map(prereqId => ({
      from: prereqId,
      to: course.id
    }));
  });
}

onMounted(() => {
  curriculum.value = curriculumData;
});

watch(curriculum, () => {
  computeArrows();
}, { deep: true, immediate: true });

function getMetricClass(course) {
  if (!course.metrics || mode.value === 'none') return '';
  const { blocking, delay, complexity } = course.metrics;
  if (mode.value === 'blocking' && blocking >= 6) return 'high-blocking';
  if (mode.value === 'delay' && delay >= 4) return 'high-delay';
  if (mode.value === 'complexity' && complexity >= 8) return 'high-complexity';
  return '';
}

function getStateClass(id) {
  return id === highlightedId.value ? 'active' : '';
}

function onHover(id) {
  highlightedId.value = id;
}

function clearHighlights() {
  highlightedId.value = null;
}

function selectCourse(course) {
  selectedCourse.value = course;
}
</script>

<style scoped>
.layout {
  display: flex;
  width: 100%;
  height: 100vh;
  overflow: hidden;
}

.graph-wrapper {
  flex: 1;
  overflow: auto;
  position: relative;
  font-family: sans-serif;
  background-color: #fff;
}

.controls {
  padding: 1rem;
  display: flex;
  justify-content: flex-start;
}

#curriculum {
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px); 
  grid-auto-rows: minmax(6rem, auto);             
  gap: 1rem;
  position: relative;
  padding: 2rem;
}

.course-node {
  position: relative;
}

.sidebar-fixed {
  width: 240px;
  min-width: 240px;
  max-width: 240px;
  padding: 1rem;
  background-color: #f9fafb;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
}
</style>
