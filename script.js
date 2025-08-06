
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

// MoodSphere JavaScript Application
class MoodSphere {
    constructor() {
        this.currentTab = 'home';
        this.currentDate = new Date();
        this.selectedMood = null;
        this.userName = '';
        this.moodEntries = [];
        this.chatMessages = [];
        
        this.init();
    }

    init() {
        this.loadData();
        this.setupEventListeners();
        this.updateGreeting();
        this.updateHomeCounts();
        this.renderCalendar();
        this.updateCalendarStats();
        
        // Update greeting every minute
        setInterval(() => this.updateGreeting(), 60000);
    }

    // Data Management
    loadData() {
        try {
            const savedName = localStorage.getItem('moodsphere-name');
            const savedEntries = localStorage.getItem('moodsphere-entries');
            const savedMessages = localStorage.getItem('moodsphere-messages');
            
            if (savedName) {
                this.userName = savedName;
                this.updateNameDisplay();
            }
            
            if (savedEntries) {
                this.moodEntries = JSON.parse(savedEntries);
                this.renderJournalEntries();
            }
            
            if (savedMessages) {
                this.chatMessages = JSON.parse(savedMessages);
                this.renderChatMessages();
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    saveData() {
        try {
            localStorage.setItem('moodsphere-name', this.userName);
            localStorage.setItem('moodsphere-entries', JSON.stringify(this.moodEntries));
            localStorage.setItem('moodsphere-messages', JSON.stringify(this.chatMessages));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-btn, .feature-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.closest('[data-tab]').dataset.tab;
                this.switchTab(tab);
            });
        });

        // Name input
        const nameInput = document.getElementById('name-input');
        const saveNameBtn = document.getElementById('save-name-btn');
        
        saveNameBtn.addEventListener('click', () => this.saveName());
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.saveName();
        });

        // Journal form
        const newEntryBtn = document.getElementById('new-entry-btn');
        const cancelEntryBtn = document.getElementById('cancel-entry-btn');
        const moodForm = document.getElementById('mood-form');
        
        newEntryBtn.addEventListener('click', () => this.showJournalForm());
        cancelEntryBtn.addEventListener('click', () => this.hideJournalForm());
        moodForm.addEventListener('submit', (e) => this.handleMoodSubmit(e));

        // Mood buttons
        document.querySelectorAll('.mood-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectMood(e));
        });

        // Chat form
        const chatForm = document.getElementById('chat-form');
        chatForm.addEventListener('submit', (e) => this.handleChatSubmit(e));

        // Calendar navigation
        document.getElementById('prev-month').addEventListener('click', () => this.navigateMonth(-1));
        document.getElementById('next-month').addEventListener('click', () => this.navigateMonth(1));
    }

    // Tab Management
    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;

        // Update specific tab content
        if (tabName === 'calendar') {
            this.renderCalendar();
            this.updateCalendarStats();
        }
    }

    // Greeting System
    updateGreeting() {
        const now = new Date();
        const hour = now.getHours();
        
        let timeData = this.getTimeOfDay(hour);
        
        // Update time indicator
        document.querySelector('.time-icon').textContent = timeData.icon;
        document.querySelector('.time-period').textContent = timeData.period;
        
        // Update greeting text
        const greeting = this.getGreeting(timeData.period);
        const greetingText = document.querySelector('.greeting-text');
        greetingText.textContent = `${greeting}${this.userName ? `, ${this.userName}` : ''}! 🌟`;
    }

    getTimeOfDay(hour) {
        if (hour < 6) return { period: 'night', icon: '🌙' };
        if (hour < 12) return { period: 'morning', icon: '🌅' };
        if (hour < 18) return { period: 'afternoon', icon: '☀️' };
        return { period: 'evening', icon: '🌆' };
    }

    getGreeting(period) {
        const greetings = {
            morning: ['Good morning', 'Rise and shine', 'Hello sunshine'],
            afternoon: ['Good afternoon', 'Hope your day is bright', 'Afternoon sunshine'],
            evening: ['Good evening', 'Hope you had a lovely day', 'Evening star'],
            night: ['Good night', 'Sweet dreams ahead', 'Peaceful night']
        };
        const options = greetings[period];
        return options[Math.floor(Math.random() * options.length)];
    }

    // Name Management
    saveName() {
        const nameInput = document.getElementById('name-input');
        const name = nameInput.value.trim();
        
        if (name) {
            this.userName = name;
            this.updateNameDisplay();
            this.updateGreeting();
            this.saveData();
        }
    }

    updateNameDisplay() {
        const nameInput = document.getElementById('name-input');
        const saveBtn = document.getElementById('save-name-btn');
        
        if (this.userName) {
            nameInput.style.display = 'none';
            saveBtn.textContent = 'Change name ✏️';
            saveBtn.onclick = () => {
                nameInput.style.display = 'inline-block';
                nameInput.value = this.userName;
                nameInput.focus();
                saveBtn.textContent = 'Save 💝';
                saveBtn.onclick = () => this.saveName();
            };
        }
    }

    // Home Page Updates
    updateHomeCounts() {
        document.getElementById('entry-count').textContent = this.moodEntries.length;
        document.getElementById('message-count').textContent = this.chatMessages.length;
        
        // Show recent mood if exists
        if (this.moodEntries.length > 0) {
            const recentEntry = this.moodEntries[0];
            const recentMoodCard = document.getElementById('recent-mood');
            
            recentMoodCard.style.display = 'block';
            recentMoodCard.querySelector('.recent-mood-emoji').textContent = recentEntry.emoji;
            recentMoodCard.querySelector('.recent-mood-text').textContent = recentEntry.mood;
            recentMoodCard.querySelector('.recent-mood-date').textContent = this.formatDate(recentEntry.date);
        }
    }

    // Journal Management
    showJournalForm() {
        document.getElementById('journal-form').style.display = 'block';
        this.selectedMood = null;
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        document.getElementById('mood-note').value = '';
    }

    hideJournalForm() {
        document.getElementById('journal-form').style.display = 'none';
    }

    selectMood(e) {
        document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
        
        this.selectedMood = {
            mood: e.currentTarget.dataset.mood,
            emoji: e.currentTarget.dataset.emoji
        };
    }

    handleMoodSubmit(e) {
        e.preventDefault();
        
        if (!this.selectedMood) {
            alert('Please select a mood! 😊');
            return;
        }
        
        const note = document.getElementById('mood-note').value.trim();
        if (!note) {
            alert('Please tell us more about your day! 📝');
            return;
        }
        
        const entry = {
            id: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            mood: this.selectedMood.mood,
            emoji: this.selectedMood.emoji,
            note: note,
            timestamp: Date.now()
        };
        
        this.moodEntries.unshift(entry);
        this.saveData();
        this.renderJournalEntries();
        this.hideJournalForm();
        this.updateHomeCounts();
        this.updateCalendarStats();
        
        // Show success message
        this.showNotification('Mood entry saved! 💝');
    }

    renderJournalEntries() {
        const container = document.getElementById('journal-entries');
        
        if (this.moodEntries.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📖</div>
                    <p class="empty-title">No journal entries yet!</p>
                    <p class="empty-subtitle">Start tracking your moods to see them here.</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.moodEntries.map(entry => `
            <div class="journal-entry">
                <div class="entry-header">
                    <div class="entry-mood">
                        <span class="entry-emoji">${entry.emoji}</span>
                        <div>
                            <h3 class="entry-mood-text">${entry.mood}</h3>
                            <div class="entry-date">
                                <span>📅</span>
                                <span>${this.formatDate(entry.date)}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <p class="entry-note">${entry.note}</p>
            </div>
        `).join('');
    }

    // Chat Management
    handleChatSubmit(e) {
        e.preventDefault();
        
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        const userMessage = {
            id: Date.now().toString(),
            text: message,
            isUser: true,
            timestamp: Date.now()
        };
        
        this.chatMessages.push(userMessage);
        input.value = '';
        this.renderChatMessages();
        
        // Add bot response after delay
        setTimeout(() => {
            const botMessage = {
                id: (Date.now() + 1).toString(),
                text: this.getChatbotResponse(message),
                isUser: false,
                timestamp: Date.now()
            };
            
            this.chatMessages.push(botMessage);
            this.renderChatMessages();
            this.saveData();
            this.updateHomeCounts();
        }, 1000);
        
        this.saveData();
        this.updateHomeCounts();
    }

    renderChatMessages() {
        const container = document.getElementById('chat-messages');
        
        if (this.chatMessages.length === 0) {
            container.innerHTML = `
                <div class="welcome-message">
                    <div class="welcome-icon">🤗</div>
                    <p class="welcome-title">Hi there! I'm MoodBot!</p>
                    <p class="welcome-subtitle">I'm here to listen and help you feel better. What's on your mind today?</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = this.chatMessages.map(message => `
            <div class="message ${message.isUser ? 'user' : 'bot'}">
                <p>${message.text}</p>
                <p class="message-time">${this.formatTime(message.timestamp)}</p>
            </div>
        `).join('');
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;
    }

    getChatbotResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greeting responses
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            const greetings = [
                "Hello there! 😊 I'm so glad you're here. How are you feeling today?",
                "Hi! 🌟 It's wonderful to chat with you. What's on your mind?",
                "Hey! 👋 I'm here to listen. How's your day going so far?"
            ];
            return greetings[Math.floor(Math.random() * greetings.length)];
        }

        // Sad/depressed responses
        if (message.includes('sad') || message.includes('depressed') || message.includes('down') || message.includes('crying')) {
            const sadResponses = [
                "I hear that you're feeling sad, and I want you to know that it's okay to feel this way. 🤗 Your feelings are valid. Would you like to tell me more about what's making you feel down?",
                "It sounds like you're going through a tough time. 💙 Remember that it's okay to feel sad sometimes - it shows that you care. Is there something specific that happened today?",
                "I'm sorry you're feeling down. 🌙 Sometimes when we're sad, it helps to talk about it. I'm here to listen without judgment. What's been weighing on your heart?"
            ];
            return sadResponses[Math.floor(Math.random() * sadResponses.length)];
        }

        // Anxious/worried responses
        if (message.includes('anxious') || message.includes('worried') || message.includes('stress') || message.includes('nervous')) {
            const anxiousResponses = [
                "I understand that you're feeling anxious. 🌸 Anxiety can feel overwhelming, but you're not alone. Try taking three deep breaths with me. What's causing you to feel this way?",
                "Feeling anxious is really tough. 💜 Remember that anxiety often comes from our mind trying to protect us. What specific thoughts are making you worry right now?",
                "I hear that you're stressed. 🕊️ Let's try to break this down together. Sometimes naming our worries can make them feel less scary. What's the biggest thing on your mind?"
            ];
            return anxiousResponses[Math.floor(Math.random() * anxiousResponses.length)];
        }

        // Happy/excited responses
        if (message.includes('happy') || message.includes('excited') || message.includes('great') || message.includes('amazing') || message.includes('good')) {
            const happyResponses = [
                "That's wonderful to hear! 🌟 I love seeing you happy. What's making you feel so good today?",
                "Yay! 🎉 Your happiness is contagious! I'm so glad you're having a great time. Tell me more about what's going well!",
                "How amazing! ✨ It makes my circuits light up to hear you're feeling good. What's been the highlight of your day?"
            ];
            return happyResponses[Math.floor(Math.random() * happyResponses.length)];
        }

        // Angry responses
        if (message.includes('angry') || message.includes('mad') || message.includes('frustrated') || message.includes('annoyed')) {
            const angryResponses = [
                "I can sense that you're feeling angry, and that's completely understandable. 🔥 Anger often tells us that something important to us has been threatened. What happened that made you feel this way?",
                "It sounds like something really frustrating happened. 😤 Anger is a natural emotion, and it's okay to feel it. Would you like to talk about what's making you mad?",
                "I hear your frustration. 💪 Sometimes anger gives us energy to make positive changes. What situation is making you feel this way?"
            ];
            return angryResponses[Math.floor(Math.random() * angryResponses.length)];
        }

        // Tired/exhausted responses
        if (message.includes('tired') || message.includes('exhausted') || message.includes('sleepy') || message.includes('drained')) {
            const tiredResponses = [
                "It sounds like you're feeling really drained. 😴 Being tired affects everything - our mood, our thoughts, our energy. Have you been getting enough rest lately?",
                "I can hear that you're exhausted. 🌙 Sometimes our minds and bodies need extra care when we're tired. What's been keeping you so busy or preventing good sleep?",
                "Feeling tired can be so overwhelming. 💤 Remember that rest isn't just about sleep - sometimes we need emotional rest too. What would help you feel more refreshed?"
            ];
            return tiredResponses[Math.floor(Math.random() * tiredResponses.length)];
        }

        // Grateful responses
        if (message.includes('grateful') || message.includes('thankful') || message.includes('blessed') || message.includes('appreciate')) {
            const gratefulResponses = [
                "How beautiful! 🙏 Gratitude is like sunshine for the soul. It's wonderful that you're taking time to appreciate the good things. What are you most grateful for today?",
                "That's so heartwarming! ✨ Practicing gratitude can really shift our perspective. I love hearing about what brings you joy and appreciation. Tell me more!",
                "What a lovely mindset! 🌺 Gratitude has this amazing way of multiplying the good in our lives. What specific moments or people are you feeling thankful for?"
            ];
            return gratefulResponses[Math.floor(Math.random() * gratefulResponses.length)];
        }

        // Default supportive responses
        const defaultResponses = [
            "Thank you for sharing that with me. 💝 I'm here to listen and support you. How are you feeling about everything right now?",
            "I appreciate you opening up. 🌈 Your thoughts and feelings matter. Is there anything specific you'd like to talk through?",
            "It means a lot that you're talking to me about this. 🤗 I'm here for you. What would be most helpful to discuss right now?",
            "I'm listening with my whole heart. 💙 Sometimes just expressing our thoughts can help us process them. How can I best support you today?",
            "Thank you for trusting me with your thoughts. 🌟 I'm here to help however I can. What's the most important thing on your mind right now?"
        ];
        
        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }

    // Calendar Management
    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
        this.updateCalendarStats();
    }

    renderCalendar() {
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        
        // Update month display
        document.getElementById('calendar-month').textContent = 
            `${monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
        
        // Calculate calendar days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getDay();
        const daysInMonth = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        
        const daysContainer = document.getElementById('calendar-days');
        daysContainer.innerHTML = '';
        
        // Empty days for alignment
        for (let i = 0; i < firstDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            daysContainer.appendChild(emptyDay);
        }
        
        // Calendar days
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Check if today
            const today = new Date();
            if (this.currentDate.getFullYear() === today.getFullYear() &&
                this.currentDate.getMonth() === today.getMonth() &&
                day === today.getDate()) {
                dayElement.classList.add('today');
            }
            
            // Check for mood entry
            const dateString = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day)
                .toISOString().split('T')[0];
            const moodEntry = this.moodEntries.find(entry => entry.date === dateString);
            
            if (moodEntry) {
                dayElement.classList.add('has-mood');
                dayElement.title = `${moodEntry.mood}: ${moodEntry.note}`;
                
                const emoji = document.createElement('span');
                emoji.className = 'calendar-day-emoji';
                emoji.textContent = moodEntry.emoji;
                dayElement.appendChild(emoji);
            }
            
            daysContainer.appendChild(dayElement);
        }
    }

    updateCalendarStats() {
        const currentMonthEntries = this.moodEntries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === this.currentDate.getMonth() && 
                   entryDate.getFullYear() === this.currentDate.getFullYear();
        });

        // Total entries
        document.getElementById('total-entries').textContent = currentMonthEntries.length;

        // Most common mood
        const moodCounts = {};
        currentMonthEntries.forEach(entry => {
            moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        });

        const mostCommonMood = Object.entries(moodCounts).reduce((a, b) => 
            moodCounts[a[0]] > moodCounts[b[0]] ? a : b, ['None', 0]
        );

        document.getElementById('most-common-mood').textContent = mostCommonMood[0];

        // Achievement
        const totalEntries = currentMonthEntries.length;
        let achievementEmoji = '🌱';
        let achievementText = 'Keep going!';

        if (totalEntries > 15) {
            achievementEmoji = '🌟';
            achievementText = 'Amazing!';
        } else if (totalEntries > 5) {
            achievementEmoji = '⭐';
            achievementText = 'Great job!';
        }

        document.getElementById('achievement-emoji').textContent = achievementEmoji;
        document.getElementById('achievement-text').textContent = achievementText;
    }

    // Utility Functions
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    formatTime(timestamp) {
        return new Date(timestamp).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    showNotification(message) {
        // Simple notification - you could enhance this with a proper notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #ec4899, #8b5cf6);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 1rem;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MoodSphere();
});

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

