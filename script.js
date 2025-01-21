const moodBtns = document.querySelectorAll(".mood-btn");
const journalEntry = document.getElementById("journal-entry");
const moodHistory = document.getElementById("mood-history");
const moodGraph = document.getElementById("mood-graph");
let moodData = JSON.parse(localStorage.getItem("moodData")) || [];

moodBtns.forEach(btn => {
  btn.addEventListener("click", function() {
    const selectedMood = this.dataset.mood;
    document.getElementById("save-btn").onclick = () => saveMood(selectedMood);
  });
});

function saveMood(selectedMood) {
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

function renderMoodHistory() {
  moodHistory.innerHTML = "";
  moodData.forEach(entry => {
    const moodElement = document.createElement("div");
    moodElement.classList.add("mood-entry");
    moodElement.innerHTML = `<strong>${entry.date}</strong>: ${entry.mood} - ${entry.note || "No journal entry"}`;
    moodHistory.appendChild(moodElement);
  });
}

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

function clearHistory() {
  localStorage.removeItem("moodData");
  moodData = [];
  renderMoodHistory();
  renderMoodGraph();
}

renderMoodHistory();
renderMoodGraph();