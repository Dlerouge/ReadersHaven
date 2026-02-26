document.addEventListener("DOMContentLoaded", async () => {
  const statusEl = document.getElementById("status");
  const listEl = document.getElementById("list");

  async function refresh() {
    setStatus(statusEl, "Loading your reading list…");
    listEl.innerHTML = "";

    try {
      const rows = await dbListBooks();

      if (!rows || rows.length === 0) {
        setStatus(statusEl, "Your reading list is empty. Go save a book from Search Results!");
        return;
      }

      rows.forEach((row) => {
        const card = createListCard(row, {
          onStatusChange: async (newStatus) => {
            try {
              await dbUpdateStatus(row.id, newStatus);
              setStatus(statusEl, "Progress updated ✅");
            } catch (err) {
              setStatus(statusEl, `Update error: ${err.message}`);
            }
          },
          onRemove: async () => {
            try {
              await dbDeleteBook(row.id);
              setStatus(statusEl, "Removed from your list ✅");
              await refresh();
            } catch (err) {
              setStatus(statusEl, `Delete error: ${err.message}`);
            }
          }
        });

        listEl.appendChild(card);
      });

      setStatus(statusEl, `Loaded ${rows.length} saved book(s).`);
    } catch (err) {
      console.error(err);
      setStatus(statusEl, `Error: ${err.message}`);
    }
  }

  refresh();
});