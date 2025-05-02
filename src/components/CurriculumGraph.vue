<template>
  <div class="layout">
    <div class="graph-wrapper" @click="selectedCourse = null">
      <div class="grid" id="curriculum">
        <ArrowLines
  :arrows="arrowPositions"
  :highlighted-ids="[hoveredCourseId, ...Object.keys(hoverColors)]"
/>
        <div
          v-for="course in curriculum"
          :key="course.id"
          class="course-node"
          :style="{
            gridColumn: course.term,
            gridRow: course.row || 'auto',
            position: 'relative'
          }"
          @click.stop="selectCourse(course)"
        >
        <CourseNode
          :course="course"
          :mode="mode"
          :highlighted-id="hoveredCourseId"
          :color-level="hoverColors[course.id] || 0"
          :dimmed="hoveredCourseId && course.id !== hoveredCourseId && !hoverColors[course.id]"
          @hover="onHover"
          @leave="clearHover"
        />
          <div v-if="selectedCourse?.id === course.id" class="popup-below">
            <h4>{{ course.label }}</h4>
            <p><strong>Units:</strong> {{ course.units }}</p>
            <p><strong>Type:</strong> {{ course.type }}</p>
            <p><strong>Frequency:</strong> {{ course.frequency }}</p>
            <div v-if="course.metrics">
              <p><strong>Metrics:</strong></p>
              <ul>
                <li>Blocking: {{ course.metrics.blocking }}</li>
                <li>Delay: {{ course.metrics.delay }}</li>
                <li>Complexity: {{ course.metrics.complexity }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <SidebarKey
      class="sidebar-fixed"
      :mode="mode"
      @update:mode="mode = $event"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import CourseNode from './CourseNode.vue';
import ArrowLines from './ArrowLines.vue';
import SidebarKey from './SidebarKey.vue';
import curriculumData from '../assets/curriculum.json';

const curriculum = ref([]);
const arrowPositions = ref([]);
const selectedCourse = ref(null);
const hoveredCourseId = ref(null);
const hoverColors = ref({});
const mode = ref('none');

function computeArrows() {
  arrowPositions.value = curriculum.value.flatMap(course =>
    (course.prereqs || []).map(prereqId => ({
      from: prereqId,
      to: course.id
    }))
  );
}

function computeHoverColors(startId) {
  const levels = {};
  const visitedUp = new Set();
  const visitedDown = new Set();

  function traverseUp(id, depth = 1) {
    if (!id || visitedUp.has(id)) return;
    visitedUp.add(id);

    if (id !== startId) {
      // Max 3 shades: 1 = red, 2 = light red, 3 = lighter red
      levels[id] = Math.min(depth, 3);
    }

    const course = curriculum.value.find(c => c.id === id);
    (course?.prereqs || []).forEach(pr => traverseUp(pr, depth + 1));
  }

  function traverseDown(id, depth = 1) {
    if (!id || visitedDown.has(id)) return;
    visitedDown.add(id);

    const dependents = curriculum.value.filter(c => (c.prereqs || []).includes(id));
    for (const dep of dependents) {
      // 11 = dark blue, 12 = medium blue, 13 = light blue
      levels[dep.id] = 10 + Math.min(depth, 3);
      traverseDown(dep.id, depth + 1);
    }
  }

  traverseUp(startId);
  traverseDown(startId);

  return levels;
}


function onHover(id) {
  hoveredCourseId.value = id;
  hoverColors.value = computeHoverColors(id);
}

function clearHover() {
  hoveredCourseId.value = null;
  hoverColors.value = {};
}

function selectCourse(course) {
  selectedCourse.value =
    selectedCourse.value?.id === course.id ? null : course;
}

onMounted(() => {
  curriculum.value = curriculumData;
});

watch(curriculum, computeArrows, { deep: true, immediate: true });
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

#curriculum {
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  grid-auto-rows: minmax(6rem, auto);
  gap: 0.5rem;
  position: relative;
  padding: 2rem 2rem 2rem 0;
  overflow: visible;
}

.course-node {
  position: relative;
  overflow: visible;
}

.sidebar-fixed {
  width: 100;
  min-width: 100;
  max-width: 100;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  font-size: 0.75rem;
}

.popup-below {
  position: absolute;
  top: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  padding: 0.6rem;
  font-size: 0.75rem;
  z-index: 10;
  pointer-events: auto;
}

.popup-below h4 {
  margin-bottom: 0.4rem;
  font-size: 0.8rem;
  font-weight: bold;
}

.popup-below p {
  margin: 0.2rem 0;
}

.popup-below ul {
  padding-left: 1rem;
  margin: 0.3rem 0 0 0;
}
</style>
