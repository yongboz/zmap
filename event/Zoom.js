import Event from "./Event.js";
export default class Zoom extends Event {
  constructor(opt) {
    super(opt);
    this.eventTypes = ["mousewheel", "DOMMouseScroll"];
    this.bind(this.el);
  }
  bind(el) {
    let types = this.eventTypes;
    for (let i = 0; i < types.length; i++) {
      el.addEventListener(types[i], (e) => {
        if (e.deltaY < 0) {
          this.map.level += 1;
          this.map.extent.level += 1;
          this.zoom(1, [e.offsetX, e.offsetY]);
        } else {
          this.map.level -= 1;
          this.map.extent.level -= 1;
          this.zoom(0, [e.offsetX, e.offsetY]);
        }
      });
    }
  }
  zoom(type, mouse) {
    let { width, height } = this.canvas;
    let center = [width / 4 + mouse[0] / 2, height / 4 + mouse[1] / 2];
    let copy = this.copeCanvas(this.canvas);
    this.canvas.height = this.canvas.height;
    if (type === 0) {
      //放大
      let origin = [center[0] - 0.25 * width, center[1] - 0.25 * height];
      this.ctx.drawImage(
        copy,
        origin[0],
        origin[1],
        0.5 * copy.width,
        0.5 * copy.height
      );
    } else {
      //缩小
      let origin = [center[0] - width, center[1] - height];
      this.ctx.drawImage(
        copy,
        origin[0],
        origin[1],
        2 * copy.width,
        2 * copy.height
      );
    }
    let lods = this.map.lods,
      level = this.map.level;
    for (let i = 0; i < lods.length; i++) {
      if (level == lods[i].level) {
        this.map.scale = lods[i].scale;
        this.map.extent.scale_ = lods[i].scale;
        break;
      }
    }
    let x = center[0] - 0.5 * width,
      y = center[1] - 0.5 * height;
    this.map.extent.update(x, y);
    this.map.layers.forEach((layer) => {
      layer.level = level;
      layer.update(x, y);
    });
  }
}
