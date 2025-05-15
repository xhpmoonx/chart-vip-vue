<template>
  <div
    class="course"
    :class="[metricClass, stateClass, course.type]"
    @mouseenter="$emit('hover', course.id)"
    @mouseleave="$emit('leave')"
    @click="$emit('select', course)"
  >
    <div
      class="shape"
      :id="course.id"
      :class="[
  shapeClass,
  isCorequisite ? 'coreq-highlight' : (colorLevel > 0 ? `color-level-${colorLevel}` : ''),
  { dimmed, 'dfw-outline': isHighDFW }
]"
>

      <span class="units">
        <template v-if="mode === 'units'">
          {{ course.units }}
        </template>
        <template v-else-if="mode === 'dfw' && course.metrics?.dfwRate !== undefined">
          {{ (course.metrics.dfwRate * 100).toFixed(0) }}%
        </template>
        <template v-else>
          {{ course.metrics?.[mode] ?? '' }}
        </template>
      </span>
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
  colorLevel: Number,
  dimmed: Boolean, 
  highlightDfw: Boolean,
  hoveredCourse: Object

});
const isHighDFW = computed(() => {
  return props.highlightDfw && props.course.metrics?.dfwRate >= 0.3;
});

const formattedLabel = computed(() => {
  const course = props.course;
  let label = course.label.replace(/\n/g, '<br>');

  const waitingList = Number(course["waiting list"] || 0);
  const equityGap = !!course["equity gap"];

  if (waitingList > 20) {
    label += '<span style="color:red;"> ⚠</span>';
  }
  if (equityGap) {
    label += '<span style="color:blue;"> ⧖</span>';
  }

  return label;
});



const shapeClass = computed(() => {
  const freq = props.course.frequency;
  if (freq === 'Offered year-round') return 'circle';
  if (freq === 'Offered twice a year') return 'triangle';
  if (freq === 'Offered once a year') return 'square';
  return 'circle';
});

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
const isCorequisite = computed(() => {
  if (!props.hoveredCourse || !props.hoveredCourse.coreqs) return false;
  return props.hoveredCourse.coreqs.includes(props.course.id);
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
  transition: background-color 0.2s ease, filter 0.2s ease;
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

.core .shape { background-color: #3b82f6; }
.ge .shape { background-color: #10b981; }
.elective .shape { background-color: #f59e0b; }
.capstone .shape { background-color: #8b5cf6; }

.high-blocking .shape { border-color: #dc2626;   color: black;}
.high-delay .shape { border-color: #f59e0b;   color: black;}
.high-complexity .shape { border-color: #6366f1;   color: black;}

.active .shape {
  outline: 2px solid #2563eb;
  outline-offset: 1px;
  color: black;
}
.coreq-outline {
  outline: 3px solid #174d2b !important; /* green */
  outline-offset: 1px;
}
.coreq-highlight.shape {
  background-color: #62bf85 !important; /* Tailwind's green-500 */
  border-color: #16a34a !important; /* green-600 border */
  color: white;
}

/* Prereqs (red shades) */
.color-level-1.shape { background-color: #dc2626 !important; } /* direct prereq */
.color-level-2.shape { background-color: #f87171 !important; }
.color-level-3.shape { background-color: #fca5a5 !important; }

/* Dependents (blue shades) */
.color-level-11.shape { background-color: #1e40af !important; } /* direct dependent */
.color-level-12.shape { background-color: #3b82f6 !important; }
.color-level-13.shape { background-color: #93c5fd !important; }

.dimmed {
  filter: grayscale(90%) brightness(0.8);
  opacity: 0.4;
}
.dfw-outline {
  border-color: #dc2626 !important; /* red */
  box-shadow: 0 0 4px #dc2626aa;
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
</style>
