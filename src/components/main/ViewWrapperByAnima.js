// src/components/Middle/ViewWrapperByAnima.js (경로는 예시)
import React from "react"; // React.memo 사용을 위해 React import
import { Link } from "react-router-dom";
import styles from "../../styles/ViewWrapperByAnima.module.css"; // 경로 확인 필요

const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return ""; // 기본 이미지 경로 또는 빈 문자열
  }
  // 절대 경로인 경우 그대로 반환
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  // 상대 경로인 경우 REACT_APP_API_BASE_URL 사용
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  if (!baseUrl) {
    console.warn(
      "REACT_APP_API_BASE_URL is not defined. Relative image paths may not work."
    );
    return imageUrl; // 기본 URL 없으면 원본 경로 반환 (에러 방지)
  }
  // URL 결합 시 슬래시 중복 방지
  const cleanedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const cleanedImageUrl = imageUrl.startsWith('/') ? imageUrl.slice(1) : imageUrl;
  return `${cleanedBaseUrl}/${cleanedImageUrl}`;
};

// 컴포넌트 로직을 별도 함수로 분리
const ViewWrapperByAnimaComponent = ({ product }) => {
  if (!product) {
    return null; // product가 없으면 아무것도 렌더링하지 않음
  }

  // 데이터 추출 (기본값 설정으로 안정성 강화)
  const brandName = product.seller?.name || "브랜드 정보 없음";
  const productName = product.name || "상품명 없음";
  const price = product.price != null ? product.price.toLocaleString() + "원" : "가격 정보 없음"; // 원 단위 추가 및 null 체크
  const reviewCount = product.reviewCount || 0;
  
  // 대표 이미지 선택 (images 배열의 첫 번째 항목 또는 Product 엔티티의 imageUrl 필드)
  let mainImageRelativeUrl = null;
  if (product.images && product.images.length > 0 && product.images[0].imageUrl) {
    mainImageRelativeUrl = product.images[0].imageUrl;
  } else if (product.imageUrl) { // ProductDTO.Response에 imageUrl 필드가 있다면 (백엔드 Product 엔티티 imageUrl 필드 사용 시)
    mainImageRelativeUrl = product.imageUrl;
  }

  const fullMainImageUrl = getFullImageUrl(mainImageRelativeUrl);
  const productDetailPath = `/product/${product.id}`;

  return (
    <Link to={productDetailPath} className={styles.productLinkWrapper}>
      <div className={styles.viewWrapperByAnima}>
        <div className={styles.element}>
          {fullMainImageUrl ? (
            <img
              src={fullMainImageUrl}
              alt={`${brandName} - ${productName}`}
              className={styles.productImage}
              loading="lazy" // 간단한 이미지 지연 로딩 (스크롤 시 보이는 경우에만 효과)
            />
          ) : (
            // 이미지가 없을 때 보여줄 placeholder
            <div className={`${styles.productImage} ${styles.placeholderImage}`}>
              <span>No Image</span>
            </div>
          )}
          <div className={styles.textWrapper5}>{brandName}</div>
          <div className={styles.textWrapper6}>{productName}</div>
          <div className={styles.textWrapper7}>{price}</div>
          <div className={styles.div2}>
            <div className={styles.textWrapper8}>리뷰</div>
            <div className={styles.textWrapper9}>{reviewCount}</div>
          </div>
        </div>
      </div>
    </Link>
  );
};

// React.memo로 감싸서 export
export const ViewWrapperByAnima = React.memo(ViewWrapperByAnimaComponent);

// export default React.memo(ViewWrapperByAnimaComponent); // default export 시