<template>
  <div class="legend">
    <!-- Dropdown -->
    <div class="dropdown-group">
      <label for="metric" class="label">View by:</label>
      <select
        id="metric"
        :value="mode"
        @change="e => emit('update:mode', e.target.value)"
      >
        <option value="units">Units</option>
        <option value="blocking">Blocking</option>
        <option value="delay">Delay</option>
        <option value="complexity">Complexity</option>
        <option value="dfw">DFW Rate</option>
        <option value="none">None</option>
      </select>
    </div>
    <!-- Metric highlights -->
    <div class="item"><span class="shape border high-blocking" /> Blocking</div>
    <div class="item"><span class="shape border high-delay" /> Delay</div>
    <div class="item"><span class="shape border high-complexity" /> Complexity</div>
    <div class="item"><span class="shape border active" /> Active</div>
    <div class="divider" />

    <!-- Type Legend -->
    <h4 class="title">Color = Type</h4>
    <div class="item"><span class="shape core" /> Core</div>
    <div class="item"><span class="shape ge" /> GE</div>
    <div class="item"><span class="shape elective" /> Elective</div>
    <div class="item"><span class="shape capstone" /> Capstone</div>
    <div class="divider" />

    <!-- Shape Legend -->
    <h4 class="title">Shape = Frequency</h4>
    <div class="item"><span class="shape circle" /> Offered year-round</div>
    <div class="item"><span class="shape triangle" /> Offered twice a year</div>
    <div class="item"><span class="shape square" /> Offered once a year</div>
    <div class="divider" />

    <!-- course Legend -->
    <h4 class="title">⚠ / ⧖  </h4>
    <div class="legend">
    <div><span style="color:red;">⚠</span> = High Waiting List </div>
    <div><span style="color:blue;">⧖</span> = Equity Gap </div>
    <div class="divider" />

    </div>
    <!-- Path Legend -->
    <h4 class="title">Longest Prerequisite Path</h4>
    <div class="legend-line">
    <svg width="100" height="10">
      <line x1="0" y1="5" x2="100" y2="5" stroke="green" stroke-width="3" stroke-dasharray="6,4" />
    </svg>
    <span>Longest path</span>
    <div class="divider" />
  </div>

    <!-- Hover Effects -->
    <h4 class="title">Hover Highlighting</h4>
    <ul class="hover-legend">
      <li><span class="swatch color-level-1"></span> Direct Prerequisite</li>
      <li><span class="swatch color-level-2"></span> Indirect Prerequisite</li>
      <li><span class="swatch color-level-11"></span> Direct Dependent</li>
      <li><span class="swatch color-level-12"></span> Indirect Dependent</li>
    </ul>
    <div class="divider" />

    <!-- LINE STYLE MODE -->
    <div class="dropdown-group">
      <label for="line-mode" class="label">Prerequisite Lines:</label>
      <select
        id="line-mode"
        :value="lineMode"
        @change="e => emit('update:lineMode', e.target.value)"
      >
        <option value="all">All</option>
        <option value="high">Only High DFW</option>
        <option value="normal">Only Normal</option>
      </select>
    </div>


      </div>
</template>

<script setup>
const props = defineProps({
  mode: String,
  lineMode: String
});

const emit = defineEmits(['update:mode', 'update:lineMode']);
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
  margin: 0.4rem 0 0.2rem;
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
  display: inline-block;
  background-color: #e5e7eb;
  border: 1.5px solid transparent;
}

/* Colors by type */
.core { background-color: #3b82f6; }
.ge { background-color: #10b981; }
.elective { background-color: #f59e0b; }
.capstone { background-color: #8b5cf6; }

/* Shapes by frequency */
.circle {
  border-radius: 50%;
}

.square {
  border-radius: 0;
}

.triangle {
  clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
  background-color: #e5e7eb;
  width: 12px;
  height: 12px;
  transform: translateY(1px);
}

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
  margin: 0.5rem 0;

}

.legend-section {
  margin-top: 1rem;
  font-size: 0.75rem;
}

.hover-legend {
  list-style: none;
  padding: 0;
  margin: 0.3rem 0;
}

.hover-legend li {
  display: flex;
  align-items: center;
  margin-bottom: 0.3rem;
}

.swatch {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border-radius: 3px;
  border: 1px solid #ccc;
}
.color-level-1 { background-color: #dc2626; }   /* red */
.color-level-2 { background-color: #f87171; }   /* lighter red */
.color-level-11 { background-color: #1e40af; }  /* dark blue */
.color-level-12 { background-color: #3b82f6; }  /* light blue */

</style>
