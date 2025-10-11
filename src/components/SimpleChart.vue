<!-- components/SimpleChart.vue -->
<template>
  <div class="simple-chart">
    <svg :width="width" :height="height" class="chart-svg">
      <!-- Сетка -->
      <g v-for="i in 5" :key="'grid-y-' + i">
        <line 
          :x1="0" 
          :y1="i * (height / 5)" 
          :x2="width" 
          :y2="i * (height / 5)" 
          stroke="#e0e0e0" 
          stroke-width="1"
        />
      </g>
      
      <!-- Линия WPM -->
      <polyline
        fill="none"
        stroke="#000000"
        stroke-width="1"
        :points="wpmPoints"
      />
      
      <!-- Линия Raw WPM -->
      <polyline
        fill="none"
        stroke="#666666"
        stroke-width="1"
        stroke-dasharray="5,5"
        :points="rawPoints"
      />
      
      <!-- Точки ошибок -->
      <circle
        v-for="(error, index) in errorPoints"
        :key="'error-' + index"
        :cx="error.x"
        :cy="error.y"
        r="2"
        fill="#ff0000"
      />
    </svg>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  wpmHistory: {
    type: Array,
    default: () => []
  },
  rawHistory: {
    type: Array,
    default: () => []
  },
  errorTimestamps: {
    type: Array,
    default: () => []
  },
  width: {
    type: Number,
    default: 800
  },
  height: {
    type: Number,
    default: 300
  }
});

const maxWpm = computed(() => {
  const allValues = [...props.wpmHistory, ...props.rawHistory];
  return Math.max(...allValues, 100);
});

const wpmPoints = computed(() => {
  return props.wpmHistory.map((value, index) => {
    const x = (index / (props.wpmHistory.length - 1 || 1)) * props.width;
    const y = props.height - (value / maxWpm.value) * props.height;
    return `${x},${y}`;
  }).join(' ');
});

const rawPoints = computed(() => {
  return props.rawHistory.map((value, index) => {
    const x = (index / (props.rawHistory.length - 1 || 1)) * props.width;
    const y = props.height - (value / maxWpm.value) * props.height;
    return `${x},${y}`;
  }).join(' ');
});

const errorPoints = computed(() => {
  return props.errorTimestamps.map(timestamp => {
    const x = (timestamp / (props.wpmHistory.length - 1 || 1)) * props.width;
    const y = props.height - 10; // Фиксированная позиция внизу
    return { x, y };
  });
});
</script>

<style scoped>
.simple-chart {
  margin: 40px 0;
}

.chart-svg {
  max-width: 100%;
  height: auto;
}
</style>