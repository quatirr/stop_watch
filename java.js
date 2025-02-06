let timer;
let running = false;
let time = 0; 
let milliseconds = 0;  
let lapTimes = [];  

const display = document.getElementById("display");
const startStopButton = document.getElementById("startStop");
const lapButton = document.getElementById("lap");
const lapList = document.getElementById("lapList");

function startStop() {
    if (running) {
        clearInterval(timer);
        startStopButton.textContent = "Start";
    } else {
        timer = setInterval(updateTime, 10);  
        startStopButton.textContent = "Stop";
    }
    running = !running;
}

function updateTime() {
    milliseconds++;  
    if (milliseconds >= 100) { 
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
    lapTimes = [];  
    lapList.innerHTML = '';  
}

function recordLap() {
    if (!running) return; 
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    const lapTime = `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}.${formatMilliseconds(milliseconds)}`;

    lapTimes.push(lapTime);
    
    const lapItem = document.createElement("li");
    lapItem.textContent = `Lap ${lapTimes.length}: ${lapTime}`;
    lapItem.draggable = true; 
    lapItem.dataset.index = lapTimes.length - 1; 

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.onclick = function() {
        deleteLap(lapTimes.length - 1, lapItem);  
    };
    lapItem.appendChild(deleteButton);
    
    lapItem.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", lapItem.dataset.index); 
        setTimeout(() => {
            lapItem.classList.add("dragging");
        }, 0);
    });

    lapItem.addEventListener("dragend", () => {
        lapItem.classList.remove("dragging");
    });

    lapItem.addEventListener("dragover", (e) => {
        e.preventDefault(); 
    });

    lapItem.addEventListener("drop", (e) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData("text/plain");
        const droppedIndex = lapItem.dataset.index; 
        [lapTimes[draggedIndex], lapTimes[droppedIndex]] = [lapTimes[droppedIndex], lapTimes[draggedIndex]];

        reorderLapList();
    });

    lapList.appendChild(lapItem);
}

function deleteLap(index, lapItem) {
    lapTimes.splice(index, 1);
    lapList.removeChild(lapItem);
    reorderLapList(); 
}

function reorderLapList() {
    lapList.innerHTML = ''; 
    lapTimes.forEach((lapTime, index) => {
        const lapItem = document.createElement("li");
        lapItem.textContent = `Lap ${index + 1}: ${lapTime}`;
        lapItem.draggable = true; 
        lapItem.dataset.index = index; 
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.onclick = function() {
            deleteLap(index, lapItem);  
        };
        lapItem.appendChild(deleteButton);
        
        // Attach drag events
        lapItem.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", lapItem.dataset.index); 
            setTimeout(() => {
                lapItem.classList.add("dragging");
            }, 0);
        });

        lapItem.addEventListener("dragend", () => {
            lapItem.classList.remove("dragging");
        });

        lapItem.addEventListener("dragover", (e) => {
            e.preventDefault();
        });

        lapItem.addEventListener("drop", (e) => {
            e.preventDefault();
            const draggedIndex = e.dataTransfer.getData("text/plain");
            const droppedIndex = lapItem.dataset.index; 

            [lapTimes[draggedIndex], lapTimes[droppedIndex]] = [lapTimes[droppedIndex], lapTimes[draggedIndex]];

            reorderLapList();
        });

        lapList.appendChild(lapItem);
    });
}
