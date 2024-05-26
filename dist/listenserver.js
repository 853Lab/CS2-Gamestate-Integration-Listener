"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenServer = void 0;
const http = require("http");
const events_1 = require("events");
/** 建立监听 CS 发来的数据 */
class ListenServer extends events_1.EventEmitter {
    /** 域名或 IP */
    host = "127.0.0.1";
    /** 端口 */
    port = 8532;
    /** 服务器 */
    server = null;
    /** CS 发来的数据 */
    body = "";
    /** 开始监听 */
    Start(host = "127.0.0.1", port = 8532) {
        [this.host, this.port] = [host, port];
        if (this.server)
            return console.log("is Listening at http://" + this.host + ":" + this.port);
        this.server = http.createServer((req, res) => {
            this.createServer(req, res);
        });
        this.server.listen(this.port, this.host);
        console.log("Listening at http://" + this.host + ":" + this.port);
        this.emit("open", "Listening");
    }
    /** 停止监听 */
    async Stop() {
        await new Promise((resolve) => {
            this.server?.close(e => resolve(e));
        });
        this.emit("close", "closed");
    }
    /** 创建服务器 */
    createServer(req, res) {
        res.writeHead(200, { "Content-Type": "text/html" });
        if (req.method != "POST") {
            console.log("Not expecting other request types...");
            res.end("<html><body>HTTP Server at http://" + this.host + ":" + this.port + "</body></html>");
            return;
        }
        let body = "";
        req.on("data", (data) => {
            body += data;
        });
        req.on("end", () => {
            if (typeof body !== "string") {
                res.end("");
                return;
            }
            // 判断发来的数据是否有更新
            if (this.body != body) {
                this.body = body;
                const response = JSON.parse(body);
                const msg = JSON.stringify(response, null, 2);
                // emit：数据更新了，内容是 response
                this.emit("message", response);
                console.log("POST payload: ", msg);
            }
            res.end("");
        });
    }
}
exports.ListenServer = ListenServer;
