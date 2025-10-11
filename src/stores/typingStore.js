// stores/typingStore.js
import { defineStore } from 'pinia';

export const useTypingStore = defineStore('typing', {
  state: () => ({
    texts: [
      "Технологии меняют мир каждый день. Новые изобретения делают нашу жизнь проще и интереснее. Мы живем в удивительное время, когда все возможно.",
      "Якутия - удивительный край вечной мерзлоты и белых ночей. Здесь живут сильные и добрые люди, которые любят свою землю.",
      "Саха сирэ айыл5а кыра туймаада. Бу олох уонна дойду сайдыытын туһунан. Биһиги атыыбыт дойдубуту таптыыбыт.",
      "Программирование открывает безграничные возможности для творчества и инноваций. Каждая строка кода может изменить мир к лучшему.",
      "Северное сияние танцует в небе озаряя бескрайние просторы тайги и тундры. Это магическое явление природы завораживает своей красотой."
    ],
    currentText: '',
    words: [],
    currentWordIndex: 0,
    currentCharIndex: 0,
    startTime: null,
    selectedTime: 15,
    timeLeft: 15,
    isTestActive: false,
    correctChars: 0,
    totalChars: 0,
    inputValue: '',
    wordHistory: [],
    wpmHistory: [],
    rawHistory: [],
    errorsHistory: [],
    burstWpm: 0,
    totalErrors: 0,
    currentErrors: 0,
    errorTimestamps: [],
    timerInterval: null
  }),

  getters: {
    wpm: (state) => {
      if (!state.startTime) return 0;
      const elapsedMinutes = (Date.now() - state.startTime) / 60000;
      const wordsTyped = state.correctChars / 5;
      return Math.round(wordsTyped / elapsedMinutes) || 0;
    },
    
    rawWpm: (state) => {
      if (!state.startTime) return 0;
      const elapsedMinutes = (Date.now() - state.startTime) / 60000;
      return Math.round((state.totalChars / 5) / elapsedMinutes) || 0;
    },
    
    accuracy: (state) => {
      return state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 100;
    },
    
    finalStats: (state) => {
      const elapsedMinutes = state.selectedTime / 60;
      const wordsTyped = state.correctChars / 5;
      const wpm = Math.round(wordsTyped / elapsedMinutes) || 0;
      const rawWpm = Math.round((state.totalChars / 5) / elapsedMinutes) || 0;
      const accuracy = state.totalChars > 0 ? Math.round((state.correctChars / state.totalChars) * 100) : 100;
      
      return {
        wpm,
        rawWpm,
        accuracy,
        burstWpm: state.burstWpm,
        totalErrors: state.totalErrors
      };
    }
  },

  actions: {
    initTest() {
      this.currentText = this.texts[Math.floor(Math.random() * this.texts.length)];
      this.words = this.currentText.split(' ');
      this.currentWordIndex = 0;
      this.currentCharIndex = 0;
      this.correctChars = 0;
      this.totalChars = 0;
      this.timeLeft = this.selectedTime;
      this.isTestActive = false;
      this.startTime = null;
      this.inputValue = '';
      this.wordHistory = [];
      this.wpmHistory = [];
      this.rawHistory = [];
      this.errorsHistory = [];
      this.burstWpm = 0;
      this.totalErrors = 0;
      this.currentErrors = 0;
      this.errorTimestamps = [];
      
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
    },

    startTimer() {
      if (this.isTestActive) return;
      
      this.isTestActive = true;
      this.startTime = Date.now();
      
      this.timerInterval = setInterval(() => {
        this.timeLeft--;
        
        // Записываем статистику каждую секунду
        this.wpmHistory.push(this.wpm);
        this.rawHistory.push(this.rawWpm);
        this.errorsHistory.push(this.currentErrors);
        
        if (this.wpm > this.burstWpm) {
          this.burstWpm = this.wpm;
        }
        
        if (this.timeLeft <= 0) {
          this.endTest();
        }
      }, 1000);
    },

    endTest() {
      if (this.timerInterval) {
        clearInterval(this.timerInterval);
        this.timerInterval = null;
      }
      this.isTestActive = false;
    },

    processInput(newValue) {
      const oldLength = this.inputValue.length;
      
      if (newValue.endsWith(' ')) {
        const typedWord = this.inputValue.trim();
        const currentWord = this.words[this.currentWordIndex];
        
        this.wordHistory[this.currentWordIndex] = [];
        
        for (let i = 0; i < Math.max(typedWord.length, currentWord.length); i++) {
          this.totalChars++;
          if (i < typedWord.length && i < currentWord.length && typedWord[i] === currentWord[i]) {
            this.correctChars++;
            this.wordHistory[this.currentWordIndex][i] = 'correct';
          } else {
            this.wordHistory[this.currentWordIndex][i] = 'incorrect';
            this.currentErrors++;
          }
        }
        
        this.currentWordIndex++;
        this.inputValue = '';
        
        if (this.currentWordIndex >= this.words.length) {
          this.currentText = this.texts[Math.floor(Math.random() * this.texts.length)];
          this.words = this.currentText.split(' ');
          this.currentWordIndex = 0;
          this.wordHistory = [];
        }
      } else {
        const currentWord = this.words[this.currentWordIndex];
        const currentCharIdx = newValue.length - 1;
        
        if (newValue.length > oldLength) {
          this.totalChars++;
          
          if (currentCharIdx < currentWord.length && newValue[currentCharIdx] === currentWord[currentCharIdx]) {
            this.correctChars++;
          } else {
            const elapsedSeconds = Math.floor((Date.now() - this.startTime) / 1000);
            this.errorTimestamps.push(elapsedSeconds);
            this.totalErrors++;
            this.currentErrors++;
          }
        } else if (newValue.length < oldLength) {
          if (this.totalChars > 0) this.totalChars--;
          
          if (oldLength <= currentWord.length && this.inputValue[oldLength - 1] === currentWord[oldLength - 1]) {
            if (this.correctChars > 0) this.correctChars--;
          } else {
            if (this.currentErrors > 0) this.currentErrors--;
          }
        }
        
        this.inputValue = newValue;
      }
    },

    setTime(time) {
      this.selectedTime = time;
      this.timeLeft = time;
    }
  }
});