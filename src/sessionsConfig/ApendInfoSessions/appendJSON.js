import fs from "fs";
import path from "path";
import crypto from "crypto";

export default class appendJSON {
    constructor(filePath, data) {
        this.data = this.validateData(data);
        this.path = this.resolveDir(filePath);
        this.appendToFile();
    }

    appendToFile() {
        try {
            if (!this.path.endsWith('.json')) {
                if (this.path.endsWith(path.sep)) {
                    this.path = path.join(this.path, 'sessions.json');
                } else {
                    this.path = path.join(this.path, '/sessions.json');
                }
            }

            const dir = path.dirname(this.path);
            if (!fs.existsSync(dir)) {
                console.error("\nEasySession error! Directory does not exist. \n\n To create it, use:\n EasySession.createJSON(\"" + dir + "\"); \n");
                return;
            }

            const raw = fs.readFileSync(this.path, "utf8");
            if (raw.trim()) {
                this.oldData = JSON.parse(raw);
            }

            if (!Array.isArray(this.oldData)) {
                this.oldData = [this.oldData];
            }

            this.oldData.push(this.data);
            this.data = this.oldData;

            fs.writeFileSync(this.path, JSON.stringify(this.data, null, 2));
            console.log("File successfully written to:", this.path);
        } catch (error) {
            console.error("\nEasySession error! Error appending data to JSON file:\n", error);
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

    validateData(data) {
        if (data.startsWith('{') && data.endsWith('}') || data.startsWith('[') && data.endsWith(']')) {
            try {
                const jsonData = JSON.parse(data);
                if (!jsonData.username) {
                    console.error("\nEasySession error! Normally in EasySession, you can enter just the username as a string, and the JSON is generated automatically. But if you want to provide a full JSON object, it must contain 'username'\n ");
                    return [];
                } else {
                    const id = crypto.randomBytes(16).toString("hex");
                    return {
                        "username": jsonData.username,
                        "id": id,
                        "createdAt": new Date().toISOString()
                    };
                }

            } catch (error) {
                console.error("\nEasySession error! Invalid JSON string provided:\n", error);
                return [];
            }
        } else {
            if (typeof data === 'string') {
                try {
                    const username = data;
                    const id = crypto.randomBytes(16).toString("hex");
                    return {
                        "username": username,
                        "id": id,
                        "createdAt": new Date().toISOString()
                    }
                } catch (error) {
                    console.error("\nEasySession error! Invalid JSON string provided:\n", error);
                    return [];
                }
            }
        }
    }
}