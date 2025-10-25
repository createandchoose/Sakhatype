// src/stores/theme.ts
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  // 1. Реактивное состояние темы.
  // Изначально берем из localStorage или ставим true (темная).
  const isDark = ref(localStorage.getItem('theme') === 'dark' || true)

  // 2. Действие: функция для переключения темы
  function toggleDark() {
    isDark.value = !isDark.value
    // Сохраняем в localStorage для запоминания
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  return { isDark, toggleDark }
})
