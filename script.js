document.addEventListener('DOMContentLoaded', function() {
    // Retrieve saved mood history from localStorage
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];
    const historyList = document.getElementById('historyList');
    const saveMoodBtn = document.getElementById('saveMoodBtn');
    const noteInput = document.getElementById('note');
    const moodButtons = document.querySelectorAll('.mood-btn');
    
    // Display mood history on page load
    function renderHistory() {
        historyList.innerHTML = '';
        moodHistory.forEach((item, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <strong>${item.mood}</strong> - ${item.note || 'No note'} 
                <span>${item.date}</span>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            historyList.appendChild(listItem);
        });

        // Attach event listeners to remove buttons
        const removeButtons = document.querySelectorAll('.remove-btn');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeEntry);
        });
    }

    // Handle mood selection
    let selectedMood = '';
    moodButtons.forEach(button => {
        button.addEventListener('click', () => {
            selectedMood = button.getAttribute('data-mood');
            document.querySelectorAll('.mood-btn').forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
        });
    });

    // Save mood
    saveMoodBtn.addEventListener('click', () => {
        if (selectedMood) {
            const note = noteInput.value;
            const date = new Date().toLocaleDateString();
            const newEntry = {
                mood: selectedMood,
                note: note,
                date: date
            };
            
            moodHistory.push(newEntry);
            localStorage.setItem('moodHistory', JSON.stringify(moodHistory));
            renderHistory();
            noteInput.value = '';  // Clear note field
            selectedMood = '';     // Clear selected mood
        } else {
            alert('Please select a mood!');
        }
    });

    // Remove mood entry
    function removeEntry(e) {
        const index = e.target.getAttribute('data-index');
        moodHistory.splice(index, 1); // Remove the item from the array
        localStorage.setItem('moodHistory', JSON.stringify(moodHistory)); // Save the updated history
        renderHistory(); // Re-render the history after removal
    }

    // Initial render of history
    renderHistory();
});