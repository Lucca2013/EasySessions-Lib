import EasySession from "../main.js";

for (let i = 0; i < 5; i++) {
    const randomName = Math.random().toString(36).substring(2, 15);

    EasySession.JSON.create("/sessions");
    EasySession.JSON.append("/sessions", randomName);
}
