import base from "./BaseImage.js";
export default class ArcgisImageLayer extends base {
  constructor(option) {
    super(option);
    this.type = "arcgis_image";
    this.format = option.format ? option.format : "png";
    this.dpi = option.dpi ? option.dpi : "96";
    this.layers = option.layers ? option.layers : null;
    this.url +=
      "/export?bbox=${bbox}&bbSR=${bbox}&&format=png&transparent=true&dpi=${dpi}&size=${size}&f=image";
  }
  rebuild() {
    let extent = this.extent,
      url = this.url;
    let { xmin, ymin, xmax, ymax, proj } = extent;
    let { width, height } = this.canvas_;
    return url
      .replace("${bbox}", xmin + "," + ymin + "," + xmax + "," + ymax)
      .replace("${bbSR}", proj.epsg)
      .replace("${size}", width + "," + height);
  }
}
