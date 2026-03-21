// ---------------- Account Databases ----------------
let accountDBs = {
    twitter: [],
    tumblr: []
};

// ---------------- Helpers ----------------
function isDBActive(platform) {
    return window.dbState && window.dbState[platform];
}

// ---------------- Twitter ----------------
function addTwitterAccount(handle, name, icon) {
    if (!isDBActive("twitter")) {
        alert("No Twitter DB selected!");
        return;
    }

    if (!handle || !name || !icon) {
        alert("All fields must be filled!");
        return;
    }

    if (accountDBs.twitter.find(acc => acc.handle === handle)) {
        alert("Handle must be unique!");
        return;
    }

    accountDBs.twitter.push({ handle, name, icon });
    saveTwitterDBToLocalStorage();
}

function editTwitterAccount(handle, newName, newIcon) {
    const acc = accountDBs.twitter.find(acc => acc.handle === handle);
    if (!acc) return;

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

// ---------------- Tumblr ----------------
function addTumblrAccount(url, name, icon) {
    if (!isDBActive("tumblr")) {
        alert("No Tumblr DB selected!");
        return;
    }

    if (!url || !icon) {
        alert("URL and icon must be filled!");
        return;
    }

    if (accountDBs.tumblr.find(acc => acc.url === url)) {
        alert("URL must be unique!");
        return;
    }

    accountDBs.tumblr.push({ url, name, icon });
    saveTumblrDBToLocalStorage();
}

function editTumblrAccount(url, newName, newIcon) {
    const acc = accountDBs.tumblr.find(acc => acc.url === url);
    if (!acc) return;

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

// ---------------- HTML Generation ----------------
function generateHTMLFromAccounts(platform, accounts) {
    let html = `<!-- ${platform} accounts database -->\n<html><body>\n<ul>\n`;

    accounts.forEach(acc => {
        if (platform === "twitter") {
            html += `<li data-handle="${acc.handle}" data-name="${acc.name}" data-icon="${acc.icon}"></li>\n`;
        } else {
            html += `<li data-url="${acc.url}" data-name="${acc.name || ""}" data-icon="${acc.icon}"></li>\n`;
        }
    });

    html += "</ul>\n</body></html>";
    return html;
}

// ---------------- Load from LocalStorage ----------------
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

// ---------------- Parse HTML ----------------
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
        } else {
            return {
                url: li.dataset.url,
                name: li.dataset.name,
                icon: li.dataset.icon
            };
        }
    });
}