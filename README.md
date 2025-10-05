# EasySession-lib

**EasySession-lib** is a lightweight Node.js library that simplifies session management for small projects and prototypes.  
Instead of manually handling files, IDs, and persistence, EasySession-lib abstracts these steps with a simple API.

---

## Features

- Easy Session Handling – Create and manage sessions effortlessly.
- Flexible Server Storage Options Where the ids/token can be validated
  - JSON file storage (implemented)
  - Database storage (developement)
- Future Roadmap  
  - Client-side storage integration (e.g., comparing client `localStorage` ID with server storage).

---

## Project Status

EasySession-lib is currently in **active development**.

- JSON storage available
- Database storage in developement
- HTTP automotizations avaliable
- Local-Storage system planned

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

JSON server storage:

```js
import EasySession from "../main.js";

//the creation of a JSON storage. Params: path
EasySession.JSON.create("/sessions");

//It listen to new users at a custom path and append info to storage and then return the id
//Params: type (DB or JSON) databaseUrl (for DB) or filePath (for JSON)
app.post('/sessions/listenNewUsers', EasySession.AppendInfoAndReturnId(
    { 
        type: "JSON"
        filePath: "/sessions"
    }
));

//put all the sessions info of a user in a var. Params: path, username
const Info = EasySession.JSON.getInfo("/sessions", "randomName");
//you can test:
if (Info.id === "5fb55bfe61418d1b0c1d19e0126e5845") { //in the future, you will put the id who is in the LocalStorage of the user to compare
  console.log("id ok"); 
} else {
  console.log("id not ok");
}

//delete all the fields of a username. Params: path, username
EasySession.JSON.deleteInfo("/sessions", "randomName")
```

SQL server storage (only create and append at the moment)

```js
import EasySession from "../main.js";
import { configDotenv } from "dotenv";
import express from "express";

configDotenv();
app = express();
app.use(express.json());
app.listen(3000); 

//the creation of a SQL storage. Params: DATABASE_URL
await EasySession.DB.create(process.env.DATABASE_URL);

//It listen to new users at a custom path and append info to storage and then return the id
//Params: type (DB or JSON) databaseUrl (for DB) or filePath (for JSON)
app.post('/sessions/listenNewUsers', EasySession.AppendInfoAndReturnId(
    { 
        type: "DB", 
        databaseUrl: DATABASE_URL 
    }
));

//put all the sessions info of a user in a var. Params: DATABASE_URL, username
Info = await EasySession.DB.getInfo(process.env.DATABASE_URL, 'randomName')

if (Info.id === "5fb55bfe61418d1b0c1d19e0126e5845") { //in the future, you will put the id who is in the LocalStorage of the user to compare
  console.log("id ok"); 
} else {
  console.log("id not ok");
}

```

---

## Contributing

PV me in discord if you want to help:
**.n4njaezzz**

---

**Stay tuned — EasySession-lib is just getting started!**
