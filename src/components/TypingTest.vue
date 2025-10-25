<template>
  <div class="typing-test">
    <main class="main">
      <TypingControls
        v-if="!store.isTestActive && !showResults"
        v-model="store.selectedTime"
        @update:modelValue="setTime"
      />

      <div class="typing-container" v-if="!showResults">
        <div class="timer">{{ store.timeLeft }}</div>
        <button class="restart-btn" @click="restartTest">↻</button>

        <div class="text-display" @click="focusInput" tabindex="0">
          <span
            v-for="(word, wordIdx) in store.words"
            :key="wordIdx"
            class="word"
            :class="{
              active: wordIdx === store.currentWordIndex && hasFocus && store.isTestActive,
            }"
          >
            <span
              v-for="(char, charIdx) in word"
              :key="charIdx"
              class="char"
              :class="getCharClass(wordIdx, charIdx)"
            >
              {{ char }}
            </span>
          </span>
        </div>

        <div class="focus-message" :class="{ hidden: hasFocus || store.isTestActive }">
          Нажмите на текст и начните печатать
        </div>

        <input
          ref="hiddenInput"
          type="text"
          class="hidden-input"
          v-model="inputValue"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          autocomplete="off"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
        />

        <div class="stats">
          <div class="stat-item">
            <div class="stat-value">{{ store.wpm }}</div>
            <div class="stat-label">wpm</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ store.accuracy }}%</div>
            <div class="stat-label">точность</div>
          </div>
        </div>
      </div>

      <ResultsView
        v-else
        :stats="store.finalStats"
        :wpm-history="store.wpmHistory"
        :raw-history="store.rawHistory"
        :burst-history="store.burstHistory"
        :error-timestamps="store.errorTimestamps"
        @restart="restartTest"
        @share="shareResults"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useTypingStore } from '@/stores/typingStore'
import ResultsView from './ResultsView.vue'
import TypingControls from './TypingControls.vue'

const store = useTypingStore()
const hiddenInput = ref(null)
const inputValue = ref('')
const hasFocus = ref(false) // Переименовано для лучшей семантики
const showResults = ref(false)

const setTime = (time) => {
  store.setTime(time)
  restartTest()
}

const restartTest = () => {
  store.initTest()
  inputValue.value = ''
  showResults.value = false
  // Убрано автоматическое получение фокуса при рестарте
}

const focusInput = () => {
  hiddenInput.value?.focus()
  hasFocus.value = true
}

const handleFocus = () => {
  hasFocus.value = true
}

const handleBlur = () => {
  hasFocus.value = false
}

const handleInput = (event) => {
  if (!store.isTestActive) {
    store.startTimer()
    // Автоматически получаем фокус при начале печати
    if (!hasFocus.value) {
      hasFocus.value = true
    }
  }
  store.processInput(event.target.value)
  inputValue.value = store.inputValue
}

const getCharClass = (wordIdx, charIdx) => {
  if (!hasFocus.value && !store.isTestActive) {
    return '' // Не показываем подсветку, если нет фокуса и тест не активен
  }

  if (wordIdx < store.currentWordIndex) {
    return store.wordHistory[wordIdx]?.[charIdx] || ''
  } else if (wordIdx === store.currentWordIndex) {
    if (charIdx < store.inputValue.length)
      return store.inputValue[charIdx] === store.words[wordIdx][charIdx] ? 'correct' : 'incorrect'
    else if (charIdx === store.inputValue.length && hasFocus.value) return 'current'
  }
  return ''
}

const shareResults = () => {
  const stats = store.finalStats
  const text = `Мой результат на Sakhatype:\n💨 WPM: ${stats.wpm}\n🎯 Точность: ${stats.accuracy}%\n⚡ Burst: ${stats.burstWpm}\n\nПопробуй сам! 🔥`

  if (navigator.share) navigator.share({ text })
  else {
    navigator.clipboard.writeText(text)
    alert('Результат скопирован в буфер обмена!')
  }
}

const handleKeyDown = (e) => {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    focusInput()
  }
  if (e.ctrlKey && e.key === 'Backspace') {
    e.preventDefault()
    inputValue.value = ''
    store.inputValue = ''
  }
  if ((e.key === 'Tab' || e.key === 'Escape') && !showResults.value) {
    e.preventDefault()
    restartTest()
  }
}

const unsubscribe = store.$onAction(({ name, after }) => {
  if (name === 'endTest') after(() => (showResults.value = true))
})

onMounted(() => {
  store.initTest()
  document.addEventListener('keydown', handleKeyDown)
  // Убрано автоматическое получение фокуса при монтировании
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
  unsubscribe()
})
</script>

<style scoped>
.typing-test {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace;
  background: #ffffff;
  color: #000000;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: #f5f5f5;
  border-bottom: 1px solid #e0e0e0;
}

.logo {
  font-size: 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 15px;
  color: #000000;
}

.logo-icon {
  font-size: 18px;
}

.user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #000000;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.controls {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 12px 20px;
  display: flex;
  gap: 20px;
  margin-bottom: 40px;
  color: #666666;
  font-size: 16px;
  border: 1px solid #e0e0e0;
}

.controls button {
  background: transparent;
  border: none;
  color: #666666;
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.2s;
  border-radius: 4px;
  font-size: 16px;
}

.controls button:hover {
  color: #000000;
  background: #e0e0e0;
}

.controls button.active {
  color: #000000;
  background: #e0e0e0;
  font-weight: bold;
}

.separator {
  color: #cccccc;
}

.typing-container {
  max-width: 1000px;
  width: 100%;
  padding: 60px;
  position: relative;
}

.category {
  text-align: center;
  font-size: 14px;
  color: #666666;
  margin-bottom: 30px;
  font-style: italic;
}

.text-display {
  font-family: 'Benzin-Bold';
  font-size: 24px;
  line-height: 0.9;
  color: #666666;
  margin-bottom: 40px;
  position: relative;
  cursor: text;
  user-select: none;
  letter-spacing: 1px;
  transition: all 0.3s ease;
}

@media only screen and (max-width: 600px) {
  .text-display {
    font-family: 'Benzin-Bold';
    font-size: 20px;
    line-height: 0.9;
  }
  .main {
    padding: 0;
  }
}

.word {
  display: inline-block;
  margin: 0 8px 8px 0;
  position: relative;
  border-bottom: 2px solid transparent;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease;
}

.word.active {
  border-bottom-color: #666666;
  background-color: #f5f5f5;
}

.char {
  position: relative;
  display: inline-block;
}

.char.correct {
  color: #000000;
}

.char.incorrect {
  color: #ff0000;
  text-decoration: underline;
}

.char.current::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #000000;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

.stats {
  display: flex;
  justify-content: center;
  gap: 50px;
  margin-top: 40px;
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

.focus-message {
  text-align: center;
  color: #666666;
  font-size: 18px;
  margin-top: 20px;
  opacity: 1;
  transition: opacity 0.3s;
  font-size: 12px;
}

.focus-message.hidden {
  opacity: 0;
}

.hidden-input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.timer {
  font-family: 'Benzin-Bold';
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 24px;
  font-weight: bold;
  color: #000000;
}

.restart-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 24px;
  color: #666666;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  border: none;
}

.restart-btn:hover {
  color: #000000;
  transform: rotate(180deg);
}

.footer {
  padding: 20px 40px;
  text-align: center;
  font-size: 12px;
  color: #666666;
  border-top: 1px solid #e0e0e0;
  background: #f5f5f5;
}
</style>
