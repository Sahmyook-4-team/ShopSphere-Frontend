import React from "react";
import heart from "../../assets/Bottom/heart.svg";
import vector from "../../assets/Bottom/vector.svg";
import styles from "../../styles/Bottom.module.css";

export const Bottom = () => {
  return (
    <div className={styles.box}>
      <div className={styles.element}>
        <div className={styles.overlap}>

          <div className={styles["view-2"]}>
            <div className={styles["overlap-group-wrapper"]}>
              <div className={styles["overlap-group"]}>
                <div className={styles["div-wrapper"]}>
                  <div className={styles["text-wrapper-4"]}>스타일리스트 추천</div>
                </div>
                <img className={styles.heart} alt="Heart" src={heart} />
              </div>
            </div>

            <div className={styles["view-3"]}>
              <div className={styles["text-wrapper-5"]}>관심 999+ 리뷰 999</div>
              <div className={styles["text-wrapper-6"]}>히코튼</div>
              <div className={styles["text-wrapper-8"]}>60%</div>
              <p className={styles.p}>
                [1+1] 사이드 핀턱 벌룬 와이드 스트링 조거 트레이닝 팬츠...
              </p>
            </div>
          </div>

          <div className={styles["view-4"]}>
            <div className={styles["view-6"]}>
              <div className={styles["text-wrapper-11"]}>28,660</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bottom;
