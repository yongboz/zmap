import { getDpi, getPixelDistance } from "./math.js";
export default class Extent {
  constructor(opt) {
    let option = Object.assign({}, opt);
    let { center, scale, height, width, proj } = option;
    this.center = center;
    this.height_ = height;
    this.width_ = width;
    this.scale_ = scale;
    this.proj = proj;
    this.dpi = getDpi();
    this.update(0, 0);
  }

  update(xRange, yRange) {
    //当前米转为当前坐标系单位的转换因子
    let factor = this.proj.factor_;
    let dpi = this.dpi;
    let scale = this.scale_;
    let height = this.height_;
    let width = this.width_;
    //获取每个像素的实际距离
    let distance = getPixelDistance(dpi, scale) * factor;
    //
    let xDistance = distance * xRange,
      yDistance = distance * yRange;
    this.center[0] = this.center[0] - xDistance;
    this.center[1] = this.center[1] + yDistance;
    //确定四点范围
    let center = this.center;
    this.xmin = center[0] - distance * width * 0.5;
    this.xmax = center[0] + distance * width * 0.5;
    this.ymin = center[1] - distance * height * 0.5;
    this.ymax = center[1] + distance * height * 0.5;
  }

  toScreen() {}

  toMap() {}

  zoom(option) {
    let { point, scale } = option;
    let x = (point.x + this.center.x) / 2,
      y = (point.y + this.center.y) / 2;
    this.center.x = x;
    this.center.y = y;
    this.scale = scale;
    this.update();
  }

  goTo(point) {
    this.center = point;
    this.update();
  }
}
