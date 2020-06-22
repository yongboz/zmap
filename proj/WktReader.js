//用于解读wkt
export default class WktReader {
  constructor(wkt) {
    this.wkt_ = wkt;
    this.status = true;
    this.read();
  }
  read() {
    this.readEpsg();
    this.readType();
    this.readDatum();
  }

  readEpsg() {
    let wkt = this.wkt_;
    let r = /AUTHORITY\["EPSG","[0-9]*"\]\]$/g;
    let r1 = /"[0-9]*"/g;
    let str = wkt.match(r)[0].match(r1)[0];
    this.espg = Number(str.replace(/"/g, ""));
  }

  //判断坐标系类型（平面坐标系 or 大地坐标系）
  readType() {
    let wkt = this.wkt_;
    let r = /^PROJCS/g;
    let r1 = /^GEOGCS/g;
    if (r.test(r)) {
      this.type = "projcs";
    } else if (r1.test(wkt)) {
      this.type = "geogcs";
    } else {
      console.error("wkt字符串不合法，请检查后修改");
      this.status = false;
    }
  }

  //获取基准
  readDatum() {
    let r = /DATUM\[".*",SPHEROID\[".*",[0-9]*,[0-9]*\.[0-9]*/g;
    let wkt = this.wkt_;
    if (r.test(wkt)) {
      let str = wkt.match(r)[0];
      let arr = str.split("[");
      //获取椭球体
      let shperoidArr = arr[2].split(",");
      this.shperoid = {
        name: shperoidArr[0].replace(/"/g, ""),
        radius: Number(shperoidArr[1]),
        oblateness: Number(shperoidArr[2]),
      };
    } else {
      console.error("wkt字符串不合法，为获取到基准信息DATUM，请检查后修改");
      this.status = false;
    }
  }

  //获取本初子午线
  readPrimem() {}

  //单位
  readUnit() {}

  //获取投影参数 （假如坐标系为平面坐标系）
  //包括投影名称，中央经线，缩放因子，向东偏移量，向北偏移量
  readProjection() {}
}
