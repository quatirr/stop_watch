// script.js
let timer;
let running = false;
let time = 0;  // Time in seconds
let milliseconds = 0;  // Milliseconds
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
        timer = setInterval(updateTime, 10);  // Update every 10ms
        startStopButton.textContent = "Stop";
    }
    running = !running;
}

function updateTime() {
    milliseconds++;  // Increment milliseconds
    if (milliseconds >= 100) {  // If 100 ms is reached, increment 1 second
        milliseconds = 0;
        time++;
    }

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    display.textContent = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;
}

function formatTime(unit) {
    return unit < 10 ? `0${unit}` : unit;
}

function formatMilliseconds(ms) {
    return ms < 10 ? `00${ms}` : ms < 100 ? `0${ms}` : ms;
}

function reset() {
    clearInterval(timer);
    running = false;
    time = 0;
    milliseconds = 0;
    display.textContent = "00:00:00.000";
    startStopButton.textContent = "Start";
    lapTimes = [];  // Clear lap times array
    lapList.innerHTML = '';  // Clear lap list display
}

function recordLap() {
    if (!running) return; // Don't record laps if stopwatch is stopped

    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const lapTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;

    // Save lap time in the array
    lapTimes.push(lapTime);
    
    // Display the lap in the list with a delete button
    const lapItem = document.createElement("li");
    lapItem.textContent = `Lap ${lapTimes.length}: ${lapTime}`;
    
    // Create a delete button for each lap
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        deleteLap(lapTimes.length - 1, lapItem);  // Pass lap index and lap element
    };
    lapItem.appendChild(deleteButton);
    
    lapList.appendChild(lapItem);
}

function deleteLap(index, lapItem) {
    // Remove lap from the array
    lapTimes.splice(index, 1);
    
    // Remove lap item from the list
    lapList.removeChild(lapItem);

    // Re-number the remaining laps
    const lapItems = lapList.getElementsByTagName("li");
    for (let i = 0; i < lapItems.length; i++) {
        // Update each lap text with correct lap number and time
        lapItems[i].textContent = `Lap ${i + 1}: ${lapTimes[i]}`;
        
        // Create a new delete button for each lap
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            deleteLap(i, lapItems[i]);  // Adjust the lap index for the delete
        };
        lapItems[i].appendChild(deleteButton);  // Add the delete button back
    }
}
