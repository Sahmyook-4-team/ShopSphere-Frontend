import React from 'react';
import styles from '../../styles/TotalSummary.module.css';

function TotalSummary({ quantity, totalPrice }) {
  return (
    <div className={styles.summaryContainer}>
      <span className={styles.totalQuantity}>총 {quantity}개</span>
      <span className={styles.totalPriceValue}>{totalPrice.toLocaleString()}원</span>
    </div>
  );
}

export default TotalSummary;