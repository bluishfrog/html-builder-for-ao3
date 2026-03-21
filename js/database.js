// ---------------- Main Document ----------------
let mainFileHandle = null;

// Update the preview of selected file
function updateFilePreview(spanId, name) {
    document.getElementById(spanId).textContent = name || "No file selected";
}

// Open existing main file
async function openMainFile() {
    try {
        [mainFileHandle] = await window.showOpenFilePicker({
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }],
            multiple: false
        });

        updateFilePreview("mainFilePreview", mainFileHandle.name);
        document.getElementById("saveMainBtn").disabled = false;
    } catch (err) {
        console.log("Open cancelled or failed:", err);
    }
}

// Create new main file
async function createNewMainFile() {
    try {
        mainFileHandle = await window.showSaveFilePicker({
            suggestedName: 'main_document.html',
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });

        const writable = await mainFileHandle.createWritable();
        await writable.write(`<!DOCTYPE html><html><head><title>Main Document</title></head><body></body></html>`);
        await writable.close();

        updateFilePreview("mainFilePreview", mainFileHandle.name);
        document.getElementById("saveMainBtn").disabled = false;
    } catch (err) {
        console.log("Creation cancelled or failed:", err);
    }
}

// Save main file
async function saveMainFile() {
    if (!mainFileHandle) return alert("No file selected.");
    try {
        const writable = await mainFileHandle.createWritable();
        const content = localStorage.getItem("loadedHTML") || "<!-- Placeholder content -->";
        await writable.write(content);
        await writable.close();
    } catch (err) {
        console.log("Save failed:", err);
    }
}

// ---------------- Twitter DB ----------------
let twitterDBHandle = null;

async function openTwitterDB() {
    try {
        [twitterDBHandle] = await window.showOpenFilePicker({
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });

        updateFilePreview("twitterFilePreview", twitterDBHandle.name);
    } catch (err) {
        console.log(err);
    }
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

        updateFilePreview("twitterFilePreview", twitterDBHandle.name);
    } catch (err) {
        console.log(err);
    }
}

async function loadTwitterTest() {
    try {
        const res = await fetch("test_data/twitter_test.html");
        const text = await res.text();
        localStorage.setItem("twitterDB", text);
        updateFilePreview("twitterFilePreview", "Test Twitter DB");
    } catch (err) {
        console.log("Failed to load Twitter test DB:", err);
    }
}

// ---------------- Tumblr DB ----------------
let tumblrDBHandle = null;

async function openTumblrDB() {
    try {
        [tumblrDBHandle] = await window.showOpenFilePicker({
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });

        updateFilePreview("tumblrFilePreview", tumblrDBHandle.name);
    } catch (err) {
        console.log(err);
    }
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

        updateFilePreview("tumblrFilePreview", tumblrDBHandle.name);
    } catch (err) {
        console.log(err);
    }
}

async function loadTumblrTest() {
    try {
        const res = await fetch("test_data/tumblr_test.html");
        const text = await res.text();
        localStorage.setItem("tumblrDB", text);
        updateFilePreview("tumblrFilePreview", "Test Tumblr DB");
    } catch (err) {
        console.log("Failed to load Tumblr test DB:", err);
    }
}