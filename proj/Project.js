import wktStr from "./wktStr.js";
import WktReader from "./WktReader.js";
export default class Project {
  constructor(option) {
    let wkt;
    if (typeof option == "string") {
      wkt = option;
    } else {
      let code = option && option.epsg;
      if (code && wktStr[code + ""]) {
        wkt = wktStr[code + ""];
      } else {
        code = "4490";
        wkt = wktStr[code];
        console.error("采用默认EPSG：4490坐标系");
      }
      this.epsg = code;
    }
    //wkt解读
    let reader = new WktReader(wkt);
    if (reader.status) {
      if (reader.type === "geogcs") {
        let radius = reader.shperoid.radius;
        this.factor_ = 1 / ((Math.PI * radius) / 180);
      } else if (reader.type === "projcs") {
        this.factor_ = 1;
      }
      if (this.epsg) {
        this.epsg = reader.espg;
      }
    }
  }
  clone() {}
}
