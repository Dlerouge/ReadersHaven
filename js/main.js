document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("searchForm");
  const queryInput = document.getElementById("query");
  const statusEl = document.getElementById("status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = queryInput.value.trim();
    if (!q) {
      statusEl.textContent = "Please type a search term.";
      return;
    }
    // Send query to results page
    window.location.href = `results.html?q=${encodeURIComponent(q)}`;
  });
});
