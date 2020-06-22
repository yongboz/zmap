import Property from "./Property.js";
export default class Layer {
  constructor(option) {
    //设置所有layer的共有属性
    this.setProperty(option);
    this.dataIndex = [];
    this.handles = {};
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    this.canvas_ = canvas;
    this.ctx_ = ctx;
  }
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
  //更新canvas
  updateCanvas(option){
    let {width,height}=option;
    this.canvas_.width = width;
    this.canvas_.height = height;
  }

  //更新属性
  updateProperty(option) {
    for (let key in option) {
      this[key] = option[key];
    }
  }
  //事件订阅等
  on(eventType, handle) {
    this.handles[eventType] = this.handles[eventType]
      ? this.handles[eventType]
      : [];
    if (typeof handle === "function") {
      this.handles[eventType].push(handle);
    } else {
      console.error("请绑定方法");
    }
  }
  //事件触发
  emit(eventType, option) {
    let handles = this.handles[eventType];
    for (let i = 0; i < handles.length; i++) {
      let item = handles[i];
      item(option);
    }
  }
  //以下为子类需要实现的方法
  //更新 promise
  update() {}
}
