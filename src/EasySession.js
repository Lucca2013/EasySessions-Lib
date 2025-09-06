import createJSON from "./sessionsConfig/createSessionsFile/createJSON.js";
import createDatabase from "./sessionsConfig/createSessionsFile/createDatabase.js";
import appendJSON from "./sessionsConfig/ApendInfoSessions/appendJSON.js";

class EasySession {
    //JSON part
    static createJSON(dir = process.cwd()) {
        return new createJSON(dir);
    }

    //Database part
    static createDatabase(conn) {
        return new createDatabase(conn);
    }

    static appendToJSON(filePath = process.cwd(), data) {
        return new appendJSON(filePath, data);
    }
}

export default EasySession;