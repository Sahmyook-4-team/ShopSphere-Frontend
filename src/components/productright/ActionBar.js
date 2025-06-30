import React from 'react';
import styles from '../../styles/ActionBar.module.css';

function ActionBar({ wishlistCount, HeartIcon, onAddToCart, onBuyNow }) {
  return (
    <div className={styles.actionBarContainer}>
      <button className={styles.wishlistButton}>
        <HeartIcon className={styles.wishlistIcon} />
        <span className={styles.wishlistCount}>{wishlistCount}</span>
      </button>
      <div className={styles.actionButtonsGroup}>
        <button
          className={styles.cartButton}
          onClick={onAddToCart} // ✅ 장바구니 추가 함수 연결
        >
          장바구니
        </button>
        <button
          className={styles.buyButton}
          onClick={onBuyNow} // ✅ 구매 함수 연결 (선택적)
        >
          구매하기
        </button>
      </div>
    </div>
  );
}

export default ActionBar;
