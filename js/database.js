// ---------------- Global DB State ----------------
window.dbState = {
    main: false,
    twitter: false,
    tumblr: false
};

// ---------------- Main Document ----------------
let mainFileHandle = null;

// Update preview + state + button
function updateFilePreview(spanId, name) {
    document.getElementById(spanId).textContent = name || "No file selected";

    let isActive = !!name;

    switch (spanId) {
        case "mainFilePreview":
            document.getElementById("downloadMainBtn").disabled = !isActive;
            window.dbState.main = isActive;
            break;

        case "twitterFilePreview":
            document.getElementById("downloadTwitterBtn").disabled = !isActive;
            window.dbState.twitter = isActive;
            break;

        case "tumblrFilePreview":
            document.getElementById("downloadTumblrBtn").disabled = !isActive;
            window.dbState.tumblr = isActive;
            break;
    }
}

// ---------------- Main File ----------------
async function openMainFile() {
    try {
        [mainFileHandle] = await window.showOpenFilePicker({
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }],
            multiple: false
        });

        updateFilePreview("mainFilePreview", mainFileHandle.name);
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

        updateFilePreview("mainFilePreview", mainFileHandle.name);
    } catch (err) {
        console.log("Creation cancelled or failed:", err);
    }
}

async function downloadMainFile() {
    try {
        const content = localStorage.getItem("loadedHTML") || "<!-- Placeholder content -->";
        const blob = new Blob([content], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = mainFileHandle?.name || "main_document.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.log("Download failed:", err);
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
        console.log("Open cancelled or failed:", err);
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
        localStorage.setItem("twitterDB", "<!-- Empty Twitter DB -->");
    } catch (err) {
        console.log("Creation cancelled or failed:", err);
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

async function downloadTwitterDB() {
    try {
        const content = localStorage.getItem("twitterDB") || "<!-- Empty Twitter DB -->";
        const blob = new Blob([content], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = twitterDBHandle?.name || "twitter_accounts.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.log("Download failed:", err);
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
        console.log("Open cancelled or failed:", err);
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
        localStorage.setItem("tumblrDB", "<!-- Empty Tumblr DB -->");
    } catch (err) {
        console.log("Creation cancelled or failed:", err);
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

async function downloadTumblrDB() {
    try {
        const content = localStorage.getItem("tumblrDB") || "<!-- Empty Tumblr DB -->";
        const blob = new Blob([content], { type: "text/html" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = tumblrDBHandle?.name || "tumblr_accounts.html";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (err) {
        console.log("Download failed:", err);
    }
}