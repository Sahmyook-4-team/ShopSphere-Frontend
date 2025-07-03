import React from 'react';
import styles from './OrderItemCard.module.css';
import { useNavigate } from 'react-router-dom';


// ProductImageDTO에서 대표 이미지를 가져오는 헬퍼 함수
const getRepresentativeImageUrl = (images) => {
  // images 배열이 없거나 비어있으면 기본 이미지 URL 반환
  if (!images || images.length === 0) {
    return 'https://via.placeholder.com/100x100.png?text=No+Image';
  }
  // displayOrder가 0인 이미지를 찾거나, 없으면 첫 번째 이미지를 대표 이미지로 사용
  const representative = images.find(img => img.displayOrder === 0) || images[0];
  return representative.imageUrl;
};

const OrderItemCard = ({ item, orderStatus }) => {
  const navigate = useNavigate();

  if (!item || !item.product) return null;

  const { product, option, id: orderItemId } = item;

  // 이제 이 함수는 파일 내에 정의되어 있으므로 정상적으로 호출됩니다.
  const representativeImage = getRepresentativeImageUrl(product.images);
  
  let displayName = product.name;
  if (option && option.size) {
    displayName = `${product.name} (${option.size})`;
  }

  const displayStatusText = orderStatus === "COMPLETED" ? "배송 완료" : orderStatus;

  const handleWriteReviewClick = () => {
    if (product && product.id) {
      navigate(`/write-review/${product.id}`);
    } else {
      console.error("리뷰를 작성할 상품 ID가 없습니다.");
    }
  };

  return (
    <div className={styles.card}>
      <img src={`${process.env.REACT_APP_API_BASE_URL}${representativeImage}`} alt={displayName} className={styles.productImage} />
      <div className={styles.productDetails}>
        <div className={styles.status}>{displayStatusText}</div>
        <div className={styles.name}>{displayName}</div>
        <div className={styles.pointInfo}>
          <span className={styles.pointSymbol}>P</span> 최대 1,500P 적립
        </div>
        <div className={styles.orderItemId}>
          주문항목ID: {orderItemId}
        </div>
      </div>
      {orderStatus === "COMPLETED" && (
        <button 
          className={styles.reviewButton} 
          onClick={handleWriteReviewClick}
        >
          리뷰 쓰기
        </button>
      )}
    </div>
  );
};

export default OrderItemCard;