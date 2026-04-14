function setStatus(el, msg) {
  if (el) {
    el.textContent = msg;
  }
}

function truncate(text, max = 180) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max).trim() + "…" : text;
}

const NO_COVER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23eee'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999'%3ENo Cover%3C/text%3E%3C/svg%3E";

function forceHttps(url = "") {
  if (!url) return "";
  return url.replace(/^http:\/\//i, "https://");
}

function googleItemToDbRow(item) {
  const info = item.volumeInfo || {};
  const thumbnail = forceHttps(
    info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || ""
  );

  return {
    google_volume_id: item.id,
    title: info.title || "Untitled",
    authors: (info.authors || []).join(", ") || "Unknown author",
    thumbnail,
    description: info.description ? truncate(info.description, 500) : ""
  };
}

/* =========================
   RESULTS PAGE CARD
========================= */
function createResultCard(item, { onSave } = {}) {
  const info = item.volumeInfo || {};
  const title = info.title || "Untitled";
  const authors = (info.authors || []).join(", ") || "Unknown author";
  const desc = truncate(info.description || "No description available.", 220);
  const thumb = forceHttps(
    info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || ""
  );

  const card = document.createElement("article");
  card.className = "card card--results";

  const img = document.createElement("img");
  img.className = "card__image";
  img.alt = `Cover of ${title}`;
  img.loading = "lazy";
  img.src = thumb || NO_COVER;

  const h3 = document.createElement("h3");
  h3.className = "card__title";
  h3.textContent = title;

  const meta = document.createElement("div");
  meta.className = "card__meta";
  meta.textContent = `By: ${authors}`;

  const p = document.createElement("p");
  p.className = "card__summary";
  p.textContent = desc;

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "card__button";
  btn.textContent = "Save to Reading List";

  btn.addEventListener("click", async () => {
    if (btn.disabled) return;

    btn.disabled = true;

    try {
      await onSave?.();

      btn.textContent = "Saved to Reading List";
    } catch (err) {
      btn.disabled = false;
      btn.textContent = "Save to Reading List";
    }
  });

  actions.append(btn);
  card.append(img, h3, meta, p, actions);

  return card;
}

/* =========================
   READING LIST CARD
========================= */
function createListCard(row, { onStatusChange, onRemove } = {}) {
  const card = document.createElement("article");
  card.className = "card card--saved";

  const img = document.createElement("img");
  img.className = "card__image";
  img.alt = `Cover of ${row.title}`;
  img.loading = "lazy";
  img.src = forceHttps(row.thumbnail) || NO_COVER;

  const h3 = document.createElement("h3");
  h3.className = "card__title";
  h3.textContent = row.title;

  const meta = document.createElement("div");
  meta.className = "card__meta";
  meta.textContent = `By: ${row.authors || "Unknown author"}`;

  const p = document.createElement("p");
  p.className = "card__summary";
  p.textContent = truncate(row.description || "", 220);

  const actions = document.createElement("div");
  actions.className = "card__actions";

  const label = document.createElement("label");
  label.className = "sr-only";
  label.setAttribute("for", `status-${row.google_volume_id}`);
  label.textContent = `Reading status for ${row.title}`;

  const select = document.createElement("select");
  select.className = "card__select";
  select.id = `status-${row.google_volume_id}`;
  select.setAttribute("aria-label", `Reading status for ${row.title}`);

  const options = [
    { value: "want", label: "Want to Read" },
    { value: "started", label: "Started" },
    { value: "finished", label: "Finished" },
  ];

  options.forEach((opt) => {
    const o = document.createElement("option");
    o.value = opt.value;
    o.textContent = opt.label;
    if (row.status === opt.value) o.selected = true;
    select.appendChild(o);
  });

  select.addEventListener("change", () => onStatusChange?.(select.value));

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "card__button";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => onRemove?.());

  actions.append(label, select, removeBtn);
  card.append(img, h3, meta, p, actions);

  return card;
}