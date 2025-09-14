import EasySession from "../main.js";
import { configDotenv } from "dotenv";

configDotenv(); 

EasySession.DB.create(process.env.DATABASE_URL);