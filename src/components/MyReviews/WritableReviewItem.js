import React from 'react';
import styles from './WritableReviewItem.module.css';
import { useNavigate } from 'react-router-dom';

const getRepresentativeImageUrl = (images) => {
  if (!images || images.length === 0) return 'https://via.placeholder.com/70x70.png?text=No+Image';
  const mainImage = images.find(img => img.displayOrder === 0) || images[0];
  return mainImage.imageUrl;
};

const WritableReviewItem = ({ orderItem, orderDate }) => {
  const navigate = useNavigate();
  console.log(orderItem);

  if (!orderItem || !orderItem.product) {
    return null;
  }

  const { product, option } = orderItem;
  const representativeImage = getRepresentativeImageUrl(product.images);
  let displayName = product.name;
  if (option && option.size) {
    displayName += ` (${option.size})`;
  }

  const handleWriteReview = () => {
    navigate(`/write-review/${product.id}`);
  };

  // 날짜 포맷팅 (간단 예시)
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '');
  };


  return (
    <div className={styles.itemContainer}>
      <p className={styles.orderDate}>주문일 {formatDate(orderDate)}</p>
      <div className={styles.content}>
        <img src={`${process.env.REACT_APP_API_BASE_URL}${representativeImage}`} alt={displayName} className={styles.productImage} />
        <div className={styles.productInfo}>
          <p className={styles.brandName}>{product.seller?.name || '브랜드 정보 없음'}</p> {/* ProductDTO.Response에 seller 정보가 있다고 가정 */}
          <p className={styles.productName}>{displayName}</p>
          {option && <p className={styles.productOption}>{/* 필요시 추가 옵션 정보 표시 */}</p>}
        </div>
        <button onClick={handleWriteReview} className={styles.writeButton}>
          리뷰 작성
        </button>
      </div>
    </div>
  );
};

export default WritableReviewItem;