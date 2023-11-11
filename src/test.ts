import { ListenServer } from "./listenserver"
import { GameStateData } from "cs2-gamestate-integration-data/main"
import * as fs from "fs"
import * as path from "path"
import { Gun, PistolOf } from "cs2-gamestate-integration-data/weapon/type"

let listenServer = new ListenServer()
listenServer.conf.wss.enable = true
// 记录节点下的数据记录
const jsonMap = new Map<string, string[]>()
// 读取先前的数据
const readSavedData = (filename: string) => {
  const data = fs.readFileSync(path.join(__dirname, filename), "utf-8")
  const arr = data.split("\n")
  arr.forEach(item => {
    if (item !== "") {
      const arr2 = item.split(": ")
      const key = arr2[0]
      const value = arr2[1].split(",")
      if (jsonMap.has(key)) {
        const arr = jsonMap.get(key)
        if (arr) {
          value.forEach(v => {
            if (arr.indexOf(v) === -1) {
              arr.push(v)
            }
          })
        } else {
          jsonMap.set(key, value)
        }
      } else {
        jsonMap.set(key, value)
      }
    }
  })
}
readSavedData("../data.txt")

const getData = (key: string, obj: any) => {
  const keys = Object.keys(obj)
  keys.forEach(k => {
    const _key = `${key}.${k}`
    const v = obj[k]
    // console.log("key", _key, v)
    switch (typeof v) {
      case "object":
        {
          if (v === null) {
            if (jsonMap.has(_key)) {
              const arr = jsonMap.get(_key)
              if (arr && arr.indexOf("null") === -1) {
                arr.push("null")
              }
            } else {
              jsonMap.set(_key, ["null"])
            }
            break
          }
          getData(_key, v)
        }
        break
      case "string":
        {
          if (jsonMap.has(_key)) {
            const arr = jsonMap.get(_key)
            if (arr && arr.indexOf(v) === -1) {
              arr.push(v)
            }
          } else {
            jsonMap.set(_key, [v])
          }
        }
        break
      case "number":
        {
          const n = v.toString()
          if (jsonMap.has(_key)) {
            const arr = jsonMap.get(_key)
            if (arr && arr.indexOf(n) === -1) {
              arr.push(n)
            }
          } else {
            jsonMap.set(_key, [n])
          }
        }
        break
      case "boolean":
        {
          const b = v.toString()
          if (jsonMap.has(_key)) {
            const arr = jsonMap.get(_key)
            if (arr && arr.indexOf(b) === -1) {
              arr.push(b)
            }
          } else {
            jsonMap.set(_key, [b])
          }
        }
        break
      default:
        {
          // 判断是否是数组
          if (Array.isArray(v)) {
            v.forEach((item, index) => {
              getData(`${_key}.${index}`, item)
            })
          }
        }
    }
  })
}
listenServer.on("message", (response: GameStateData) => {
  // console.log("getdata", response)
  getData("root", response)
  // 保存数据到文件
  let arr: string[] = []
  jsonMap.forEach((value, key) => {
    // data += key + ": " + value.join(",") + "\n"
    arr.push(key + ": " + value.join(","))
  })
  // 排序 arr
  arr.sort((a, b) => {
    const a1 = a.split(":")[0]
    const b1 = b.split(":")[0]
    return a1.localeCompare(b1)
  })
  fs.writeFileSync(path.join(__dirname, "../data.txt"), arr.join("\n"))
  if (response.player?.weapons) {
    for (const key in response.player.weapons) {
      const weapon = response.player.weapons[key]
      // 保存武器数据到 weapons/weaponname.json
      const weaponName = weapon.name
      const weaponPath = path.join(__dirname, `../weapons/${weaponName}.json`)
      if (!fs.existsSync(weaponPath)) {
        fs.writeFileSync(weaponPath, JSON.stringify(weapon, null, 2))
      }
    }
  }
})
listenServer.Start()