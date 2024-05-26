import http = require("http")
import { EventEmitter } from "events"
import { GameStateData } from "cs2-gamestate-integration-data/main"

/** 建立监听 CS 发来的数据 */
class ListenServer extends EventEmitter {
  /** 域名或 IP */
  host = "127.0.0.1"
  /** 端口 */
  port = 8532
  /** 服务器 */
  server: http.Server | null = null
  /** CS 发来的数据 */
  body = ""
  /** 开始监听 */
  Start(host = "127.0.0.1", port = 8532) {
    [this.host, this.port] = [host, port]
    if (this.server) return console.log("is Listening at http://" + this.host + ":" + this.port)
    this.server = http.createServer((req, res) => {
      this.createServer(req, res)
    })
    this.server.listen(this.port, this.host)
    console.log("Listening at http://" + this.host + ":" + this.port)
    this.emit("open", "Listening")
  }
  /** 停止监听 */
  async Stop() {
    await new Promise((resolve) => {
      this.server?.close(e => resolve(e))
    })
    this.emit("close", "closed")
  }
  /** 创建服务器 */
  createServer(req: http.IncomingMessage, res: http.ServerResponse) {
    res.writeHead(200, { "Content-Type": "text/html" })
    if (req.method != "POST") {
      console.log("Not expecting other request types...")
      res.end("<html><body>HTTP Server at http://" + this.host + ":" + this.port + "</body></html>")
      return;
    }
    let body = ""
    req.on("data", (data) => {
      body += data
    })
    req.on("end", () => {
      if (typeof body !== "string") {
        res.end("")
        return
      }
      // 判断发来的数据是否有更新
      if (this.body != body) {
        this.body = body
        const response: GameStateData = JSON.parse(body)
        const msg = JSON.stringify(response, null, 2)
        // emit：数据更新了，内容是 response
        this.emit("message", response)
        console.log("POST payload: ", msg)
      }
      res.end("")
    })
  }
}
declare interface ListenServer {
  /**
   * 当开始监听时，触发
   * @param event 类型
   * @param listener 内容
   */
  on(event: "open", listener: (response: "Listening") => void): this;
  /**
   * 当 CS 发来数据时，触发
   * @param event 类型
   * @param listener CS 发来的数据
   */
  on(event: "message", listener: (response: GameStateData) => void): this;
  /**
   * 当停止监听时，触发
   * @param event 类型
   * @param listener 内容
   */
  on(event: "close", listener: (response: "closed") => void): this;
}

export { ListenServer }