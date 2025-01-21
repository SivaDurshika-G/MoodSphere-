document.addEventListener('DOMContentLoaded', function() {
    const saveMoodBtn = document.getElementById('saveMoodBtn');
    const noteInput = document.getElementById('note');
    const moodButtons = document.querySelectorAll('.mood-btn');
    const historyList = document.getElementById('historyList');

    let selectedMood = '';

    // Function to render the mood history
    function renderHistory() {
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        historyList.innerHTML = ''; // Clear current list
        
        moodHistory.forEach((entry, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${entry.mood}</strong> - ${entry.note || 'No note'} 
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            historyList.appendChild(listItem);
        });

        // Add event listeners for remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeMood);
        });
    }

    // Handle mood button click
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedMood = button.getAttribute('data-mood');
            document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Handle save mood button click
    saveMoodBtn.addEventListener('click', () => {
        if (selectedMood) {
            const note = noteInput.value;
            const date = new Date().toLocaleDateString();
            const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
            moodHistory.push({ mood: selectedMood, note, date });
            localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
            renderHistory();
            noteInput.value = '';  // Clear note input
            selectedMood = '';     // Reset selected mood
        } else {
            alert('Please select a mood!');
        }
    });

    // Remove a mood entry
    function removeMood(event) {
        const index = event.target.getAttribute('data-index');
        const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
        moodHistory.splice(index, 1);
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
        renderHistory(); // Re-render the list after removal
    }

    // Initial render of mood history
    renderHistory();
});