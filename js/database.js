// ---------------- Main Document ----------------
let mainFileHandle = null;

async function openMainFile() {
    try {
        [mainFileHandle] = await window.showOpenFilePicker({
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }],
            multiple: false
        });
        updateFileName("mainFileName", mainFileHandle.name);
        document.getElementById("saveMainBtn").disabled = false;
        alert("Main document loaded: " + mainFileHandle.name);
    } catch (err) {
        console.log("Open cancelled or failed:", err);
    }
}

async function createNewMainFile() {
    try {
        mainFileHandle = await window.showSaveFilePicker({
            suggestedName: 'main_document.html',
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        const writable = await mainFileHandle.createWritable();
        await writable.write(`<!DOCTYPE html><html><head><title>Main Document</title></head><body></body></html>`);
        await writable.close();
        updateFileName("mainFileName", mainFileHandle.name);
        document.getElementById("saveMainBtn").disabled = false;
        alert("New main document created: " + mainFileHandle.name);
    } catch (err) {
        console.log("Creation cancelled or failed:", err);
    }
}

async function saveMainFile() {
    if (!mainFileHandle) return alert("No file selected.");
    const writable = await mainFileHandle.createWritable();
    const content = localStorage.getItem("loadedHTML") || "<!-- Placeholder content -->";
    await writable.write(content);
    await writable.close();
    alert("Main file saved!");
}

// ---------------- Account DB selection ----------------
let twitterDBHandle = null;
let tumblrDBHandle = null;

async function openTwitterDB() {
    try {
        [twitterDBHandle] = await window.showOpenFilePicker({ types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }] });
        updateFileName("twitterDBName", twitterDBHandle.name);
        alert("Twitter DB loaded: " + twitterDBHandle.name);
    } catch (err) { console.log(err); }
}

async function createNewTwitterDB() {
    try {
        twitterDBHandle = await window.showSaveFilePicker({
            suggestedName: "twitter_accounts.html",
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        const writable = await twitterDBHandle.createWritable();
        await writable.write("<!-- Empty Twitter DB -->");
        await writable.close();
        updateFileName("twitterDBName", twitterDBHandle.name);
        alert("New Twitter DB created: " + twitterDBHandle.name);
    } catch (err) { console.log(err); }
}

async function loadTwitterTest() {
    const res = await fetch("test_data/twitter_test.html");
    const text = await res.text();
    console.log("Twitter test DB loaded:", text);
}

// Tumblr DB
async function openTumblrDB() {
    try {
        [tumblrDBHandle] = await window.showOpenFilePicker({ types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }] });
        updateFileName("tumblrDBName", tumblrDBHandle.name);
        alert("Tumblr DB loaded: " + tumblrDBHandle.name);
    } catch (err) { console.log(err); }
}

async function createNewTumblrDB() {
    try {
        tumblrDBHandle = await window.showSaveFilePicker({
            suggestedName: "tumblr_accounts.html",
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        const writable = await tumblrDBHandle.createWritable();
        await writable.write("<!-- Empty Tumblr DB -->");
        await writable.close();
        updateFileName("tumblrDBName", tumblrDBHandle.name);
        alert("New Tumblr DB created: " + tumblrDBHandle.name);
    } catch (err) { console.log(err); }
}

async function loadTumblrTest() {
    const res = await fetch("test_data/tumblr_test.html");
    const text = await res.text();
    console.log("Tumblr test DB loaded:", text);
}

// ---------------- Utility ----------------
function updateFileName(spanId, name) {
    document.getElementById(spanId).textContent = name;
}