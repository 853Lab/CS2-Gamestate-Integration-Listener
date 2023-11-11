import { ListenServer } from "./listenserver"
import { GameStateData } from "cs2-gamestate-integration-data/main"

let listenServer = new ListenServer()
listenServer.conf.wss.enable = true
listenServer.on("message", (response: GameStateData) => {
  console.log("getdata", response)
})
listenServer.Start()