let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let timer;
let running = false;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateTimeDisplay(type) {
    const value = document.getElementById(type + 'Time').value;
    document.getElementById(type + 'TimeDisplay').textContent = value;
}

function adjustTime(type, amount) {
    let input = document.getElementById(type + 'Time');
    let newValue = parseInt(input.value) + amount;
    if (newValue >= parseInt(input.min) && newValue <= parseInt(input.max)) {
        input.value = newValue;
        updateTimeDisplay(type);
    }
}

function setPreset(focus, breakT) {
    document.getElementById('focusTime').value = focus;
    document.getElementById('breakTime').value = breakT;
    updateTimeDisplay('focus');
    updateTimeDisplay('break');
}

function setCustomTime() {
    focusTime = parseInt(document.getElementById("focusTime").value) * 60;
    breakTime = parseInt(document.getElementById("breakTime").value) * 60;
    resetTimer();
}

function toggleTimer() {
    const button = document.getElementById("startPauseButton");
    if (!running) {
        running = true;
        button.textContent = "Pause";
        button.classList.replace("w3-green", "w3-red");
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                document.getElementById('notification').style.display = 'block';
                clearInterval(timer);
                running = false;
                button.textContent = "Start";
                button.classList.replace("w3-red", "w3-green");
            }
        }, 1000);
    } else {
        clearInterval(timer);
        running = false;
        button.textContent = "Start";
        button.classList.replace("w3-red", "w3-green");
    }
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    timeLeft = focusTime;
    updateDisplay();
    document.getElementById('notification').style.display = 'none';
    const button = document.getElementById("startPauseButton");
    button.textContent = "Start";
    button.classList.replace("w3-red", "w3-green");
}

updateDisplay();
