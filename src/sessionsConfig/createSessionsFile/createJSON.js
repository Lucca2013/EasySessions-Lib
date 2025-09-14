import fs from "fs";
import path from "path";
import Logger from "../../utils/logger.js";

export default class createJSON {
  constructor(dir = process.cwd()) {
    this.resolvedDir = this.resolveDir(dir);

    fs.mkdirSync(this.resolvedDir, { recursive: true });

    this.sessionsFile = path.join(this.resolvedDir, "sessions.json");

    if (!fs.existsSync(this.sessionsFile)) {
      fs.writeFileSync(this.sessionsFile, JSON.stringify([], null, 2));
      Logger.success("JSON storage was created at " + this.sessionsFile);
    }else {
      Logger.info("Already exists a JSON storage at " + this.sessionsFile);
    }
  }

  resolveDir(filePath) {
    if (filePath.startsWith('/')) {
      const relativePath = filePath.substring(1);
      return path.resolve(process.cwd(), relativePath);
    } else if (path.isAbsolute(filePath)) {
      return filePath;
    } else {
      Logger.warn("Relative paths may not work as expected.");
      Logger.info("Consider using an absolute path starting with '/' or a full path");
      return path.resolve(process.cwd(), filePath);
    }
  }


}
