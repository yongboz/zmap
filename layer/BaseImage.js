import layer from "./Base.js";
import { getUid } from "../math.js";
export default class BaseImage extends layer {
  constructor(option) {
    super(option);
    this.type = "image";
    this.uid = null;
  }
  update() {
    let uid = getUid();
    this.uid = uid;
    this.canvas_.height = this.canvas_.height;
    let url = this.rebuild();
    let img = new Image();
    img.src = url;
    img.style.display = "none";
    document.body.appendChild(img);
    img.onload = () => {
      if (uid === this.uid) {
        this.ctx_.drawImage(img, 0, 0);
        this.emit("update");
      }
      document.body.removeChild(img);
    };
  }
  rebuild() {}
}
