<template>
  <div
    class="course"
    :class="[props.metricClass, props.stateClass, props.course.type]"
    @mouseenter="emit('hover', props.course.id)"
    @mouseleave="emit('leave')"
    @click="emit('select', props.course)"
  >
    <div class="shape" :id="props.course.id">
      <span class="units">{{ props.course.units }}</span>
    </div>
    <div class="label" v-html="formattedLabel" />
  </div>
</template>


<script setup>
import { computed } from 'vue';

const props = defineProps({
  course: Object,
  metricClass: String,
  stateClass: String
});

const emit = defineEmits(['hover', 'leave', 'select']);

const formattedLabel = computed(() => {
  return props.course.label.replace(/\n/g, '<br>');
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

.core {
  color: white;
}
.core .shape {
  background-color: #3b82f6;
}

.ge {
  color: white;
}
.ge .shape {
  background-color: #10b981;
}

.elective {
  color: white;
}
.elective .shape {
  background-color: #f59e0b;
}

.capstone {
  color: white;
}
.capstone .shape {
  background-color: #8b5cf6;
}

/* 🎯 Metric highlight borders */
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
