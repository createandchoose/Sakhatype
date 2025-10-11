const texts = [
    "Технологии меняют мир каждый день. Новые изобретения делают нашу жизнь проще и интереснее. Мы живем в удивительное время, когда все возможно.",
    "Якутия - удивительный край вечной мерзлоты и белых ночей. Здесь живут сильные и добрые люди, которые любят свою землю.",
    "Саха сирэ айыл5а кыра туймаада. Бу олох уонна дойду сайдыытын туһунан. Биһиги атыыбыт дойдубуту таптыыбыт.",
    "Программирование открывает безграничные возможности для творчества и инноваций. Каждая строка кода может изменить мир к лучшему.",
    "Северное сияние танцует в небе озаряя бескрайние просторы тайги и тундры. Это магическое явление природы завораживает своей красотой."
];

let currentText = '';
let words = [];
let currentWordIndex = 0;
let currentCharIndex = 0;
let startTime = null;
let timerInterval = null;
let selectedTime = 15;
let timeLeft = 15;
let isTestActive = false;
let correctChars = 0;
let totalChars = 0;
let inputValue = '';
let wordHistory = []; // История правильности каждого символа в словах
let wpmHistory = []; // История WPM по секундам
let rawHistory = []; // История raw WPM
let errorsHistory = []; // История ошибок
let burstWpm = 0; // Максимальная скорость
let totalErrors = 0; // Общее количество ошибок (включая исправленные)
let currentErrors = 0; // Текущие неисправленные ошибки
let errorTimestamps = []; // Временные метки ошибок для графика

const textDisplay = document.getElementById('textDisplay');
const hiddenInput = document.getElementById('hiddenInput');
const focusMessage = document.getElementById('focusMessage');

function initTest() {
    currentText = texts[Math.floor(Math.random() * texts.length)];
    words = currentText.split(' ');
    currentWordIndex = 0;
    currentCharIndex = 0;
    correctChars = 0;
    totalChars = 0;
    timeLeft = selectedTime;
    isTestActive = false;
    startTime = null;
    inputValue = '';
    wordHistory = [];
    wpmHistory = [];
    rawHistory = [];
    errorsHistory = [];
    burstWpm = 0;
    totalErrors = 0;
    currentErrors = 0;
    errorTimestamps = [];
    
    renderText();
    
    hiddenInput.value = '';
    hiddenInput.disabled = false;
    document.getElementById('timer').textContent = selectedTime;
    document.getElementById('wpm').textContent = '0';
    document.getElementById('accuracy').textContent = '100%';
    document.getElementById('results').classList.remove('show');
    document.querySelector('.typing-container').style.display = 'block';
    focusMessage.classList.remove('hidden');
    
    if (timerInterval) clearInterval(timerInterval);
}

function renderText() {
    textDisplay.innerHTML = '';
    words.forEach((word, wordIdx) => {
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        
        word.split('').forEach((char, charIdx) => {
            const charSpan = document.createElement('span');
            charSpan.className = 'char';
            charSpan.textContent = char;
            
            if (wordIdx === currentWordIndex && charIdx === currentCharIndex) {
                charSpan.classList.add('current');
            }
            
            wordSpan.appendChild(charSpan);
        });
        
        textDisplay.appendChild(wordSpan);
    });
}

function updateDisplay() {
    const allChars = textDisplay.querySelectorAll('.char');
    const allWords = textDisplay.querySelectorAll('.word');
    let charIndex = 0;
    
    // Убираем класс active со всех слов
    allWords.forEach(w => w.classList.remove('active'));
    
    // Добавляем класс active к текущему слову
    if (allWords[currentWordIndex]) {
        allWords[currentWordIndex].classList.add('active');
    }
    
    words.forEach((word, wordIdx) => {
        for (let i = 0; i < word.length; i++) {
            const char = allChars[charIndex];
            char.classList.remove('correct', 'incorrect', 'current');
            
            if (wordIdx < currentWordIndex) {
                // Уже напечатанные слова - используем сохраненную историю
                if (wordHistory[wordIdx] && wordHistory[wordIdx][i]) {
                    char.classList.add(wordHistory[wordIdx][i]);
                }
            } else if (wordIdx === currentWordIndex) {
                // Текущее слово
                if (i < inputValue.length) {
                    if (inputValue[i] === word[i]) {
                        char.classList.add('correct');
                    } else {
                        char.classList.add('incorrect');
                    }
                } else if (i === inputValue.length) {
                    char.classList.add('current');
                }
            }
            
            charIndex++;
        }
    });
}

function startTimer() {
    if (isTestActive) return;
    isTestActive = true;
    startTime = Date.now();
    focusMessage.classList.add('hidden');
    
    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        
        // Записываем статистику каждую секунду
        const elapsedMinutes = (Date.now() - startTime) / 60000;
        const wordsTyped = correctChars / 5;
        const wpm = Math.round(wordsTyped / elapsedMinutes) || 0;
        const rawWpm = Math.round((totalChars / 5) / elapsedMinutes) || 0;
        
        wpmHistory.push(wpm);
        rawHistory.push(rawWpm);
        errorsHistory.push(currentErrors);
        
        if (wpm > burstWpm) {
            burstWpm = wpm;
        }
        
        if (timeLeft <= 0) {
            endTest();
        }
    }, 1000);
}

function updateStats() {
    if (!startTime) return;
    
    const elapsedMinutes = (Date.now() - startTime) / 60000;
    const wordsTyped = correctChars / 5;
    const wpm = Math.round(wordsTyped / elapsedMinutes) || 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    document.getElementById('wpm').textContent = wpm;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

function endTest() {
    clearInterval(timerInterval);
    isTestActive = false;
    hiddenInput.disabled = true;
    
    const elapsedMinutes = selectedTime / 60;
    const wordsTyped = correctChars / 5;
    const wpm = Math.round(wordsTyped / elapsedMinutes) || 0;
    const rawWpm = Math.round((totalChars / 5) / elapsedMinutes) || 0;
    const accuracy = totalChars > 0 ? Math.round((correctChars / totalChars) * 100) : 100;
    
    document.getElementById('finalWpm').textContent = wpm;
    document.getElementById('finalAccuracy').textContent = accuracy + '%';
    document.getElementById('finalRaw').textContent = rawWpm;
    document.getElementById('finalBurst').textContent = burstWpm;
    document.getElementById('finalErrors').textContent = totalErrors;
    
    document.querySelector('.typing-container').style.display = 'none';
    document.getElementById('results').classList.add('show');
    
    // Создаем график
    createResultChart();
}

function createResultChart() {
    const ctx = document.getElementById('resultChart').getContext('2d');
    
    // Уничтожаем старый график если есть
    if (window.resultChartInstance) {
        window.resultChartInstance.destroy();
    }
    
    const labels = wpmHistory.map((_, i) => i + 1);
    
    // Создаем массив для точек ошибок
    const errorPoints = labels.map(second => {
        const errorsAtThisSecond = errorTimestamps.filter(t => t === second - 1).length;
        return errorsAtThisSecond > 0 ? errorsAtThisSecond : null;
    });
    
    window.resultChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'wpm',
                    data: wpmHistory,
                    borderColor: '#e2b714',
                    backgroundColor: 'rgba(226, 183, 20, 0.1)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 1,
                    pointHoverRadius: 2,
                    pointBackgroundColor: '#e2b714',
                },
                {
                    label: 'raw',
                    data: rawHistory,
                    borderColor: '#646669',
                    backgroundColor: 'rgba(100, 102, 105, 0.05)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 1,
                    pointHoverRadius: 2,
                    pointBackgroundColor: '#646669',
                    borderDash: [5, 5]
                },
                {
                    label: 'errors',
                    data: errorPoints,
                    borderColor: 'transparent',
                    backgroundColor: '#ca4754',
                    borderWidth: 0,
                    tension: 0,
                    pointRadius: 2,
                    pointHoverRadius: 4,
                    pointBackgroundColor: '#ca4754',
                    pointBorderColor: '#ca4754',
                    pointBorderWidth: 2,
                    showLine: false,
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        color: '#d1d0c5',
                        font: {
                            size: 13,
                            family: "'SF Mono', 'Monaco', monospace"
                        },
                        padding: 15,
                        usePointStyle: true,
                    }
                },
                tooltip: {
                    backgroundColor: '#2c2e31',
                    titleColor: '#e2b714',
                    bodyColor: '#d1d0c5',
                    borderColor: '#646669',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: true,
                    callbacks: {
                        title: function(context) {
                            return 'Секунда ' + context[0].label;
                        },
                        label: function(context) {
                            if (context.dataset.label === 'errors') {
                                return context.raw ? `ошибки: ${context.raw}` : null;
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
                        color: '#3a3c41',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#646669',
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        text: 'время (секунды)',
                        color: '#646669',
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
                        color: '#3a3c41',
                        drawBorder: false,
                    },
                    ticks: {
                        color: '#646669',
                        font: {
                            size: 11
                        }
                    },
                    title: {
                        display: true,
                        text: 'words per minute',
                        color: '#646669',
                        font: {
                            size: 12
                        }
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    grid: {
                        drawOnChartArea: false,
                    },
                    ticks: {
                        color: '#ca4754',
                        font: {
                            size: 11
                        },
                        stepSize: 1
                    },
                    title: {
                        display: true,
                        text: 'ошибки',
                        color: '#ca4754',
                        font: {
                            size: 12
                        }
                    }
                }
            }
        }
    });
}

function restartTest() {
    initTest();
    setTimeout(() => hiddenInput.focus(), 100);
}

function shareResults() {
    const wpm = document.getElementById('finalWpm').textContent;
    const accuracy = document.getElementById('finalAccuracy').textContent;
    const burst = document.getElementById('finalBurst').textContent;
    const text = `Мой результат на Sakhatype:\n💨 WPM: ${wpm}\n🎯 Точность: ${accuracy}\n⚡ Burst: ${burst}\n\nПопробуй сам! 🔥`;
    
    if (navigator.share) {
        navigator.share({ text: text });
    } else {
        navigator.clipboard.writeText(text);
        alert('Результат скопирован в буфер обмена!');
    }
}

hiddenInput.addEventListener('input', (e) => {
    if (!isTestActive) startTimer();
    
    const newValue = e.target.value;
    const oldLength = inputValue.length;
    
    // Проверяем если нажат пробел
    if (newValue.endsWith(' ')) {
        const typedWord = inputValue.trim();
        const currentWord = words[currentWordIndex];
        
        // Сохраняем историю правильности для текущего слова
        wordHistory[currentWordIndex] = [];
        
        // Подсчитываем правильность слова
        for (let i = 0; i < Math.max(typedWord.length, currentWord.length); i++) {
            totalChars++;
            if (i < typedWord.length && i < currentWord.length && typedWord[i] === currentWord[i]) {
                correctChars++;
                wordHistory[currentWordIndex][i] = 'correct';
            } else {
                wordHistory[currentWordIndex][i] = 'incorrect';
                currentErrors++;
            }
        }
        
        // Переходим к следующему слову
        currentWordIndex++;
        inputValue = '';
        e.target.value = '';
        
        // Если слова закончились, загружаем новый текст
        if (currentWordIndex >= words.length) {
            currentText = texts[Math.floor(Math.random() * texts.length)];
            words = currentText.split(' ');
            currentWordIndex = 0;
            wordHistory = [];
            renderText();
        }
        
        updateDisplay();
        updateStats();
    } else {
        // Обычный ввод символов
        const currentWord = words[currentWordIndex];
        const currentCharIdx = newValue.length - 1;
        
        // Если добавлен символ (не удаление)
        if (newValue.length > oldLength) {
            totalChars++;
            
            // Проверяем правильность нового символа
            if (currentCharIdx < currentWord.length && newValue[currentCharIdx] === currentWord[currentCharIdx]) {
                correctChars++;
            } else {
                // Ошибка - записываем временную метку
                const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
                errorTimestamps.push(elapsedSeconds);
                totalErrors++;
                currentErrors++;
            }
        } 
        // Если удален символ (backspace)
        else if (newValue.length < oldLength) {
            if (totalChars > 0) totalChars--;
            
            // Если удаленный символ был правильным
            if (oldLength <= currentWord.length && inputValue[oldLength - 1] === currentWord[oldLength - 1]) {
                if (correctChars > 0) correctChars--;
            } else {
                // Удален неправильный символ - уменьшаем текущие ошибки
                if (currentErrors > 0) currentErrors--;
            }
        }
        
        inputValue = newValue;
        updateDisplay();
        updateStats();
    }
});

textDisplay.addEventListener('click', () => {
    hiddenInput.focus();
});

hiddenInput.addEventListener('focus', () => {
    focusMessage.classList.add('hidden');
});

hiddenInput.addEventListener('blur', () => {
    if (!isTestActive) {
        focusMessage.classList.remove('hidden');
    }
});

document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const time = parseInt(btn.dataset.time);
        if (!time) return;
        
        selectedTime = time;
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        restartTest();
    });
});

document.addEventListener('keydown', (e) => {
    // Фокус на скрытое поле при любой печати
    if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        hiddenInput.focus();
    }
    
    // Ctrl+Backspace - удалить слово
    if (e.ctrlKey && e.key === 'Backspace') {
        e.preventDefault();
        inputValue = '';
        hiddenInput.value = '';
        updateDisplay();
    }
    
    // Tab или Escape - перезапуск теста
    if ((e.key === 'Tab' || e.key === 'Escape') && !document.getElementById('results').classList.contains('show')) {
        e.preventDefault();
        restartTest();
    }
});

initTest();
hiddenInput.focus();