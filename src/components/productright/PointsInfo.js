// src/components/productright/PointsInfo.js

import React from 'react';
import styles from '../../styles/PointsInfo.module.css';

// ✨ prop으로 'price' 하나만 받도록 수정합니다.
function PointsInfo({ price }) {

  // ✨ price가 유효한 숫자인지 확인하고, 아니면 0으로 처리하여 오류를 방지합니다.
  const validPrice = typeof price === 'number' ? price : 0;

  // ✨ price를 기반으로 각 포인트를 직접 계산합니다.
  const maxPoints = Math.floor(validPrice * 0.02);
  const purchasePoints = Math.floor(validPrice * 0.01);
  const reviewPoints = 2000; // 후기 적립은 고정값으로 가정합니다.

  return (
    <div className={styles.pointsInfoContainer}>
      <div className={styles.maxPointsSection}>
        {/* ✨ 계산된 값을 사용합니다. */}
        <span className={styles.maxPointsValue}>{maxPoints.toLocaleString()}P</span> 최대적립
        <div className={styles.separator}></div>
      </div>
      <div className={styles.detailsSection}>
        <div className={styles.pointItem}>
          <span>· 구매 추가 적립</span>
          {/* ✨ 계산된 값을 사용합니다. */}
          <span className={styles.pointValue}>{purchasePoints.toLocaleString()}P</span>
        </div>
        <div className={styles.pointItem}>
          <span>· 후기 적립</span>
          {/* ✨ 계산된 값을 사용합니다. */}
          <span className={styles.pointValue}>{reviewPoints.toLocaleString()}P</span>
        </div>
      </div>
    </div>
  );
}

export default PointsInfo;