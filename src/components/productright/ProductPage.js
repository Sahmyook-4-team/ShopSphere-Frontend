// src/components/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../styles/ProductPage.module.css';

import ProductImageGallery from '../productleft/ProductImageGallery';
import ProductHeader from './ProductHeader';
import PromotionBanner from './PromotionBanner';
import PointsInfo from './PointsInfo';
import OptionsSelector from './OptionsSelector';
import TotalSummary from './TotalSummary';
import ActionBar from './ActionBar';
import Header from '../Header';

import { FaHeart, FaStar, FaChevronRight } from 'react-icons/fa';

function ProductPage() {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  // ✅ 수량 변경 핸들러
  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    if (productData?.price) {
      setTotalPrice(newQuantity * productData.price);
    }
  };

  // ✅ 장바구니 추가 함수
  const handleAddToCart = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          productId: productData.id,
          quantity: quantity,
        }),
      });

      if (!response.ok) {
        throw new Error('장바구니 추가 실패');
      }

      alert('장바구니에 상품이 추가되었습니다!');
      // navigate('/cart'); ← 필요 시
    } catch (error) {
      console.error(error);
      alert('장바구니 추가 중 오류가 발생했습니다.');
    }
  };

  // ✅ 상품 데이터 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (!response.ok) throw new Error('상품 데이터를 불러올 수 없습니다.');
        const data = await response.json();
        setProductData(data);
        setTotalPrice(data.price * quantity);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, quantity]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류 발생: {error}</div>;

  return (
    <>
      <Header />
      <div className={styles.container}>
        {/* 좌측 패널: 이미지 */}
        <div className={styles.leftPanel}>
          <ProductImageGallery images={productData.images} />
        </div>

        {/* 우측 패널: 정보 */}
        <div className={styles.rightPanel}>
          <ProductHeader
            brandLogoText={productData.seller ? productData.seller.name.substring(0, 2).toUpperCase() : "로고"}
            brandName={productData.seller ? productData.seller.name : "브랜드 정보 없음"}
            likes={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}천` : "0"}
            breadcrumbs={`홈 > ${productData.category ? productData.category.name : '카테고리'} > ${productData.name}`}
            productName={productData.name}
            rating={productData.averageRating || 0}
            reviews={productData.reviewCount || 0}
            price={productData.price}
            HeartIcon={FaHeart}
            StarIcon={FaStar}
          />

          <PromotionBanner
            text="첫 구매 시 20% 할인 쿠폰 즉시 발급!"
            ArrowRightIcon={FaChevronRight}
          />

          <PointsInfo
            maxPoints={productData.price ? Math.floor(productData.price * 0.02) : 2050}
            purchasePoints={productData.price ? Math.floor(productData.price * 0.01) : 50}
            reviewPoints={2000}
          />

          <OptionsSelector
            optionName={
              productData.options && productData.options.length > 0
                ? productData.options[0].size || "기본 옵션"
                : "수량"
            }
            price={productData.price}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
          />

          <TotalSummary
            quantity={quantity}
            totalPrice={totalPrice}
          />

          <ActionBar
            wishlistCount={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}천` : "0"}
            HeartIcon={FaHeart}
            productId={productData.id}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>
    </>
  );
}

export default ProductPage;
