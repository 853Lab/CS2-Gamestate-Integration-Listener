# CSGO/CS2 Gamestate Integration Listener

CSGO/CS2 Gamestate Integration Listener

## How to Use

### Install

```Batchfile
pnpm install https://github.com/853Lab/CS2_Gamestate_Integration_Listener.git
```

### Import

```TypeScript
import { ListenServer } from "cs2_gamestate_integration_listener/listenserver";

const listenServer = new ListenServer();

listenServer.on("message", (response) => {
  console.log("getdata", response);
});

listenServer.Start();
```
