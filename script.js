let moodData = JSON.parse(localStorage.getItem("moodData")) || [];

// Function to set selected mood
function setMood(mood) {
    document.getElementById("note").setAttribute("data-mood", mood);
}

// Save the mood and note
function saveMood() {
    const selectedMood = document.getElementById("note").getAttribute("data-mood");
    const note = document.getElementById("note").value.trim();

    if (!selectedMood) {
        alert("Please select a mood first.");
        return;
    }

    const date = new Date().toLocaleDateString();
    const moodEntry = {
        mood: selectedMood,
        note: note,
        date: date
    };

    moodData.push(moodEntry);
    localStorage.setItem("moodData", JSON.stringify(moodData));

    document.getElementById("note").value = "";  // Clear the textarea
    renderMoodHistory();
}

// Render mood history
function renderMoodHistory() {
    const moodHistoryDiv = document.getElementById("mood-history");
    moodHistoryDiv.innerHTML = "";

    moodData.forEach(entry => {
        const entryDiv = document.createElement("div");
        entryDiv.innerHTML = `<strong>${entry.date}</strong> - Mood: ${entry.mood}<br>Note: ${entry.note || "No note"}`;
        moodHistoryDiv.appendChild(entryDiv);
    });
}

// Initial render on page load
renderMoodHistory();