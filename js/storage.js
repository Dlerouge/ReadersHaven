const SUPABASE_URL = window.SUPABASE_URL;
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY;

function sbHeaders() {
  return {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json"
  };
}

async function sbRequest(path, { method = "GET", body } = {}) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    method,
    headers: sbHeaders(),
    body: body ? JSON.stringify(body) : undefined
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.message || data?.hint || JSON.stringify(data) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

// CRUD for reading_list
async function dbListBooks() {
  // order newest first
  return sbRequest("reading_list?select=*&order=created_at.desc");
}

async function dbInsertBook(book) {
  // POST returns inserted row if Prefer header is set, but we can ignore and just confirm success
  const res = await fetch(`${SUPABASE_URL}/rest/v1/reading_list`, {
    method: "POST",
    headers: {
      ...sbHeaders(),
      "Prefer": "return=minimal"
    },
    body: JSON.stringify(book)
  });

  // 201 created, or 409 conflict if duplicate unique key
  if (res.status === 409) {
    throw new Error("This book is already in your Reading List.");
  }

  if (!res.ok) {
    const text = await res.text();
    let data = null;
    try { data = text ? JSON.parse(text) : null; } catch {}
    throw new Error(data?.message || data?.hint || `HTTP ${res.status}`);
  }
}

async function dbUpdateStatus(id, status) {
  return sbRequest(`reading_list?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: { status }
  });
}

async function dbDeleteBook(id) {
  return sbRequest(`reading_list?id=eq.${encodeURIComponent(id)}`, {
    method: "DELETE"
  });
}