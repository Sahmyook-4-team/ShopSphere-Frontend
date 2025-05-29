import React from "react";
import styles from "../../styles/ViewWrapperByAnima.module.css";

export const ViewWrapperByAnima = () => {
  return (
    <div className={styles.viewWrapperByAnima}>
      <div className={styles.element}>
        <div className={styles.view2} />
        <div className={styles.textWrapper5}>아디다스</div>
        <div className={styles.textWrapper6}>NEW/특가 아디다스 져지</div>
        <div className={styles.textWrapper7}>85,020</div>
        <div className={styles.div2}>
          <div className={styles.textWrapper8}>관심</div>
          <div className={styles.textWrapper9}>999+</div>
          <div className={styles.textWrapper8}>리뷰</div>
          <div className={styles.textWrapper9}>33</div>
        </div>
      </div>
      {/* 나머지 상품들도 동일한 구조로 복사 붙여넣기 */}
    </div>
  );
};

export default ViewWrapperByAnima;
