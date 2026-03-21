// ---------------- Global Project State ----------------
window.project = {
    folderHandle: null,
    configHandle: null,
    config: {
        mainDocument: null,
        twitterDB: null,
        tumblrDB: null,
        outputHTML: null,
        workskin: null
    },
    // File handles for quick reference (optional)
    mainDocumentHandle: null,
    twitterDBHandle: null,
    tumblrDBHandle: null,
    outputHTMLHandle: null,
    workskinHandle: null
};

// ---------------- Utility: Update UI Previews ----------------
function updateProjectUI() {
    document.getElementById("projectStatus").textContent =
        window.project.folderHandle?.name || "No project loaded";

    document.getElementById("mainFileConfig").textContent =
        window.project.config.mainDocument || "No file assigned";

    document.getElementById("twitterFileConfig").textContent =
        window.project.config.twitterDB || "No file assigned";

    document.getElementById("tumblrFileConfig").textContent =
        window.project.config.tumblrDB || "No file assigned";

    document.getElementById("outputHTMLConfig").textContent =
        window.project.config.outputHTML || "No file assigned";

    document.getElementById("workskinFileConfig").textContent =
        window.project.config.workskin || "No file assigned";
}

// ---------------- Project: Open Existing ----------------
async function openProject() {
    try {
        const folderHandle = await window.showDirectoryPicker();
        window.project.folderHandle = folderHandle;

        // Look for Project.config.json
        let configFile = null;
        for await (const entry of folderHandle.values()) {
            if (entry.kind === "file" && entry.name === "Project.config.json") {
                configFile = entry;
                break;
            }
        }

        if (!configFile) {
            alert("Project folder has no Project.config.json. Cannot open project.");
            window.project.folderHandle = null;
            return;
        }

        window.project.configHandle = configFile;
        const file = await configFile.getFile();
        const text = await file.text();
        window.project.config = JSON.parse(text);

        // Load handles for each assigned file if they exist in folder
        await loadFileHandles();

        updateProjectUI();
        alert("Project loaded successfully.");
    } catch (err) {
        console.log("Open project cancelled or failed:", err);
    }
}

// ---------------- Project: Create New ----------------
async function createNewProject() {
    try {
        const folderHandle = await window.showDirectoryPicker({ mode: 'readwrite' });
        window.project.folderHandle = folderHandle;

        // Create empty files
        const mainDoc = await createFileInFolder(folderHandle, "main_document.html", "<!DOCTYPE html><html><head><title>Main Document</title></head><body></body></html>");
        const twitterDB = await createFileInFolder(folderHandle, "twitter_accounts.html", "<!-- Empty Twitter DB -->");
        const tumblrDB = await createFileInFolder(folderHandle, "tumblr_accounts.html", "<!-- Empty Tumblr DB -->");
        const outputHTML = await createFileInFolder(folderHandle, "output.html", "<!-- Generated HTML -->");
        const workskin = await createFileInFolder(folderHandle, "workskin.css", "/* Empty Workskin */");

        // Save config
        window.project.config = {
            mainDocument: mainDoc.name,
            twitterDB: twitterDB.name,
            tumblrDB: tumblrDB.name,
            outputHTML: outputHTML.name,
            workskin: workskin.name
        };

        const configHandle = await createFileInFolder(folderHandle, "Project.config.json", JSON.stringify(window.project.config, null, 4));
        window.project.configHandle = configHandle;

        // Store file handles
        window.project.mainDocumentHandle = mainDoc;
        window.project.twitterDBHandle = twitterDB;
        window.project.tumblrDBHandle = tumblrDB;
        window.project.outputHTMLHandle = outputHTML;
        window.project.workskinHandle = workskin;

        updateProjectUI();
        alert("New project created successfully.");
    } catch (err) {
        console.log("Create project cancelled or failed:", err);
    }
}

// ---------------- Utility: Create file in folder ----------------
async function createFileInFolder(folderHandle, fileName, content = "") {
    const handle = await folderHandle.getFileHandle(fileName, { create: true });
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    return handle;
}

// ---------------- Utility: Load Handles from Config ----------------
async function loadFileHandles() {
    const folder = window.project.folderHandle;
    const config = window.project.config;

    async function findHandle(fileName) {
        for await (const entry of folder.values()) {
            if (entry.kind === "file" && entry.name === fileName) return entry;
        }
        return null;
    }

    window.project.mainDocumentHandle = config.mainDocument ? await findHandle(config.mainDocument) : null;
    window.project.twitterDBHandle = config.twitterDB ? await findHandle(config.twitterDB) : null;
    window.project.tumblrDBHandle = config.tumblrDB ? await findHandle(config.tumblrDB) : null;
    window.project.outputHTMLHandle = config.outputHTML ? await findHandle(config.outputHTML) : null;
    window.project.workskinHandle = config.workskin ? await findHandle(config.workskin) : null;
}

// ---------------- Assign / Create Main Document ----------------
async function assignMainDocument() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            startIn: window.project.folderHandle,
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        window.project.config.mainDocument = fileHandle.name;
        window.project.mainDocumentHandle = fileHandle;
        await saveConfig();
        updateProjectUI();
    } catch (err) {
        console.log("Assign Main Document cancelled or failed:", err);
    }
}

async function createMainDocument() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    const newFile = await createFileInFolder(window.project.folderHandle, "main_document_new.html", "<!DOCTYPE html><html><head><title>Main Document</title></head><body></body></html>");
    window.project.config.mainDocument = newFile.name;
    window.project.mainDocumentHandle = newFile;
    await saveConfig();
    updateProjectUI();
}

// ---------------- Assign / Create Output HTML ----------------
async function assignOutputHTML() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            startIn: window.project.folderHandle,
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        window.project.config.outputHTML = fileHandle.name;
        window.project.outputHTMLHandle = fileHandle;
        await saveConfig();
        updateProjectUI();
    } catch (err) {
        console.log("Assign Output HTML cancelled or failed:", err);
    }
}

async function createOutputHTML() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    const newFile = await createFileInFolder(window.project.folderHandle, "output_new.html", "<!-- Generated HTML -->");
    window.project.config.outputHTML = newFile.name;
    window.project.outputHTMLHandle = newFile;
    await saveConfig();
    updateProjectUI();
}

// ---------------- Assign / Create Account DBs ----------------
async function assignTwitterDB() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            startIn: window.project.folderHandle,
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        window.project.config.twitterDB = fileHandle.name;
        window.project.twitterDBHandle = fileHandle;
        await saveConfig();
        updateProjectUI();
    } catch (err) {
        console.log("Assign Twitter DB cancelled or failed:", err);
    }
}

async function createTwitterDB() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    const newFile = await createFileInFolder(window.project.folderHandle, "twitter_accounts_new.html", "<!-- Empty Twitter DB -->");
    window.project.config.twitterDB = newFile.name;
    window.project.twitterDBHandle = newFile;
    await saveConfig();
    updateProjectUI();
}

async function assignTumblrDB() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            startIn: window.project.folderHandle,
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        window.project.config.tumblrDB = fileHandle.name;
        window.project.tumblrDBHandle = fileHandle;
        await saveConfig();
        updateProjectUI();
    } catch (err) {
        console.log("Assign Tumblr DB cancelled or failed:", err);
    }
}

async function createTumblrDB() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    const newFile = await createFileInFolder(window.project.folderHandle, "tumblr_accounts_new.html", "<!-- Empty Tumblr DB -->");
    window.project.config.tumblrDB = newFile.name;
    window.project.tumblrDBHandle = newFile;
    await saveConfig();
    updateProjectUI();
}

// ---------------- Assign Workskin ----------------
async function assignWorkskin() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            startIn: window.project.folderHandle,
            types: [{ description: "CSS Files", accept: { "text/css": [".css"] } }]
        });
        window.project.config.workskin = fileHandle.name;
        window.project.workskinHandle = fileHandle;
        await saveConfig();
        updateProjectUI();
    } catch (err) {
        console.log("Assign Workskin cancelled or failed:", err);
    }
}

// ---------------- Save Project Config ----------------
async function saveConfig() {
    if (!window.project.configHandle) {
        window.project.configHandle = await createFileInFolder(window.project.folderHandle, "Project.config.json", "");
    }
    const writable = await window.project.configHandle.createWritable();
    await writable.write(JSON.stringify(window.project.config, null, 4));
    await writable.close();
}