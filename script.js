let timeLeft = 25 * 60; // 1 minute for testing 
// default will be  25 minutes
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
    timeLeft = 25 * 60;
    updateDisplay();
    document.getElementById('notification').style.display = 'none';
}

if ("Notification" in window) {
    Notification.requestPermission();
}

updateDisplay();