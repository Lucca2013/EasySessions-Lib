import EasySession from "../main.js";
import express from "express";

const app = express();
app.use(express.json());

EasySession.JSON.create('/sessions');

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
        type: "JSON", 
        filePath: '/sessions'
    }
));

app.post('/sessions/verifyId', EasySession.verifyIdAndReturnInfo(
    { 
        type: "JSON", 
        filePath: '/sessions'
    }
))

app.post('/sessions/logout', EasySession.DeleteInfo(
    { 
        type: "JSON", 
        filePath: '/sessions'
    }
));