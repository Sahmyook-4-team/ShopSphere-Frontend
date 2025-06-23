import React from 'react';
import styles from '../../styles/ProductHeader.module.css';

function ProductHeader({
  brandLogoText,
  brandName,
  likes,
  breadcrumbs,
  productName,
  rating,
  reviews,
  price,
  HeartIcon,
  StarIcon
}) {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.topRow}>
        <div className={styles.brandInfo}>
          <div className={styles.brandLogoCircle}>
            <span className={styles.brandLogoText}>{brandLogoText}</span>
          </div>
          <span className={styles.brandName}>{brandName}</span>
        </div>
        <button className={styles.likeButton}>
          <HeartIcon className={styles.heartIcon} /> {likes}
        </button>
      </div>

      <p className={styles.breadcrumbs}>{breadcrumbs}</p>
      <h1 className={styles.productName}>{productName}</h1>

      <div className={styles.ratingInfo}>
        <StarIcon className={styles.starIcon} />
        <span className={styles.ratingValue}>{rating}</span>
        <a href="#reviews" className={styles.reviewLink}>
          후기 {reviews}개
        </a>
      </div>

      <p className={styles.price}>{price.toLocaleString()}원</p>
    </div>
  );
}

export default ProductHeader;