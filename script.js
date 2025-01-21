const moodBtns = document.querySelectorAll(".mood-btn");
const journalEntry = document.getElementById("journal-entry");
const moodHistory = document.getElementById("mood-history");
const moodGraph = document.getElementById("mood-graph");
let moodData = JSON.parse(localStorage.getItem("moodData")) || [];
let selectedMood = "";

// Mood selection functionality
moodBtns.forEach(btn => {
  btn.addEventListener("click", function() {
    selectedMood = this.dataset.mood;
    // Highlight the selected mood button (optional)
    moodBtns.forEach(button => button.classList.remove("selected"));
    this.classList.add("selected");
  });
});

// Save mood function
function saveMood() {
  if (selectedMood === "") {
    alert("Please select a mood.");
    return;
  }

  const note = journalEntry.value.trim();
  const date = new Date().toLocaleDateString();

  const newMoodEntry = {
    mood: selectedMood,
    note: note,
    date: date,
  };

  moodData.push(newMoodEntry);
  localStorage.setItem("moodData", JSON.stringify(moodData));

  journalEntry.value = ""; // Reset the journal field
  renderMoodHistory();
  renderMoodGraph();
}

// Render mood history (recent entries)
function renderMoodHistory() {
  moodHistory.innerHTML = "";
  moodData.forEach(entry => {
    const moodElement = document.createElement("div");
    moodElement.classList.add("mood-entry");
    moodElement.innerHTML = `<strong>${entry.date}</strong>: ${entry.mood} - ${entry.note || "No journal entry"}`;
    moodHistory.appendChild(moodElement);
  });
}

// Render mood graph (count of each mood)
function renderMoodGraph() {
  const moodCount = {
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0,
    anxious: 0,
  };

  moodData.forEach(entry => {
    if (moodCount[entry.mood] !== undefined) {
      moodCount[entry.mood]++;
    }
  });

  let graphHTML = "<h3>Mood Graph:</h3><ul>";
  for (const mood in moodCount) {
    graphHTML += `<li><strong>${mood}</strong>: ${moodCount[mood]}</li>`;
  }
  graphHTML += "</ul>";

  moodGraph.innerHTML = graphHTML;
}

// Clear mood history
function clearHistory() {
  localStorage.removeItem("moodData");
  moodData = [];
  renderMoodHistory();
  renderMoodGraph();
}

// Initial render
renderMoodHistory();
renderMoodGraph();