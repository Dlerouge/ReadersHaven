document.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("status");
  const resultsEl = document.getElementById("results");

  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");

  if (!q) {
    setStatus(statusEl, "No search query provided.");
    return;
  }

  setStatus(statusEl, `Searching for “${q}”…`);

  try {
    const items = await fetchBooks(q);

    if (items.length === 0) {
      setStatus(statusEl, `No results found for “${q}”.`);
      return;
    }

    resultsEl.innerHTML = "";
    items.forEach((item) => {
      const card = createBookCard(item, {
        onSave: () => {
          saveBook(bookToSavedModel(item));
          setStatus(statusEl, "Saved to your Reading List ✅");
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
