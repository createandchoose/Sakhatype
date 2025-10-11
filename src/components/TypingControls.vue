<template>
  <div class="controls">
    <span class="label">время</span>
    <span class="separator">|</span>
    <div class="toggle-group" ref="toggleGroup">
      <div
        v-for="time in [15, 30, 60, 120]"
        :key="time"
        :class="['time-btn', { active: modelValue === time }]"
        role="button"
        tabindex="0"
        @click="handleClick(time)"
        @mouseenter="handleHover(time)"
        @mouseleave="handleLeave"
        @keydown.enter="handleClick(time)"
        ref="setButtonRef(time)"
      >
        {{ time }}
      </div>
      <div
        class="indicator"
        :class="{ visible: isIndicatorVisible }"
        :style="indicatorStyle"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'

const props = defineProps({
  modelValue: { type: Number, required: true }
})
const emits = defineEmits(['update:modelValue'])

const buttonRefs = ref({})
const toggleGroup = ref(null)
const indicatorStyle = ref({
  width: '0px',
  left: '0px',
  transform: 'scale(1)'
})
const isIndicatorVisible = ref(false)

const updateIndicator = (targetTime, isHover = false) => {
  nextTick(() => {
    const time = targetTime ?? props.modelValue
    const el = buttonRefs.value[time]
    if (el && toggleGroup.value) {
      const rect = el.getBoundingClientRect()
      const groupRect = toggleGroup.value.getBoundingClientRect()
      const offsetLeft = Math.max(0, Math.round(rect.left - groupRect.left))
      const width = Math.round(rect.width)

      indicatorStyle.value = {
        width: `${width}px`,
        left: `${offsetLeft}px`,
        transform: isHover ? 'scale(1.05)' : 'scale(1)'
      }
      isIndicatorVisible.value = true
    }
  })
}

const handleClick = (time) => {
  emits('update:modelValue', time)
  updateIndicator(time)
}

const handleHover = (time) => {
  updateIndicator(time, true)
}

const handleLeave = () => {
  updateIndicator(props.modelValue)
}

const setButtonRef = (time) => (el) => {
  if (el) {
    buttonRefs.value[time] = el
    if (time === props.modelValue) {
      nextTick(() => updateIndicator(time))
    }
  }
}

watch(() => props.modelValue, () => updateIndicator(props.modelValue))
onMounted(() => updateIndicator(props.modelValue))
</script>

<style scoped>
.controls {
  position: relative;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  gap: 5px;
  color: #333;
  font-size: 14px;
  justify-content: center;
  user-select: none;
}

.label {
  font-weight: 600;
  color: #666;
  text-transform: lowercase;
}

.separator {
  color: #ccc;
}

.toggle-group {
  position: relative;
  display: flex;
  gap: 5px;
}

.time-btn {
  background: transparent;
  color: #666;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.2s ease, background-color 0.2s ease;
  position: relative;
  z-index: 1;
  min-width: 40px;
  text-align: center;
}

.time-btn:hover {
  color: #000;
}

.time-btn.active {
  color: #fff;
  background-color: #3b82f6;
  border-radius: 8px;
}

.time-btn:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
}

.indicator {
  background: linear-gradient(135deg, #ef4444, #f97316); /* Red to orange gradient */
  box-shadow: 0 3px 8px rgba(239, 68, 68, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.2);
}

.indicator.visible {
  opacity: 1;
}
</style>