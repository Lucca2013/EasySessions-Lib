import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";
import crypto from "crypto";
import Logger from "../../utils/logger.js";

export default class appendDB {
    constructor(databaseUrl, data) {
        this.databaseUrl = this.verifyDatabaseUrl(databaseUrl);
        this.DBType = databaseUrl.startsWith("postgresql") ? "postgresql" : "mysql";
        this.data = this.validateData(data);
    }

    verifyDatabaseUrl(databaseUrl) {
        if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("mysql://")) {
            return databaseUrl
        } else {
            Logger.error("EasySessions error! the database url needs to start with: >> postgresql:// OR mysql:// <<")
        }
    }

    validateData(data) {
        if (data.startsWith('{') && data.endsWith('}') || data.startsWith('[') && data.endsWith(']')) {
            try {
                const jsonData = JSON.parse(data);
                if (!jsonData.username) {
                    Logger.error("EasySession error! Normally in EasySession, you can enter just the username as a string, \n and the JSON is generated automatically. But if you want to provide a full JSON object, it must contain 'username'\n ");
                    return {};
                } else {
                    const id = crypto.randomBytes(16).toString("hex");
                    return {
                        "username": jsonData.username,
                        "id": id,
                        "createdAt": new Date().toISOString()
                    };
                }

            } catch (error) {
                Logger.error("EasySession error! Invalid JSON string provided:\n", error);
                return {};
            }
        } else {
            if (typeof data === 'string') {
                try {
                    const username = data;
                    const id = crypto.randomBytes(16).toString("hex");
                    return {
                        "username": username,
                        "id": id,
                        "createdAt": new Date().toISOString()
                    }
                } catch (error) {
                    Logger.error("EasySession error! Invalid string or JSON provided:\n", error);
                    return {};
                }
            }
        }
    }

    async appendToDB() {
        let pool;
        try {
            if (this.DBType == "postgresql") {
                pool = new PgPool({ connectionString: this.databaseUrl });

                const result = await pool.query(`SELECT id FROM sessions WHERE username = $1`, [this.data.username]);
                if (result.rows.length > 0) {
                    Logger.warn(`User: ${this.data.username} already exists in the table, the application will not append info to the table`);
                    return;
                }

                await pool.query(
                    'INSERT INTO sessions (username, id, createdAt) VALUES ($1, $2, $3)',
                    [this.data.username, this.data.id, this.data.createdAt]
                );

                Logger.success("data appended to postgresql database")
            } else {
                pool = mysql.createPool(this.databaseUrl);

                const [rows] = await pool.query(`SELECT id FROM sessions WHERE username = ?`, [this.data.username]);
                if (rows.length > 0) {
                    Logger.warn(`User: ${this.data.username} already exists in the table, the application will not append info to the table`);
                    return;
                }

                await pool.execute(
                    'INSERT INTO sessions (username, id, createdAt) VALUES (?, ?, ?)',
                    [this.data.username, this.data.id, this.data.createdAt]
                );

                Logger.success("data appended to mysql database")
            }
        } catch (err) {
            Logger.error(`EasySession error! Error appending data to DB: \n ${err}`)
        } finally {
            if (pool) await pool.end();
        }
    }


}