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
    const focusInput = document.getElementById("focusTime").value;
    const breakInput = document.getElementById("breakTime").value;
    
    if (!focusInput || !breakInput || isNaN(focusInput) || isNaN(breakInput)) {
        alert("Please enter valid numbers for both focus and break time");
        return;
    }
    
    const newFocusTime = parseInt(focusInput);
    const newBreakTime = parseInt(breakInput);
    
    if (newFocusTime < 1 || newBreakTime < 1 || newFocusTime > 120 || newBreakTime > 60) {
        alert("Focus time should be between 1-120 minutes and break time between 1-60 minutes");
        return;
    }
    
    focusTime = newFocusTime * 60;
    breakTime = newBreakTime * 60;
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
