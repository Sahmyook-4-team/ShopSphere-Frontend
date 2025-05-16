import React from "react";
import styles from "../styles/CartOption.module.css";
import vector from "../assets/CartOption/vector.svg";
import vector2 from "../assets/CartOption/vector-2.svg";
import x from "../assets/CartOption/x.svg";
import image from "../assets/CartOption/image.svg";

const CartOption = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>장바구니</div>

      <div className={styles.selectBar}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <img src={vector} alt="check" />
          <span>전체 선택</span>
        </div>
        <div className={styles.button}>선택 삭제</div>
      </div>

      <div className={styles.brandRow}>
        <img src={vector} alt="check" />
        <span>엑스포디움</span>
        <div style={{ marginLeft: "auto", fontSize: "14px", color: "#888" }}>
          브랜드숍
        </div>
      </div>

      <div className={styles.itemBox}>
        <img src={vector} alt="check" />
        <div className={styles.thumbnail}>
          <img src={image} alt="thumbnail" style={{ width: "100%" }} />
        </div>
        <div className={styles.itemInfo}>
          <div>
            <div className={styles.itemTitle}>백팩 2.0 크로스핏 운동 가방</div>
            <div className={styles.itemOption}>카키 / 1개</div>
            <div className={styles.itemPrice}>91,500원</div>
          </div>
          <div className={styles.actions}>
            <div className={styles.button}>옵션 변경</div>
            <div className={styles.button}>쿠폰 사용</div>
          </div>
        </div>
        <img src={x} alt="삭제" className={styles.deleteIcon} />
      </div>
    </div>
  );
};

export default CartOption;
