document.addEventListener("DOMContentLoaded", () => {
  const statusEl = document.getElementById("status");
  const listEl = document.getElementById("list");

  const saved = getSavedBooks();

  if (saved.length === 0) {
    setStatus(statusEl, "Your reading list is empty. Go back and save a book!");
    return;
  }

  setStatus(statusEl, `You have ${saved.length} saved book(s).`);
  listEl.innerHTML = "";

  saved.forEach((b) => {
    const card = createSavedCard(b, {
      onRemove: () => {
        removeBook(b.id);
        window.location.reload();
      }
    });
    listEl.appendChild(card);
  });
});
