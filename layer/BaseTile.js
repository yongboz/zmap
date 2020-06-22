import layer from "./Base.js";
import { copeCanvas } from "../math.js";
import { watch } from "../watch.js";
export default class Tile extends layer {
  constructor(opt) {
    super(opt);
    this.type = "tiled";
    this.origin = opt.origin ? opt.origin : [-180, 90];
    this.size = opt.size ? opt.size : [256, 256];
    this.dpi = opt.dpi ? opt.dpi : 96;
    //[level][row][col]
    this.imgs = [];
    watch(this, "level", () => {
      this.canvas_.height = this.canvas_.height;
    });
  }
  //更新
  update(x, y) {
    if (x && y) {
      let copy = copeCanvas(this.canvas_);
      this.canvas_.height = this.canvas_.height;
      this.ctx_.drawImage(copy, x, y);
    }
    let matrix = this.getExtentRowCol();
    //缓存图片
    this.imgs[this.level] = this.imgs[this.level] ? this.imgs[this.level] : [];
    for (let i = 0; i < matrix.length; i++) {
      let [row, col, originY, originX] = matrix[i];
      let url = this.rebuild(row, col);
      this.getTileData(url, row, col)
        .then((img) => {
          this.imgs[this.level][row] = this.imgs[this.level][row]
            ? this.imgs[this.level][row]
            : [];
          if (!this.imgs[this.level][row][col]) {
            this.imgs[this.level][row][col] = img;
          }
          if (img.level == this.level) {
            this.ctx_.drawImage(img, originX, originY);
            this.emit("update");
          }
          if (document.contains(img)) {
            document.body.removeChild(img);
          }
        })
        .catch((e) => {
          console.error("请求" + url + "失败，原因：" + e);
        });
    }
  }
  //获取当前范围内的行列号
  getExtentRowCol() {
    let extent = this.extent,
      level = this.level,
      [sizeX, sizeY] = this.size,
      matrix = [],
      resolution;
    let lods = this.lods;
    if (!lods || lods.length == 0) {
      console.warn("map对象的lods属性为必须值");
      return;
    }
    let { xmin, xmax, ymin, ymax } = extent;
    for (let i = 0; i < this.lods.length; i++) {
      if (level === this.lods[i].level) {
        resolution = this.lods[i].resolution;
        break;
      }
    }
    //计算左上和右下两点的行列号
    let leftTop = this.getRowCol(xmin, ymax, resolution);
    let rightBottom = this.getRowCol(xmax, ymin, resolution);
    let [minRow, minCol] = leftTop;
    let [maxRow, maxCol] = rightBottom;
    //获取左上角瓦片绘制的起始点在canvas中的坐标
    let [tileOriginX, tileOriginY] = this.getTileOrigin(
      { row: minRow, col: minCol, x: xmin, y: ymax },
      resolution
    );
    let range = maxCol - minCol,
      range1 = maxRow - minRow;
    for (let i = 0; i <= range; i++) {
      for (let j = 0; j <= range1; j++) {
        matrix.push([
          minRow + j,
          minCol + i,
          tileOriginY + sizeY * j,
          tileOriginX + sizeX * i,
          level,
        ]);
      }
    }
    return matrix;
  }

  //获取切片的行列号
  getRowCol(x, y, resolution) {
    let origin = this.origin,
      originX = origin[0],
      originY = origin[1];
    //行列
    let row = Math.floor(Math.abs((originY - y) / (this.size[1] * resolution)));
    let col = Math.floor(Math.abs((originX - x) / (this.size[0] * resolution)));
    return [row, col];
  }

  //获取左上角瓦片绘制的起始点在canvas中的坐标
  getTileOrigin(leftTop, resolution) {
    let { row, col, x, y } = leftTop,
      [originX, originY] = this.origin;
    //瓦片左上角的坐标
    let tileX = col * (this.size[0] * resolution) + originX;
    let tileY = originY - row * (this.size[1] * resolution);
    return [0 - (x - tileX) / resolution, 0 - (tileY - y) / resolution];
  }

  //请求瓦片
  //@params url 完整的请求地址 row 行 col 列
  getTileData(url, row, col) {
    let promise = new Promise((resolve, reject) => {
      let imgs = this.imgs,
        level = this.level;
      if (imgs[level] && imgs[level][row] && imgs[level][row][col]) {
        resolve(imgs[level][row][col]);
      } else {
        let img = new Image();
        img.src = url;
        img.style.display = "none"; img.setAttribute("crossOrigin",'anonymous');
        document.body.appendChild(img);
        img.onload = () => {
          img.level = level;
          resolve(img);
        };
        img.onerror = (e) => {
          reject(e);
        };
      }
    });
    return promise;
  }

  //子类需要实现的方法

  //拼接url
  rebuild() {}
}
