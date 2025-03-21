// Timer settings and state variables
let focusTime = 25 * 60; // Default focus time in seconds
let breakTime = 5 * 60; // Default break time in seconds
let timeLeft = focusTime; // Remaining time for the current session
let timer; // Reference to the interval timer
let running = false; // Indicates if the timer is running
let onBreak = false; // Indicates if the current session is a break
let cycleCount = 0; // Number of completed focus-break cycles
let focusCount = 0; // Number of completed focus sessions
let breakCount = 0; // Number of completed break sessions

// Progress ring visualization setup
const progressRing = document.querySelector('.progress-ring__circle');
const radius = progressRing.r.baseVal.value; // Radius of the progress ring
const circumference = 2 * Math.PI * radius; // Circumference of the progress ring
progressRing.style.strokeDasharray = `${circumference} ${circumference}`; // Set dash array for the ring
progressRing.style.strokeDashoffset = circumference; // Initialize offset to full circumference

// Helper function to format time as MM:SS
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

/**
 * Updates the timer display and progress ring visualization.
 *
 * Formats the remaining time (in seconds) into minutes and seconds, updates the text content of the HTML element 
 * with id "timer", and refreshes the progress ring by calling updateProgressRing().
 */
function updateDisplay() {
    document.getElementById('timer').textContent = formatTime(timeLeft);
    updateProgressRing();
}

/**
 * Updates the progress ring's visual gauge based on the timer's remaining time.
 *
 * The function calculates the stroke dash offset by scaling the remaining time (timeLeft)
 * against the total duration of the current period (breakTime if on break, otherwise focusTime)
 * using the progress ring's circumference. It then applies this computed value to the progress ring's
 * strokeDashoffset, visually representing the current progress of the timer.
 */
function updateProgressRing() {
    const progress = (timeLeft / (onBreak ? breakTime : focusTime)) * circumference;
    progressRing.style.strokeDashoffset = progress;
}

/**
 * Updates the timer UI to reflect its current state.
 *
 * This function adjusts the displayed status message, timer text color, and the progress ring's stroke color
 * based on the timer's status:
 * - When the timer is not running, it shows a prompt ("Press Start to Begin") and applies a gray color scheme.
 * - If the timer is on break, it displays "Break Time! Relax!", updates the CSS classes for break mode,
 *   and uses blue coloring.
 * - Otherwise, during focus time, it shows "Focus Time! Stay Productive!", applies focus mode classes,
 *   and uses green styling.
 */
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
        timerDisplay.style.color = "#3498db"; // Relaxing blue
        progressRing.style.stroke = "#3498db"; // Blue for break
    } else {
        statusMessage.textContent = "Focus Time! Stay Productive!";
        statusMessage.classList.remove("break-mode");
        statusMessage.classList.add("focus-mode");
        timerDisplay.style.color = "#28a745"; // Calming green
        progressRing.style.stroke = "#28a745"; // Green for focus
    }
}

/**
 * Toggles the timer between running and paused states.
 *
 * When starting the timer, it updates the UI by changing the button's label and style,
 * begins a countdown that decrements the remaining time every second, and eventually invokes
 * the timer end handler when the countdown reaches zero. When pausing, it stops the countdown
 * and resets the UI to indicate that the timer is not active.
 */
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

/**
 * Handles the timer's transition when the current period ends.
 *
 * Tracks completed focus and break sessions, increments the cycle count
 * after a full focus and break session, and updates the UI accordingly.
 */
function handleTimerEnd() {
    const audio = document.getElementById('transitionSound');
    if (localStorage.getItem("audioNotification") === "true") {
        audio.play().catch(error => {
            console.error("Error playing sound:", error);
            alert("Unable to play notification sound. Please check your audio settings.");
        });
    }

    if (onBreak) {
        breakCount++;
        if (focusCount > 0) {
            cycleCount++;
        }
    } else {
        focusCount++;
    }

    onBreak = !onBreak;
    timeLeft = onBreak ? breakTime : focusTime;
    updateUI();
    updateCycleTracking();
    toggleTimer();
}

/**
 * Resets the timer and cycle tracking to their default states.
 */
function resetTimer() {
    clearInterval(timer);
    running = false;
    onBreak = false;
    focusTime = 25 * 60;
    breakTime = 5 * 60;
    timeLeft = focusTime;
    cycleCount = 0;
    focusCount = 0;
    breakCount = 0;
    document.getElementById('focusTime').value = 25;
    document.getElementById('breakTime').value = 5;
    document.getElementById('focusTimeInput').value = 25;
    document.getElementById('breakTimeInput').value = 5;
    const notificationSettings = document.getElementById('notificationSettings');
    notificationSettings.textContent = "";
    updateUI();
    updateDisplay();
    updateCycleTracking();
    progressRing.style.strokeDashoffset = circumference;

    const button = document.getElementById("startPauseButton");
    button.textContent = "Start";
    button.classList.replace("w3-red", "w3-green");
}

/**
 * Updates the cycle tracking display with the latest counts.
 */
function updateCycleTracking() {
    document.getElementById("cycleCount").textContent = cycleCount;
    document.getElementById("focusCount").textContent = focusCount;
    document.getElementById("breakCount").textContent = breakCount;
}

/**
 * Adjusts the value of a time input element by a specified increment or decrement.
 *
 * Retrieves the input element corresponding to the time type (e.g., "focus" or "break")
 * and increases its value by the given amount. If the new value is within the element's
 * defined minimum and maximum limits, the function updates both the input element and
 * the displayed time.
 *
 * @param {string} type - The identifier for the time input element (e.g., "focus" or "break").
 * @param {number} amount - The value to add (or subtract) from the current time setting.
 */
function adjustTime(type, amount) {
    let input = document.getElementById(type + 'Time');
    let newValue = parseInt(input.value) + amount;
    if (newValue >= parseInt(input.min) && newValue <= parseInt(input.max)) {
        input.value = newValue;
        updateTime(type, newValue);
    }
}

/**
 * Synchronizes the slider and input field for time settings.
 *
 * @param {string} type - The timer type to update ("focus" or "break").
 * @param {number} value - The new value to set.
 */
function updateTime(type, value) {
    const slider = document.getElementById(type + 'Time');
    const input = document.getElementById(type + 'TimeInput');
    const notificationSettings = document.getElementById('notificationSettings');

    const min = parseInt(slider.min);
    const max = parseInt(slider.max);

    if (value < min || value > max) {
        notificationSettings.textContent = `The value must be between ${min} and ${max}.`;
        return;
    }

    notificationSettings.textContent = "";
    slider.value = value;
    input.value = value;

    if (!running) {
        if (type === 'focus') {
            focusTime = value * 60;
            timeLeft = focusTime;
        } else {
            breakTime = value * 60;
        }
        updateDisplay();
    }
}

/**
 * Sets custom preset durations for focus and break periods when the timer is not running.
 *
 * This function converts the provided focus and break durations from minutes to seconds, updates the global timer settings,
 * resets the timer to focus mode, and refreshes the UI elements. No changes are made if the timer is currently active.
 *
 * @param {number} focus - The focus duration in minutes.
 * @param {number} breakT - The break duration in minutes.
 */
function setPreset(focus, breakT) {
    if (!running) {
        focusTime = focus * 60;
        breakTime = breakT * 60;
        timeLeft = focusTime;
        onBreak = false;
        document.getElementById('focusTime').value = focus;
        document.getElementById('breakTime').value = breakT;
        // update the number input fields
        document.getElementById('focusTimeInput').value = focus;
        document.getElementById('breakTimeInput').value = breakT;
        updateTime('focus', focus);
        updateTime('break', breakT);
        updateDisplay();
    } else {
        const notificationSettings = document.getElementById('notificationSettings');
        notificationSettings.textContent = "Cannot change presets while the timer is running. Please pause or reset the timer.";
    }
}

/**
 * Toggles the visibility of a modal dialog.
 *
 * @param {string} id - The unique identifier of the modal element.
 * @param {boolean} isOpen - Whether to open (true) or close (false) the modal.
 */
function toggleModal(id, isOpen) {
    document.getElementById(id).style.display = isOpen ? "block" : "none";
}

/**
 * Updates the audio notification setting in local storage and UI.
 */
function toggleAudioSetting() {
    let audioEnabled = document.getElementById("audioToggle").checked;
    localStorage.setItem("audioNotification", audioEnabled);
    document.getElementById("audioStatus").textContent = audioEnabled
        ? "Audio notifications are enabled."
        : "Audio notifications are disabled.";
}

/**
 * Loads the audio notification setting from localStorage and updates the corresponding UI toggle.
 *
 * Retrieves the "audioNotification" value from localStorage, converts it to a boolean,
 * and sets the checked state of the "audioToggle" element accordingly.
 */
function loadSettings() {
    let audioEnabled = localStorage.getItem("audioNotification") === "true";
    document.getElementById("audioToggle").checked = audioEnabled;
    document.getElementById("audioStatus").textContent = audioEnabled
        ? "Audio notifications are enabled."
        : "Audio notifications are disabled.";
}

/**
 * Initializes the timer application.
 *
 * Loads user settings, updates the timer display, and refreshes the UI to reflect
 * the current state of the timer. This function should be invoked during the
 * application's startup process.
 */
function init() {
    loadSettings();
    updateDisplay();
    updateUI();
}

window.onload = init;

