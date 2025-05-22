import React from "react";
import { ViewByAnima } from "./ViewByAnima";
import { ViewWrapperByAnima } from "./ViewWrapperByAnima";
import image from "../../assets/Middle/image.svg";
import styles from "../../styles/Middle.module.css";

export const Middle = () => {
  return (
    <div className={styles.element}>
      <div className={styles["div-3"]}>
        <ViewByAnima />

        <div className={styles["text-wrapper-10"]}>트레이닝</div>
        <div className={styles["text-wrapper-11"]}>가격대별 BEST</div>
        <div className={styles["text-wrapper-12"]}>3만원 이하</div>
        <div className={styles["text-wrapper-13"]}>3~5만원</div>
        <div className={styles["text-wrapper-14"]}>5~10만원</div>
        <div className={styles["text-wrapper-15"]}>10만원 이상</div>

        <img className={styles.image} alt="Image" src={image} />

        <div className={styles.wrapperRow}>
          <ViewWrapperByAnima />
          <ViewWrapperByAnima />
          <ViewWrapperByAnima />
          <ViewWrapperByAnima />
        </div>
      </div>
    </div>
  );
};


export default Middle;