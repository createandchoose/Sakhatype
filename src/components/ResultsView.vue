<!-- components/ResultsView.vue -->
<template>
  <div class="results">
    <h2>Результаты теста</h2>
    
    <div class="chart-container">
      <canvas ref="chartCanvas"></canvas>
    </div>
    
    <div class="final-stats">
      <div class="stat-item">
        <div class="stat-value">{{ stats.wpm }}</div>
        <div class="stat-label">wpm</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.accuracy }}%</div>
        <div class="stat-label">точность</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.rawWpm }}</div>
        <div class="stat-label">raw</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.burstWpm }}</div>
        <div class="stat-label">burst</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">{{ stats.totalErrors }}</div>
        <div class="stat-label">errors</div>
      </div>
    </div>
    
    <div class="buttons">
      <button class="btn" @click="$emit('restart')">↻ еще раз</button>
      <button class="btn" @click="$emit('share')">📤 поделиться</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';
import { Chart, registerables } from 'chart.js';

// Регистрируем необходимые компоненты Chart.js
Chart.register(...registerables);

const props = defineProps({
  stats: {
    type: Object,
    required: true
  },
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
  }
});

defineEmits(['restart', 'share']);

const chartCanvas = ref(null);
let chartInstance = null;

onMounted(() => {
  createChart();
});

onUnmounted(() => {
  if (chartInstance) {
    chartInstance.destroy();
  }
});

// Следим за изменениями данных и обновляем график
watch(
  () => [props.wpmHistory, props.rawHistory, props.errorTimestamps],
  () => {
    if (chartInstance) {
      chartInstance.destroy();
      nextTick(() => {
        createChart();
      });
    }
  },
  { deep: true }
);

const createChart = () => {
  if (!chartCanvas.value) return;

  const ctx = chartCanvas.value.getContext('2d');
  const labels = props.wpmHistory.map((_, i) => i + 1);
  
  const errorPoints = labels.map(second => {
    const errorsAtThisSecond = props.errorTimestamps.filter(t => t === second - 1).length;
    return errorsAtThisSecond > 0 ? errorsAtThisSecond : null;
  });

  chartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'wpm',
          data: props.wpmHistory,
          borderColor: '#000000',
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 1,
          pointHoverRadius: 2,
          pointBackgroundColor: '#000000',
        },
        {
          label: 'raw',
          data: props.rawHistory,
          borderColor: '#666666',
          backgroundColor: 'rgba(102, 102, 102, 0.05)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointRadius: 1,
          pointHoverRadius: 2,
          pointBackgroundColor: '#666666',
          borderDash: [5, 5]
        },
        {
          label: 'Сыыhалар',
          data: errorPoints,
          borderColor: 'transparent',
          backgroundColor: '#ff0000',
          borderWidth: 0,
          tension: 0,
          pointRadius: 3,
          pointHoverRadius: 6,
          pointBackgroundColor: '#ff0000',
          pointBorderColor: '#ff0000',
          pointBorderWidth: 2,
          showLine: false,
          yAxisID: 'y1',
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: '#000000',
            font: {
              size: 12,
              family: "'SF Mono', 'Monaco', monospace"
            },
            padding: 15,
            usePointStyle: false,
          }
        },
        tooltip: {
          backgroundColor: '#ffffff',
          titleColor: '#000000',
          bodyColor: '#000000',
          borderColor: '#666666',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
          callbacks: {
            title: function(context) {
              return 'Секунда ' + context[0].label;
            },
            label: function(context) {
              if (context.dataset.label === 'errors') {
                return context.raw ? `Сыыhалар: ${context.raw}` : null;
              }
              return context.dataset.label + ': ' + context.raw;
            }
          },
          filter: function(tooltipItem) {
            if (tooltipItem.dataset.label === 'errors') {
              return tooltipItem.raw !== null;
            }
            return true;
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: '#e0e0e0',
            drawBorder: false,
          },
          ticks: {
            color: '#666666',
            font: {
              size: 11
            }
          },
          title: {
            display: true,
            text: 'Бэриэмэ (h8кунндэннэн)',
            color: '#666666',
            font: {
              size: 12
            }
          }
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          grid: {
            color: '#e0e0e0',
            drawBorder: false,
          },
          ticks: {
            color: '#666666',
            font: {
              size: 11
            }
          },
          title: {
            display: true,
            text: 'words per minute',
            color: '#666666',
            font: {
              size: 12
            }
          },
          beginAtZero: true
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            color: '#ff0000',
            font: {
              size: 11
            },
            stepSize: 1
          },
          title: {
            display: true,
            text: 'Сыыhалар',
            color: '#ff0000',
            font: {
              size: 12
            }
          },
          beginAtZero: true
        }
      }
    }
  });
};
</script>
<style scoped>
.results {
  text-align: center;
  padding: 40px;
  max-width: 1000px;
  width: 100%;
}

.results h2 {
  font-size: 36px;
  margin-bottom: 30px;
  color: #000000;
}

.chart-container {
  height: 300px;
  margin: 40px 0;
}

.final-stats {
  display: flex;
  justify-content: center;
  gap: 80px;
  margin: 40px 0;
}

.buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 40px;
}

.btn {
  padding: 14px 35px;
  font-size: 15px;
  border: 2px solid #666666;
  background: transparent;
  color: #000000;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  font-family: inherit;
}

.btn:hover {
  background: #000000;
  border-color: #000000;
  color: #ffffff;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 42px;
  font-weight: bold;
  color: #000000;
}

.stat-label {
  font-size: 14px;
  color: #666666;
  margin-top: 8px;
  text-transform: lowercase;
}
</style>