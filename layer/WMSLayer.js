import Base from "./BaseImage.js";
export default class WMSLayer extends Base {
  constructor(opt) {
    super(opt);
    this.type = "wms-image";
    this.layers = opt.layers ? opt.layers : [];
    this.url +=
      "?transparent=true&service=WMS&version=1.1.0&request=GetMap&layers=${layers}&bbox=${xmin}%2C${ymin}%2C${xmax}%2C${ymax}&width=${width}&height=${height}&srs=EPSG%3A${epsg}&format=image/png&styles=";
  }
  //获取元数据
  getMetadata() {
    let promise = new Promise((resolve, reject) => {
      let url = this.url + "?SERVICE=WMS&VERSION=1.0.0&REQUEST=GetCapabilities";
      let client = new XMLHttpRequest();
      client.open("GET", url, true);
      client.onload = function () {
        let data = client.response;
        let parser = new DOMParser();
        let xmlDoc = parser.parseFromString(data, "text/xml");
        let layerDocs = xmlDoc.getElementsByTagName("Layer");
        let layers = [];
        for (let i = 0; i < layerDocs.length; i++) {
          let doc = layerDocs[i];
          let attributes = doc.attributes;
          if (
            attributes.length &&
            attributes.queryable &&
            attributes.queryable.nodeValue
          ) {
            let nameNode = doc.getElementsByTagName("Name")[0];
            layers.push(nameNode.textContent);
          }
        }
        resolve({
          layers: layers,
        });
      };
      client.onerror = function () {
        console.error("请求" + url + "失败");
      };
      client.send();
    });
    return promise;
  }
  rebuild() {
    const extent = this.extent,
      proj = this.proj,
      canvas = this.canvas_,
      height = canvas.height,
      width = canvas.width;
    let url = this.url;
    return url
      .replace("${layers}", this.layers.join(","))
      .replace("${xmin}", extent.xmin)
      .replace("${ymin}", extent.ymin)
      .replace("${xmax}", extent.xmax)
      .replace("${ymax}", extent.ymax)
      .replace("${width}", width)
      .replace("${height}", height)
      .replace("${epsg}", proj.epsg);
  }
}
