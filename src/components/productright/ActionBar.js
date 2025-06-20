import React from 'react';
import styles from '../../styles/ActionBar.module.css';

function ActionBar({ wishlistCount, HeartIcon }) {
  return (
    <div className={styles.actionBarContainer}>
      <button className={styles.wishlistButton}>
        <HeartIcon className={styles.wishlistIcon} />
        <span className={styles.wishlistCount}>{wishlistCount}</span>
      </button>
      <div className={styles.actionButtonsGroup}>
        <button className={styles.cartButton}>장바구니</button>
        <button className={styles.buyButton}>구매하기</button>
      </div>
    </div>
  );
}

export default ActionBar;