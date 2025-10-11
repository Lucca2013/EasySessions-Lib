import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";
import Logger from "../../utils/logger.js";

export default class getInfoByIdDB {
    constructor(databaseUrl, id, isEasySession) {
        if (!databaseUrl) {
            Logger.error("EasySession error! No database URL provided \n error at: DB.getInfoById function");
            throw new Error("Database URL is required");
        }

        if (!id) {
            Logger.error("EasySession error! No database id provided \n error at: DB.getInfoById function");
            throw new Error("Id is required");
        }

        this.databaseUrl = this.verifyDatabaseUrl(databaseUrl);
        this.DBType = databaseUrl.startsWith("postgresql") ? "postgresql" : "mysql";
        this.id = this.verifyId(id);
        this.isEasySession = isEasySession;
    }

    verifyDatabaseUrl(databaseUrl) {
        if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("mysql://")) {
            return databaseUrl
        } else {
            Logger.error("EasySessions error! the database url needs to start with: >> postgresql:// OR mysql:// << \n error at: DB.append function");
            throw new error("Correct Database Url is required");
        }
    }

    verifyId(id) {
        if (typeof id === 'string') {
            return id;
        } else {
            Logger.error("id must be a string \n error at: DB.getInfoById function");
            throw new error("id must be a string");
        }
    }

    async getInfo() {
        let pool;
        try {
            if (this.DBType === 'postgresql') {
                pool = new PgPool({ connectionString: this.databaseUrl });

                const info = await pool.query(
                    `SELECT * FROM sessions WHERE id = $1`,
                    [this.id]
                );

                Logger.success("The information was obtained successfully");

                return info.rows.length === 1 ? info.rows[0] : 'false';

            } else {
                const pool = mysql.createPool(this.databaseUrl);

                const info = await pool.execute(
                    'SELECT * FROM sessions WHERE id = ?',
                    [this.id]
                );

                Logger.success("The information was obtained successfully");

                return info.rows.length === 1 ? info.rows[0] : this.isEasySession ? 'false' : null;
            }
        } catch (err) {
            Logger.error(`EasySession error! Error getting data from DB: \n ${err}`)
        } finally {
            if (pool) await pool.end();
        }
    }

}