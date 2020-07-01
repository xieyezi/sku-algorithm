---
title: 商品多规格选择-sku算法
---

# 商品多规格选择-前端 sku 算法

![sku.png](https://i.loli.net/2020/06/21/xld2cADgjnuWF7J.png)

相信大家看到这张图片就知道我们这篇文章要讲什么了，没错就是-商品多规格选择的解法。

近来在掘金上面看见大家都在研究“商品多规格选择”的问题，例如`晨曦大佬`的[前端电商 sku 的全排列算法很难吗？学会这个套路，彻底掌握排列组合。](https://juejin.im/post/5ee6d9026fb9a047e60815f1) 在这篇文章里面，大佬写明了如何实现`sku`的全排列，思路非常的棒，但是并没有紧贴业务场景。真正的业务场景是，我们要根据用户每一次选择的规格，找出剩下可选的规格和不可选的规格，表现在前端页面上：就是将不可选的规格置灰，也就是如下效果（可以点击[这里](https://codesandbox.io/s/sku-algorithm-pionk?file=/src/redux/reducer/spec-reducer.ts)查看最终效果）：

![sku.gif](https://i.loli.net/2020/06/21/hdQRZwjpvknKNru.gif)

那么今天我们就来讲讲这个问题的一个解决方法，要讲明白很难，但是我相信你看了这篇文章之后，`sku`就再也难不倒你了。

## 什么是 sku

在介绍具体解法之前，我们先来介绍一下什么是`sku`? `sku`是会计学中的一个名词，被称作`库存单元`。说人话？简单来讲就是，我们上图 👆 中每一个单规格选项，例如`深空灰色`、`64G`,都是一个规格(`sku`)。商品和`sku`属于一对多的关系，也就是我们可以选择多个`sku`来确定到某个具体的商品:

![商品.png](https://i.loli.net/2020/06/21/xpPuVWzkfFhD9t6.png)

## 业务场景

可以这么说，只要是做电商类相关的产品，比如购物 APP、购物网站等等，都会遇到这么一个场景，每个商品对应着多个规格，用户可以根据不同的规格组合，选择出自己想要的产品。我们自己在生活中也会经常用到这个功能，然而就是这样一个简单的功能，却难倒了很多小伙伴。

笔者也是一样，刚开始遇到这个场景，笔者觉得应该一个下午就能搞定，完美收工，奈何还是太过于年轻，搞了差不多两天，在网上查阅了很多相关的文章和资料，但是不得其解，最后没有办法，只能硬着头皮采用暴力求解（也就是不断循环）的方法来解决的，时间复杂度贼高，达到了`O(m*n)`也就是`O(n²)`,这种实现方法其实也不是不行（~~能跑就行~~），对吧。但是后来笔者发现，当一个商品的规格非常非常多、并且用户的设备性能不是那么好的情况下，那么这种实现方式就会导致运行时间过长，表现在页面上就是：当用户点击了一个规格，会有明显的卡顿，那怎么行，客户都流失了，老板还怎么买法拉利 🤔️？所以笔者又开始了研究。

## 图

一个偶然的机会，笔者在逛知乎的时候，看到了有人在讨论`图`，这个`数据结构`，突然灵光一现，貌似咱们的`多规格选择`也可以用图来作求解方法，后来一尝试，还真的可行。而且时间复杂度只有`O(n)`，简直完美。所以我们下面来介绍一下`图`，什么是`图`？相信大学学过`数据结构与算法`的同学都应该知道，不过应该已经忘得一干二净了。

### 什么是图

`图`其实是数学的一个分支。它以图为研究对象。图论中的图是由若干给定的点及连接两点的线所构成的图形，这种图形通常用来描述某些事物之间的某种特定关系，用点代表事物，用连接两点的线表示相应两个事物间具有这种关系：

![图.jpg](https://i.loli.net/2020/06/21/aK6qZJw2Odm1Q9u.jpg)

`图`通常有如下分类:

- 分为有向图和无向图

- 分为有权图和无权图

好了知道这两个概念就差不多了,当然如果想了解更多图多概念，请看[这里](https://zhuanlan.zhihu.com/p/25498681)

那么我们需要用到的是无向图，什么是无向图呢，就像这样：

![无向图.png](https://i.loli.net/2020/06/21/sMaedvPVSCfwFO9.png)

两个顶点之间如果有连线，则表示这两个顶点是互通的。小伙伴们看到这里可能会懵逼了，说了这么多，好像跟我们要解决的问题没关系啊。小伙伴们现在想一想：用户在选择规格的时候，肯定是没有先后顺序的，假设我们现在把每种规格看作是`无向图`的一个`顶点`的话，我们可以根据这些`单项规格`的组合规格，就可以画出一个像上图一样的`无向图`。

### 邻接矩阵

假设我们已经画出了如上 👆 的无向图，那么我们如何将这个图用咱们的代码来表示呢？这里就用到了`邻接矩阵`

`邻接矩阵`其实是《线性代数》里面的概念，相信很多小伙伴都不会陌生，我们在代码中，表示它的方法是用一个`n x n`的二维数组来抽象邻接矩阵。让我们来把上面 👆 这个无向图用邻接矩阵(二维数组)表示出来：

![邻接矩阵.png](https://i.loli.net/2020/06/21/7h6IE2JgwcxqoXu.png)

很显然，如果两个顶点互通（有连线），那么它们对应下标的值则为 1，否则为 0。

好了，下面开始逐步都是高能，请小伙伴们认真观看。

假设现在我们有如下规格列表：

```js
specList: [
  { title: "颜色", list: ["红色", "紫色"] },
  { title: "套餐", list: ["套餐一", "套餐二"] },
  { title: "内存", list: ["64G", "128G", "256G"] },
];
```

可供选择的规格组合有：

```js
specCombinationList: [
    { id: "1", specs: ["紫色", "套餐一", "64G"] },
    { id: "2", specs: ["紫色", "套餐一", "128G"] },
    { id: "3", specs: ["紫色", "套餐二", "128G"] },
    { id: "4", specs: ["红色", "套餐二", "256G"] }
  ],
```

首先，我们根据`specList`知道：我们有“`颜色`”、“`套餐`”、“`内存`”三种规格类别。分别有`红色`、`紫色`、`套餐一`、`套餐二`、`64G`、`128G`、`256G`这些单项规格。每个单项规格作为一个顶点，所以就有如下顶点：

![顶点.png](https://i.loli.net/2020/06/21/RhnGq17toK9xdj5.png)

然后我们根据`specCombinationList`，我们可以知道，哪些规格的组合是可选的。好了我们要开始画图了。

根据`{ id: "1", specs: ["紫色", "套餐一", "64G"] },`我们可以画出：

![开始画图.png](https://i.loli.net/2020/06/21/V9UXJQM1jC3sbAw.png)

接下来依葫芦画瓢：我们可以根据`specCombinationList`剩下的数据画出如下的图：

![规格组合.png](https://i.loli.net/2020/06/21/tQcJTjf6PXGnp3S.png)

好了，我们已经根据`specCombinationList`(也就是可选规格组合)将我们的规格无向图画完了。现在我们来模拟一下用户的选择:

```js
specCombinationList: [
    { id: "1", specs: ["紫色", "套餐一", "64G"] },
    { id: "2", specs: ["紫色", "套餐一", "128G"] },
    { id: "3", specs: ["紫色", "套餐二", "128G"] },
    { id: "4", specs: ["红色", "套餐二", "256G"] }
  ],
```

假设用户先选择了`紫色`、根据`data`,我们发现`套餐一`、`套餐二`、`64G`、`128G`是可选的，这个时候我们发现一个问题：显然跟`紫色`同级的`红色`其实也是可选的。所以这个图其实我们还没有画完。所以相同类型的规格，只要是在可选规格里面的，他们其实是应该连接起来的：

![全部规格.png](https://i.loli.net/2020/06/21/2huzUjsSYfT3mbt.png)

好了，无向图画好了，现在我们将它映射到`邻接矩阵`上面（这一步强烈建议小伙伴们拿出纸笔来一起画一画）：

![顶点邻接矩阵.png](https://i.loli.net/2020/06/21/sz5d9k34wJnXmNM.png)

到了这一步，恭喜你，你已经懂了一大半了 👏。

好了，到这我们就可以公布最终结论了：

- 当用户初次进入该页面时，所有的规格均可选：

![都可选.png](https://i.loli.net/2020/06/21/Jgy4dzTfwDEmMlR.png)

- 当用户选择了某个顶点后，当前顶点所有可选项均被找出（即是当前顶点所在列值为 1 的顶点）：

![选择一项.png](https://i.loli.net/2020/06/21/Gnkr3ZSwjcIRJqW.png)

- 选取多个顶点时，可选项是各个顶点邻接点的交集：（即是选中顶点所在列的交集）

![多个顶点交集.png](https://i.loli.net/2020/06/21/xBTaGw9znPtVXED.png)

## 代码实现

说真的，我觉得小伙伴们看明白了我上面 👆 这些讲解，相信你已经完全懂了该如何实现“`多规格选择`”算法了。不过有句话叫做：光说不练假把式！那下面我们就一起来捋一捋，用代码如何实现吧，笔者这里用的前端框架是`react`，明白思路了，用什么框架都一样的哦。

这里先说下思路：

1、根据规格列表（`specList`）创建邻接矩阵（数组）

2、根据可选规格组合(`specCombinationList`)填写顶点的值

3、获得所有可选顶点，然后根据可选顶点填写同级顶点的值

### 创建邻接矩阵

首先，我们需要提供一个类来创建邻接矩阵。一个邻接矩阵，首先需要传入一个顶点数组：`vertex`,需要一个用来装邻接矩阵的数组：`adjoinArray`。刚刚我们上面说到了，这个类还必须提供计算`并集`和`交集`的方法：

```ts
export type AdjoinType = Array<string>;

export default class AdjoinMatrix {
  vertex: AdjoinType; // 顶点数组
  quantity: number; // 矩阵长度
  adjoinArray: Array<number>; // 矩阵数组

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
   *  传入一个顶点，和当前顶点可达的顶点数组，将对应位置置为1
   */
  setAdjoinVertexs(id: string, sides: AdjoinType) {
    const pIndex = this.vertex.indexOf(id);
    sides.forEach((item) => {
      const index = this.vertex.indexOf(item);
      this.adjoinArray[pIndex * this.quantity + index] = 1;
    });
  }

  /*
   * @param id string
   * 传入顶点的值，获取该顶点的列
   */
  getVertexCol(id: string) {
    const index = this.vertex.indexOf(id);
    const col: Array<number> = [];
    this.vertex.forEach((item, pIndex) => {
      col.push(this.adjoinArray[index + this.quantity * pIndex]);
    });
    return col;
  }

  /*
   * @param params Array<string>
   * 传入一个顶点数组，求出该数组所有顶点的列的合
   */
  getColSum(params: AdjoinType) {
    const paramsVertex = params.map((id) => this.getVertexCol(id));
    const paramsVertexSum: Array<number> = [];
    this.vertex.forEach((item, index) => {
      const rowtotal = paramsVertex
        .map((value) => value[index])
        .reduce((total, current) => {
          total += current || 0;
          return total;
        }, 0);
      paramsVertexSum.push(rowtotal);
    });
    return paramsVertexSum;
  }

  /*
   *  @param params Array<string>
   * 传入一个顶点数组，求出并集
   */
  getCollection(params: AdjoinType) {
    const paramsColSum = this.getColSum(params);
    let collections: AdjoinType = [];
    paramsColSum.forEach((item, index) => {
      if (item && this.vertex[index]) collections.push(this.vertex[index]);
    });
    return collections;
  }

  /*
   *  @param params Array<string>
   * 传入一个顶点数组，求出交集
   */
  getUnions(params: AdjoinType) {
    const paramsColSum = this.getColSum(params);
    let unions: AdjoinType = [];
    paramsColSum.forEach((item, index) => {
      if (item >= params.length && this.vertex[index]) unions.push(this.vertex[index]);
    });
    return unions;
  }
}
```

有了这个类，接下来可以创建一个专门用于生成`商品多规格选择`的类，它继承于`AdjoinMatrix`。

### 创建`多规格选择`邻接矩阵

我们这个多规格选择的邻接矩阵，需要提供一个查询可选顶点的方法：`getSpecscOptions`

```ts
import AdjoinMatrix from "./adjoin-martix";
import { AdjoinType } from "./adjoin-martix";
import { SpecCategoryType, CommoditySpecsType } from "../redux/reducer/spec-reducer";

export default class SpecAdjoinMatrix extends AdjoinMatrix {
  specList: Array<CommoditySpecsType>;
  specCombinationList: Array<SpecCategoryType>;

  constructor(specList: Array<CommoditySpecsType>, specCombinationList: Array<SpecCategoryType>) {
    super(specList.reduce((total: AdjoinType, current) => [...total, ...current.list], []));
    this.specList = specList;
    this.specCombinationList = specCombinationList;
    // 根据可选规格列表矩阵创建
    this.initSpec();
    // 同级顶点创建
    this.initSameLevel();
  }

  /**
   * 根据可选规格组合填写邻接矩阵的值
   */
  initSpec() {
    this.specCombinationList.forEach((item) => {
      this.fillInSpec(item.specs);
    });
  }
  // 填写同级点
  initSameLevel() {
    // 获得初始所有可选项
    const specsOption = this.getCollection(this.vertex);
    this.specList.forEach((item) => {
      const params: AdjoinType = [];
      // 获取同级别顶点
      item.list.forEach((value) => {
        if (specsOption.includes(value)) params.push(value);
      });
      // 同级点位创建
      this.fillInSpec(params);
    });
  }
  /*
   * 传入顶点数组，查询出可选规格
   * @param params
   */
  getSpecscOptions(params: AdjoinType) {
    let specOptionCanchoose: AdjoinType = [];
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
  fillInSpec(params: AdjoinType) {
    params.forEach((param) => {
      this.setAdjoinVertexs(param, params);
    });
  }
}
```

### 页面渲染

好了到了这一步，我们已经可以在页面中使用这两个类了：

```tsx
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducer/root-reducer";
import SpecAdjoinMatrix from "../utils/spec-adjoin-martix";
import "./spec.css";
const classNames = require("classnames");

const Spec: React.FC = () => {
  const { specList, specCombinationList } = useSelector((state: RootState) => state.spec);
  // 已选择的规格，长度为规格列表的长度
  const [specsS, setSpecsS] = useState(Array(specList.length).fill(""));

  // 创建一个规格矩阵
  const specAdjoinMatrix = useMemo(() => new SpecAdjoinMatrix(specList, specCombinationList), [specList, specCombinationList]);
  // 获得可选项表
  const optionSpecs = specAdjoinMatrix.getSpecscOptions(specsS);

  const handleClick = function(bool: boolean, text: string, index: number) {
    // 排除可选规格里面没有的规格
    if (specsS[index] !== text && !bool) return;
    // 根据text判断是否已经被选中了
    specsS[index] = specsS[index] === text ? "" : text;
    setSpecsS(specsS.slice());
  };

  return (
    <div className="container">
      {specList.map(({ title, list }, index) => (
        <div key={index}>
          <p className="title">{title}</p>
          <div className="specBox">
            {list.map((value, i) => {
              const isOption = optionSpecs.includes(value); // 当前规格是否可选
              const isActive = specsS.includes(value); // 当前规格是否被选
              return (
                <span
                  key={i}
                  className={classNames({
                    specOption: isOption,
                    specAction: isActive,
                    specDisabled: !isOption,
                  })}
                  onClick={() => handleClick(isOption, value, index)}
                >
                  {value}
                </span>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Spec;
```

好了，打完收工了，如果有小伙伴想看实现效果，可以查看[这里](https://codesandbox.io/s/sku-algorithm-pionk?file=/src/redux/reducer/spec-reducer.ts)，如果有小伙伴想把代码拉到本地看看，那么请点击[这里](https://github.com/xieyezi/sku-algorithm)

## 总结

实践证明：大学学的东西是真的有用的。我们通过`图`，解决了`商品多规格选择`的难题。在求解可选规格的时候，时间复杂度由原来的`O(n²)`变成了`O(n)`。不过值得一提的是，采用`邻接矩阵`来存储`图`，空间复杂度就变成了`O(n²)`了，同时也存在浪费空间的问题，但是`图`肯定不止有`邻接矩阵`这一种存储方法，我们还可以用`链表`来存储`图`，小伙伴们可以自己去试一试。另外如果用`链表`来存储图，空间复杂度会变低，但是时间复杂度会变高，具体如何选择，就看小伙伴们自己权衡了。

以后遇到这个需求，小伙伴们肯定是分分钟实现，提早下班。

我是觉非，码字不易，如果你觉得这篇文章对你有用的话，请给个赞吧！！
