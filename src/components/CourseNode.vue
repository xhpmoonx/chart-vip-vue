<template>
  <div
    class="course"
    :class="[metricClass, stateClass, course.type]"
    @mouseenter="$emit('hover', course.id)"
    @mouseleave="$emit('leave')"
    @click="$emit('select', course)"
  >
    <div class="shape" :id="course.id">
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
  highlightedId: String
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

const stateClass = computed(() =>
  props.highlightedId === props.course.id ? 'active' : ''
);
</script>

<style scoped>
.course {
  text-align: center;
  cursor: pointer;
  font-size: 0.75rem;
  line-height: 1.2;
}

.shape {
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.5rem auto;
  border: 3px solid #d1d5db;
  background-color: #f3f4f6;
}

.units {
  font-weight: bold;
  font-size: 0.875rem;
}

.core .shape {
  background-color: #3b82f6;
  color: white;
}
.ge .shape {
  background-color: #10b981;
  color: white;
}
.elective .shape {
  background-color: #f59e0b;
  color: white;
}
.capstone .shape {
  background-color: #8b5cf6;
  color: white;
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
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}
</style>
