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
 * Adjusts the displayed status message, timer text color, and the progress ring's stroke color
 * based on the timer's status (running, on break, or focus time).
 */
function updateUI() {
    const statusMessage = document.getElementById("statusMessage");
    const timerDisplay = document.getElementById("timer");
    const isBreak = onBreak && running;
    const isFocus = !onBreak && running;

    // Update status message with text and icons
    statusMessage.innerHTML = !running
        ? '<span><i class="fas fa-play-circle"></i> Press Start to Begin</span>'
        : isBreak
            ? '<span><i class="fas fa-coffee"></i> Break Time! Relax!</span>'
            : '<span><i class="fas fa-briefcase"></i> Focus Time! Stay Productive!</span>';

    statusMessage.classList.toggle("focus-mode", isFocus);
    statusMessage.classList.toggle("break-mode", isBreak);

    const color = !running
        ? "gray"
        : isBreak
            ? "#3498db" // Blue for break
            : "#28a745"; // Green for focus

    timerDisplay.style.color = color;
    progressRing.style.stroke = color;
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
    const pauseIndicator = document.getElementById("pauseIndicator");
    const timerContainer = document.querySelector(".timer-container");

    if (!running) {
        running = true;
        button.innerHTML = '<i class="fas fa-pause"></i> Pause'; // Update icon to pause
        button.classList.replace("w3-green", "w3-red");
        pauseIndicator.style.display = "none";
        timerContainer.classList.remove("paused");
        progressRing.classList.remove("paused");
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
        button.innerHTML = '<i class="fas fa-play"></i> Start'; // Update icon to play
        button.classList.replace("w3-red", "w3-green");
        pauseIndicator.style.display = "block";
        timerContainer.classList.add("paused");
        progressRing.classList.add("paused");
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
        updateBreakCount();
        if (focusCount > 0) {
            updateCycleCount();
        }
    } else {
        updateFocusCount();
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
    button.innerHTML = '<i class="fas fa-play"></i> Start'; // Update icon to play
    button.classList.replace("w3-red", "w3-green");
}

/**
 * Updates the cycle tracking display with the latest counts.
 */
function updateCycleTracking() {
  const dailyFocusGoal = parseInt(localStorage.getItem('dailyFocusGoal') || 4);
  const dailyBreakGoal = parseInt(localStorage.getItem('dailyBreakGoal') || 4);
  const dailyCycleGoal = parseInt(localStorage.getItem('dailyCycleGoal') || 2);

  document.getElementById("cycleCount").textContent = cycleCount;
  document.getElementById("focusCount").textContent = focusCount;
  document.getElementById("breakCount").textContent = breakCount;

  const focusBar = document.getElementById("focusBar");
  const breakBar = document.getElementById("breakBar");
  const cycleBar = document.getElementById("cycleBar");

  focusBar.style.width = `${(focusCount / dailyFocusGoal) * 100}%`;
  breakBar.style.width = `${(breakCount / dailyBreakGoal) * 100}%`;
  cycleBar.style.width = `${(cycleCount / dailyCycleGoal) * 100}%`;

  if (focusCount >= dailyFocusGoal) focusBar.classList.add("goal-met");
  else focusBar.classList.remove("goal-met");

  if (breakCount >= dailyBreakGoal) breakBar.classList.add("goal-met");
  else breakBar.classList.remove("goal-met");

  if (cycleCount >= dailyCycleGoal) cycleBar.classList.add("goal-met");
  else cycleBar.classList.remove("goal-met");
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

    if (value < Number(slider.min) || value > Number(slider.max)) {
        notificationSettings.textContent = `The value must be between ${Number(slider.min)} and ${Number(slider.max)}.`;
        return;
    }

    notificationSettings.textContent = "";
    slider.value = input.value = value;

    if (!running) {
        if (type === 'focus') focusTime = value * 60;
        else breakTime = value * 60;

        if (type === 'focus') timeLeft = focusTime;
        updateDisplay();
    }
}

/**
 * Sets custom preset durations for focus and break periods when the timer is not running.
 *
 * @param {number} focus - The focus duration in minutes.
 * @param {number} breakT - The break duration in minutes.
 */
function setPreset(focus, breakT) {
    if (running) {
        document.getElementById('notificationSettings').textContent =
            "Cannot change presets while the timer is running. Please pause or reset the timer.";
        return;
    }

    focusTime = focus * 60;
    breakTime = breakT * 60;
    timeLeft = focusTime;
    onBreak = false;

    ['focus', 'break'].forEach(type => {
        const value = type === 'focus' ? focus : breakT;
        document.getElementById(`${type}Time`).value = value;
        document.getElementById(`${type}TimeInput`).value = value;
        updateTime(type, value);
    });

    updateDisplay();
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

window.onload = function() {
  loadSettings();
  loadGoalsFromLocalStorage();
  updateDisplay();
  updateUI();
};

/**
 * Synchronizes the slider value with the input field for time settings.
 *
 * @param {string} type - The timer type to update ("focus" or "break").
 */
function syncSliderWithInput(type) {
    const input = document.getElementById(`${type}TimeInput`);
    const slider = document.getElementById(`${type}Time`);
    const value = parseInt(input.value);

    if (value >= parseInt(slider.min) && value <= parseInt(slider.max)) {
        slider.value = value;
        updateTime(type, value);
    } else {
        input.value = slider.value; // Reset input to slider's value if out of bounds
    }
}

/**
 * Synchronizes the input field value with the slider for time settings.
 *
 * @param {string} type - The timer type to update ("focus" or "break").
 */
function syncInputWithSlider(type) {
    const slider = document.getElementById(`${type}Time`);
    const input = document.getElementById(`${type}TimeInput`);
    const value = parseInt(slider.value);

    input.value = value;
    updateTime(type, value);
}

/**
 * Shows a confirmation dialog before resetting the timer.
 */
function confirmReset() {
    if (confirm("Are you sure you want to reset the timer? This will erase all progress.")) {
        resetTimer();
    }
}

/**
 * Skips the current phase and transitions to the next one.
 *
 * If the current phase is focus, it transitions to break, and vice versa.
 * Updates the timer, UI, and cycle tracking accordingly.
 */
function skipPhase() {
    clearInterval(timer);
    running = false;

    if (onBreak) {
        updateBreakCount();
        if (focusCount > 0) {
            updateCycleCount();
        }
    } else {
        updateFocusCount();
    }

    onBreak = !onBreak;
    timeLeft = onBreak ? breakTime : focusTime;

    updateUI();
    updateDisplay();
    updateCycleTracking();

    // Update pause indicator to reflect paused state
    const pauseIndicator = document.getElementById("pauseIndicator");
    pauseIndicator.style.display = "block"; // Show pause indicator

    // Update timer container to reflect the new phase
    const timerContainer = document.getElementById("timerContainer");
    timerContainer.classList.toggle("break-phase", onBreak);

    // Reset progress ring for the new phase
    progressRing.style.strokeDashoffset = circumference;

    // Update start/pause button to reflect paused state
    const button = document.getElementById("startPauseButton");
    button.innerHTML = '<i class="fas fa-play"></i> Start'; // Reset button to start
    button.classList.replace("w3-red", "w3-green");
}

/**
 * Adds a flash animation to an element when its value is updated.
 *
 * @param {HTMLElement} el - The element to animate.
 */
function flashUpdate(el) {
    el.classList.add('updated');
    setTimeout(() => el.classList.remove('updated'), 400);
}

/**
 * Increments the cycle count and updates the display with an animation.
 */
function updateCycleCount() {
    cycleCount++;
    document.getElementById('cycleCount').textContent = cycleCount;
    flashUpdate(document.getElementById('cycleCount'));
}

/**
 * Increments the focus count and updates the display with an animation.
 */
function updateFocusCount() {
    focusCount++;
    document.getElementById('focusCount').textContent = focusCount;
    flashUpdate(document.getElementById('focusCount'));
}

/**
 * Increments the break count and updates the display with an animation.
 */
function updateBreakCount() {
    breakCount++;
    document.getElementById('breakCount').textContent = breakCount;
    flashUpdate(document.getElementById('breakCount'));
}

/**
 * Saves daily goals to local storage.
 */
function saveGoalsToLocalStorage() {
  const dailyFocusGoal = document.getElementById('dailyFocusGoal').value;
  const dailyBreakGoal = document.getElementById('dailyBreakGoal').value;
  const dailyCycleGoal = document.getElementById('dailyCycleGoal').value;

  localStorage.setItem('dailyFocusGoal', dailyFocusGoal);
  localStorage.setItem('dailyBreakGoal', dailyBreakGoal);
  localStorage.setItem('dailyCycleGoal', dailyCycleGoal);
}

/**
 * Loads daily goals from local storage.
 */
function loadGoalsFromLocalStorage() {
  const dailyFocusGoal = localStorage.getItem('dailyFocusGoal') || 4;
  const dailyBreakGoal = localStorage.getItem('dailyBreakGoal') || 4;
  const dailyCycleGoal = localStorage.getItem('dailyCycleGoal') || 2;

  document.getElementById('dailyFocusGoal').value = dailyFocusGoal;
  document.getElementById('dailyBreakGoal').value = dailyBreakGoal;
  document.getElementById('dailyCycleGoal').value = dailyCycleGoal;
}

