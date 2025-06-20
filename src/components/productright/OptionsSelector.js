import React from 'react';
import styles from '../../styles/OptionsSelector.module.css';
// react-icons에서 플러스/마이너스 아이콘 사용 가능
// import { FaPlus, FaMinus } from 'react-icons/fa';

function OptionsSelector({ optionName, price, quantity, onQuantityChange }) {
  const decreaseQuantity = () => {
    onQuantityChange(quantity - 1);
  };

  const increaseQuantity = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className={styles.optionsContainer}>
      <p className={styles.optionName}>{optionName}</p>
      <div className={styles.controlsAndPrice}>
        <div className={styles.quantityControl}>
          <button
            className={`${styles.quantityButton} ${styles.decreaseButton}`}
            onClick={decreaseQuantity}
            disabled={quantity <= 1} // 1개 미만으로 줄일 수 없도록
          >
            {/* <FaMinus /> */} -
          </button>
          <span className={styles.quantityDisplay}>{quantity}</span>
          <button
            className={`${styles.quantityButton} ${styles.increaseButton}`}
            onClick={increaseQuantity}
          >
            {/* <FaPlus /> */} +
          </button>
        </div>
        <span className={styles.currentOptionPrice}>{(price * quantity).toLocaleString()}원</span>
      </div>
    </div>
  );
}

export default OptionsSelector;