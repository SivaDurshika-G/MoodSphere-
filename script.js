// Get elements
const moodSelector = document.getElementById('mood');
const noteInput = document.getElementById('note');
const saveButton = document.getElementById('save');
const resetButton = document.getElementById('reset');
const calendarContainer = document.getElementById('calendar');

// Function to load the calendar and moods
function loadCalendar() {
  const currentDate = new Date();
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  
  // Create the calendar grid
  calendarContainer.innerHTML = '';
  for (let i = 1; i <= daysInMonth; i++) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = i;
    dayDiv.dataset.day = i;

    // Load mood from LocalStorage if exists
    const savedMood = localStorage.getItem(`moodDay${i}`);
    const savedNote = localStorage.getItem(`noteDay${i}`);
    
    if (savedMood) {
      dayDiv.style.backgroundColor = savedMood;
    }
    
    // Add click event to select mood for that day
    dayDiv.addEventListener('click', () => {
      moodSelector.value = savedMood || 'neutral';
      noteInput.value = savedNote || '';
    });

    calendarContainer.appendChild(dayDiv);
  }
}

// Save mood and note to LocalStorage
saveButton.addEventListener('click', () => {
  const selectedMood = moodSelector.value;
  const selectedDay = document.querySelector('.calendar .selected')?.dataset.day;

  if (selectedDay) {
    localStorage.setItem(`moodDay${selectedDay}`, selectedMood);
    localStorage.setItem(`noteDay${selectedDay}`, noteInput.value);

    // Update the calendar with the selected mood color
    const dayDiv = document.querySelector(`.calendar div[data-day="${selectedDay}"]`);
    if (dayDiv) {
      dayDiv.style.backgroundColor = selectedMood;
    }
  }
});

// Reset all data in LocalStorage
resetButton.addEventListener('click', () => {
  localStorage.clear();
  loadCalendar();
});

// Function to show notification
function showNotification() {
  if (Notification.permission === "granted") {
    new Notification("Don't forget to log your mood for the day!");
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        new Notification("Don't forget to log your mood for the day!");
      }
    });
  }
}

// Schedule daily reminder (at 8 PM)
function scheduleReminder() {
  const now = new Date();
  const timeToReminder = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 20, 0, 0); // 8 PM today
  const timeUntilReminder = timeToReminder - now;

  if (timeUntilReminder > 0) {
    setTimeout(() => {
      showNotification();
    }, timeUntilReminder);
  }
}

// Initial calendar load and schedule reminder
loadCalendar();
scheduleReminder();