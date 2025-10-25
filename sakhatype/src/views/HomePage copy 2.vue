<script setup lang="ts">
import { ref, watch } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'
import { useControlStore } from '@/stores/control'
import Control from '@/components/Control.vue'

const { isDark } = useTheme()
const control = useControlStore()

// 🚀 читаем значение из store при загрузке
const selectedTime = ref(control.selectedTime)
const displayTime = ref(control.selectedTime)
const isAnimating = ref(false)

// Функция анимации чисел как в GTA
const animateNumber = (from: number, to: number) => {
  if (from === to) return

  isAnimating.value = true
  const duration = 200 // длительность анимации в мс
  const steps = 30 // количество шагов
  const increment = (to - from) / steps
  let current = from
  let step = 0

  const timer = setInterval(() => {
    step++
    current += increment

    if (step >= steps) {
      displayTime.value = to
      isAnimating.value = false
      clearInterval(timer)
    } else {
      displayTime.value = Math.round(current)
    }
  }, duration / steps)
}

// 🧩 следим за изменениями store → родитель с анимацией
watch(
  () => control.selectedTime,
  (newVal, oldVal) => {
    selectedTime.value = newVal
    animateNumber(oldVal || displayTime.value, newVal)
  },
)

// 🔁 следим за изменениями родителя → store (если вдруг меняется вручную)
watch(selectedTime, (val) => control.setTime(val))
</script>

<template>
  <div>
    <main class="flex-1 flex flex-col items-center justify-center py-16">
      <div class="flex items-center gap-3 mb-20">
        <Control v-model="selectedTime" />
      </div>
      <div class="w-full">
        <div
          :class="[
            'text-7xl font-bold mb-6 transition-all duration-300 select-none',
            isDark ? 'text-[#2a2a2a]' : 'text-gray-300',
          ]"
          :style="{
            transform: isAnimating ? 'translateY(-5px)' : 'translateY(0)',
            opacity: isAnimating ? '0.7' : '1',
          }"
        >
          {{ displayTime }}
        </div>
        <h1
          :class="['text-5xl font-bold leading-snug mb-4', isDark ? 'text-white' : 'text-gray-900']"
        >
          Отлично идея логичная: сделать имя файла динамическим по текущей дате и времени, чтобы
          каждый скрин имел
        </h1>
        <div class="text-center">
          <p :class="['text-xs mb-6 select-none', isDark ? 'text-gray-500' : 'text-gray-600']">
            Нажмите на текст и начните печатать
          </p>
          <div class="inline-flex justify-center cursor-pointer rotate-icon">
            <RotateCcw :size="24" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.rotate-icon {
  transition: transform 0.3s ease;
}
.rotate-icon:hover {
  transform: rotate(-260deg);
}
</style>
