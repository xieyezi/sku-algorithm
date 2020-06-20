import AdjoinMatrix from "./adjoin-martix";
import { AdjoinType } from "./adjoin-martix";
import { SpecCategoryType, CommoditySpecsType } from "../redux/reducer/spec-reducer";

export default class SpecAdjoinMatrix extends AdjoinMatrix {
  commoditySpecs: Array<CommoditySpecsType>;
  data: Array<SpecCategoryType>;

  constructor(commoditySpecs: Array<CommoditySpecsType>, data: Array<SpecCategoryType>) {
    super(commoditySpecs.reduce((total: AdjoinType, current) => [...total, ...current.list], []));
    this.commoditySpecs = commoditySpecs;
    this.data = data;
    // 根据可选规格列表矩阵创建
    this.initCommodity();
    // 同级顶点创建
    this.initSimilar();
  }

  /**
   * 对数据结构不同层次的解析 （item.specs）
   */
  initCommodity() {
    this.data.forEach((item) => {
      this.applyCommodity(item.specs);
    });
  }

  initSimilar() {
    // 获得所有可选项 (所有连接上了的点)
    const specsOption = this.getCollection(this.vertex);
    this.commoditySpecs.forEach((item) => {
      const params: AdjoinType = [];
      // 获取同级别顶点
      item.list.forEach((value) => {
        if (specsOption.includes(value)) params.push(value);
      });
      // 同级点位创建
      this.applyCommodity(params);
    });
  }
  /*
   * 传入顶点数组，查询出可选规格
   * @param params
   */
  querySpecsOptions(params: AdjoinType) {
    let specOptionCanchoose: any = [];
    if (params.some(Boolean)) {
      // 过滤一下选项
      specOptionCanchoose = this.getUnions(params.filter(Boolean));
    } else {
      // 所有可选项
      specOptionCanchoose = this.getCollection(this.vertex);
    }
    return specOptionCanchoose;
  }

  /**
   *
   * @param {*} params [key, key]
   */
  applyCommodity(params: AdjoinType) {
    params.forEach((param) => {
      this.setAdjoinVertexs(param, params);
    });
  }
}
