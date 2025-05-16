import React from "react";
import image from "../assets/CartOption/image.svg";
import line1 from "../assets/CartOption/line-1.svg";
import "../styles/CartOption.css";
import vector2 from "../assets/CartOption/vector-2.svg";
import vector from "../assets/CartOption/vector.svg";
import x from "../assets/CartOption/x.svg";

export const CartOption = () => {
  return (
    <div className="box">
      <div className="view">
        <div className="overlap">
          <div className="div">
            <div className="overlap-group-wrapper">
              <div className="overlap-group">
                <div className="text-wrapper">쿠폰 사용</div>
              </div>
            </div>

            <div className="overlap-wrapper">
              <div className="overlap-group">
                <div className="text-wrapper-2">옵션 변경</div>
              </div>
            </div>

            <div className="view-2">
              <div className="text-wrapper-3">91,500원</div>

              <div className="text-wrapper-4">카키 / 1개</div>

              <p className="p">백팩 2.0 크로스핏 운동 가방</p>

              <div className="rectangle" />
            </div>

            <div className="vector-wrapper">
              <img className="vector" alt="Vector" src={vector2} />
            </div>

            <img className="x" alt="X" src={x} />
          </div>

          <div className="div-wrapper">
            <div className="overlap-2">
              <div className="view-3">
                <div className="overlap-group-2">
                  <img className="line" alt="Line" src={line1} />

                  <div className="text-wrapper-5">브랜드숍</div>
                </div>
              </div>

              <div className="text-wrapper-6">엑스포디움</div>

              <div className="img-wrapper">
                <img className="vector" alt="Vector" src={image} />
              </div>
            </div>
          </div>
        </div>

        <div className="view-4">
          <div className="overlap-3">
            <div className="view-5">
              <img className="vector" alt="Vector" src={vector} />
            </div>

            <div className="text-wrapper-7">전체 선택</div>

            <div className="view-6">
              <div className="overlap-group-3">
                <div className="text-wrapper-8">선택 삭제</div>
              </div>
            </div>
          </div>
        </div>

        <div className="view-7">
          <div className="overlap-4">
            <div className="text-wrapper-9">장바구니</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartOption;


