export class EventEmitter {
  private events: { [key: string]: Function[] } = {}

  public on(event: string, listener: Function) {
    if (!this.events[event]) {
      this.events[event] = []
    }
    this.events[event].push(listener)
  }

  public off(event: string, listener: Function) {
    if (!this.events[event]) {
      return
    }
    this.events[event] = this.events[event].filter((l) => l !== listener)
  }

  public emit(event: string, ...args: any[]) {
    if (!this.events[event]) {
      return
    }
    this.events[event].forEach((l) => l(...args))
  }
}
