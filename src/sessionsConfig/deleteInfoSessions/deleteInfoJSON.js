import fs from "fs";
import path from "path"

export default class deleteInfoJSON {
    constructor(filePath, username) {
        this.filePath = this.resolveDir(filePath);
        this.username = this.verifyUsername(username);
        return this.deleteInfo();

    }

    verifyUsername(username) {
        if (!username || typeof username !== 'string' || username.trim() === '' || username == null) {
            console.error("\nEasySession error! Invalid username provided.");
        } else {
            return username;
        }
    }

    resolveDir(filePath) {
        if (filePath.startsWith('/')) {
            const relativePath = filePath.substring(1);
            return path.resolve(process.cwd(), relativePath);
        } else if (path.isAbsolute(filePath)) {
            return filePath;
        } else {
            console.error("\nEasySession warning! Relative paths may not work as expected.");
            console.error("Consider using an absolute path starting with '/' or a full path");
            return path.resolve(process.cwd(), filePath);
        }
    }

    deleteInfo() {
        try {
            if (!fs.existsSync(this.filePath)) {
                console.error("\nEasySession error! JSON file does not exist at the specified path:", this.filePath);
            } else {
                if (this.filePath.endsWith("/")) {
                    this.filePath = this.filePath + "sessions.json";
                }

                if (!this.filePath.endsWith(".json")) {
                    this.filePath = this.filePath + "/sessions.json";
                }

                const fileData = fs.readFileSync(this.filePath, 'utf-8');
                const jsonData = JSON.parse(fileData);

                if (this.username in jsonData) {
                    const infoDeleted = jsonData[this.username]
                    delete jsonData[this.username];
                    fs.writeFileSync(this.filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
                    console.log("Info who was deleted: \n")
                    console.table(infoDeleted);
                } else {
                    console.error(`\nEasySession error! Username: ${this.username} not found in the JSON file.\n`);
                }

            }
        } catch (error) {
            console.error("\nEasySession error! An error occurred while checking the JSON file:", error);
        }
    }
}