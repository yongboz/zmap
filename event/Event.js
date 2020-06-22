import { getUid } from "../math.js";
export default class event {
  constructor(map) {
    this.handles = {};
    this.type = "event";
    this.map = map;
    this.el = map.el;
    this.ctx = map.ctx_;
    this.canvas = map.canvas_;
    this.status = false;
    this.copy = null;
  }
  //事件订阅等
  on(handle) {
    if (typeof handle === "function") {
      const uid = getUid();
      this.handles[uid].push(handle);
    } else {
      console.error("请绑定方法");
    }
  }
  //事件触发
  emit(option) {
    let handles = this.handles;
    for (const i in handles) {
      let item = handles[i];
      item(option);
    }
  }
  //清空
  remove(uid) {
    delete this.handles[uid];
  }

  copeCanvas(oldCanvas) {
    let newCanvas = document.createElement("canvas");
    let context = newCanvas.getContext("2d");
    newCanvas.width = oldCanvas.width;
    newCanvas.height = oldCanvas.height;
    context.drawImage(oldCanvas, 0, 0);
    return newCanvas;
  }
}
