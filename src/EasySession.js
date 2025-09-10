import createJSON from "./sessionsConfig/createSessionsFile/createJSON.js";
import createDatabase from "./sessionsConfig/createSessionsFile/createDatabase.js";
import appendJSON from "./sessionsConfig/apendInfoSessions/appendJSON.js";
import getInfoJSON from "./sessionsConfig/getInfoSessions/getInfoJSON.js";

class EasySession {
    //JSON part
    static JSON = {
        create(dir = process.cwd()) {
            return new createJSON(dir);
        },

        append(filePath = process.cwd(), data) {
            return new appendJSON(filePath, data);
        },

        getInfo(filePath = process.cwd(), username = null) {
            return new getInfoJSON(filePath, username);
        }
    };

    //Database part
    static createDatabase(conn) {
    return new createDatabase(conn);
}



}

export default EasySession;