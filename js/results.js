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

    if (!items || items.length === 0) {
      setStatus(statusEl, `No results found for “${q}”. Try a different search.`);
      return;
    }

    resultsEl.innerHTML = "";

    items.forEach((item) => {
      let isSaving = false;

      const card = createResultCard(item, {
        onSave: async () => {
          if (isSaving) return;
          isSaving = true;

          try {
            const row = googleItemToDbRow(item);
            await dbInsertBook(row);
            setStatus(statusEl, "Saved to your Reading List ✅");
          } catch (err) {
            const message = err?.message || "Unable to save this book right now.";
            setStatus(statusEl, `Save error: ${message}`);
          } finally {
            isSaving = false;
          }
        }
      });

      resultsEl.appendChild(card);
    });

    setStatus(statusEl, `Showing ${items.length} results for “${q}”.`);
  } catch (err) {
    const message = err?.message || "Something went wrong while loading results.";
    setStatus(statusEl, `Error: ${message}`);
  }
});