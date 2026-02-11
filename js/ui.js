function setStatus(el, msg) {
  el.textContent = msg;
}

function bookToSavedModel(item) {
  const info = item.volumeInfo || {};
  return {
    id: item.id,
    title: info.title || "Untitled",
    authors: (info.authors || []).join(", ") || "Unknown author",
    thumbnail:
      info.imageLinks?.thumbnail ||
      info.imageLinks?.smallThumbnail ||
      "",
  };
}

function createBookCard(item, { onSave, onRemove } = {}) {
  const info = item.volumeInfo || {};
  const title = info.title || "Untitled";
  const authors = (info.authors || []).join(", ") || "Unknown author";
  const thumb =
    info.imageLinks?.thumbnail ||
    info.imageLinks?.smallThumbnail ||
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999'%3ENo Cover%3C/text%3E%3C/svg%3E";

  const card = document.createElement("article");
  card.className = "card";

  const img = document.createElement("img");
  img.alt = `Cover of ${title}`;
  img.src = thumb;

  const h3 = document.createElement("h3");
  h3.textContent = title;

  const meta = document.createElement("p");
  meta.textContent = `By: ${authors}`;

  card.append(img, h3, meta);

  if (onSave) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Save to List";
    btn.addEventListener("click", onSave);
    card.append(btn);
  }

  if (onRemove) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = "Remove";
    btn.addEventListener("click", onRemove);
    card.append(btn);
  }

  return card;
}

function createSavedCard(saved, { onRemove } = {}) {
  const card = document.createElement("article");
  card.className = "card";

  const img = document.createElement("img");
  img.alt = `Cover of ${saved.title}`;
  img.src = saved.thumbnail || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999'%3ENo Cover%3C/text%3E%3C/svg%3E";

  const h3 = document.createElement("h3");
  h3.textContent = saved.title;

  const meta = document.createElement("p");
  meta.textContent = `By: ${saved.authors}`;

  card.append(img, h3, meta);

  const btn = document.createElement("button");
  btn.type = "button";
  btn.textContent = "Remove";
  btn.addEventListener("click", onRemove);
  card.append(btn);

  return card;
}
