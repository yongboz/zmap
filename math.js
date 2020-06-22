export function getDpi() {
  const tmpNode = document.createElement("div");
  tmpNode.style.cssText =
    "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
  document.body.appendChild(tmpNode);
  const dpi = parseInt(tmpNode.offsetWidth);
  tmpNode.parentNode.removeChild(tmpNode);
  return dpi;
}

export function getPixelDistance(dpi, scale) {
  return (0.0254 / dpi) * scale;
}

export function getUid() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function copeCanvas(oldCanvas) {
  let newCanvas = document.createElement("canvas");
  let context = newCanvas.getContext("2d");
  newCanvas.width = oldCanvas.width;
  newCanvas.height = oldCanvas.height;
  context.drawImage(oldCanvas, 0, 0);
  return newCanvas;
}
