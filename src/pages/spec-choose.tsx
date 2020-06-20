import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/reducer/root-reducer";
import SpecAdjoinMatrix from "../utils/spec-adjoin-martix";
import "./spec.css";
const classNames = require("classnames");

const Spec: React.FC = () => {
  const { data, commoditySpecs } = useSelector((state: RootState) => state.spec);
  // 已选择的，就三个选项
  const [specsS, setSpecsS] = useState(Array(commoditySpecs.length).fill(""));

  // 创建一个规格矩阵
  const specAdjoinMatrix = useMemo(() => new SpecAdjoinMatrix(commoditySpecs, data), [commoditySpecs, data]);
  // 获得可选项表
  const optionSpecs = specAdjoinMatrix.querySpecsOptions(specsS);

  const handleClick = function (bool: boolean, text: string, index: number) {
    // 可选项没有的并且选中不同的
    if (specsS[index] !== text && !bool) return;
    // 选择中相同的，可能可选项有的，可选项没有的
    specsS[index] = specsS[index] === text ? "" : text;
    setSpecsS(specsS.slice());
  };

  return (
    <div className="container">
      {commoditySpecs.map(({ title, list }, index) => (
        <div key={index}>
          <p className="title">{title}</p>
          <div className="specBox">
            {list.map((value, i) => {
              const isOption = optionSpecs.includes(value);
              const isActive = specsS.includes(value);
              return (
                <span
                  key={i}
                  className={classNames({
                    specOption: isOption,
                    specAction: isActive,
                    specDisabled: !isOption,
                  })}
                  onClick={() => handleClick(optionSpecs.indexOf(value) > -1, value, index)}
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
