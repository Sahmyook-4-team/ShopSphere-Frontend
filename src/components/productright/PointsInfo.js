import React from 'react';
import styles from '../../styles/PointsInfo.module.css';

function PointsInfo({ maxPoints, purchasePoints, reviewPoints }) {
  return (
    <div className={styles.pointsInfoContainer}>
      <div className={styles.maxPointsSection}>
        <span className={styles.maxPointsValue}>{maxPoints.toLocaleString()}원</span> 최대적립
        <div className={styles.separator}></div> {/* 이미지의 가로선 */}
      </div>
      <div className={styles.detailsSection}>
        <div className={styles.pointItem}>
          <span>· 구매 추가 적립</span>
          <span className={styles.pointValue}>{purchasePoints.toLocaleString()}원</span>
        </div>
        <div className={styles.pointItem}>
          <span>· 후기 적립</span>
          <span className={styles.pointValue}>{reviewPoints.toLocaleString()}원</span>
        </div>
      </div>
    </div>
  );
}

export default PointsInfo;