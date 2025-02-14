let focusTime = 25 * 60; // Default 25 minutes
let breakTime = 5 * 60; // Default 5 minutes
let timeLeft = focusTime;
let timer;
let running = false;

function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function setCustomTime() {
    focusTime = parseInt(document.getElementById("focusTime").value) * 60;
    breakTime = parseInt(document.getElementById("breakTime").value) * 60;
    resetTimer();
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
                document.getElementById('notification').style.display = 'block';
                if (Notification.permission === "granted") {
                    new Notification("Pomodoro Timer", { body: "Time's Up! Take a break!" });
                }
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
    timeLeft = focusTime;
    updateDisplay();
    document.getElementById('notification').style.display = 'none';
}

if ("Notification" in window) {
    Notification.requestPermission();
}

updateDisplay();
