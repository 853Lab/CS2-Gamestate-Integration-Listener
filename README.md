# CSGO/CS2 Gamestate Integration Listener

CSGO/CS2 Gamestate Integration Listener

## How to Use

### Install

```Batchfile
pnpm install https://github.com/853Lab/CS2-Gamestate-Integration-Listener.git
```

### Import

```TypeScript
import { ListenServer } from "cs2-gamestate-integration-listener/main";

const listenServer = new ListenServer();

listenServer.on("message", (response) => {
  console.log("getdata", response);
});

listenServer.Start();
```
