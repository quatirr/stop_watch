// script.js
let timer;
let running = false;
let time = 0;  // Time in seconds
let lapTimes = [];  // Array to store lap times

const display = document.getElementById("display");
const startStopButton = document.getElementById("startStop");
const lapButton = document.getElementById("lap");
const lapList = document.getElementById("lapList");

function startStop() {
    if (running) {
        clearInterval(timer);
        startStopButton.textContent = "Start";
    } else {
        timer = setInterval(updateTime, 1000);
        startStopButton.textContent = "Stop";
    }
    running = !running;
}

function updateTime() {
    time++;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    
    display.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
}

function formatTime(unit) {
    return unit < 10 ? `0${unit}` : unit;
}

function reset() {
    clearInterval(timer);
    running = false;
    time = 0;
    display.textContent = "00:00:00";
    startStopButton.textContent = "Start";
    lapTimes = [];  // Clear lap times array
    lapList.innerHTML = '';  // Clear lap list display
}

function recordLap() {
    if (!running) return; // Don't record laps if stopwatch is stopped

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    // Save lap time in the array
    lapTimes.push(`${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`);
    
    // Display the lap in the list
    const lapItem = document.createElement("li");
    lapItem.textContent = `Lap ${lapTimes.length}: ${lapTimes[lapTimes.length - 1]}`;
    lapList.appendChild(lapItem);
}
