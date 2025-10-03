import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";
import crypto from "crypto";
import Logger from "../../utils/logger.js";
import { Session } from "inspector/promises";

export default class appendDB {
    constructor(databaseUrl, username, SessionPassword) {
        if (!databaseUrl) {
            Logger.error("EasySession error! No database URL provided \n error at: DB.append function");
            throw new Error("Database URL is required");
        }

        if (!username) {
            Logger.error("EasySession error! No username provided to append \n error at: DB.append function");
            throw new Error("Username is required to append");
        }

        if (!SessionPassword) {
            Logger.error("EasySession error! No SessionPassword provided to append \n error at: DB.append function");
            throw new Error("SessionPassword is required to append");
        }

        this.databaseUrl = this.verifyDatabaseUrl(databaseUrl);
        this.DBType = databaseUrl.startsWith("postgresql") ? "postgresql" : "mysql";
        this.data = this.validateData(username, SessionPassword);
    }

    verifyDatabaseUrl(databaseUrl) {
        if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("mysql://")) {
            return databaseUrl
        } else {
            Logger.error("EasySessions error! the database url needs to start with: >> postgresql:// OR mysql:// << \n error at: DB.append function")
        }
    }

    validateData(username, SessionPassword) {
        if (typeof username === 'string' && typeof SessionPassword === 'string') {
            try {
                const id = crypto.randomBytes(16).toString("hex");
                console.log(SessionPassword)
                return {
                    "username": username,
                    "SessionPassword": SessionPassword,
                    "id": id,
                    "createdAt": new Date().toISOString()
                }
            } catch (error) {
                Logger.error("EasySession error! Invalid string or JSON provided:\n", error, "\n\n error at: DB.append function");
                return {};
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
                    Logger.warn(`User: ${this.data.username} already exists in the table, the application will not append info to the table \n warn at: DB.append function`);
                    return;
                }

                await pool.query(
                    'INSERT INTO sessions (username, sessionpassword, id, createdAt) VALUES ($1, $2, $3, $4)',
                    [this.data.username, this.data.SessionPassword, this.data.id, this.data.createdAt]
                );

                Logger.success("data appended to postgresql database")
            } else {
                pool = mysql.createPool(this.databaseUrl);

                const [rows] = await pool.query(`SELECT id FROM sessions WHERE username = ?`, [this.data.username]);
                if (rows.length > 0) {
                    Logger.warn(`User: ${this.data.username} already exists in the table, the application will not append info to the table \n warn at: DB.append function`);
                    return;
                }

                await pool.execute(
                    'INSERT INTO sessions (username, sessionpassword, id, createdAt) VALUES (?, ?, ?, ?)',
                    [this.data.username, this.data.SessionPassword, this.data.id, this.data.createdAt]
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