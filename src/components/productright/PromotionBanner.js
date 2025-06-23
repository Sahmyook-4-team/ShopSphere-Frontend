import React from 'react';
import styles from '../../styles/PromotionBanner.module.css';

function PromotionBanner({ text, ArrowRightIcon }) {
  return (
    <div className={styles.bannerContainer}>
      <span>{text}</span>
      <ArrowRightIcon className={styles.arrowIcon} />
    </div>
  );
}

export default PromotionBanner;