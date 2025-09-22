import createJSON from "./sessionsConfig/createSessionsFile/createJSON.js";
import appendJSON from "./sessionsConfig/appendInfoSessions/appendJSON.js";
import getInfoJSON from "./sessionsConfig/getInfoSessions/getInfoJSON.js";
import deleteInfoJSON from "./sessionsConfig/deleteInfoSessions/deleteInfoJSON.js";
import createDB from "./sessionsConfig/createSessionsFile/createDB.js";
import appendDB from "./sessionsConfig/appendInfoSessions/appendDB.js";
import getInfoDB from "./sessionsConfig/getInfoSessions/getInfoDB.js";
import deleteInfoDB from "./sessionsConfig/deleteInfoSessions/deleteInfoDB.js";

export default class EasySession {
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
        },

        deleteInfo(filePath = process.cwd(), username = null){
            return new deleteInfoJSON(filePath, username)
        }
    };

    //Database part
    static DB = {
        async create(databaseUrl) {
            const createdb = new createDB(databaseUrl);
            await createdb.createDB();
        },

        async append(databaseUrl, data) {
            const appenddb = new appendDB(databaseUrl, data);
            await appenddb.appendToDB();
        },

        async getInfo() {
            return new getInfoDB();
        },

        async deleteInfo(){
            return new deleteInfoDB();
        }

    }



}