let focusTime = 25 * 60;
let breakTime = 5 * 60;
let timeLeft = focusTime;
let timer;
let running = false;
let onBreak = false;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    // Ensure the correct status message and color is set when the page loads
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = "Focus Time! Stay Productive!";
    statusMessage.classList.add("focus-mode");
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
        onBreak = false;

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
    }
}

function handleTimerEnd() {
    const statusMessage = document.getElementById('statusMessage');
    const timerDisplay = document.getElementById('timer');
    const audio = document.getElementById('transitionSound');

    audio.play(); // Play transition sound

    if (!onBreak) {
        // Switch to break time
        statusMessage.textContent = "Break Time! Relax!";
        statusMessage.classList.remove("focus-mode");
        statusMessage.classList.add("break-mode");
        timerDisplay.style.color = "blue";
        timeLeft = breakTime;
        onBreak = true; // Stay in break mode

        // Delay restarting the timer to prevent flickering
        setTimeout(() => toggleTimer(), 1000);
    } else {
        // Switch back to focus time
        statusMessage.textContent = "Focus Time! Stay Productive!";
        statusMessage.classList.remove("break-mode");
        statusMessage.classList.add("focus-mode");
        timerDisplay.style.color = "green";
        timeLeft = focusTime;
        onBreak = false; // Reset break mode

        // Restart the focus timer without flickering
        setTimeout(() => toggleTimer(), 1000);
    }
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
    updateTimeDisplay('focus');
    updateTimeDisplay('break');
    updateDisplay();

    document.getElementById('statusMessage').textContent = "Focus Time! Stay Productive!";
    document.getElementById('statusMessage').style.color = "green";

    const button = document.getElementById("startPauseButton");
    button.textContent = "Start";
    button.classList.replace("w3-red", "w3-green");
}

updateDisplay();
