const moodButtons = document.querySelectorAll('.mood-btn');
const noteInput = document.getElementById('note');
const saveMoodBtn = document.getElementById('saveMoodBtn');
const historyList = document.querySelector('.history ul');
const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];

// Permission for notification on loading page
if ('Notification' in window && Notification.permission !== 'granted') {
    Notification.requestPermission();
}

// Get current date and time
function getCurrentDateTime() {
    const now = new Date();
    const date = now.toLocaleDateString(); // Formats date as 'MM/DD/YYYY'
    const time = now.toLocaleTimeString(); // Formats time as 'HH:MM:SS AM/PM'
    return `${date} ${time}`;
}

// Update the mood history UI
function updateHistory() {
    historyList.innerHTML = ''; // Clear the history list
    moodHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span><strong>${item.mood}</strong> - ${item.date}</span>
            ${item.note ? `<p>Note: ${item.note}</p>` : ''}
            <button class="remove-btn" onclick="removeMood(${item.id})">Remove</button>
        `;
        historyList.appendChild(listItem);
    });
}

// Save mood to local storage
function saveMood() {
    const selectedMood = document.querySelector('.mood-btn.selected');
    if (!selectedMood) {
        alert('Please select a mood!');
        return;
    }
    const mood = selectedMood.innerText;
    const note = noteInput.value.trim();
    const dateTime = getCurrentDateTime();
    
    const moodData = {
        id: new Date().getTime(),
        mood,
        note,
        date: dateTime
    };

    moodHistory.push(moodData);
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));

    updateHistory(); // Refresh the history list

    // Reset the UI
    document.querySelector('.mood-btn.selected')?.classList.remove('selected');
    noteInput.value = '';
}

// Remove mood from history
function removeMood(id) {
    const index = moodHistory.findIndex(item => item.id === id);
    if (index !== -1) {
        moodHistory.splice(index, 1);
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
        updateHistory(); // Refresh the history list
    }
}

// Add event listener to mood buttons
moodButtons.forEach(button => {
    button.addEventListener('click', () => {
        moodButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
    });
});

// Add event listener to save button
saveMoodBtn.addEventListener('click', saveMood);

// Initialize the app
updateHistory();

const themeSwitch = document.getElementById('themeSwitch');

// Apply previously selected theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
    themeSwitch.checked = true;
}

// Toggle on switch change
themeSwitch.addEventListener('change', () => {
    if (themeSwitch.checked) {
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
});

// Set reminder time
const setReminderBtn = document.getElementById('setReminderBtn');
const reminderInput = document.getElementById('reminderTime');

setReminderBtn.addEventListener('click', () => {
    const time = reminderInput.value;
    if (time) {
        localStorage.setItem('reminderTime', time);

        if (Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission === 'denied') {
                    alert('You have blocked notifications. Please enable them in your browser settings to receive mood reminders.');
                }
            });
        }

        alert('Reminder time saved!');
    }
});

// Check for reminder every 60 seconds
let lastNotificationTime = null;

setInterval(() => {
    const reminderTime = localStorage.getItem('reminderTime');
    if (!reminderTime || Notification.permission !== 'granted') return;

    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5); 

    if (currentTime === reminderTime && currentTime !== lastNotificationTime) {
        new Notification('Mood Tracker', {
            body: "It's time to log your mood",
        });
        lastNotificationTime = currentTime;
    }
}, 60000);

