<template>
    <div class="layout">
      <div class="main-content">
        <CurriculumChart />
      </div>
      <div class="key">
        <!-- Reuse your Course Flow Key HTML here -->
        <!-- (Or break into Vue components later) -->
      </div>
    </div>
  </template>
  
  <script setup>
  import CurriculumGraph from '@/components/CurriculumGraph.vue';
  import ArrowLines from '@/components/ArrowLines.vue';
  import CourseNode from '@/components/CourseNode.vue';
  import MetricDropdown from '@/components/MetricDropdown.vue';
  import SidebarKey from '@/components/SidebarKey.vue';
  
</script>
  