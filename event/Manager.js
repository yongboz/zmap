// map event manager
import Drag from "./Drag.js";
import Zoom from "./Zoom.js";
export default class Manager {
  constructor(map) {
    this.handles = [];
    this.drag = new Drag(map);
    this.zoom = new Zoom(map);
  }
  on(eventType, handle) {
    let uid;
    switch (eventType) {
      case "drag":
        uid = this.drag.on(handle);
        break;
      case "zoom":
        uid = this.zoom.on(handle);
        break;
      default:
        break;
    }
    handles.push({ uid: uid, type: eventType });
  }
  remove(option) {
    let { uid, type } = option;
    switch (type) {
      case "drag":
        this.drag.remove(uid);
        break;
      case "zoom":
        this.zoom.remove(uid);
        break;
      default:
        break;
    }
  }
}
