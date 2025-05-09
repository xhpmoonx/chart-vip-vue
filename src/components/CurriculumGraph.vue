<template>
  <div class="layout">
    <div class="graph-wrapper" @click="selectedCourse = null">
      <div class="grid" id="curriculum">
        <ArrowLines
          :arrows="filteredArrows"
          :highlighted="highlightedArrows"
          :highlighted-ids="[hoveredCourseId, ...Object.keys(hoverColors)]"
          :line-mode="lineMode"
        />
        <!-- TERM HEADERS -->
        <div
          v-for="term in termNumbers"
          :key="'header-' + term"
          class="term-header"
          :style="{ gridColumn: term, gridRow: 1 }"
          >
          Term {{ term }}
        </div>

        <!-- COMPLEXITY FOOTERS -->
        <div
          v-for="term in termNumbers"
          :key="'footer-' + term"
          class="term-footer"
          :style="{ gridColumn: term, gridRow: maxRow + 1 }"
          >
          Avg. Complexity: {{ getAverageComplexity(term) }}
        </div>

        <div
          v-for="course in curriculum"
          :key="course.id"
          class="course-node"
          :style="{ gridColumn: course.term, gridRow: course.row || 'auto' }"

          @click.stop="selectCourse(course)"
        >
        <CourseNode
          :course="course"
          :mode="mode"
          :highlighted-id="hoveredCourseId"
          :color-level="hoverColors[course.id] || 0"
          :dimmed="hoveredCourseId && course.id !== hoveredCourseId && !hoverColors[course.id]"
          :highlight-dfw="highlightDFW" 
          @hover="onHover"
          @leave="clearHover"
        />
          <div v-if="selectedCourse?.id === course.id" class="popup-below">
            <h4>{{ course.label }} <span v-if="course['waiting list'] > 20">⚠</span></h4>
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
              <p v-if="course.metrics?.dfwRate !== undefined">
              <strong>DFW Rate:</strong> {{ (course.metrics.dfwRate * 100).toFixed(1) }}%
            </p>
            <p><strong>Waiting List:</strong> {{ course["waiting list"] }}</p>
            <p><strong>Equity Gap:</strong> {{ course["equity gap"] ? 'Yes' : 'No' }}</p>

            </div>
          </div>
        </div>
      </div>
    </div>
    <SidebarKey
  class="sidebar-fixed"
  :mode="mode"
  :line-mode="lineMode"
  @update:mode="mode = $event"
  @update:lineMode="lineMode = $event"
  @update:highlightDFW="highlightDFW = $event"

/>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import CourseNode from './CourseNode.vue';
import ArrowLines from './ArrowLines.vue';
import SidebarKey from './SidebarKey.vue';
import curriculumData from '../assets/curriculum.json';
import { findLongestPaths } from '../utils/graph.js';

const curriculum = ref([]);
const arrowPositions = ref([]);
const selectedCourse = ref(null);
const hoveredCourseId = ref(null);
const hoverColors = ref({});
const mode = ref('units');
const lineMode = ref('all');
const highlightDFW = ref(false);

const longestPath = computed(() => {
  return findLongestPaths(curriculum.value);
});
const highlightedArrows = computed(() => {
  return longestPath.value.slice(0, -1).map((fromId, i) => ({
    from: fromId,
    to: longestPath.value[i + 1],
    longest: true
  }));
});

const termNumbers = computed(() => {
  return [...new Set(curriculum.value.map(c => parseInt(c.term)))].sort((a, b) => a - b);
});

const maxRow = computed(() => {
  const rows = curriculum.value.map(c => parseInt(c.row) || 1);
  return Math.max(...rows);
});

function getAverageComplexity(term) {
  const courses = curriculum.value.filter(c => c.term == term && c.metrics?.complexity);
  if (!courses.length) return '-';
  const total = courses.reduce((sum, c) => sum + c.metrics.complexity, 0);
  return (total / courses.length).toFixed(1);
}
function computeArrows() {
  arrowPositions.value = curriculum.value.flatMap(course => {
    return (course.prereqs || []).map(prereqId => {
      const fromId = typeof prereqId === 'object' ? prereqId.id : prereqId;
      const fromCourse = curriculum.value.find(c => c.id === fromId);
      const dfwRate = fromCourse?.metrics?.dfwRate ?? 0;

      return {
        from: fromId,
        to: course.id,
        dfwRate: dfwRate
      };
    });
  });
}

const filteredArrows = computed(() => {
  if (lineMode.value === 'high') {
    return arrowPositions.value.filter(a => a.dfwRate >= 0.3);
  }
  if (lineMode.value === 'normal') {
    return arrowPositions.value.filter(a => a.dfwRate < 0.3);
  }
  return arrowPositions.value; // All lines
});




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

    console.log('Longest path:', longestPath.value);
    console.log('Highlighted arrows:', highlightedArrows.value);
     
});

watch(curriculum, computeArrows, { deep: true, immediate: true });
</script>

<style scoped>
.layout {
  display: flex;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
.graph-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  background-color: #fff;
}


#curriculum {
  width: 90%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 180px);
  grid-auto-rows: minmax(6rem, auto);
  gap: 0.5rem;
  position: relative;
  padding: 2rem 2rem 2rem 0;
}


.course-node {
  position: relative;
  overflow: visible;
}
.sidebar-fixed {
  width: 240px;
  flex-shrink: 0;
  height: 100vh;
  overflow-y: auto;
  background-color: #f9fafb;
  border-left: 1px solid #e5e7eb;
  padding: 1rem;
  padding-right: 1.5rem; 
  margin-right: 40px; 
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
.term-header {
  font-size: 0.75rem;
  font-weight: bold;
  text-align: center;
}

.term-footer {
  font-size: 0.7rem;
  color: #4b5563;
  text-align: center;
}

</style>
