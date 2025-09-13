import fs from "fs";
import path from "path";

export default class createJSON {
  constructor(dir = process.cwd()) {
    this.resolvedDir = this.resolveDir(dir);

    fs.mkdirSync(this.resolvedDir, { recursive: true });

    this.sessionsFile = path.join(this.resolvedDir, "sessions.json");

    if (!fs.existsSync(this.sessionsFile)) {
      fs.writeFileSync(this.sessionsFile, JSON.stringify([], null, 2));
      console.log("JSON storage was created")
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


}
