"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const listenserver_1 = require("./listenserver");
const fs = require("fs");
const path = require("path");
let listenServer = new listenserver_1.ListenServer();
listenServer.conf.wss.enable = true;
// 记录节点下的数据记录
const jsonMap = new Map();
const getData = (key, obj) => {
    const keys = Object.keys(obj);
    keys.forEach(k => {
        const v = obj[k];
        switch (typeof v) {
            case 'object':
                {
                    if (v === null) {
                        if (jsonMap.has(key)) {
                            const arr = jsonMap.get(key);
                            if (arr && arr.indexOf('null') === -1) {
                                arr.push('null');
                            }
                        }
                        else {
                            jsonMap.set(key, ['null']);
                        }
                        break;
                    }
                    getData(key + '.' + k, v);
                }
                break;
            case 'string':
                {
                    if (jsonMap.has(key)) {
                        const arr = jsonMap.get(key);
                        if (arr && arr.indexOf(v) === -1) {
                            arr.push(v);
                        }
                    }
                    else {
                        jsonMap.set(key, [v]);
                    }
                }
                break;
            case 'number':
                {
                    const n = v.toString();
                    if (jsonMap.has(key)) {
                        const arr = jsonMap.get(key);
                        if (arr && arr.indexOf(n) === -1) {
                            arr.push(n);
                        }
                    }
                    else {
                        jsonMap.set(key, [n]);
                    }
                }
                break;
            case 'boolean':
                {
                    const b = v.toString();
                    if (jsonMap.has(key)) {
                        const arr = jsonMap.get(key);
                        if (arr && arr.indexOf(b) === -1) {
                            arr.push(b);
                        }
                    }
                    else {
                        jsonMap.set(key, [b]);
                    }
                }
                break;
            default:
                {
                    // 判断是否是数组
                    if (Array.isArray(v)) {
                        v.forEach((item, index) => {
                            getData(key + '.' + k + '.' + index, item);
                        });
                    }
                }
        }
    });
};
listenServer.on('message', (response) => {
    // console.log('getdata', response)
    getData('root', response);
    // 保存数据到文件
    const json = JSON.stringify(jsonMap);
    fs.writeFileSync(path.join(__dirname, 'data.json'), json);
});
listenServer.Start();
