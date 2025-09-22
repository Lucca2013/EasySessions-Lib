import EasySession from "../main.js";
import { configDotenv } from "dotenv";

configDotenv(); 

await EasySession.DB.create(process.env.DATABASE_URL);

for (let i = 0; i < 5; i++) {
    const randomName = ["alice", "bob", "charlie", "dave", "eve"];
    EasySession.DB.append(process.env.DATABASE_URL, randomName[i])
}