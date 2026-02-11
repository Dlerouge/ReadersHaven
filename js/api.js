async function fetchBooks(query) {
  const key = window.GOOGLE_BOOKS_API_KEY;
  const params = new URLSearchParams({
    q: query,
    maxResults: "12",
    printType: "books",
    orderBy: "relevance",
    projection: "lite",
    langRestrict: "en",
    key
  });

  const url = `https://www.googleapis.com/books/v1/volumes?${params.toString()}`;
  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || `HTTP ${res.status}`);
  }

  return data.items || [];
}
