document.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("status");
  const resultsEl = document.getElementById("results");

  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  const mood = params.get("mood");

  if (!q) {
    setStatus(statusEl, "No search query provided.");
    return;
  }

  setStatus(statusEl, mood ? `Mood: ${mood}. Searching…` : "Searching…");

  try {
    const items = await fetchBooksGoogle(q);

    if (items.length === 0) {
      setStatus(statusEl, `No results found for “${q}”. Try a different search.`);
      return;
    }

    resultsEl.innerHTML = "";
    items.forEach((item) => {
      const card = createResultCard(item, {
        onSave: async () => {
          try {
            const row = googleItemToDbRow(item);
            await dbInsertBook(row);
            setStatus(statusEl, "Saved to your Reading List ✅");
          } catch (err) {
            setStatus(statusEl, `Save error: ${err.message}`);
          }
        }
      });
      resultsEl.appendChild(card);
    });

    setStatus(statusEl, `Showing ${items.length} results for “${q}”.`);
  } catch (err) {
    console.error(err);
    setStatus(statusEl, `Error: ${err.message}`);
  }
});