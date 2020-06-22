import base from "./BaseTile.js";
export default class ArcgisTileLayer extends base {
  constructor(option) {
    super(option);
    this.type = "arcgis_tile";
    this.url += "/tile/${level}/${row}/${col}?blankTile=false";
  }
  rebuild(row, col) {
    let url = this.url,
      level = this.level;
    return url
      .replace("${level}", level - 1)
      .replace("${row}", row)
      .replace("${col}", col);
  }
}
