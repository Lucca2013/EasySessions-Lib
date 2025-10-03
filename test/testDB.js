import EasySession from "../main.js";
import { configDotenv } from "dotenv";
import express from "express";
configDotenv();

const app = express();
app.use(express.json());

await EasySession.DB.create(process.env.DATABASE_URL);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'public' });
});

EasySession.expressUtils.onNewUsers(app, (user) => {
    console.log("New user:", user);
    const {username, password} = user;
    EasySession.DB.append(process.env.DATABASE_URL, username, password);
});

app.post('/sessions/listenNewUsers', EasySession.handler(async (user) => {
    console.log("New user:", user);
    const {username, password} = user;
    await EasySession.DB.append(process.env.DATABASE_URL, username, password);
}));