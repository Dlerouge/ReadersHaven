document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const queryInput = document.getElementById("query");
  const statusEl = document.getElementById("status");

  const moodMap = {
    cozy: "comfort fiction cozy fantasy",
    adventurous: "adventure fantasy quest",
    romantic: "romantic fantasy paranormal romance",
    mysterious: "mystery thriller suspense",
    dark: "dark academia gothic mystery"
  };

  document.querySelectorAll(".mood").forEach((btn) => {
    btn.addEventListener("click", () => {
      const mood = btn.dataset.mood;
      const q = moodMap[mood] || mood;
      window.location.href = `results.html?q=${encodeURIComponent(q)}&mood=${encodeURIComponent(mood)}`;
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = queryInput.value.trim();
    if (!q) {
      statusEl.textContent = "Please type a search term.";
      return;
    }
    window.location.href = `results.html?q=${encodeURIComponent(q)}`;
  });
});