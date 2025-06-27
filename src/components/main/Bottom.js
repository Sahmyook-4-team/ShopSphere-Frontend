import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import heart from "../../assets/Bottom/heart.svg";
import styles from "../../styles/Bottom.module.css";

export const Bottom = ({ productIdFromProps }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // props로 productId가 전달되지 않으면 기본값 1 사용
  const productIdToFetch = productIdFromProps || 1;

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productIdToFetch}`);
        setProduct(response.data);
      } catch (e) {
        setError(e);
        console.error("상품 데이터를 가져오는 중 오류 발생:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productIdToFetch]); // productIdToFetch가 변경될 때마다 재실행

  const handleProductClick = () => {
    if (product && product.id) {
      navigate(`/product/${product.id}`);
    } else {
      console.warn("상품 ID가 없어 상세 페이지로 이동할 수 없습니다. product:", product);
    }
  };

  if (loading) {
    return <div className={styles.box}>상품 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.box}>오류: {error.message}</div>;
  }

  if (!product) {
    return <div className={styles.box}>상품 정보를 찾을 수 없습니다.</div>;
  }

  // --- 👇 대표 이미지 URL을 찾는 로직 ---
  let representativeImageUrl = null;
  if (product.images && product.images.length > 0) {
    const representativeImageObject = product.images.find(img => img.displayOrder === 0);

    if (representativeImageObject) {
      representativeImageUrl = representativeImageObject.imageUrl;
    } else {
      // displayOrder가 0인 이미지가 없다면, 배열의 첫 번째 이미지를 사용
      representativeImageUrl = product.images[0].imageUrl;
    }
  }

  //console.log("대표 이미지 URL:", representativeImageUrl);
  // --- 👆 대표 이미지 URL을 찾는 로직 추가 ---

  const originalPrice = product.price;
  const discountedPrice = originalPrice * 0.4; // 60% 할인 가정 (실제 할인율로 변경 필요)

  return (
    <div className={styles.box} onClick={handleProductClick} style={{ cursor: 'pointer' }}>
      <div className={styles.element}>
        <div className={styles.overlap}>
          <div className={styles["view-2"]}>
            <div className={styles["overlap-group-wrapper"]}>
              <div className={styles["overlap-group"]}>
                {/* --- 👇 이미지 렌더링 부분 수정: API_BASE_URL 사용 --- */}
                {representativeImageUrl ? (
                  <img
                    className={styles.productImage}
                    alt={product.name}
                    src={`${process.env.REACT_APP_API_BASE_URL}${representativeImageUrl}`} // API_BASE_URL과 상대 경로 조합
                  />
                ) : (
                  // 이미지가 없을 경우 보여줄 플레이스홀더
                  <div className={styles.noImagePlaceholder}>이미지 준비 중</div>
                )}
                {/* --- 👆 이미지 렌더링 부분 수정 --- */}
                <div className={styles["div-wrapper"]}>
                  <div className={styles["text-wrapper-4"]}>쇼핑몰 추천3</div>
                </div>
                <img className={styles.heart} alt="Heart" src={heart} />
              </div>
            </div>

            <div className={styles["view-3"]}>
              <div className={styles["text-wrapper-5"]}>
                관심 {product.interestCount || 0}+ 리뷰 {product.reviewCount || 0}+
              </div>
              <div className={styles["text-wrapper-6"]}>
                {product.seller ? product.seller.name : "히코튼"}
              </div>
              <div className={styles["text-wrapper-8"]}>60%</div>
              <p className={styles.p}>
                {product.name}
              </p>
            </div>
          </div>

          <div className={styles["view-4"]}>
            <div className={styles["view-6"]}>
              <div className={styles["text-wrapper-11"]}>
                {discountedPrice.toLocaleString()}원
              </div>
              <div className={styles["original-price"]}>
                <del>{originalPrice.toLocaleString()}원</del>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bottom;