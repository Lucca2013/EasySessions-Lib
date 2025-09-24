import EasySession from "../main.js";
import { configDotenv } from "dotenv";

configDotenv(); 

await EasySession.DB.create(process.env.DATABASE_URL)

const randomNames = ["alice", "bob", "charlie", "dave", "eve"];

for (const name of randomNames) {
    EasySession.DB.append(process.env.DATABASE_URL, name)
    const info = await EasySession.DB.getInfo(process.env.DATABASE_URL, name);
}