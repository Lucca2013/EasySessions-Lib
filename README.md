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
- 🔜 Database storage planned
- 🔜 Client-server integration planned

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

```js
import EasySession from "../main.js";

//the creation of a JSON storage. Params: path
EasySession.JSON.create("/sessions");

//append a info to the JSON, you can put only username and the script will create the fields:
//username, id and createdAt
//params: path of the JSON, username
EasySession.JSON.append("/sessions", 'randomName');
```

---

## 🤝 Contributing

PV me in discord if you want to help:
**.n4njaezzz**

---

✨ **Stay tuned — EasySession-lib is just getting started!** 🚀
