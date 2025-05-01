<template>
  <svg ref="svg" class="arrow-canvas">
    <path
      v-for="(arrow, index) in positions"
      :key="index"
      :d="getPath(arrow)"
      stroke="#f87171"
      stroke-width="2"
      fill="none"
    />
  </svg>
</template>


<script setup>
import { ref, watch, onMounted, nextTick } from 'vue';

const props = defineProps({ arrows: Array });

const svg = ref(null);
const positions = ref([]);

function calculatePositions() {
  const svgRect = svg.value?.getBoundingClientRect();
  if (!svgRect) return;

  positions.value = props.arrows.map(({ from, to }) => {
    const fromEl = document.getElementById(from);
    const toEl = document.getElementById(to);
    if (!fromEl || !toEl) return null;

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const x1 = fromRect.left + fromRect.width / 2 - svgRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - svgRect.top;
    const x2 = toRect.left + toRect.width / 2 - svgRect.left;
    const y2 = toRect.top + toRect.height / 2 - svgRect.top;

    return { x1, y1, x2, y2 };
  }).filter(Boolean);
}

function getPath({ x1, y1, x2, y2 }) {
  const dx = Math.max(40, Math.abs(x2 - x1) * 0.4);
  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
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
