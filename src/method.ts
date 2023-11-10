
/** Event触发 */
export class EventEmiter {
  static events = new Map()
  static on(event: string, listener: (...args: any[]) => void) {
    // @ts-ignore
    if (typeof this.events[event] !== "object") {
      // @ts-ignore
      this.events[event] = []
    }
    // @ts-ignore
    this.events[event].push(listener)
    return () => this.removeListener(event, listener)
  }
  static removeListener(event: string, listener: (...args: any[]) => void) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    const idx = this.events[event].indexOf(listener)
    if (idx > -1) {
      // @ts-ignore
      this.events[event].splice(idx, 1)
    }
  }
  static emit(event: string, ...args: any[]) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    this.events[event].forEach((listener) => listener.apply(this, args))
  }
  static once(event: string, listener: (...args: any[]) => void) {
    const remove = this.on(event, (...args) => {
      remove()
      listener.apply(this, args)
    })
  }
  static removeAllListeners(event: string) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    this.events[event] = []
  }
  events = new Map()
  on(event: string, listener: (...args: any[]) => void) {
    // @ts-ignore
    if (typeof this.events[event] !== "object") {
      // @ts-ignore
      this.events[event] = []
    }
    // @ts-ignore
    this.events[event].push(listener)
    return () => this.removeListener(event, listener)
  }
  removeListener(event: string, listener: (...args: any[]) => void) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    const idx = this.events[event].indexOf(listener)
    if (idx > -1) {
      // @ts-ignore
      this.events[event].splice(idx, 1)
    }
  }
  emit(event: string, ...args: any[]) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    this.events[event].forEach((listener) => listener.apply(this, args))
  }
  once(event: string, listener: (...args: any[]) => void) {
    const remove = this.on(event, (...args) => {
      remove()
      listener.apply(this, args)
    })
  }
  removeAllListeners(event: string) {
    // @ts-ignore
    if (typeof this.events[event] !== "object")
      return
    // @ts-ignore
    this.events[event] = []
  }
}
