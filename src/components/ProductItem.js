// src/components/ProductItem.js
import React from 'react';
import styles from '../styles/ProductItem.module.css';
import axios from 'axios';
import { addToCart } from '../lib/cartUtils'; // 경로 확인!
import cartPageStyles from '../styles/ShoppingCartPage.module.css';

const ProductItem = ({
  product,
  productImage = "https://via.placeholder.com/100x100.png?text=Product", 
  originalPrice,
  finalPrice,
  initialQuantity = 1,
  isChecked,
  onQuantityChange,
  onCheckToggle,
  onRemove,
  onAddToCart,
  currency = "원"
}) => {
  const {
    id: productId,
    name = "상품명",
    seller,
    options,
    discountText,
  } = product || {};

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

  const handleAddToCart = () => {
    const action = onAddToCart || addToCart; // 기본값 대체
    action(productId, initialQuantity);
  };

  
  return (
    <div className={styles.productCardContainer}>
      <div className={styles.mainTitle}></div>
      <div className={styles.productCard}>
        <div className={styles.topRow}>
          <div
            className={`${cartPageStyles.customCheckbox} ${isChecked ? cartPageStyles.checked : ''}`}
            onClick={onCheckToggle}
            role="checkbox"
            aria-checked={isChecked}
          >
            {isChecked && <span className={cartPageStyles.checkmark}>✓</span>}
          </div>

          <div className={styles.imageWrapper}>
            <img src={process.env.REACT_APP_API_BASE_URL + productImage} alt={name} />
          </div>
          <div className={styles.detailsWrapper}>
            <span className={styles.brandLabel}>
              {seller?.name || "브랜드명"}
            </span>
            <label className={styles.nameLabel}>{name}</label>
            {discountText && <span className={styles.discountTag}>{discountText}</span>}
          </div>
          {onRemove && (
            <button
              className={styles.closeButton}
              aria-label="Remove item"
              onClick={onRemove}
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.optionsDropdown}>
          <label className={styles.optionsLabel}>
            {options?.size
              ? `${options.size} / 재고 ${options.stockQuantity}개 / +${options.additionalPrice}원`
              : '옵션 없음'}
          </label>          
          <span className={styles.dropdownArrow}>⌄</span>
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.quantityControl}>
            <button
              className={`${styles.quantityButton} ${styles.minus}`}
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              disabled={initialQuantity <= 1}
            >
              -
            </button>
            <label className={styles.quantityDisplay} aria-live="polite">{initialQuantity}</label>
            <button
              className={`${styles.quantityButton} ${styles.plus}`}
              onClick={handleIncrease}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <div className={styles.priceInfo}>
            {originalPrice && (
              <label className={styles.originalPriceLabel}>
                {originalPrice}{currency}
              </label>
            )}
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
