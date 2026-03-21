// Example structure for account DB
let accountDBs = {
    twitter: [],
    tumblr: []
};

// Add Twitter account
function addTwitterAccount(name, handle, icon) {
    if (!name || !handle || !icon) return alert("All fields must be filled!");
    if (accountDBs.twitter.find(acc => acc.handle === handle)) return alert("Handle must be unique!");
    accountDBs.twitter.push({ name, handle, icon });
}

// Add Tumblr account
function addTumblrAccount(url, name, icon) {
    if (!url || !icon) return alert("URL and icon must be filled!");
    if (accountDBs.tumblr.find(acc => acc.url === url)) return alert("URL must be unique!");
    accountDBs.tumblr.push({ url, name, icon });
}

// Future: edit/delete accounts