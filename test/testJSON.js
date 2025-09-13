import EasySession from "../main.js";

for (let i = 0; i < 5; i++) {
    const randomName = ["alice", "bob", "charlie", "dave", "eve"];
    let name = i;

    EasySession.JSON.create("/sessions");
    EasySession.JSON.append("/sessions", randomName[name]);
    const Info = EasySession.JSON.getInfo("/sessions", randomName[name]);
    console.table(Info);
}

const nameToDelete = "bob"
EasySession.JSON.deleteInfo("/sessions", nameToDelete)

const Info = EasySession.JSON.getInfo("/sessions", "eve");
if (Info.id === "5fb55bfe61418d1b0c1d19e0126e5845") {
    console.table(Info.id);
    console.log("id ok");
} else {
    console.log("id not ok");
}