const STORAGE_KEY = "readersHaven.savedBooks";

function getSavedBooks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveBook(book) {
  const current = getSavedBooks();
  if (current.some(b => b.id === book.id)) return; // prevent duplicates
  current.push(book);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

function removeBook(id) {
  const next = getSavedBooks().filter(b => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}
