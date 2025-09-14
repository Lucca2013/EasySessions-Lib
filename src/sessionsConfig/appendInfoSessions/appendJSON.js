import fs from "fs";
import path from "path";
import crypto from "crypto";
import Logger from "../../utils/logger.js";

export default class appendJSON {
    constructor(filePath, data) {
        this.data = this.validateData(data);
        this.path = this.resolveDir(filePath);
        this.appendToFile();
    }

    appendToFile() {
        try {
            if (!this.path.endsWith('.json')) {
                this.path = path.join(this.path, 'sessions.json');
            }

            const dir = path.dirname(this.path);
            if (!fs.existsSync(dir)) {
                Logger.error("EasySession error! Directory does not exist. \n\n To create it, use:\n EasySession.createJSON(\"" + dir + "\"); \n");
                return;
            }

            let oldData = {};

            if (fs.existsSync(this.path)) {
                const raw = fs.readFileSync(this.path, "utf8");
                if (raw.trim()) {
                    try {
                        oldData = JSON.parse(raw);
                    } catch (e) {
                        Logger.error("Error parsing existing JSON file:", e);
                        oldData = {};
                    }
                }
            }

            if (Array.isArray(oldData) || typeof oldData !== "object") {
                oldData = {};
            }

            if (oldData.hasOwnProperty(this.data.username)) {
                Logger.warn("EasySession warning! User already exists. \n");
            } else {
                oldData[this.data.username] = {
                    id: this.data.id,
                    createdAt: this.data.createdAt
                };

                this.newData = oldData;

                fs.writeFileSync(this.path, JSON.stringify(this.newData, null, 2));
                Logger.success(`File successfully written to: ${this.path} \n`);
            }
        } catch (error) {
            Logger.error("EasySession error! Error appending data to JSON file:\n", error);
        }
    }

    resolveDir(filePath) {
        if (filePath.startsWith('/')) {
            const relativePath = filePath.substring(1);
            return path.resolve(process.cwd(), relativePath);
        } else if (path.isAbsolute(filePath)) {
            return filePath;
        } else {
            Logger.warn("EasySession warning! Relative paths may not work as expected.");
            Logger.info("Consider using an absolute path starting with '/' or a full path");
            return path.resolve(process.cwd(), filePath);
        }
    }

    validateData(data) {
        if (data.startsWith('{') && data.endsWith('}') || data.startsWith('[') && data.endsWith(']')) {
            try {
                const jsonData = JSON.parse(data);
                if (!jsonData.username) {
                    Logger.error("EasySession error! Normally in EasySession, you can enter just the username as a string, \n and the JSON is generated automatically. But if you want to provide a full JSON object, it must contain 'username'\n ");
                    return {};
                } else {
                    const id = crypto.randomBytes(16).toString("hex");
                    return {
                        "username": jsonData.username,
                        "id": id,
                        "createdAt": new Date().toISOString()
                    };
                }

            } catch (error) {
                Logger.error("EasySession error! Invalid JSON string provided:\n", error);
                return {};
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
                    Logger.error("EasySession error! Invalid JSON string provided:\n", error);
                    return {};
                }
            }
        }
    }
}