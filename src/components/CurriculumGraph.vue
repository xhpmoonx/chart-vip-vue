<template>
  <div class="layout">
    <div class="graph-wrapper">
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
const highlightedId = ref(null);
const selectedCourse = ref(null);
const mode = ref('none');

function computeArrows() {
  arrowPositions.value = curriculum.value.flatMap(course =>
    (course.prereqs || []).map(prereqId => ({
      from: prereqId,
      to: course.id
    }))
  );
}

onMounted(() => {
  curriculum.value = curriculumData;
});

watch(curriculum, computeArrows, { deep: true, immediate: true });

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
  width: 90;
  min-width: 90;
  max-width: 90;
  padding: 0.5rem;
  background-color: #f9fafb;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  font-size: 0.75rem;
}
</style>
