import { ListenServer } from "./listenserver"

const listenServer = new ListenServer()
listenServer.on("message", (response) => {
  console.log("getdata", response)
})
listenServer.Start()