import EasySession from "../main.js";
import dotenv from 'dotenv';
import express from "express";

dotenv.config();

const app = express();
app.use(express.json());
const DATABASE_URL = process.env.DATABASE_URL;

await EasySession.DB.create(DATABASE_URL);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

app.get('/', (req, res) => {
  res.sendFile('index.html', { root: 'test/public' });
});

app.get('/loged', (req, res) => {
    res.sendFile('loged.html', { root: 'test/public' })
});

app.post('/sessions/listenNewUsers', EasySession.AppendInfoAndReturnId(
    { 
        type: "DB", 
        databaseUrl: DATABASE_URL 
    }
));

app.post('/sessions/verifyId', EasySession.verifyIdAndReturnInfo(
    {
        type: "DB", 
        databaseUrl: DATABASE_URL 
    }
))

app.post('/sessions/logout', EasySession.DeleteInfo(
    {
        type: "DB",
        databaseUrl: DATABASE_URL
    }
));