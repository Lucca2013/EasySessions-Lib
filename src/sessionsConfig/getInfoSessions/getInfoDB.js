import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";
import Logger from "../../utils/logger.js";

export default class getInfoDB {
    constructor(databaseUrl, username) {
        this.databaseUrl = this.verifyDatabaseUrl(databaseUrl);
        this.DBType = databaseUrl.startsWith("postgresql") ? "postgresql" : "mysql";
        this.username = this.validateData(username);
    }

    verifyDatabaseUrl(databaseUrl) {
        if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("mysql://")) {
            return databaseUrl
        } else {
            Logger.error("EasySessions error! the database url needs to start with: >> postgresql:// OR mysql:// << \n error at: DB.getInfo function")
        }
    }

    validateData(data) {
        if (data.startsWith('{') && data.endsWith('}') || data.startsWith('[') && data.endsWith(']')) {
            try {
                const jsonData = JSON.parse(data);
                if (!jsonData.username) {
                    Logger.error("EasySession error! Normally in EasySession, you can enter just the username as a string, \n and the JSON is generated automatically. But if you want to provide a full JSON object, it must contain 'username' \n error at: DB.getInfo function");
                    return {};
                } else {
                    return jsonData.username;
                }

            } catch (error) {
                Logger.error("EasySession error! Invalid JSON or string provided:\n", error, "\n error at: DB.getInfo function");
                return {};
            }
        } else {
            if (typeof data === 'string') {
                return data;
            } else {
                Logger.error("EasySession error! Invalid JSON or string provided:\n", data, "\n error at: DB.getInfo function");
                return;
            }
        }
    }

    async getInfo() {
        let pool;
        try {
            if (this.DBType === 'postgresql') {
                pool = new PgPool({ connectionString: this.databaseUrl });

                const info = await pool.query(
                    `SELECT * FROM sessions WHERE username = $1`,
                    [this.username]
                );

                Logger.success("The information was obtained successfully");

                return info.rows;

            } else {
                const pool = mysql.createPool(this.databaseUrl);

                const info = await pool.execute(
                    'SELECT * FROM sessions WHERE username = ?',
                    [this.username]
                );

                Logger.success("The information was obtained successfully");

                return info.rows;
            }
        } catch (err) {
            Logger.error(`EasySession error! Error getting data from DB: \n ${err}`)
        } finally {
            if (pool) await pool.end();
        }
    }
}