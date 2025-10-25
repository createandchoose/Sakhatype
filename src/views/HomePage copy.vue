<template>
  <div
    :class="[
      // Удаляем классы макета и темы, они в MainLayout.vue
      // 'min-h-screen flex flex-col transition-colors duration-300',
      // isDark ? 'bg-[#0a0a0a] text-white' : 'bg-gray-50 text-gray-900',
    ]"
  >
    <main class="flex-1 flex flex-col items-center justify-center py-16">
      <div class="flex items-center gap-3 mb-20">
        <!-- <span :class="['text-sm', isDark ? 'text-gray-500' : 'text-gray-600']">Время</span>
        <button
          v-for="time in timeOptions"
          :key="time"
          @click="selectedTime = time"
          :class="[
            'px-5 py-2 rounded-lg text-sm font-medium transition-all',
            selectedTime === time
              ? isDark
                ? 'bg-[#2a2a2a] text-white'
                : 'bg-gray-200 text-gray-900'
              : isDark
                ? 'bg-transparent text-gray-500 hover:bg-[#1a1a1a]'
                : 'bg-transparent text-gray-500 hover:bg-gray-100',
          ]"
        >
          {{ time }}
        </button> -->
        <Control v-model="selectedTime" />
      </div>

      <div class="w-full">
        <div :class="['text-7xl font-bold mb-6', isDark ? 'text-[#2a2a2a]' : 'text-gray-300']">
          {{ selectedTime }}
        </div>
        <h1
          :class="[
            'text-5xl font-bold leading-snug mb-16',
            isDark ? 'text-white' : 'text-gray-900',
          ]"
        >
          Отлично идея логичная: сделать имя файла динамическим по текущей дате и времени, чтобы
          каждый скрин имел
        </h1>

        <div class="text-center mt-20">
          <p :class="['text-xs mb-8', isDark ? 'text-gray-500' : 'text-gray-600']">
            Нажмите на текст и начните печатать
          </p>
          <div class="inline-flex justify-center"><RotateCcw :size="24" /></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RotateCcw } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'
import Control from '@/components/Control.vue' // Control component import

const { isDark } = useTheme()

// 3. Declare the state in the parent
const selectedTime = ref(15) // Initial value
</script>
