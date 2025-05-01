<template>
  <div class="sidebar-key">
    <h4 class="title">Legend</h4>

    <!-- 📊 Metric Highlights -->
    <div class="section">
      <div class="item"><span class="box blocking" /> Blocking ≥ 6</div>
      <div class="item"><span class="box delay" /> Delay ≥ 4</div>
      <div class="item"><span class="box complexity" /> Complexity ≥ 8</div>
    </div>

    <!-- 📘 Course Types -->
    <h4 class="title">Course Types</h4>
    <div class="section">
      <div class="item"><span class="circle core" /> Core Course</div>
      <div class="item"><span class="circle ge" /> General Education (GE)</div>
      <div class="item"><span class="circle elective" /> Elective Course</div>
      <div class="item"><span class="circle capstone" /> Capstone Project</div>
    </div>
  </div>
</template>

<script setup>
// Static component — no logic needed
</script>

<style scoped>
.sidebar-key {
  font-size: 0.875rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
  border-left: 1px solid #e5e7eb;
  background-color: #f9fafb;
  height: 100%;
}

.title {
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Metric style boxes */
.box {
  width: 20px;
  height: 20px;
  background-color: #f3f4f6;
  border-radius: 9999px;
  border: 3px solid transparent;
}

.blocking {
  border-color: #dc2626; /* Red */
}
.delay {
  border-color: #f59e0b; /* Orange */
}
.complexity {
  border-color: #6366f1; /* Indigo */
}

/* Course type dots */
.circle {
  width: 20px;
  height: 20px;
  border-radius: 9999px;
}

.core {
  background-color: #3b82f6; /* Blue */
}
.ge {
  background-color: #10b981; /* Green */
}
.elective {
  background-color: #f59e0b; /* Orange */
}
.capstone {
  background-color: #8b5cf6; /* Violet */
}
</style>
