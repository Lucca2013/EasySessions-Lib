import createJSON from "./storageConfig/createSessionsFile/createJSON.js";
import appendJSON from "./storageConfig/appendInfoSessions/appendJSON.js";
import getInfoJSON from "./storageConfig/getInfoSessions/getInfoJSON.js";
import deleteInfoJSON from "./storageConfig/deleteInfoSessions/deleteInfoJSON.js";
import createDB from "./storageConfig/createSessionsFile/createDB.js";
import appendDB from "./storageConfig/appendInfoSessions/appendDB.js";
import getInfoDB from "./storageConfig/getInfoSessions/getInfoDB.js";
import deleteInfoDB from "./storageConfig/deleteInfoSessions/deleteInfoDB.js";
import getInfoByIdDB from "./storageConfig/getInfoById/getInfoByIdDB.js"
import getInfoByIdJSON from "./storageConfig/getInfoById/getInfoByIdJSON.js";
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
        },

        getInfoById(filePath = process.cwd(), id = null, isEasySession = false) {
            return new getInfoByIdJSON(filePath, id, isEasySession);
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

        async deleteInfo(databaseUrl, username, isEasySession = false) {
            const deletedb = new deleteInfoDB(databaseUrl, username, isEasySession);
            await deletedb.deleteFromDB();
        },

        async getInfoById(databaseUrl, id, isEasySession = false){
            const getinfodb = new getInfoByIdDB(databaseUrl, id, isEasySession);
            const Info = await getinfodb.getInfo();
            return Info;
        }

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

    static verifyIdAndReturnInfo({ type = "JSON" | "DB", databaseUrl = null, filePath = null }) {
        return async (req, res) => {
            const { id } = req.body;
            console.log(id)
            try {
                let info;
                if (type === "JSON") {
                    //if isEasySession be false, the lib will return null if id is not valid, if true, it will return 'false'
                    info = this.JSON.getInfoById(filePath, id, {isEasySession : true});

                    if(info === 'false'){
                        res.send(406);
                    }

                    res.send(200).json(info);
                } else if (type === "DB") {
                    //if isEasySession be false, the lib will return null if id is not valid, if true, it will return 'false'
                    info = await this.DB.getInfoById(databaseUrl, id, {isEasySession : false});

                    if(info === 'false'){
                        res.send(406);
                    }

                    res.json(info);
                }else {
                    Logger.error(`EasySession error! type not defined: ${type} it needs to be "JSON" or "DB" \n Error at: (HTTP) DeleteInfo function`);
                    throw new Error("type not defined, it needs to be 'JSON' or 'DB'");
                }
            } catch (err) {
                console.error(err)
                res.status(500).json({ error: err.message });
            }
        };
    }

    static DeleteInfo({ type = "JSON" | "DB", databaseUrl = null, filePath = null }) {
        return async (req, res) => {
            const { id } = req.body;
            try {
                let info;
                if (type === "JSON") {
                    info = this.JSON.getInfoById(filePath, id);
                    this.JSON.deleteInfo(filePath, info.username);

                    res.send(200);
                } else if (type === "DB") {
                    info = await this.DB.getInfoById(databaseUrl, id);
                    await this.DB.deleteInfo(databaseUrl, info.username);

                    res.send(200);
                }else {
                    Logger.error(`EasySession error! type not defined: ${type} it needs to be "JSON" or "DB" \n Error at: (HTTP) DeleteInfo function`);
                    throw new Error("type not defined, it needs to be 'JSON' or 'DB'");
                }
            } catch (err) {
                res.status(500).json({ error: err.message });
            }
        };
    }

}
