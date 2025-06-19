// src/components/Bottom.js

import React, { useState, useEffect } from "react";
import heart from "../../assets/Bottom/heart.svg";
import vector from "../../assets/Bottom/vector.svg";
import styles from "../../styles/Bottom.module.css";

export const Bottom = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/products/1"); // 특정 상품 ID
        if (!response.ok) {
          throw new Error(`HTTP 오류! 상태: ${response.status}`);
        }
        const data = await response.json();
        setProduct(data);
      } catch (e) {
        setError(e);
        console.error("상품 데이터를 가져오는 중 오류 발생:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, []);

  if (loading) {
    return <div className={styles.box}>상품 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.box}>오류: {error.message}</div>;
  }

  if (!product) {
    return <div className={styles.box}>상품 정보를 찾을 수 없습니다.</div>;
  }

  const originalPrice = product.price;
  const discountedPrice = originalPrice * 0.4; // 60% 할인 가정

  return (
    <div className={styles.box}>
      <div className={styles.element}>
        <div className={styles.overlap}>
          <div className={styles["view-2"]}>
            <div className={styles["overlap-group-wrapper"]}>
              <div className={styles["overlap-group"]}>
                {/* 🌟 여기에 상품 메인 이미지 태그를 이동합니다! */}
                {product.imageUrl && (
                  <img
                    className={styles.productImage}
                    alt={product.name}
                    src={`http://localhost:8080${product.imageUrl}`}
                  />
                )}
                {/* '스타일리스트 추천' 띠 */}
                <div className={styles["div-wrapper"]}>
                  <div className={styles["text-wrapper-4"]}>스타일리스트 추천</div>
                </div>
                {/* 하트 아이콘 */}
                <img className={styles.heart} alt="Heart" src={heart} />
              </div> {/* <-- .overlap-group 끝 */}
            </div> {/* <-- .overlap-group-wrapper 끝 */}

            {/* 🌟 여기 있던 이미지 태그는 제거합니다. */}
            {/* {product.imageUrl && (
                <img
                    className={styles.productImage}
                    alt={product.name}
                    src={`http://localhost:8080${product.imageUrl}`}
                />
            )} */}

            <div className={styles["view-3"]}>
              {/* 리뷰 수와 관심 수 표시 */}
              <div className={styles["text-wrapper-5"]}>
                관심 {product.interestCount || 0}+ 리뷰 {product.reviewCount || 0}+
              </div>
              {/* 판매자(브랜드) 이름 */}
              <div className={styles["text-wrapper-6"]}>
                {product.seller ? product.seller.name : "히코튼"}
              </div>
              <div className={styles["text-wrapper-8"]}>60%</div> {/* 할인율 */}
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