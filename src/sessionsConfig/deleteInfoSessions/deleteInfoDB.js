import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";
import Logger from "../../utils/logger.js";

export default class deleteInfoDB{
    constructor(databaseUrl, username) {
        if (!databaseUrl) {
            Logger.error("EasySession error! No database URL provided \n error at: DB.delete function");
            throw new Error("Database URL is required");
        }

        if (!username) {
            Logger.error("EasySession error! No username provided to delete \n error at: DB.delete function");
            throw new Error("Username is required to delete");
        }

        this.databaseUrl = this.verifyDatabaseUrl(databaseUrl);
        this.DBType = databaseUrl.startsWith("postgresql") ? "postgresql" : "mysql";
        this.username = username;
    }

    verifyDatabaseUrl(databaseUrl) {
        if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("mysql://")) {
            return databaseUrl
        } else {
            Logger.error("EasySessions error! the database url needs to start with: >> postgresql:// OR mysql:// << \n error at: DB.delete function")
        }
    }

    async deleteFromDB() {
        let pool;
        try {
            if (this.DBType == "postgresql") {
                pool = new PgPool({ connectionString: this.databaseUrl });

                await pool.query(`DELETE FROM sessions WHERE username = $1`, [this.username]);

                Logger.success("data deleted from postgresql database")
            } else {
                pool = mysql.createPool(this.databaseUrl);

                await pool.execute(`DELETE FROM sessions WHERE username = ?`, [this.username]);

                Logger.success("data deleted from mysql database")
            }
        } catch (err) {
            Logger.error(`EasySession error! Error deleting data from DB: \n ${err}`)
        } finally {
            if (pool) await pool.end();
        }
    }
}