<template>
  <div class="dropdown">
    <label for="metric" class="label">View by:</label>
    <select id="metric" v-model="selected" @change="updateMode">
      <option value="none">None</option>
      <option value="blocking">Blocking</option>
      <option value="delay">Delay</option>
      <option value="complexity">Complexity</option>
    </select>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  mode: String
});
const emit = defineEmits(['update:mode']);

const selected = ref(props.mode || 'none');

watch(() => props.mode, (newVal) => {
  selected.value = newVal;
});

function updateMode() {
  emit('update:mode', selected.value);
}
</script>

<style scoped>
.dropdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
}
.label {
  font-weight: bold;
}
select {
  padding: 0.25rem 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.875rem;
}
</style>
