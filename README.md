# EasySession-lib

**EasySession-lib** is a lightweight Node.js library that simplifies session management for small projects and prototypes.  
Instead of manually handling files, IDs, and persistence, EasySession-lib abstracts these steps with a simple API.

---

## ✨ Features

- 📦 **Easy Session Handling** – Create and manage sessions effortlessly.
- 🗄️ **Flexible Storage Options**
  - ✅ JSON file storage (implemented)
  - 🚧 Database storage (planned)
- 🔒 **Future Roadmap**
  - Client-side storage integration (e.g., comparing client `localStorage` ID with server storage).

---

## 🚧 Project Status

EasySession-lib is currently in **active development**.

- ✅ JSON storage available
- ⚠️ Database storage in developement
- 🔜 Local-Storage system planned

---

## 📦 Installation

_Coming soon... (npm package planned)_

For now, you can clone the repository locally:

```bash
git clone https://github.com/Lucca2013/EasySession-lib.git
cd EasySession-lib
##then you can manipulate the "test" folder and configure some tests using npm test (remember to configure in package.json)
```

---

## ⚡ Usage Example

JSON server storage:

```js
import EasySession from "../main.js";

//the creation of a JSON storage. Params: path
EasySession.JSON.create("/sessions");

//append a info to the JSON, you can put only username and the script will create the fields:
//username, id and createdAt
//params: path of the JSON, username
EasySession.JSON.append("/sessions", "randomName");

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

SQL server storage (only create at the moment)

```js
import EasySession from "../main.js";
import { configDotenv } from "dotenv";

configDotenv(); 

//the creation of a SQL storage. Params: DATABASE_URL
await EasySession.DB.create(process.env.DATABASE_URL);

//append a info to the DB, you can put only username and the script will create the fields:
//username, id and createdAt
//params: DATABASE_URL, username
EasySession.DB.append(process.env.DATABASE_URL, 'randomName')

//put all the sessions info of a user in a var. Params: DATABASE_URL, username
Info = await EasySession.DB.getInfo(process.env.DATABASE_URL, 'randomName')

if (Info.id === "5fb55bfe61418d1b0c1d19e0126e5845") { //in the future, you will put the id who is in the LocalStorage of the user to compare
  console.log("id ok"); 
} else {
  console.log("id not ok");
}

```

---

## 🤝 Contributing

PV me in discord if you want to help:
**.n4njaezzz**

---

✨ **Stay tuned — EasySession-lib is just getting started!** 🚀
