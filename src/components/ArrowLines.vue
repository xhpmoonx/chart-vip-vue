<template>
  <svg class="arrow-canvas">
    <defs>
      <marker
        id="arrowhead"
        markerWidth="8"
        markerHeight="8"
        refX="4"
        refY="4"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L8,4 L0,8 Z" fill="#f87171" />
      </marker>
    </defs>

    <path
      v-for="(arrow, index) in positions"
      :key="index"
      :d="getPath(arrow)"
      stroke="#f87171"
      stroke-width="2"
      fill="none"
      marker-end="url(#arrowhead)"
    />
  </svg>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const props = defineProps({
  arrows: Array,
});

const positions = ref([]);

function calculatePositions() {
  const result = [];
  const container = document.querySelector('.graph-wrapper');
  const curriculum = document.getElementById('curriculum');

  if (!container || !curriculum) return;

  const containerBox = container.getBoundingClientRect();
  const scale = parseFloat(getComputedStyle(curriculum).getPropertyValue('--scale')) || 1;

  props.arrows.forEach(({ from, to }) => {
    const fromEl = document.getElementById(from);
    const toEl = document.getElementById(to);
    if (!fromEl || !toEl) return;

    const fromBox = fromEl.getBoundingClientRect();
    const toBox = toEl.getBoundingClientRect();

    const x1 = (fromBox.left - containerBox.left + fromBox.width / 2) / scale;
    const y1 = (fromBox.top - containerBox.top + fromBox.height / 2) / scale;
    const x2 = (toBox.left - containerBox.left + toBox.width / 2) / scale;
    const y2 = (toBox.top - containerBox.top + toBox.height / 2) / scale;

    result.push({ x1, y1, x2, y2 });
  });

  positions.value = result;
}

function getPath({ x1, y1, x2, y2 }) {
  const dx = Math.min(150, Math.abs(x2 - x1) * 0.6); 
  const dy = (y2 - y1) * 0.3;

  const curveX1 = x1 + dx;
  const curveY1 = y1;
  const curveX2 = x2 - dx;
  const curveY2 = y2;

  return `M${x1},${y1} C${curveX1},${curveY1} ${curveX2},${curveY2} ${x2},${y2}`;
}


function delayedCalc() {
  nextTick(() => setTimeout(calculatePositions, 30));
}

onMounted(() => {
  delayedCalc();
  window.addEventListener('resize', delayedCalc);
});

watch(() => props.arrows, delayedCalc, { deep: true });
</script>

<style scoped>
.arrow-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
  overflow: visible;
}
</style>
