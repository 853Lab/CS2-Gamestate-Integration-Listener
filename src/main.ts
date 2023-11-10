import { ListenServer } from "./listenserver"
import { GameStateData } from "./gsi_data/main"

let listenServer = new ListenServer()
listenServer.conf.wss.enable = true
listenServer.on("message", (response: GameStateData) => {
  console.log("getdata", response)
})
listenServer.Start()