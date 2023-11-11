/// <reference types="node" />
/// <reference types="node" />
import http = require("http");
import { EventEmitter } from "events";
import { GameStateData } from "cs2-gamestate-integration-data/main";
/** 建立监听 CS 发来的数据 */
declare class ListenServer extends EventEmitter {
    /** 域名或 IP */
    host: string;
    /** 端口 */
    port: number;
    /** 服务器 */
    server: http.Server | null;
    /** CS 发来的数据 */
    body: string;
    /** 开始监听 */
    Start(host?: string, port?: number): void;
    /** 停止监听 */
    Stop(): Promise<void>;
    /** 创建服务器 */
    createServer(req: http.IncomingMessage, res: http.ServerResponse): void;
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
export { ListenServer };
