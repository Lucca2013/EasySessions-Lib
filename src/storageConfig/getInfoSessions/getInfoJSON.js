import fs from "fs";
import path from "path";
import Logger from "../../utils/logger.js";

export default class getInfoJSON {
    constructor(filePath, username) {
        this.filePath = this.resolveDir(filePath);
        this.username = this.verifyUsername(username);
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
        try{
            if (!fs.existsSync(this.filePath)) {
                Logger.error("EasySession error! JSON file does not exist at the specified path:", this.filePath);
            }else{
                if(this.filePath.endsWith("/")){
                    this.filePath = this.filePath + "sessions.json";
                }

                if(!this.filePath.endsWith(".json")){
                    this.filePath = this.filePath + "/sessions.json";
                }
                
                const fileData = fs.readFileSync(this.filePath, 'utf-8');
                const jsonData = JSON.parse(fileData);

                if(this.username in jsonData){
                    return jsonData[this.username];
                }else{
                    Logger.error(`EasySession error! Username: ${this.username} not found in the JSON file.\n`);
                }
                
            }
        } catch (error) {
            Logger.error("EasySession error! An error occurred while checking the JSON file:", error);
        }
    }

}