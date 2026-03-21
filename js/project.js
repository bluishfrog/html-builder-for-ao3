// ---------------- Global Project State ----------------
window.Project = {
    current: {
        name: null,
        folderHandle: null,
        configHandle: null,
        mainFileHandle: null,
        accountDBHandles: {}, // { twitter: handle, tumblr: handle }
        outputHTMLHandle: null,
        workskinHandle: null
    },

    openProject: async function () {
        try {
            const folderHandle = await window.showDirectoryPicker();

            let configHandle = null;
            for await (const [name, handle] of folderHandle.entries()) {
                if (name.endsWith(".json") && handle.kind === "file") {
                    if (configHandle) throw new Error("Multiple config files found!");
                    configHandle = handle;
                }
            }
            if (!configHandle) throw new Error("No config file found!");

            const fileData = await configHandle.getFile();
            const text = await fileData.text();
            const config = JSON.parse(text);

            // Validate required files
            const requiredFiles = [
                config.mainDocument,
                ...Object.values(config.accountDBs),
                config.outputHTML,
                config.workskin
            ];

            for (const filename of requiredFiles) {
                if (!(await folderHandle.getFileHandle(filename).catch(() => null))) {
                    throw new Error(`Required file missing: ${filename}`);
                }
            }

            // Assign handles
            Project.current = {
                name: folderHandle.name,
                folderHandle,
                configHandle,
                mainFileHandle: await folderHandle.getFileHandle(config.mainDocument),
                accountDBHandles: {
                    twitter: await folderHandle.getFileHandle(config.accountDBs.twitter),
                    tumblr: await folderHandle.getFileHandle(config.accountDBs.tumblr)
                },
                outputHTMLHandle: await folderHandle.getFileHandle(config.outputHTML),
                workskinHandle: await folderHandle.getFileHandle(config.workskin)
            };

            document.getElementById("projectStatus").textContent = `Project: ${folderHandle.name}`;
            document.getElementById("downloadWorkskinBtn").disabled = false;

            // Enable account add buttons
            document.getElementById("addTwitterBtn").disabled = false;
            document.getElementById("addTumblrBtn").disabled = false;

            console.log("Project loaded:", Project.current.name);

        } catch (err) {
            alert("Failed to open project: " + err.message);
        }
    },

    createNewProject: async function () {
        try {
            const folderHandle = await window.showDirectoryPicker();

            const fileNames = {
                mainDocument: "main_document.html",
                accountDBs: { twitter: "twitter_accounts.html", tumblr: "tumblr_accounts.html" },
                outputHTML: "generated.html",
                workskin: "workskin.css"
            };

            // Create empty files
            await folderHandle.getFileHandle(fileNames.mainDocument, { create: true });
            for (const accFile of Object.values(fileNames.accountDBs)) {
                await folderHandle.getFileHandle(accFile, { create: true });
            }
            await folderHandle.getFileHandle(fileNames.outputHTML, { create: true });
            await folderHandle.getFileHandle(fileNames.workskin, { create: true });

            // Create config
            const configHandle = await folderHandle.getFileHandle("config.json", { create: true });
            const writable = await configHandle.createWritable();
            await writable.write(JSON.stringify(fileNames, null, 2));
            await writable.close();

            // Assign current project
            Project.current = {
                name: folderHandle.name,
                folderHandle,
                configHandle,
                mainFileHandle: await folderHandle.getFileHandle(fileNames.mainDocument),
                accountDBHandles: {
                    twitter: await folderHandle.getFileHandle(fileNames.accountDBs.twitter),
                    tumblr: await folderHandle.getFileHandle(fileNames.accountDBs.tumblr)
                },
                outputHTMLHandle: await folderHandle.getFileHandle(fileNames.outputHTML),
                workskinHandle: await folderHandle.getFileHandle(fileNames.workskin)
            };

            document.getElementById("projectStatus").textContent = `Project: ${folderHandle.name}`;
            document.getElementById("downloadWorkskinBtn").disabled = false;

            document.getElementById("addTwitterBtn").disabled = false;
            document.getElementById("addTumblrBtn").disabled = false;

        } catch (err) {
            alert("Failed to create project: " + err.message);
        }
    },

    downloadWorkskin: async function () {
        if (!Project.current.workskinHandle) return;
        try {
            const file = await Project.current.workskinHandle.getFile();
            const blob = await file.slice();
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = Project.current.workskinHandle.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.log("Failed to download workskin:", err);
        }
    }
};