import createJSON from "./sessionsConfig/createSessionsFile/createJSON.js";
import appendJSON from "./sessionsConfig/appendInfoSessions/appendJSON.js";
import getInfoJSON from "./sessionsConfig/getInfoSessions/getInfoJSON.js";
import deleteInfoJSON from "./sessionsConfig/deleteInfoSessions/deleteInfoJSON.js";
import createDB from "./sessionsConfig/createSessionsFile/createDB.js";
import appendDB from "./sessionsConfig/appendInfoSessions/appendDB.js";
import getInfoDB from "./sessionsConfig/getInfoSessions/getInfoDB.js";
import deleteInfoDB from "./sessionsConfig/deleteInfoSessions/deleteInfoDB.js";

export default class EasySession {
    static servers = {};

    //JSON part
    static JSON = {
        create(dir = process.cwd()) {
            return new createJSON(dir);
        },

        append(filePath = process.cwd(), username, SessionPassword) {
            return new appendJSON(filePath, username, SessionPassword);
        },

        getInfo(filePath = process.cwd(), username = null) {
            return new getInfoJSON(filePath, username);
        },

        deleteInfo(filePath = process.cwd(), username = null) {
            return new deleteInfoJSON(filePath, username)
        }
    };

    //Database part
    static DB = {
        async create(databaseUrl) {
            const createdb = new createDB(databaseUrl);
            await createdb.createDB();
        },

        async append(databaseUrl, username, SessionPassword) {
            const appenddb = new appendDB(databaseUrl, username, SessionPassword);
            await appenddb.appendToDB();
        },

        async getInfo(databaseUrl, username) {
            const getinfodb = new getInfoDB(databaseUrl, username);
            const Info = await getinfodb.getInfo();
            return Info;
        },

        async deleteInfo() {
            return new deleteInfoDB();
        }

    }

    static handler(callback) {
        return async (req, res) => {
            const { username, password } = req.body;
            try {
                await callback({ username, password });
                res.json({ status: "User received and forwarded" });
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        };
    }

    static expressUtils = {
        onNewUsers(app, callback) {
            app.post("/sessions/listenNewUsers", async (req, res) => {
                const { username, password } = req.body;

                try {
                    await callback({ username, password });
                } catch (error) {
                    Logger.error("Error in EasySession callback:", error);
                }

                res.json({ status: "User received and forwarded" });
            });
        }
    };

}
