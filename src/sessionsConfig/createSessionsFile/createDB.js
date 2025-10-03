import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";
import Logger from "../../utils/logger.js";
import { NONAME } from "dns";

export default class createDatabase {
    constructor(databaseUrl) {
        if (!databaseUrl) {
            Logger.error("Database URL is undefined.");
            throw new Error("Database URL is required");
        }

        this.databaseUrl = this.verifyDatabaseUrl(databaseUrl);
        this.DBType = databaseUrl.startsWith("postgresql") ? "postgresql" : "mysql";
    }

    verifyDatabaseUrl(databaseUrl) {
        if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("mysql://")) {
            return databaseUrl
        } else {
            Logger.error("EasySessions error! the database url needs to start with: >> postgresql:// OR mysql:// <<")
        }
    }

    async createDB() {
        let pool;
        try {
            if (this.DBType === "postgresql") {
                pool = new PgPool({ connectionString: this.databaseUrl });

                const res = await pool.query(`
                    SELECT EXISTS (
                        SELECT FROM pg_tables
                        WHERE  schemaname = 'public'
                        AND    tablename  = 'sessions'
                    );
                `);

                const tableExists = res.rows[0].exists;

                if (tableExists) {
                    Logger.warn("Table 'sessions' already exists. The application will not attempt to create it again.");
                    return;
                } else {
                    await pool.query(`
                        CREATE TABLE sessions (
                            username TEXT NOT NULL,
                            SessionPassword TEXT NOT NULL,
                            id TEXT PRIMARY KEY,
                            createdAt TEXT NOT NULL
                        );
                    `);
                    Logger.success("PostgreSQL 'sessions' storage created.");
                }


            } else {
                const [rows] = await pool.query(`
                    SELECT EXISTS (
                        SELECT TABLE_NAME FROM information_schema.tables
                        WHERE table_schema = DATABASE()
                        AND table_name = 'sessions'
                    ) AS tableExists;
                `);

                const tableExists = rows[0].tableExists;

                if (tableExists) {
                    Logger.warn("Table 'sessions' already exists. The application will not attempt to create it again.");
                    return;
                } else {
                    await pool.query(`
                        CREATE TABLE sessions (
                            username VARCHAR(255) NOT NULL,
                            SessionPassword VARCHAR(255) NOT NULL,
                            id VARCHAR(255) PRIMARY KEY,
                            createdAt VARCHAR(255) NOT NULL
                        );
                    `);
                    Logger.success("MySQL 'sessions' storage created.");
                }
            }
        } catch (error) {
            Logger.error(`EasySession error! error while trying to create a sessions table:\n ${error}`)
        } finally {
            if (pool) await pool.end();
        }



    }
}
