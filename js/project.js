// ---------------- Global Project State ----------------
window.project = {
    folderHandle: null,
    configHandle: null,
    config: {
        mainDocument: null,
        twitterDB: null,
        tumblrDB: null,
        workskin: null
    }
};

// ---------------- Utility: Update UI Previews ----------------
function updateProjectUI() {
    document.getElementById("projectStatus").textContent =
        window.project.folderHandle?.name || "No project loaded";

    document.getElementById("twitterFileConfig").textContent =
        window.project.config.twitterDB || "No file assigned";

    document.getElementById("tumblrFileConfig").textContent =
        window.project.config.tumblrDB || "No file assigned";

    document.getElementById("workskinFileConfig").textContent =
        window.project.config.workskin || "No file assigned";
}

// ---------------- Project: Open Existing ----------------
async function openProject() {
    try {
        // User selects a folder
        const [folderHandle] = await window.showDirectoryPicker();
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

        // Create empty files in the folder
        const mainDoc = await createFileInFolder(folderHandle, "main_document.html", "<!DOCTYPE html><html><head><title>Main Document</title></head><body></body></html>");
        const twitterDB = await createFileInFolder(folderHandle, "twitter_accounts.html", "<!-- Empty Twitter DB -->");
        const tumblrDB = await createFileInFolder(folderHandle, "tumblr_accounts.html", "<!-- Empty Tumblr DB -->");
        const workskin = await createFileInFolder(folderHandle, "workskin.css", "/* Empty Workskin */");

        // Save config
        window.project.config = {
            mainDocument: mainDoc.name,
            twitterDB: twitterDB.name,
            tumblrDB: tumblrDB.name,
            workskin: workskin.name
        };

        const configHandle = await createFileInFolder(folderHandle, "Project.config.json", JSON.stringify(window.project.config, null, 4));
        window.project.configHandle = configHandle;

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

// ---------------- Assign Existing Twitter DB ----------------
async function assignTwitterDB() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            startIn: window.project.folderHandle,
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        window.project.config.twitterDB = fileHandle.name;
        await saveConfig();
        updateProjectUI();
    } catch (err) {
        console.log("Assign Twitter DB cancelled or failed:", err);
    }
}

// ---------------- Create New Twitter DB ----------------
async function createTwitterDB() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    const newFile = await createFileInFolder(window.project.folderHandle, "twitter_accounts_new.html", "<!-- Empty Twitter DB -->");
    window.project.config.twitterDB = newFile.name;
    await saveConfig();
    updateProjectUI();
}

// ---------------- Assign Existing Tumblr DB ----------------
async function assignTumblrDB() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    try {
        const [fileHandle] = await window.showOpenFilePicker({
            startIn: window.project.folderHandle,
            types: [{ description: "HTML Files", accept: { "text/html": [".html"] } }]
        });
        window.project.config.tumblrDB = fileHandle.name;
        await saveConfig();
        updateProjectUI();
    } catch (err) {
        console.log("Assign Tumblr DB cancelled or failed:", err);
    }
}

// ---------------- Create New Tumblr DB ----------------
async function createTumblrDB() {
    if (!window.project.folderHandle) return alert("Load a project first.");
    const newFile = await createFileInFolder(window.project.folderHandle, "tumblr_accounts_new.html", "<!-- Empty Tumblr DB -->");
    window.project.config.tumblrDB = newFile.name;
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
        await saveConfig();
        updateProjectUI();
    } catch (err) {
        console.log("Assign workskin cancelled or failed:", err);
    }
}

// ---------------- Save Project Config ----------------
async function saveConfig() {
    if (!window.project.configHandle) {
        // Create config file if missing
        window.project.configHandle = await createFileInFolder(window.project.folderHandle, "Project.config.json", "");
    }
    const writable = await window.project.configHandle.createWritable();
    await writable.write(JSON.stringify(window.project.config, null, 4));
    await writable.close();
}