import React from "react";
import { Link } from "react-router-dom"; // react-router-dom의 Link import
import styles from "../../styles/ViewWrapperByAnima.module.css";

const getFullImageUrl = (imageUrl) => {
  if (!imageUrl) {
    return "";
  }
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  const baseUrl = process.env.REACT_APP_API_BASE_URL;
  if (!baseUrl) {
    console.warn(
      "REACT_APP_API_BASE_URL is not defined. Relative image paths may not work."
    );
    return imageUrl;
  }
  const separator = imageUrl.startsWith('/') ? '' : '/';
  const cleanedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanedBaseUrl}${separator}${imageUrl}`;
};

export const ViewWrapperByAnima = ({ product }) => {
  if (!product) {
    return null;
  }

  const brandName = product.seller?.name || "브랜드 없음";
  const productName = product.name || "상품명 없음";
  const price = product.price?.toLocaleString() || "가격 정보 없음";
  const reviewCount = product.reviewCount || 0;
  const mainImageRelativeUrl =
    product.images && product.images.length > 0
      ? product.images[0].imageUrl
      : null;
  const fullMainImageUrl = getFullImageUrl(mainImageRelativeUrl);

  // 상품 상세 페이지로 이동할 경로 (productId를 사용)
  const productDetailPath = `/product/${product.id}`;

  return (
    // Link 컴포넌트로 전체 카드를 감싸서 클릭 시 페이지 이동
    <Link to={productDetailPath} className={styles.productLinkWrapper}> {/* Link로 감싸고 스타일용 클래스 추가 */}
      <div className={styles.viewWrapperByAnima}> {/* 기존 스타일 유지 */}
        <div className={styles.element}>
          {fullMainImageUrl ? (
            <img
              src={fullMainImageUrl}
              alt={productName}
              className={styles.productImage}
            />
          ) : (
            <div className={styles.view2} />
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

export default ViewWrapperByAnima;