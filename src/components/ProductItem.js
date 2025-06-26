// src/components/ProductItem/ProductItem.js (또는 ProductItem.js의 실제 경로)
import React from 'react';
import styles from '../styles/ProductItem.module.css'; // 실제 ProductItem.module.css 경로

const ProductItem = ({
  productImage = "https://via.placeholder.com/100x100.png?text=Product",
  brand = "브랜드명",
  name = "상품명",
  discountText,
  options = "옵션 정보",
  initialQuantity = 1,
  originalPrice,
  finalPrice,
  currency = "원",
  isChecked, // 부모로부터 전달받는 체크 상태
  onQuantityChange, // (newQuantity) => void
  onCheckToggle,    // () => void
  onRemove,         // () => void (새로 추가)
}) => {
  // ProductItem 내부의 quantity 상태는 이제 initialQuantity prop으로 초기화되고,
  // 변경 시 onQuantityChange를 통해 부모에게 알립니다.
  // 부모가 quantity 상태를 직접 관리하므로, ProductItem 내부에는 quantity state가 필요 없을 수 있습니다.
  // 또는, 내부 상태를 가지되 변경 시 부모에게 알리는 방식으로 유지할 수도 있습니다.
  // 여기서는 부모가 initialQuantity를 제공한다고 가정합니다.

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

  return (
    <div className={styles.productCardContainer}> {/* ProductItem을 감싸는 div 추가 */}
      <div className={styles.mainTitle}></div> {/* ProductItem 내에서는 이 부분은 제거하거나, 그룹명을 받아서 표시할 수도 있지만, 그룹명은 ShoppingCartPage에서 처리 */}
      <div className={styles.productCard}>
        <div className={styles.topRow}>
          <div
            className={styles.checkboxWrapper}
            onClick={onCheckToggle} // 부모의 함수 직접 호출
            role="checkbox"
            aria-checked={isChecked}
          >
            {isChecked && <span className={styles.checkmark}>✓</span>}
          </div>
          <div className={styles.imageWrapper}>
            <img src={process.env.REACT_APP_API_BASE_URL + productImage} alt={name} />
          </div>
          <div className={styles.detailsWrapper}>
            <label className={styles.brandLabel}>{brand}</label>
            <label className={styles.nameLabel}>{name}</label>
            {discountText && <span className={styles.discountTag}>{discountText}</span>}
          </div>
          {onRemove && ( /* onRemove prop이 있을 때만 X 버튼 표시 */
            <button
              className={styles.closeButton}
              aria-label="Remove item"
              onClick={onRemove} // 삭제 함수 호출
            >
              ✕
            </button>
          )}
        </div>

        <div className={styles.optionsDropdown}>
          <label className={styles.optionsLabel}>{options}</label>
          <span className={styles.dropdownArrow}>⌄</span>
        </div>

        <div className={styles.controlsRow}>
          <div className={styles.quantityControl}>
            <button
              className={`${styles.quantityButton} ${styles.minus}`}
              onClick={handleDecrease}
              aria-label="Decrease quantity"
              disabled={initialQuantity <= 1} // 1개 이하로 못 줄이게
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