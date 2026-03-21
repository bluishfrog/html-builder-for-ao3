let fileHandle = null;
let fileContent = "";

// 📂 OPEN existing file
async function openFile() {
    try {
        [fileHandle] = await window.showOpenFilePicker({
            types: [
                {
                    description: "HTML Files",
                    accept: { "text/html": [".html"] }
                }
            ]
        });

        const file = await fileHandle.getFile();
        fileContent = await file.text();

        console.log("Loaded content:", fileContent);

        // store for other pages (builder later)
        localStorage.setItem("loadedHTML", fileContent);

        document.getElementById("saveBtn").disabled = false;

        alert("File loaded successfully!");
    } catch (err) {
        console.log("Open cancelled or failed", err);
    }
}

// 🆕 CREATE new file
async function createNewFile() {
    try {
        fileHandle = await window.showSaveFilePicker({
            suggestedName: "new_document.html",
            types: [
                {
                    description: "HTML Files",
                    accept: { "text/html": [".html"] }
                }
            ]
        });

        fileContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>New Document</title>
</head>
<body>

<!-- Your content here -->

</body>
</html>`;

        await writeFile(fileHandle, fileContent);

        localStorage.setItem("loadedHTML", fileContent);

        document.getElementById("saveBtn").disabled = false;

        alert("New file created!");
    } catch (err) {
        console.log("Creation cancelled or failed", err);
    }
}

// SAVE file (overwrite)
async function saveFile() {
    if (!fileHandle) {
        alert("No file selected.");
        return;
    }

    try {
        // later: replace with actual builder output
        const updatedContent = localStorage.getItem("loadedHTML") || fileContent;

        await writeFile(fileHandle, updatedContent);

        alert("File saved!");
    } catch (err) {
        console.log("Save failed", err);
    }
}

// ✍️ helper to write file
async function writeFile(handle, content) {
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
}