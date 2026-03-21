// ---------------- Account Databases ----------------
let accountDBs = {
    twitter: [],
    tumblr: []
};

// ---------------- Twitter Accounts ----------------
function addTwitterAccount(name, handle, icon) {
    if (!name || !handle || !icon) return alert("All fields must be filled!");
    if (accountDBs.twitter.find(acc => acc.handle === handle)) return alert("Handle must be unique!");

    accountDBs.twitter.push({ name, handle, icon });

    // Update localStorage for download
    saveTwitterDBToLocalStorage();
}

function editTwitterAccount(handle, newName, newIcon) {
    const acc = accountDBs.twitter.find(acc => acc.handle === handle);
    if (!acc) return alert("Account not found!");
    acc.name = newName || acc.name;
    acc.icon = newIcon || acc.icon;

    saveTwitterDBToLocalStorage();
}

function deleteTwitterAccount(handle) {
    accountDBs.twitter = accountDBs.twitter.filter(acc => acc.handle !== handle);
    saveTwitterDBToLocalStorage();
}

function saveTwitterDBToLocalStorage() {
    const htmlContent = generateHTMLFromAccounts("twitter", accountDBs.twitter);
    localStorage.setItem("twitterDB", htmlContent);
}

// ---------------- Tumblr Accounts ----------------
function addTumblrAccount(url, name, icon) {
    if (!url || !icon) return alert("URL and icon must be filled!");
    if (accountDBs.tumblr.find(acc => acc.url === url)) return alert("URL must be unique!");

    accountDBs.tumblr.push({ url, name, icon });

    // Update localStorage for download
    saveTumblrDBToLocalStorage();
}

function editTumblrAccount(url, newName, newIcon) {
    const acc = accountDBs.tumblr.find(acc => acc.url === url);
    if (!acc) return alert("Account not found!");
    acc.name = newName || acc.name;
    acc.icon = newIcon || acc.icon;

    saveTumblrDBToLocalStorage();
}

function deleteTumblrAccount(url) {
    accountDBs.tumblr = accountDBs.tumblr.filter(acc => acc.url !== url);
    saveTumblrDBToLocalStorage();
}

function saveTumblrDBToLocalStorage() {
    const htmlContent = generateHTMLFromAccounts("tumblr", accountDBs.tumblr);
    localStorage.setItem("tumblrDB", htmlContent);
}

// ---------------- Utility: Generate HTML from account list ----------------
function generateHTMLFromAccounts(platform, accounts) {
    let html = `<!-- ${platform} accounts database -->\n<html><body>\n<ul>\n`;
    accounts.forEach(acc => {
        if (platform === "twitter") {
            html += `<li data-handle="${acc.handle}" data-name="${acc.name}" data-icon="${acc.icon}"></li>\n`;
        } else if (platform === "tumblr") {
            html += `<li data-url="${acc.url}" data-name="${acc.name || ""}" data-icon="${acc.icon}"></li>\n`;
        }
    });
    html += "</ul>\n</body></html>";
    return html;
}

// ---------------- Optional: Load DB from localStorage ----------------
function loadTwitterDBFromLocalStorage() {
    const content = localStorage.getItem("twitterDB");
    if (!content) return;
    accountDBs.twitter = parseAccountsFromHTML("twitter", content);
}

function loadTumblrDBFromLocalStorage() {
    const content = localStorage.getItem("tumblrDB");
    if (!content) return;
    accountDBs.tumblr = parseAccountsFromHTML("tumblr", content);
}

// ---------------- Utility: Parse HTML back into account objects ----------------
function parseAccountsFromHTML(platform, html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const lis = Array.from(doc.querySelectorAll("li"));
    return lis.map(li => {
        if (platform === "twitter") {
            return {
                handle: li.dataset.handle,
                name: li.dataset.name,
                icon: li.dataset.icon
            };
        } else if (platform === "tumblr") {
            return {
                url: li.dataset.url,
                name: li.dataset.name,
                icon: li.dataset.icon
            };
        }
    });
}