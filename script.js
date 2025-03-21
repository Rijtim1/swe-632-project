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

/**
 * Updates the timer display and progress ring visualization.
 *
 * Formats the remaining time (in seconds) into minutes and seconds, updates the text content of the HTML element 
 * with id "timer", and refreshes the progress ring by calling updateProgressRing().
 */
function updateDisplay() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;
    document.getElementById('timer').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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
 * If audio notifications are enabled, the function plays a transition sound (logging any playback errors).
 * It then toggles the break state, resets the remaining time to the appropriate duration (focus or break),
 * updates the user interface, and toggles the timer's running state.
 */
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

/**
 * Resets the timer to its default state.
 *
 * This function stops any active timer interval and resets all timer-related state variables, including
 * the focus time (25 minutes), break time (5 minutes), and the remaining time. It updates the UI by setting
 * the focus and break input fields to their default values, restoring the progress ring's stroke dash offset,
 * and resetting the start/pause button's label and style.
 */
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
        updateTimeDisplay(type);
    }
}

/**
 * Updates the time display for the specified timer type and resets related timer values when the timer is paused.
 *
 * Retrieves the value from an input element with an ID based on the given type (e.g., "focusTime" or "breakTime")
 * and updates the associated display element ("focusTimeDisplay" or "breakTimeDisplay"). If the timer is not running,
 * the function sets the corresponding timer duration (in seconds) based on the input value—resetting both the focus
 * period and the countdown if the type is "focus", or updating the break period if otherwise—and then refreshes the UI.
 *
 * @param {string} type - The timer type to update ("focus" or "break").
 */
function updateTimeDisplay(type) {
    const slider = document.getElementById(type + 'Time');
    const input = document.getElementById(type + 'TimeInput');
    const value = slider.value;

    if (input) input.value = value;

    const display = document.getElementById(type + 'TimeDisplay');
    if (display) display.textContent = value;

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


function syncSliderWithInput(type) {
    const input = document.getElementById(type + 'TimeInput');
    const slider = document.getElementById(type + 'Time');
    let value = parseInt(input.value);

    if (isNaN(value)) return;

    const min = parseInt(slider.min);
    const max = parseInt(slider.max);
    value = Math.min(Math.max(value, min), max);

    slider.value = value;
    input.value = value;
    updateTimeDisplay(type);
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
        updateTimeDisplay('focus');
        updateTimeDisplay('break');
        updateDisplay();
    }
}

/**
 * Opens the modal dialog with the given identifier.
 *
 * Retrieves the DOM element corresponding to the provided id and sets its display style
 * to "block", making the modal visible.
 *
 * @param {string} id - The unique identifier of the modal element.
 */
function openModal(id) {
    document.getElementById(id).style.display = "block";
}

/**
 * Closes the modal dialog by hiding the element with the specified id.
 *
 * @param {string} id - The unique identifier of the modal element to close.
 */
function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

/**
 * Opens the help modal dialog.
 *
 * Invokes the generic modal opening function with the "helpModal" identifier to display
 * the help section to the user.
 *
 * @see openModal
 */
function openHelpModal() {
    openModal("helpModal");
}

/**
 * Closes the help modal dialog.
 *
 * Delegates the modal closing action to the generic closeModal function using
 * the "helpModal" identifier.
 */
function closeHelpModal() {
    closeModal("helpModal");
}

/**
 * Opens the settings modal dialog.
 *
 * Invokes the generic modal opening function with the identifier for the settings modal, displaying the settings interface.
 */
function openSettingsModal() {
    openModal("settingsModal");
}

/**
 * Closes the settings modal dialog.
 *
 * This function closes the settings modal by invoking the generic `closeModal`
 * function with the identifier "settingsModal".
 */
function closeSettingsModal() {
    closeModal("settingsModal");
}

/**
 * Updates the audio notification setting in local storage.
 *
 * Retrieves the "audioToggle" checkbox state and saves it under the "audioNotification" key,
 * ensuring the user's preference for audio notifications is persisted.
 */
function toggleAudioSetting() {
    let audioEnabled = document.getElementById("audioToggle").checked;
    localStorage.setItem("audioNotification", audioEnabled);
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

