// ---------------- Initialize ----------------
document.addEventListener("DOMContentLoaded", () => {
    renderTwitterAccounts();
    renderTumblrAccounts();
    updateAddButtons();
});

// ---------------- Helpers ----------------
function updateAddButtons() {
    document.getElementById("addTwitterBtn").disabled = !window.dbState.twitter;
    document.getElementById("addTumblrBtn").disabled = !window.dbState.tumblr;

    document.getElementById("twitterFileStatus").textContent = window.dbState.twitter ? "DB loaded" : "No file selected";
    document.getElementById("tumblrFileStatus").textContent = window.dbState.tumblr ? "DB loaded" : "No file selected";
}

// ---------------- Render Lists ----------------
function renderTwitterAccounts() {
    const container = document.getElementById("twitterList");
    container.innerHTML = "";

    accountDBs.twitter.forEach(acc => {
        const card = createAccountCard("twitter", acc.handle, acc.name, acc.icon);
        container.appendChild(card);
    });
}

function renderTumblrAccounts() {
    const container = document.getElementById("tumblrList");
    container.innerHTML = "";

    accountDBs.tumblr.forEach(acc => {
        const card = createAccountCard("tumblr", acc.url, acc.name, acc.icon);
        container.appendChild(card);
    });
}

// ---------------- Create Card ----------------
function createAccountCard(platform, id, name, icon) {
    const div = document.createElement("div");
    div.className = "account-card";

    div.innerHTML = `
        <p><strong>${platform === "twitter" ? "Handle:" : "URL:"}</strong> ${id}</p>
        <p><strong>Name:</strong> ${name || "-"}</p>
        <p><strong>Icon:</strong> <img src="${icon}" alt="${name}" style="height:2em; vertical-align:middle;"></p>
        <div style="display:flex; gap:10px; margin-top:8px;">
            <button onclick="editAccount('${platform}','${id}')">Edit</button>
            <button onclick="deleteAccount('${platform}','${id}')">Delete</button>
        </div>
    `;

    return div;
}

// ---------------- Add Account ----------------
function openTwitterForm() {
    const handle = prompt("@Handle (unique)");
    if (!handle) return;
    const name = prompt("Name (required)");
    if (!name) return;
    const icon = prompt("Icon URL (required)");
    if (!icon) return;

    addTwitterAccount(handle, name, icon);
    renderTwitterAccounts();
}

function openTumblrForm() {
    const url = prompt("@URL (unique)");
    if (!url) return;
    const name = prompt("Name (optional)");
    const icon = prompt("Icon URL (required)");
    if (!icon) return;

    addTumblrAccount(url, name, icon);
    renderTumblrAccounts();
}

// ---------------- Edit / Delete ----------------
function editAccount(platform, id) {
    let acc;
    if (platform === "twitter") acc = accountDBs.twitter.find(a => a.handle === id);
    else acc = accountDBs.tumblr.find(a => a.url === id);
    if (!acc) return;

    const newName = prompt("Edit Name:", acc.name);
    if (newName === null) return;
    const newIcon = prompt("Edit Icon URL:", acc.icon);
    if (newIcon === null) return;

    if (platform === "twitter") editTwitterAccount(id, newName, newIcon);
    else editTumblrAccount(id, newName, newIcon);

    if (platform === "twitter") renderTwitterAccounts();
    else renderTumblrAccounts();
}

function deleteAccount(platform, id) {
    if (!confirm("Are you sure you want to delete this account?")) return;

    if (platform === "twitter") deleteTwitterAccount(id);
    else deleteTumblrAccount(id);

    if (platform === "twitter") renderTwitterAccounts();
    else renderTumblrAccounts();
}