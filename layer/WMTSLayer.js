import base from "./BaseTile.js";
export default class WMTSLayer extends base {
  constructor(opt) {
    super(opt);
    this.type = "wmst-tile";
    this.layer = opt.layer;
    if (!this.layer) {
      console.warn("请指定图层");
      return;
    }
    this.style = opt.style ? opt.style : "default";
    this.format = opt.format ? opt.format : "image/png";
    this.tileMatrixSet = opt.tileMatrixSet ? opt.tileMatrixSet : "default";
    this.url =
      this.url +
      "?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=${style}&TILEMATRIXSET=${tileMatrixSet}&TILEMATRIX=${level}&TILEROW=${row}&TILECOL=${col}&FORMAT=${format}&tk=c1c588f91c60fb36e3b5471012946402";
  }
  //拼接url
  rebuild(row, col) {
    let url = this.url,
      level = this.level,
      format = this.format,
      tileMatrixSet = this.tileMatrixSet,
      style = this.style,
      layer = this.layer;
    return url
      .replace("${layer}", layer)
      .replace("${style}", style)
      .replace("${tileMatrixSet}", tileMatrixSet)
      .replace("${level}", level)
      .replace("${row}", row)
      .replace("${col}", col)
      .replace("${format}", format);
  }
}
