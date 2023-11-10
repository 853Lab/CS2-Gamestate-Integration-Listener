"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListenServer = void 0;
const http = require("http");
const method_1 = require("./method");
const ws_1 = require("ws");
/** 建立监听 CS2 发来的数据 */
class ListenServer extends method_1.EventEmiter {
    /** 域名或 IP */
    host = '127.0.0.1';
    /** 端口 */
    port = 8532;
    server = null;
    conf = {
        wss: {
            enable: false,
            port: 8523,
        }
    };
    wss = null;
    body = '';
    Start() {
        if (this.server)
            return console.log('is Listening at http://' + this.host + ':' + this.port);
        this.server = http.createServer((req, res) => {
            this.createServer(req, res);
        });
        this.server.listen(this.port, this.host);
        console.log('Listening at http://' + this.host + ':' + this.port);
        if (!this.wss && this.conf.wss.enable) {
            this.wss = new ws_1.WebSocketServer({
                port: this.conf.wss.port,
            });
        }
        this.emit('open', 'Listening');
    }
    async Stop() {
        await new Promise((resolve) => {
            this.server?.close(e => resolve(e));
        });
        await new Promise((resolve) => {
            this.wss?.close(e => resolve(e));
        });
        this.emit('close', 'closed');
    }
    // 处理 CS2 发来的信息，CS2 是一股脑的向程序发送 POST 来达到数据实时
    createServer(req, res) {
        if (req.method == 'POST') {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            let body = '';
            req.on('data', (data) => {
                body += data;
            });
            req.on('end', () => {
                if (typeof body === 'string') {
                    // 判断发来的数据是否有更新
                    if (this.body != body) {
                        this.body = body;
                        const response = JSON.parse(body);
                        const msg = JSON.stringify(response);
                        // emit：数据更新了，内容是 response
                        this.emit('message', response);
                        if (this.conf.wss.enable)
                            this.wss?.clients.forEach(client => client.send(msg));
                        console.log('POST payload: ', response);
                    }
                }
                res.end('');
            });
        }
        else {
            console.log('Not expecting other request types...');
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('<html><body>HTTP Server at http://' + this.host + ':' + this.port + '</body></html>');
        }
    }
}
exports.ListenServer = ListenServer;
