<template>
  <div
    class="course"
    :class="[metricClass, visibilityClass, course.type]"
    @mouseenter="$emit('hover', course.id)"
    @mouseleave="$emit('leave')"
    @click="$emit('select', course)"
  >
    <div class="shape" :id="course.id" :class="shapeClass">
      <span class="units">{{ course.units }}</span>
    </div>
    <div class="label" v-html="formattedLabel" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  course: Object,
  mode: String,
  highlightedId: String,
  relatedIds: Array
});

const shapeClass = computed(() => {
  const freq = props.course.frequency;
  if (freq === 'Offered year-round') return 'circle';
  if (freq === 'Offered twice a year') return 'triangle';
  if (freq === 'Offered once a year') return 'square';
  return 'circle';
});

const formattedLabel = computed(() =>
  props.course.label.replace(/\\n/g, '<br>')
);

const metricClass = computed(() => {
  if (!props.course.metrics || props.mode === 'none') return '';
  const { blocking, delay, complexity } = props.course.metrics;
  if (props.mode === 'blocking' && blocking >= 6) return 'high-blocking';
  if (props.mode === 'delay' && delay >= 4) return 'high-delay';
  if (props.mode === 'complexity' && complexity >= 8) return 'high-complexity';
  return '';
});

const visibilityClass = computed(() => {
  if (!props.highlightedId) return '';
  return props.relatedIds?.includes(props.course.id) ? 'active' : 'dimmed';
});
</script>

<style scoped>
.course {
  text-align: center;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1.2;
}

.shape {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.3rem auto;
  border: 2px solid #d1d5db;
  color: white;
  font-weight: bold;
  font-size: 0.7rem;
  transition: all 0.2s ease;
}

.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.square {
  width: 36px;
  height: 36px;
  border-radius: 0;
}

.triangle {
  width: 38px;
  height: 38px;
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  border: 4px solid #d1d5db;
}

.core .shape {
  background-color: #3b82f6;
}

.ge .shape {
  background-color: #10b981;
}

.elective .shape {
  background-color: #f59e0b;
}

.capstone .shape {
  background-color: #8b5cf6;
}

.units {
  font-size: 0.7rem;
  font-weight: normal;
}

.label {
  font-size: 0.7rem;
  line-height: 1.1;
  white-space: pre-line;
  margin-top: 0.2rem;
}

.high-blocking .shape {
  border-color: #dc2626;
}
.high-delay .shape {
  border-color: #f59e0b;
}
.high-complexity .shape {
  border-color: #6366f1;
}

.active .shape {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
}

.dimmed {
  opacity: 0.2;
  pointer-events: none;
  filter: grayscale(80%);
}
</style>
