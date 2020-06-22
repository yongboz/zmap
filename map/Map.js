import Extent from "../Extent.js";
import Project from "../proj/Project.js";
import Property from "./Property.js";
import Manager from "../event/Manager.js";

class Map {
  constructor(option) {
    let properties = Object.assign({}, option);
    //在容器中创建并添加canvas
    let container = properties.container;
    let el = document.getElementById(container);
    if (el) {
      let canvas = this.createCanvas(el);
      this.canvas_ = canvas;
      let ctx = canvas.getContext("2d");
      this.ctx_ = ctx;
      properties.height = canvas.height;
      properties.width = canvas.width;
      this.setProperty(properties);
      this.init();
      this.el = el;
      this.manager = new Manager(this);
    } else {
      console.error("指定的容器不存在");
    }
  }

  init() {
    this.project();
    this.createExtent();
  }

  //渲染canvas
  createCanvas(el) {
    let canvas = document.createElement("canvas");
    canvas.height = el.offsetHeight * 2;
    canvas.width = el.offsetWidth * 2;
    canvas.style.height = el.offsetHeight + "px";
    canvas.style.width = el.offsetWidth + "px";
    el.appendChild(canvas);
    return canvas;
  }

  //定义
  project() {
    let option = this.proj;
    let proj = new Project(option);
    this.proj = proj;
  }

  //创建范围
  createExtent() {
    let option = Object.assign({}, this);
    let extent = new Extent(option);
    this.extent = extent;
  }

  //定义属性
  setProperty(option) {
    for (let key in Property) {
      if (option[key]) {
        this[key] = option[key];
      } else if (Property[key] && Property[key].default) {
        this[key] = Property[key].default;
      } else {
        this[key] = null;
      }
    }
  }

  //添加图层
  addLayer(layer, index) {
    let layers = this.layers;
    if (!index) {
      index = layers.length;
    }
    layer.index = index;
    layer.updateCanvas({
      height: this.height,
      width: this.width,
    });
    layer.updateProperty({
      extent: this.extent,
      proj: this.proj,
    });
    if (this.lods) {
      this.setLevel();
      layer.updateProperty({
        lods: this.lods,
        level: this.level,
      });
    }
    layer.update();
    layer.on("update", () => {
      this.update();
    });
    this.layers.splice(index, 0, layer);
  }

  //更新数据
  update() {
    this.canvas_.height = this.canvas_.height;
    let ctx = this.ctx_,
      layers = this.layers;
    for (let i = 0, length = layers.length; i < length; i++) {
      const layer = layers[i];
      if (!layer.visible) continue;
      let canvas = layer.canvas_;
      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.drawImage(canvas, 0, 0);
      ctx.restore();
    }
  }

  //级别level
  getLevel() {
    return this.level;
  }

  setLevel() {
    let scale = this.scale,
      lods = this.lods;
    for (let i = 0; i < lods.length; i++) {
      if (scale === lods[i].scale) {
        this.level = lods[i].level;
        break;
      }
    }
  }
}
export default Map;
