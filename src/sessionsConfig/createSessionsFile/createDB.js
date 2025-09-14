import { Pool as PgPool } from "pg";
import mysql from "mysql2/promise";
import Logger from "../../utils/logger.js";

export default class createDatabase {
    constructor(databaseUrl) {
        this.databaseUrl = this.verifyDatabaseUrl(databaseUrl);
        this.DBType = databaseUrl.startsWith("postgresql") ? "postgresql" : "mysql";
        this.createDB();
    }

    verifyDatabaseUrl(databaseUrl) {
        if (databaseUrl.startsWith("postgresql://") || databaseUrl.startsWith("mysql://")) {
            return databaseUrl
        } else {
            Logger.error("EasySessions error! the database url needs to start with: >> postgresql:// OR mysql:// <<")
        }
    }

    async createDB() {
        try {
            if (this.DBType === "postgresql") {
                this.DBLocation = new PgPool({ connectionString: this.databaseUrl });

                const query = `
                CREATE TABLE IF NOT EXISTS sessions (
                    username TEXT NOT NULL,
                    id SERIAL PRIMARY KEY,
                    createdAt TEXT NOT NULL
                )`;

                await this.DBLocation.query(query);

                Logger.success("postgresql sessions storage created")
            } else {
                this.client = mysql.createPool(this.databaseUrl);

                const query = `
                CREATE TABLE IF NOT EXISTS sessions (
                    name VARCHAR(255) NOT NULL,
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    createdAt TEXT NOT NULL
                )`;

                await this.DBLocation.query(query);

                Logger.success("mysql sessions storage created")
            }
        } catch (error){
            Logger.error(`EasySession error! error while trying to create a sessions table:\n ${error}`)
        }
        

        
    }
}
