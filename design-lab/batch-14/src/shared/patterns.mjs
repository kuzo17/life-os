function safe(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[c]);
}
function eur(n) {
  return new Intl.NumberFormat("it-IT", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 2
  }).format(n);
}
function sectionHead(title, more = "") {
  return '<div class="section-head"><h2>' + title + '</h2><span class="hint">' + more + '</span></div>';
}
function headline(title, desc, label = "ESPERIENZA PERSONALE", actions = "") {
  return '<div class="headline"><div><div class="eyebrow">' + label + '</div><h1>' + title + '<span style="color:var(--main)">.</span></h1><p>' + desc + '</p></div>' + actions + '</div>';
}
function miniStat(label, value, note, shade, icon) {
  return '<div class="card stat ' + shade + '"><div><div class="stat-label">' + label + '</div><div class="statnum">' + value + '</div><div class="stat-note">' + note + '</div></div><span class="stat-badge">' + icon + '</span></div>';
}
function priorityChip(priority) {
  const c = {
    alta: "coral",
    media: "blue",
    bassa: "cyan"
  }[priority] || "blue";
  return '<span class="chip ' + c + '">' + safe(priority || "media") + '</span>';
}
export { safe, eur, sectionHead, headline, miniStat, priorityChip };
