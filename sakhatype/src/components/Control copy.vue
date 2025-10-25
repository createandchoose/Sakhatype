<script setup lang="ts">
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { useTheme } from '@/composables/useTheme'
import { useControlStore } from '@/stores/control'
import { computed, ref } from 'vue'

const { isDark } = useTheme()
const control = useControlStore()

// Доступные опции
const timeOptions = [15, 30, 60, 120]
const wordOptions = ['Простые', 'Сложные']

// Тип текущего выбора
const currentType = ref<'Время' | 'Слова'>('Время')

// Выбранное значение
const currentValue = computed({
  get: () => {
    return currentType.value === 'Время'
      ? String(control.selectedTime)
      : control.selectedWord || wordOptions[0]
  },
  set: (value: string) => {
    if (currentType.value === 'Время') {
      const num = Number(value)
      if (!isNaN(num)) control.setTime(num)
    } else {
      control.setWord(value)
    }
  },
})

// Функция, чтобы вернуть правильные опции для текущего типа
const options = computed(() => (currentType.value === 'Время' ? timeOptions : wordOptions))
</script>

<template>
  <div class="flex items-center gap-4 p-6">
    <!-- Тип выбора -->
    <ToggleGroup type="single" v-model="currentType" class="flex gap-1">
      <ToggleGroupItem
        value="Время"
        :class="[
          'px-3 rounded-lg text-sm font-medium transition-all',
          isDark
            ? 'data-[state=on]:bg-[#2a2a2a] data-[state=on]:text-white text-gray-500 hover:bg-[#1a1a1a]'
            : 'data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 text-gray-500 hover:bg-gray-100',
        ]"
      >
        Время
      </ToggleGroupItem>
      <ToggleGroupItem
        value="Слова"
        :class="[
          'px-3 rounded-lg text-sm font-medium transition-all',
          isDark
            ? 'data-[state=on]:bg-[#2a2a2a] data-[state=on]:text-white text-gray-500 hover:bg-[#1a1a1a]'
            : 'data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 text-gray-500 hover:bg-gray-100',
        ]"
      >
        Слова
      </ToggleGroupItem>
    </ToggleGroup>

    <span class="text-gray-500">|</span>

    <!-- Опции выбранного типа -->
    <ToggleGroup type="single" v-model="currentValue" class="flex gap-1">
      <ToggleGroupItem
        v-for="opt in options"
        :key="opt"
        :value="String(opt)"
        :aria-label="opt"
        :class="[
          'px-3 rounded-lg text-sm font-medium transition-all',
          isDark
            ? 'data-[state=on]:bg-[#2a2a2a] data-[state=on]:text-white text-gray-500 hover:bg-[#1a1a1a]'
            : 'data-[state=on]:bg-gray-200 data-[state=on]:text-gray-900 text-gray-500 hover:bg-gray-100',
        ]"
      >
        {{ opt }}
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>
