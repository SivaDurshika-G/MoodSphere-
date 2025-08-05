// script.js

(function() {
  'use strict';

  // --- Safe element references ---
  const moodButtons    = document.querySelectorAll('.mood-btn');
  const noteInput      = document.getElementById('note');
  const saveMoodBtn    = document.getElementById('saveMoodBtn');
  const historyList    = document.getElementById('historyList');
  const themeSwitch    = document.getElementById('themeSwitch');
  const setReminderBtn = document.getElementById('setReminderBtn');
  const reminderInput  = document.getElementById('reminderTime');
  const streakCount    = document.getElementById('streakCount');
  const resetBtn       = document.getElementById('resetBtn');
  const reminderStatus = document.getElementById('reminderStatus');

  // --- Load mood history safely ---
  let moodHistory = [];
  try {
    moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
  } catch {
    moodHistory = [];
  }

  // --- Theme Management ---
  (function initTheme() {
    const dark = localStorage.getItem('darkMode') === 'true';
    document.body.classList.toggle('dark', dark);
    if (themeSwitch) themeSwitch.checked = dark;
  })();

  if (themeSwitch) {
    themeSwitch.addEventListener('change', () => {
      const dark = themeSwitch.checked;
      document.body.classList.toggle('dark', dark);
      localStorage.setItem('darkMode', dark);
    });
  }

  // --- Custom Notification System ---
  function showCustomNotification(message, icon = '⏰') {
    const notification = document.getElementById('customNotification');
    if (!notification) return;
    const txt = notification.querySelector('.notification-text');
    const ic  = notification.querySelector('.notification-icon');
    if (!txt || !ic) return;
    txt.textContent = message;
    ic.textContent  = icon;
    notification.classList.add('show');
    setTimeout(() => notification.classList.remove('show'), 5000);
  }
  window.closeNotification = () => {
    const n = document.getElementById('customNotification');
    if (n) n.classList.remove('show');
  };

  // --- Day Counter ---
  function updateStreak() {
    const c = localStorage.getItem('dayCount') || '0';
    if (streakCount) streakCount.textContent = c;
  }
  function incStreak() {
    const n = parseInt(localStorage.getItem('dayCount')||'0',10) + 1;
    localStorage.setItem('dayCount', n);
    updateStreak();
  }
  function resetStreak() {
    localStorage.setItem('dayCount','0');
    updateStreak();
    if (resetBtn) {
      resetBtn.textContent = 'Reset! ✓';
      setTimeout(() => resetBtn.textContent = 'Reset Count', 2000);
    }
  }
  updateStreak();
  if (resetBtn) resetBtn.addEventListener('click', resetStreak);

  // --- History Rendering ---
  function getEmoji(m) {
    return {Great:'😄',Good:'😊',Okay:'😐','Not Great':'😕',Bad:'😢',Anxious:'😰'}[m]||'😊';
  }
  // --- Mood Analytics Charts ---
  // Add these variables at the top of the file with other declarations
  let moodBarChart = null;
  let moodLineChart = null;

  // Update the updateCharts function
  function updateCharts() {
    // Destroy existing charts if they exist
    if (moodBarChart) moodBarChart.destroy();
    if (moodLineChart) moodLineChart.destroy();

    const barCtx = document.getElementById('moodBarChart');
    const lineCtx = document.getElementById('moodLineChart');

    if (!barCtx || !lineCtx) return;

    // Bar Chart - Mood Frequency
    const moodCounts = {};
    moodHistory.forEach(entry => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    moodBarChart = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: Object.keys(moodCounts),
        datasets: [{
          label: 'Mood Frequency',
          data: Object.values(moodCounts),
          backgroundColor: [
            '#4CAF50', // Great
            '#8BC34A', // Good
            '#FFC107', // Okay
            '#FF9800', // Not Great
            '#F44336', // Bad
            '#9C27B0'  // Anxious
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    // Line Chart - Mood Changes Over Time
    const last7Days = moodHistory.slice(0, 7).reverse();
    moodLineChart = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: last7Days.map(entry => entry.date),
        datasets: [{
          label: 'Mood Trend',
          data: last7Days.map(entry => {
            const moodValues = {
              'Great': 5,
              'Good': 4,
              'Okay': 3,
              'Not Great': 2,
              'Bad': 1,
              'Anxious': 1.5
            };
            return moodValues[entry.mood];
          }),
          borderColor: '#3498db',
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            min: 0,
            max: 6,
            ticks: {
              stepSize: 1,
              callback: function(value) {
                return ['', 'Bad', 'Not Great', 'Okay', 'Good', 'Great'][value] || '';
              }
            }
          }
        }
      }
    });
  }

  // Update charts when mood history changes
  function renderHistory() {
    if (!historyList) return;
    historyList.innerHTML = '';
    moodHistory.slice(0,20).forEach(item => {
      const d = document.createElement('div');
      d.className = 'history-item';
      d.innerHTML = `
        <div class="mood-info">
          <span class="mood-emoji-small">${getEmoji(item.mood)}</span>
          <div>
            <div class="mood-text"><strong>${item.mood}</strong></div>
            <div class="mood-date">${item.date}</div>
            ${item.note ? `<p style="font-size:12px;opacity:0.8;">${item.note}</p>` : ''}
          </div>
        </div>
        <button class="remove-btn" onclick="removeMood(${item.id})">Remove</button>
      `;
      historyList.appendChild(d);
    });
    updateCharts(); // Add this line to update charts when history changes
  }
  window.removeMood = id => {
    moodHistory = moodHistory.filter(e=>e.id!==id);
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
    renderHistory();
  };
  renderHistory();

  // --- Mood Selection & Saving ---
  moodButtons.forEach(btn=>btn.addEventListener('click', ()=>{
    moodButtons.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
  }));
  saveMoodBtn.addEventListener('click',()=>{
    const sel = document.querySelector('.mood-btn.selected');
    if (!sel) { alert('Select a mood!'); return; }
    const mood = sel.dataset.mood;
    const note = noteInput.value.trim();
    const date = new Date().toLocaleDateString();
    moodHistory.unshift({id:Date.now(),mood,note,date});
    localStorage.setItem('moodHistory',JSON.stringify(moodHistory));
    renderHistory();
    sel.classList.remove('selected');
    noteInput.value = '';
    incStreak();
    saveMoodBtn.textContent = 'Saved! ✨';
    setTimeout(()=>saveMoodBtn.textContent="Save Today's Mood",2000);
  });

  // --- Reminder UI ---
  function updateReminderUI() {
    const t = localStorage.getItem('reminderTime');
    if (t && reminderStatus) {
      const [h,m] = t.split(':');
      const lbl = new Date(`1970-01-01T${t}:00`)
                    .toLocaleTimeString([], {hour:'numeric',minute:'2-digit',hour12:true});
      reminderStatus.textContent = `Reminder set for ${lbl}`;
    } else if (reminderStatus) {
      reminderStatus.textContent = '';
    }
  }
  setReminderBtn.addEventListener('click',()=>{
    const t = reminderInput.value;
    if (!t) { showCustomNotification('Pick a time!', '⚠️'); return; }
    localStorage.setItem('reminderTime', t);
    updateReminderUI();
    showCustomNotification(`Reminder for ${t}`, '✅');
  });
  updateReminderUI();

  // --- Exact-Second Reminder Check ---
  let lastHHMM = null;
  setInterval(()=>{
    const t = localStorage.getItem('reminderTime');
    if (!t) return;
    const now = new Date();
    const hh = String(now.getHours()).padStart(2,'0');
    const mm = String(now.getMinutes()).padStart(2,'0');
    const ss = now.getSeconds();
    const current = `${hh}:${mm}`;
    // when seconds===0 and we haven't yet triggered for this minute
    if (ss === 0 && current === t && lastHHMM !== current) {
      showCustomNotification("Time to log your mood!","⏰");
      lastHHMM = current;
    }
    // reset flag after minute passes
    if (current !== lastHHMM) {
      lastHHMM = null;
    }
  }, 1000);

})();
