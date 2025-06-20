// src/components/ProductPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../../styles/ProductPage.module.css'; // ProductPage 전용 CSS Module

// 하위 컴포넌트 import
import ProductImageGallery from '../productleft/ProductImageGallery'; // 이미지 갤러리 컴포넌트
import ProductHeader from './ProductHeader';
import PromotionBanner from './PromotionBanner';
import PointsInfo from './PointsInfo';
import OptionsSelector from './OptionsSelector';
import TotalSummary from './TotalSummary';
import ActionBar from './ActionBar';
import Header from '../Header';

// 아이콘 (react-icons 예시)
import { FaHeart, FaStar, FaChevronRight } from 'react-icons/fa';

function ProductPage() {
  const { productId } = useParams(); // URL에서 productId 파라미터 가져오기
  const [productData, setProductData] = useState(null); // API로부터 받을 상품 데이터 상태
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [quantity, setQuantity] = useState(1); // 기본 수량 1
  const [totalPrice, setTotalPrice] = useState(0); // 초기 총 가격

  // 상품 상세 정보 API 호출
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true); // 데이터 가져오기 시작 시 로딩 상태 true
        setError(null); // 이전 에러 상태 초기화

        // 실제 API 엔드포인트 (백엔드 ProductController의 getProductById와 일치)
        const response = await fetch(`http://localhost:8080/api/products/${productId}`);
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP 오류! 상태: ${response.status}` }));
          throw new Error(errorData.message || `HTTP 오류! 상태: ${response.status}`);
        }
        const data = await response.json(); // ProductDTO.Response 형식의 데이터

        setProductData(data);
        // 상품 데이터 로드 후, 초기 수량(1)에 대한 가격 설정
        if (data && data.price) {
          setTotalPrice(data.price * quantity); // quantity는 초기값 1
        }

      } catch (e) {
        setError(e);
        console.error("상품 상세 정보를 가져오는 중 오류 발생:", e);
      } finally {
        setLoading(false); // 데이터 가져오기 완료 시 로딩 상태 false
      }
    };

    if (productId) { // productId가 유효할 때만 API 호출
      fetchProductDetails();
    }
  }, [productId]); // productId가 변경될 때마다 (다른 상품 페이지로 이동 시) 다시 호출

  // 수량이 변경될 때마다 총 가격 업데이트
  useEffect(() => {
    if (productData && productData.price) { // productData와 price가 유효할 때만 계산
      setTotalPrice(productData.price * quantity);
    }
  }, [quantity, productData]); // quantity 또는 productData가 변경될 때 실행

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) { // 최소 수량은 1
      setQuantity(newQuantity);
    }
  };

  // 로딩 중 UI
  if (loading) {
    return <div className={styles.productPageContainer}><p className={styles.loadingMessage}>상품 정보를 불러오는 중...</p></div>;
  }

  // 에러 발생 시 UI
  if (error) {
    return <div className={styles.productPageContainer}><p className={styles.errorMessage}>오류: {error.message}</p></div>;
  }

  // 상품 데이터가 없을 경우 (로딩 완료 후에도 productData가 null인 경우)
  if (!productData) {
    return <div className={styles.productPageContainer}><p className={styles.infoMessage}>상품 정보를 찾을 수 없습니다.</p></div>;
  }

  // productData가 성공적으로 로드된 후의 렌더링
  // ProductDTO.Response의 필드명에 맞춰서 props를 전달해야 합니다.
  // (예: brandName은 productData.seller.name, likes는 productData.interestCount 등)
  return (
    <>
    <Header/>
    <div className={styles.productPageContainer}>
      {/* 좌측 패널: 상품 이미지 갤러리 */}
      <div className={styles.leftPanel}>
        <ProductImageGallery
          imagesData={productData.images || []} // API로 받은 이미지 목록 전달 (없으면 빈 배열)
          productName={productData.name}
          productDescription={productData.description} // 👈 [추가] 상품 설명 전달
        />
      </div>

      {/* 우측 패널: 상품 정보 및 액션 */}
      <div className={styles.rightPanel}>
        <ProductHeader
          brandLogoText={productData.seller ? productData.seller.name.substring(0, 2).toUpperCase() : "로고"} // 예시: 판매자 이름 앞 두글자 대문자
          brandName={productData.seller ? productData.seller.name : "브랜드 정보 없음"}
          likes={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}천` : "0"} // 찜 수 (천 단위)
          breadcrumbs={ // breadcrumbs는 프론트에서 동적으로 생성하거나, API에서 더 구조화된 형태로 받을 수 있음
            `홈 > ${productData.category ? productData.category.name : '카테고리'} > ${productData.name}`
          }
          productName={productData.name}
          rating={productData.averageRating || 0} // 평균 평점 (없으면 0)
          reviews={productData.reviewCount || 0} // 리뷰 수 (없으면 0)
          price={productData.price} // 상품 원가
          HeartIcon={FaHeart}
          StarIcon={FaStar}
        />

        <PromotionBanner
          text="첫 구매 시 20% 할인 쿠폰 즉시 발급!" // 이 텍스트도 API 또는 다른 설정에서 올 수 있음
          ArrowRightIcon={FaChevronRight}
        />

        <PointsInfo
          // 포인트 정보도 실제로는 상품별, 사용자별로 달라질 수 있으므로 API에서 받아오는 것이 좋음
          maxPoints={productData.price ? Math.floor(productData.price * 0.02) : 2050} // 예시: 가격의 2%
          purchasePoints={productData.price ? Math.floor(productData.price * 0.01) : 50} // 예시: 가격의 1%
          reviewPoints={2000} // 예시: 고정 리뷰 포인트
        />

        <OptionsSelector
          // 옵션 정보는 productData.options (List<ProductOptionDTO.Response>) 에서 가져와야 함
          // 현재는 단일 수량 옵션만 있다고 가정
          optionName={
            productData.options && productData.options.length > 0
              ? productData.options[0].size || "기본 옵션" // 예시: 첫번째 옵션의 size 또는 기본값
              : "수량" // 옵션이 없을 경우
          }
          price={productData.price} // 단가 전달
          quantity={quantity}
          onQuantityChange={handleQuantityChange} // 수량 변경 함수 전달
        />

        <TotalSummary
          quantity={quantity}
          totalPrice={totalPrice}
        />

        <ActionBar
          wishlistCount={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}천` : "0"} // 찜 수 (천 단위)
          HeartIcon={FaHeart}
          // 여기에 장바구니 담기, 바로 구매 등의 함수를 props로 전달할 수 있습니다.
          // 예: onAddToCart={() => console.log('장바구니 담기 클릭')}
          //     onBuyNow={() => console.log('바로 구매 클릭')}
          productId={productData.id} // 장바구니/구매 시 상품 ID 필요
        />
      </div>
    </div>
    </>
  );
}

export default ProductPage;