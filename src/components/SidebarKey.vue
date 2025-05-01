<template>
  <div class="legend">
    <div class="dropdown-group">
      <label for="metric" class="label">View by:</label>
      <select
        id="metric"
        :value="mode"
        @change="e => emit('update:mode', e.target.value)"
      >
        <option value="none">None</option>
        <option value="blocking">Blocking</option>
        <option value="delay">Delay</option>
        <option value="complexity">Complexity</option>
      </select>
    </div>

    <h4 class="title">Legend</h4>

    <div class="item"><span class="shape core" /> Core</div>
    <div class="item"><span class="shape ge" /> GE</div>
    <div class="item"><span class="shape elective" /> Elective</div>
    <div class="item"><span class="shape capstone" /> Capstone</div>

    <div class="divider" />

    <div class="item"><span class="shape border high-blocking" /> Blocking</div>
    <div class="item"><span class="shape border high-delay" /> Delay</div>
    <div class="item"><span class="shape border high-complexity" /> Complexity</div>
    <div class="item"><span class="shape border active" /> Active</div>
  </div>
</template>

<script setup>
const props = defineProps({
  mode: String
});
const emit = defineEmits(['update:mode']);
</script>

<style scoped>
.legend {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.dropdown-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 0.75rem;
  gap: 0.25rem;
}
.label {
  font-size: 0.7rem;
  font-weight: 600;
}
select {
  font-size: 0.7rem;
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.title {
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  line-height: 1.2;
}

.shape {
  width: 12px;
  height: 12px;
  border-radius: 9999px;
  display: inline-block;
  background-color: #e5e7eb;
  border: 1.5px solid transparent;
}

/* Types */
.core { background-color: #3b82f6; }
.ge { background-color: #10b981; }
.elective { background-color: #f59e0b; }
.capstone { background-color: #8b5cf6; }

/* Metrics */
.border {
  background-color: white;
}
.high-blocking { border-color: #10b981; }
.high-delay { border-color: #3b82f6; }
.high-complexity { border-color: #8b5cf6; }
.active {
  outline: 1.5px solid #2563eb;
  outline-offset: 1px;
}

.divider {
  border-top: 1px solid #ddd;
  margin: 0.4rem 0;
}
</style>
