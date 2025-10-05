import createJSON from "./sessionsConfig/createSessionsFile/createJSON.js";
import appendJSON from "./sessionsConfig/appendInfoSessions/appendJSON.js";
import getInfoJSON from "./sessionsConfig/getInfoSessions/getInfoJSON.js";
import deleteInfoJSON from "./sessionsConfig/deleteInfoSessions/deleteInfoJSON.js";
import createDB from "./sessionsConfig/createSessionsFile/createDB.js";
import appendDB from "./sessionsConfig/appendInfoSessions/appendDB.js";
import getInfoDB from "./sessionsConfig/getInfoSessions/getInfoDB.js";
import deleteInfoDB from "./sessionsConfig/deleteInfoSessions/deleteInfoDB.js";
import e from "express";
import Logger from "./utils/logger.js";

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

        async append(databaseUrl, username) {
            const appenddb = new appendDB(databaseUrl, username);
            await appenddb.appendToDB();
        },

        async getInfo(databaseUrl, username) {
            const getinfodb = new getInfoDB(databaseUrl, username);
            const Info = await getinfodb.getInfo();
            return Info;
        },

        async deleteInfo(databaseUrl, username) {
            const deletedb = new deleteInfoDB(databaseUrl, username);
            await deletedb.deleteFromDB();
        }

    }

    static handler(callback) {
        return async (req, res) => {
            const { username } = req.body;
            try {
                await callback(username);
                res.send(200);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        };
    }

    static AppendInfoAndReturnId({ type = "JSON" | "DB", databaseUrl = null, filePath = null }) {
        return async (req, res) => {
            const { username } = req.body;
            try {
                let info;
                if (type === "JSON") {
                    this.JSON.append(filePath, username);
                    info = this.JSON.getInfo(filePath, username);
                } else if (type === "DB") {
                    await this.DB.append(databaseUrl, username);
                    info = await this.DB.getInfo(databaseUrl, username);
                } else {
                    Logger.error(`EasySession error! type not defined: ${type} it needs to be "JSON" or "DB" \n Error at: AppendInfoAndReturnId function`);
                    throw new Error("type not defined, it needs to be 'JSON' or 'DB'");
                }
                res.send(info.id);
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        };
    }

}
