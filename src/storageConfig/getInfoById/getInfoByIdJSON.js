import fs from "fs";
import path from "path";
import Logger from "../../utils/logger.js";
import EasySession from "../../EasySession.js";

export default class getInfoByIdJSON {
    constructor(filePath, id, isEasySession = false) {
        this.filePath = this.resolveDir(filePath);
        this.username = this.verifyUsername(username);
        this.isEasySession = isEasySession;
        return this.getInfo();
    }

    verifyUsername(username) {
        if (!username || typeof username !== 'string' || username.trim() === '' || username == null) {
            Logger.error("EasySession error! Invalid username provided.");
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
            Logger.warn("EasySession warning! Relative paths may not work as expected.");
            Logger.info("Consider using an absolute path starting with '/' or a full path");
            return path.resolve(process.cwd(), filePath);
        }
    }

    getInfo() {
        try {
            if (!fs.existsSync(this.filePath)) {
                Logger.error("EasySession error! JSON file does not exist at the specified path:", this.filePath);
            } else {
                if (this.filePath.endsWith("/")) {
                    this.filePath = this.filePath + "sessions.json";
                }

                if (!this.filePath.endsWith(".json")) {
                    this.filePath = this.filePath + "/sessions.json";
                }

                const fileData = fs.readFileSync(this.filePath, 'utf-8');
                const jsonData = JSON.parse(fileData);

                for (const [username, userData] of Object.entries(jsonData)) {
                    if (userData.id === this.id) {
                        return {
                            username: username,
                            ...userData
                        };
                    }
                }

                if (this.isEasySession) {
                    return 'false';
                } else {
                    Logger.error(`EasySession error! ID: ${this.id} not found in the JSON file.\n`);
                    return null;
                }

            }
        } catch (error) {
            Logger.error("EasySession error! An error occurred while checking the JSON file:", error);
        }
    }

}