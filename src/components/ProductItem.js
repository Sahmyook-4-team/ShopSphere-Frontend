// src/components/ProductItem.js

import React from 'react';
import styles from '../styles/ProductItem.module.css';
import cartPageStyles from '../styles/ShoppingCartPage.module.css';

const ProductItem = ({
  product,
  options, // ProductPage에서는 선택된 옵션 객체, ShoppingCartPage에서는 텍스트용 가짜 객체
  productImage,
  finalPrice,
  initialQuantity = 1,
  isChecked,
  onQuantityChange,
  onCheckToggle,
  onRemove,
  currency = "원",
  isFromProductPage = false
}) => {
  const { name = "상품명", seller } = product || {};

  const handleDecrease = () => {
    if (onQuantityChange && initialQuantity > 1) {
      onQuantityChange(initialQuantity - 1);
    }
  };

  const handleIncrease = () => {
    if (onQuantityChange) {
      onQuantityChange(initialQuantity + 1);
    }
  };
  
  // prop에 따라 다른 최상위 컨테이너 스타일을 적용
  const containerClassName = isFromProductPage 
    ? styles.productCardContainerSimple 
    : styles.productCardContainer;

  return (
    <div className={containerClassName}>
      <div className={styles.productCard}>
        <div className={styles.topRow}>
          {/* 장바구니 페이지에서만 체크박스 표시 */}
          {!isFromProductPage && (
            <div
              className={`${cartPageStyles.customCheckbox} ${isChecked ? cartPageStyles.checked : ''}`}
              onClick={onCheckToggle}
            >
              {isChecked && <span className={cartPageStyles.checkmark}>✓</span>}
            </div>
          )}

          {/* 장바구니 페이지에서만 이미지 표시 */}
          {!isFromProductPage && productImage && (
            <div className={styles.imageWrapper}>
              <img src={process.env.REACT_APP_API_BASE_URL + productImage} alt={name} />
            </div>
          )}

          <div className={styles.detailsWrapper}>
            {/* 장바구니 페이지에서만 브랜드명 표시 */}
            {!isFromProductPage && (
                <span className={styles.brandLabel}>{seller?.name || "브랜드명"}</span>
            )}
            <label className={styles.nameLabel}>
                {/* ProductPage에서는 옵션명, ShoppingCartPage에서는 상품명 표시 */}
                {isFromProductPage ? options.size : name}
            </label>
            {/* 장바구니 페이지에서만 옵션 상세 텍스트 표시 */}
            {!isFromProductPage && options?.size && (
                <div className={styles.optionsTextDisplay}>{options.size}</div>
            )}
          </div>
          
          {onRemove && (
            <button className={styles.closeButton} onClick={onRemove}>✕</button>
          )}
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.quantityControl}>
            <button
              className={`${styles.quantityButton} ${styles.minus}`}
              onClick={handleDecrease}
              disabled={initialQuantity <= 1}
            >
              -
            </button>
            <label className={styles.quantityDisplay}>{initialQuantity}</label>
            <button
              className={`${styles.quantityButton} ${styles.plus}`}
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
          <div className={styles.priceInfo}>
            <label className={styles.finalPriceLabel}>
              {finalPrice}{currency}
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;
