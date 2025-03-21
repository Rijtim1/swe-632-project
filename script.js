let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let timer;
let running = false;
let onBreak = false;

const progressRing = document.querySelector('.progress-ring__circle');
const radius = progressRing.r.baseVal.value;
const circumference = 2 * Math.PI * radius;
progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
progressRing.style.strokeDashoffset = circumference;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    updateProgressRing();
}

function updateProgressRing() {
    const progress = (timeLeft / (onBreak ? breakTime : focusTime)) * circumference;
    progressRing.style.strokeDashoffset = progress;
}

function updateUI() {
    const statusMessage = document.getElementById("statusMessage");
    const timerDisplay = document.getElementById("timer");
    
    if (!running) {
        statusMessage.textContent = "Press Start to Begin";
        timerDisplay.style.color = "gray";
        progressRing.style.stroke = "gray";
    } else if (onBreak) {
        statusMessage.textContent = "Break Time! Relax!";
        statusMessage.classList.remove("focus-mode");
        statusMessage.classList.add("break-mode");
        timerDisplay.style.color = "blue";
        progressRing.style.stroke = "#2196F3"; // Blue for break
    } else {
        statusMessage.textContent = "Focus Time! Stay Productive!";
        statusMessage.classList.remove("break-mode");
        statusMessage.classList.add("focus-mode");
        timerDisplay.style.color = "green";
        progressRing.style.stroke = "#4CAF50"; // Green for focus
    }
}

function toggleTimer() {
    const button = document.getElementById("startPauseButton");

    if (!running) {
        running = true;
        button.textContent = "Pause";
        button.classList.replace("w3-green", "w3-red");
        updateUI();

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                clearInterval(timer);
                running = false;
                handleTimerEnd();
            }
        }, 1000);
    } else {
        clearInterval(timer);
        running = false;
        button.textContent = "Start";
        button.classList.replace("w3-red", "w3-green");
        updateUI();
    }
}

function handleTimerEnd() {
    const audio = document.getElementById('transitionSound');
    if (localStorage.getItem("audioNotification") === "true") {
        audio.play().catch(error => console.error("Error playing sound:", error));
    }
    onBreak = !onBreak;
    timeLeft = onBreak ? breakTime : focusTime;
    updateUI();
    toggleTimer();
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    onBreak = false;
    focusTime = 25 * 60;
    breakTime = 5 * 60;
    timeLeft = focusTime;
    document.getElementById('focusTime').value = 25;
    document.getElementById('breakTime').value = 5;
    updateUI();
    updateDisplay();
    progressRing.style.strokeDashoffset = circumference;

    const button = document.getElementById("startPauseButton");
    button.textContent = "Start";
    button.classList.replace("w3-red", "w3-green");
}

function adjustTime(type, amount) {
    let input = document.getElementById(type + 'Time');
    let newValue = parseInt(input.value) + amount;
    if (newValue >= parseInt(input.min) && newValue <= parseInt(input.max)) {
        input.value = newValue;
        updateTimeDisplay(type);
    }
}

function updateTimeDisplay(type) {
    const value = document.getElementById(type + 'Time').value;
    document.getElementById(type + 'TimeDisplay').textContent = value;

    if (!running) {
        if (type === 'focus') {
            focusTime = parseInt(value) * 60;
            timeLeft = focusTime;
        } else {
            breakTime = parseInt(value) * 60;
        }
        updateDisplay();
    }
}

function setPreset(focus, breakT) {
    if (!running) {
        focusTime = focus * 60;
        breakTime = breakT * 60;
        timeLeft = focusTime;
        onBreak = false;
        document.getElementById('focusTime').value = focus;
        document.getElementById('breakTime').value = breakT;
        updateTimeDisplay('focus');
        updateTimeDisplay('break');
        updateDisplay();
    }
}

function openModal(id) {
    document.getElementById(id).style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function openHelpModal() {
    openModal("helpModal");
}

function closeHelpModal() {
    closeModal("helpModal");
}

function openSettingsModal() {
    openModal("settingsModal");
}

function closeSettingsModal() {
    closeModal("settingsModal");
}

function toggleAudioSetting() {
    let audioEnabled = document.getElementById("audioToggle").checked;
    localStorage.setItem("audioNotification", audioEnabled);
}

function loadSettings() {
    let audioEnabled = localStorage.getItem("audioNotification") === "true";
    document.getElementById("audioToggle").checked = audioEnabled;
}

function init() {
    loadSettings();
    updateDisplay();
    updateUI();
}

window.onload = init;

