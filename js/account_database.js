// ---------------- Account DB storage ----------------
let accountDBs = {
    twitter: [],
    tumblr: []
};

// ---------------- Twitter Accounts ----------------
function addTwitterAccount(name, handle, icon) {
    if (!name || !handle || !icon) return alert("All fields must be filled!");
    if (accountDBs.twitter.find(acc => acc.handle === handle)) return alert("Handle must be unique!");
    accountDBs.twitter.push({ name, handle, icon });
}

// ---------------- Tumblr Accounts ----------------
function addTumblrAccount(url, name, icon) {
    if (!url || !icon) return alert("URL and icon must be filled!");
    if (accountDBs.tumblr.find(acc => acc.url === url)) return alert("URL must be unique!");
    accountDBs.tumblr.push({ url, name, icon });
}

// Future: edit/delete accounts