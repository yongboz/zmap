import Event from "./Event.js";
export default class Drag extends Event {
  constructor(opt) {
    super(opt);
    this.bind(this.el);
  }
  bind(el) {
    let x = 0,
      y = 0;
    el.addEventListener("mousedown", () => {
      this.copy = this.copeCanvas(this.canvas);
      this.ctx.save();
      this.status = true;
    });
    el.addEventListener("mousemove", (e) => {
      if (this.status) {
        this.canvas.height = this.canvas.height;
        x += e.movementX;
        y += e.movementY;
        this.ctx.drawImage(this.copy, x, y);
      }
    });
    el.addEventListener("mouseup", () => {
      this.status = false;
      this.ctx.restore();
      if (x != 0 || y != 0) {
        this.map.extent.update(x, y);
        this.map.layers.forEach((layer) => {
          layer.update(x, y);
        });
      }
      this.copy = null;
      x = 0;
      y = 0;
    });
  }
}
