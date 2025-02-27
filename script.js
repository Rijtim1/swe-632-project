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

    // Only update values if the timer is NOT running
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

function adjustTime(type, amount) {
    let input = document.getElementById(type + 'Time');
    let newValue = parseInt(input.value) + amount;
    if (newValue >= parseInt(input.min) && newValue <= parseInt(input.max)) {
        input.value = newValue;
        updateTimeDisplay(type);
    }
}

function setPreset(focus, breakT) {
    if (!running) {
        focusTime = focus * 60;
        breakTime = breakT * 60;
        timeLeft = focusTime;

        document.getElementById('focusTime').value = focus;
        document.getElementById('breakTime').value = breakT;
        updateTimeDisplay('focus');
        updateTimeDisplay('break');
        updateDisplay();
    }
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

    // Reset to default 25/5 minutes
    focusTime = 25 * 60;
    breakTime = 5 * 60;
    timeLeft = focusTime;

    // Update UI elements
    document.getElementById('focusTime').value = 25;
    document.getElementById('breakTime').value = 5;
    updateTimeDisplay('focus');
    updateTimeDisplay('break');
    updateDisplay();

    document.getElementById('notification').style.display = 'none';
    const button = document.getElementById("startPauseButton");
    button.textContent = "Start";
    button.classList.replace("w3-red", "w3-green");
}

updateDisplay();
