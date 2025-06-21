// OrderItemCard.jsx
import React from 'react';
import styles from './OrderItemCard.module.css';
import { useNavigate } from 'react-router-dom'; // ◀️ useNavigate import 추가

// ProductImageDTO에서 대표 이미지를 가져오는 헬퍼 함수 (이전과 동일)
const getRepresentativeImageUrl = (images) => {
  if (!images || images.length === 0) {
    return 'https://via.placeholder.com/100x100.png?text=No+Image';
  }
  const representative = images.find(img => img.displayOrder === 0) || images[0];
  return representative.imageUrl;
};

const OrderItemCard = ({ item, orderStatus }) => {
  const navigate = useNavigate(); // ◀️ useNavigate 훅 사용

  if (!item || !item.product) return null;

  const { product, option } = item;
  const representativeImage = getRepresentativeImageUrl(product.images);
  
  let displayName = product.name;
  if (option && option.size) {
    displayName = `${product.name} (${option.size})`;
  }

  const displayStatusText = orderStatus === "COMPLETED" ? "배송 완료" : orderStatus;

  // "리뷰 쓰기" 버튼 클릭 핸들러
  const handleWriteReviewClick = () => {
    // product.id는 ProductDTO.Response 내의 상품 ID
    if (product && product.id) {
      navigate(`/write-review/${product.id}`); // ◀️ 리뷰 작성 페이지로 이동
    } else {
      console.error("리뷰를 작성할 상품 ID가 없습니다.");
      // 사용자에게 알림 처리 등을 추가할 수 있음
    }
  };

  return (
    <div className={styles.card}>
      <img src={representativeImage} alt={displayName} className={styles.productImage} />
      <div className={styles.productDetails}>
        <div className={styles.status}>{displayStatusText}</div>
        <div className={styles.name}>{displayName}</div>
        <div className={styles.pointInfo}>
          <span className={styles.pointSymbol}>P</span> 최대 1,500P 적립
        </div>
      </div>
      {/* orderStatus가 "COMPLETED"일 때만 리뷰 쓰기 버튼을 보여주는 조건 추가 가능 */}
      {orderStatus === "COMPLETED" && (
        <button 
          className={styles.reviewButton} 
          onClick={handleWriteReviewClick} // ◀️ onClick 핸들러 연결
        >
          리뷰 쓰기
        </button>
      )}
    </div>
  );
};

export default OrderItemCard;