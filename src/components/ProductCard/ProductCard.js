// src/components/ProductCard/ProductCard.jsx
import React from 'react';
import styles from './ProductCard.module.css';
import { Link } from 'react-router-dom';

const formatCount = (count) => {
  if (count >= 10000) {
    return (count / 10000).toFixed(1) + '만';
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + '천';
  }
  return count;
};

const ProductCard = ({ product }) => {
  if (!product) return null;

  // 1. 백엔드 API 기본 URL 가져오기
  const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || ''; // 환경 변수에서 값 로드, 없으면 빈 문자열

  // 2. 완전한 이미지 URL 생성
  let fullImageUrl = '/images/placeholder.png'; // 기본 플레이스홀더 이미지
  if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
    const imagePath = product.images[0].imageUrl; // 예: "/uploads/images/products/2/1.png"
    
    // imagePath가 이미 절대 URL(http로 시작)인지 확인
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      fullImageUrl = imagePath; // 이미 절대 URL이면 그대로 사용
    } else if (apiBaseUrl && imagePath.startsWith('/')) { 
      // apiBaseUrl이 있고, imagePath가 슬래시로 시작하는 상대 경로이면 조합
      fullImageUrl = `${apiBaseUrl}${imagePath}`; // 예: "http://localhost:8080/uploads/images/products/2/1.png"
    } else if (apiBaseUrl) {
      // imagePath가 슬래시로 시작하지 않는 경우 (예: "uploads/...") - 드문 경우지만 대비
      fullImageUrl = `${apiBaseUrl}/${imagePath}`;
    }
    // apiBaseUrl이 없는 경우, imagePath가 상대 경로이면 그대로 사용 (public 폴더 내 이미지일 경우)
    // 이 시나리오에서는 백엔드 이미지를 로드하는 것이 목적이므로, apiBaseUrl이 필수적입니다.
  }
  
  // console.log('Final Image URL:', fullImageUrl); // 디버깅용

  // 할인율 계산 (DTO에 원래 가격(originalPrice) 필드가 있다는 가정 하에)
  // let discountRate = 0;
  // if (product.originalPrice && product.originalPrice > product.price) {
  //   discountRate = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  // }

  return (
    <div className={styles.card}>
      <Link to={`/products/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageContainer}>
          <img src={fullImageUrl} alt={product.name} className={styles.productImage} />
          <button className={styles.likeButton} aria-label="좋아요">
            <svg viewBox="0 0 20 20" fill="currentColor" className={styles.heartIcon}><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd"></path></svg>
          </button>
        </div>
      </Link>
      <div className={styles.info}>
        <div className={styles.brandName}>{product.seller?.name || '브랜드 없음'}</div>
        <Link to={`/products/${product.id}`} className={styles.productNameLink}>
          <div className={styles.productName}>{product.name}</div>
        </Link>
        <div className={styles.priceContainer}>
          {/* {discountRate > 0 && <span className={styles.discountRate}>{discountRate}%</span>} */}
          <span className={styles.finalPrice}>{product.price?.toLocaleString()}원</span>
          {/* {product.originalPrice && product.originalPrice > product.price && 
            <span className={styles.originalPrice}>{product.originalPrice.toLocaleString()}원</span>
          } */}
        </div>
        <div className={styles.stats}>
          <span className={styles.statItem}>
            ♥ {formatCount(product.interestCount || 0)}
          </span>
          <span className={styles.statItem}>
            ★ {(product.averageRating || 0).toFixed(1)} ({formatCount(product.reviewCount || 0)})
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;