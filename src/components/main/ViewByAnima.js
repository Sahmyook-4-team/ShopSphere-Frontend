import React from "react";
import styles from "../../styles/ViewByAnima.module.css";

export const ViewByAnima = () => {
  return (
    <div className={styles.viewByAnima}>
      <div className={styles.roundButton}>
        <div className={styles.roundIcon}></div>
        <span>가방 · 지갑</span>
      </div>

      <div className={styles.roundButton}>
        <div className={styles.roundIcon}></div>
        <span>셔츠</span>
      </div>

      <div className={styles.roundButton}>
        <div className={styles.roundIcon}></div>
        <span>모자</span>
      </div>

      <div className={styles.roundButton}>
        <div className={styles.roundIcon}></div>
        <span>트레이닝</span>
      </div>

      <div className={styles.roundButton}>
        <div className={styles.roundIcon}></div>
        <span>디지털</span>
      </div>

      <div className={styles.roundButton}>
        <div className={styles.roundIcon}></div>
        <span>패션소품</span>
      </div>

      <div className={styles.roundButton}>
        <div className={styles.roundIcon}></div>
        <span>언더웨어</span>
      </div>
    </div>
  );
};

export default ViewByAnima;
