import EasySession from "../main.js";

for (let i = 0; i < 5; i++) {
    const randomName = Math.random().toString(36).substring(2, 15);

    EasySession.createJSON("/sessions");
    EasySession.appendToJSON("/sessions", randomName);
}
