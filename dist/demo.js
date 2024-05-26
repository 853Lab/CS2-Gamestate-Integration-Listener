"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listenserver_1 = require("./listenserver");
const listenServer = new listenserver_1.ListenServer();
listenServer.on("message", (response) => {
    console.log("getdata", response);
});
listenServer.Start();
