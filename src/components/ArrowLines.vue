<template>
  <svg class="arrow-canvas">
    <defs>
      <marker
        id="arrowhead"
        markerWidth="10"
        markerHeight="10"
        refX="7"
        refY="5"
        orient="auto"
        markerUnits="strokeWidth"
      >
        <path d="M0,0 L10,5 L0,10" fill="#d1d5db" stroke="none" />
      </marker>
    </defs>

    <path
      v-for="(arrow, index) in positions"
      :key="index"
      :d="getPath(arrow)"
      :stroke="getStroke(arrow)"
      :stroke-dasharray="arrow.dfwLike ? '4,2' : 'none'"
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
  highlightedIds: Array,
  lineMode: String
});


const positions = ref([]);

function calculatePositions() {
  const result = [];

  const container = document.querySelector('.graph-wrapper');
  if (!container) return;

  props.arrows.forEach(({ from, to, dfwLike }) => {
    const fromEl = document.getElementById(from);
    const toEl = document.getElementById(to);
    if (!fromEl || !toEl) return;

    const containerRect = container.getBoundingClientRect();
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();

    const x1 = fromRect.left + fromRect.width / 2 - containerRect.left;
    const y1 = fromRect.top + fromRect.height / 2 - containerRect.top;

    const x2 = toRect.left + toRect.width / 2 - containerRect.left;
    const y2 = toRect.top + toRect.height / 2 - containerRect.top;

    result.push({ x1, y1, x2, y2, from, to, dfwLike });
  });

  positions.value = result;
}


function getPath({ x1, y1, x2, y2 }) {
  const isVertical = Math.abs(x2 - x1) < 20;
  const dx = Math.max(80, Math.abs(x2 - x1) * 0.6);
  const dy = Math.max(80, Math.abs(y2 - y1) * 0.6);

  if (isVertical) {
    return `M${x1},${y1} C${x1},${y1 + dy} ${x2},${y2 - dy} ${x2},${y2}`;
  }

  return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}


function isHighlighted(arrow) {
  if (!props.highlightedIds || props.highlightedIds.length === 0) {
    return 'default';
  }
  if (
    props.highlightedIds.includes(arrow.from) &&
    props.highlightedIds.includes(arrow.to)
  ) {
    return 'highlighted';
  }
  return 'dimmed';
}

function getStroke(arrow) {
  const status = isHighlighted(arrow);
  if (status === 'highlighted') return '#2563eb'; // blue
  if (status === 'dimmed') return '#d1d5db';      // gray
  return '#dc2626';                               // red default
}

function delayedCalc() {
  nextTick(() => {
    requestAnimationFrame(() => calculatePositions());
  });
}

onMounted(() => {
  delayedCalc();
  window.addEventListener('resize', delayedCalc);
});

watch(() => props.arrows, delayedCalc, { deep: true });
watch(() => props.highlightedIds, delayedCalc, { deep: true });
</script>

<style scoped>
.arrow-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  overflow: visible;
}

.arrow-canvas path {
  pointer-events: stroke;
}
</style>
