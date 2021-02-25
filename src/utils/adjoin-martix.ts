export type AdjoinType = Array<string>;

export default class AdjoinMatrix {
  vertex: AdjoinType; // 顶点数组
  quantity: number; // 矩阵长度
  adjoinArray: Array<any>; // 矩阵数组

  constructor(vertx: AdjoinType) {
    this.vertex = vertx;
    this.quantity = this.vertex.length;
    this.adjoinArray = [];
    this.init();
  }
  // 初始化数组
  init() {
    this.adjoinArray = Array(this.quantity * this.quantity).fill(0);
  }

  /*
   * @param id string
   * @param sides Array<string>
   *  传入一个顶点，和当前顶点可达的顶点数组，将对应位置设置权值
   */
  setAdjoinVertexs(id: string, sides: AdjoinType, weight: number) {
    const pIndex = this.vertex.indexOf(id);
    sides.forEach((item) => {
      const index = this.vertex.indexOf(item);
      const cur = this.adjoinArray[pIndex * this.quantity + index];
      if (typeof cur !== 'number') { // specList.length > 3时，存在单边多权的情况
        this.adjoinArray[pIndex * this.quantity + index].push(weight);
      } else if (cur > 1) {
        this.adjoinArray[pIndex * this.quantity + index] = [cur, weight];
      } else {
        this.adjoinArray[pIndex * this.quantity + index] = weight;
      }
    });
  }

  /*
   * @param id string
   * 传入顶点的值，获取该顶点的列
   */
  getVertexCol(id: string) {
    const index = this.vertex.indexOf(id);
    const col: Array<any> = [];
    this.vertex.forEach((item, pIndex) => {
      col.push(this.adjoinArray[index + this.quantity * pIndex]);
    });
    return col;
  }

  /*
   *  @param params Array<string>
   * 传入一个顶点数组，求出并集
   */
  getCollection(params: AdjoinType) {
    const paramsVertex = params.map((id) => this.getVertexCol(id));
    let collections: AdjoinType = [];
    paramsVertex.forEach((col, index) => {
      if (col.some(item => item !== 0)) {
        collections.push(params[index])
      }
    })
    return collections;
  }

  /*
   *  @param params Array<string>
   * 传入一个顶点数组，求出交集
   */
  getUnions(params: AdjoinType) {
    const paramsVertex = params.map((id) => this.getVertexCol(id));
    let unions: AdjoinType = [];
    this.vertex.forEach((type, index) => {
      const row = paramsVertex.map(col => col[index]).filter(t => t !== 1)
      if (this.isItemEqual(row)) {
        unions.push(type)
      }
    })
    return unions;
  }

  /*
   *  @param params
   * 传入一个交集行，判断内部是否互相相等
   */
  isItemEqual(params: Array<any>) {
    if (params.includes(0)) return false;

    let weight: number = -1;

    // 找出权值
    if (params.length) {
      params.some(t => {
        if (typeof t === 'number') weight = t
        return typeof t === 'number'
      })
      if (weight === -1) { // 都是多权边数组的情况
        return this.isArrayUnions(params)
      }
    }

    return params.every(t => {
      if (typeof t === 'number') {
        return t === weight
      } else {
        return t.includes(weight)
      }
    })
  }

  /*
   *  @param params
   * 传入多个数组，判断是否有交集
   */
  isArrayUnions(params: Array<Array<number>>) {
    if (!params.length) return false;
    return params[0].some(t => {
      return params.every(_t => _t.includes(t))
    })
  }
}
