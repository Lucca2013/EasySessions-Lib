# EasySession-lib

**EasySession-lib** is a lightweight Node.js library that simplifies session management for small projects and prototypes.  
Instead of manually handling files, IDs, and persistence, EasySession-lib abstracts these steps with a simple API.

**Version:** 1.0.0

---

## Features

- Easy Session Handling – Create and manage sessions effortlessly.
- Flexible Server Storage Options Where the ids/token can be validated
  - JSON file storage
  - Database storage

---

## Project Status

EasySession-lib is currently in **active development**.

- JSON storage available
- Database storage in developement
- HTTP automotizations avaliable

---

## Installation

_Coming soon... (npm package planned)_

For now, you can clone the repository locally:

```bash
git clone https://github.com/Lucca2013/EasySession-lib.git
cd EasySession-lib
##then you can manipulate the "test" folder and configure some tests using npm test (remember to configure in package.json)
```

---

## Usage Example

SQL server storage

```js
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
```

JSON server storage:

```js
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

```

---

## Contributing

PV me in discord if you want to help:
**.n4njaezzz**

---

**Stay tuned — EasySession-lib is just getting started!**