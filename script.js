let timeLeft = 25 * 60; // Default 25 minutes
let timer;
let running = false;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function startTimer() {
    if (!running) {
        running = true;
        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                document.getElementById('alarm').play();
                clearInterval(timer);
                running = false;
            }
        }, 1000);
    }
}

function pauseTimer() {
    clearInterval(timer);
    running = false;
}

function resetTimer() {
    clearInterval(timer);
    running = false;
    timeLeft = 25 * 60;
    updateDisplay();
}

updateDisplay();