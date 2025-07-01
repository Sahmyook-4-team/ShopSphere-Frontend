// src/components/ProductPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { loadTossPayments } from '@tosspayments/payment-sdk'; // 토스페이먼츠 SDK 로더 추가
import styles from '../../styles/ProductPage.module.css';

// 하위 컴포넌트 import
import ProductImageGallery from '../productleft/ProductImageGallery';
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
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  // 수량 변경 핸들러
  const handleQuantityChange = useCallback((newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  }, []);

  // 장바구니 추가 함수 (기존 코드 유지)
  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/cart/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId: productData.id,
          quantity: quantity,
        }),
      });
      if (!response.ok) {
        throw new Error('Failed to add item to cart. Please try again.');
      }
      alert('Item added to cart successfully!');
    } catch (cartError) {
      console.error("Error adding to cart:", cartError);
      alert(`Error adding to cart: ${cartError.message}`);
    }
  };

  // ====================================================================
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ "구매하기" 로직 추가 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // ====================================================================
  const handleBuyNow = async () => {
    if (!productData) {
      alert("상품 정보를 불러오는 중입니다.");
      return;
    }

    // 1. 백엔드에 '결제 대기' 주문 생성 요청
    try {
      const createOrderResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          // '바로 구매'는 현재 보고 있는 상품 하나만 주문
          items: [{
            productId: productData.id,
            quantity: quantity,
            // TODO: 옵션이 있는 경우 optionId도 전달해야 합니다.
            // optionId: selectedOptionId, 
          }],
          // TODO: 실제 배송지 정보는 사용자 정보나 별도 입력 폼에서 가져와야 합니다.
          shippingAddress: productData.seller?.address || "기본 배송지를 입력해주세요.",
        }),
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        throw new Error(errorData.message || '주문 생성에 실패했습니다. 재고를 확인해주세요.');
      }

      const createdOrder = await createOrderResponse.json();

      // 2. 토스페이먼츠 결제창 호출
      const tossPayments = await loadTossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY);
      
      tossPayments.requestPayment('카드', { // 또는 다른 결제 수단
        amount: createdOrder.totalAmount,
        orderId: createdOrder.transactionId, // 백엔드에서 생성된 고유 ID
        orderName: productData.name + (createdOrder.items.length > 1 ? ` 외 ${createdOrder.items.length - 1}건` : ''),
        customerName: createdOrder.user.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      }).catch(function (error) {
        if (error.code === 'USER_CANCEL') {
          alert('결제를 취소했습니다.');
          // 참고: 사용자가 결제를 취소하면 백엔드에는 PENDING_PAYMENT 상태의 주문이 남아있게 됩니다.
          // 이를 주기적으로 삭제하는 스케줄링 로직을 백엔드에 구현할 수 있습니다.
        } else {
          alert(`결제 실패: ${error.message}`);
        }
      });

    } catch (error) {
      console.error("Buy now process failed:", error);
      alert(`구매 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  };
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ "구매하기" 로직 추가 ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲

  // 상품 상세 정보 및 리뷰 API 호출 (기존 코드 유지)
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      // ... (기존 API 호출 로직) ...
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);
        const productResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productId}`);
        if (!productResponse.ok) {
          const errorData = await productResponse.json().catch(() => ({ message: `HTTP error! Status: ${productResponse.status}` }));
          throw new Error(errorData.message || `HTTP error! Status: ${productResponse.status}`);
        }
        const productDataResult = await productResponse.json();
        setProductData(productDataResult);
        setTotalPrice(productDataResult.price * quantity);
      } catch (productFetchError) {
        setError(productFetchError);
        console.error("Error fetching product details:", productFetchError);
      } finally {
        setLoading(false);
      }
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const reviewResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/reviews/product/${productId}`);
        if (!reviewResponse.ok) {
          const errorData = await reviewResponse.json().catch(() => ({ message: `Failed to fetch reviews. (Status: ${reviewResponse.status})` }));
          throw new Error(errorData.message || `Failed to fetch reviews. (Status: ${reviewResponse.status})`);
        }
        const reviewData = await reviewResponse.json();
        setReviews(reviewData);
      } catch (reviewFetchError) {
        setReviewsError(reviewFetchError);
        console.error("Error fetching product reviews:", reviewFetchError);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [productId, quantity]);

  // Update total price when quantity or productData.price changes (기존 코드 유지)
  useEffect(() => {
    if (productData && productData.price) {
      setTotalPrice(productData.price * quantity);
    }
  }, [quantity, productData]);


  // 로딩, 에러, 데이터 없음 UI (기존 코드 유지)
  if (loading) return <div className={styles.productPageContainer}><p className={styles.loadingMessage}>Loading product information...</p></div>;
  if (error) return <div className={styles.productPageContainer}><p className={styles.errorMessage}>Error: {error.message}</p></div>;
  if (!productData) return <div className={styles.productPageContainer}><p className={styles.infoMessage}>Product information not found.</p></div>;

  // 렌더링 부분 (기존 코드 유지, ActionBar에 onBuyNow prop 추가)
  return (
    <>
      <Header />
      <div className={styles.productPageContainer}>
        {/* 좌측 패널 */}
        <div className={styles.leftPanel}>
          <ProductImageGallery
            imagesData={productData.images || []}
            productName={productData.name}
            productDescription={productData.description}
          />
        </div>

        {/* 우측 패널 */}
        <div className={styles.rightPanel}>
          <ProductHeader
            brandLogoText={productData.seller ? productData.seller.name.substring(0, 2).toUpperCase() : "LOGO"}
            brandName={productData.seller ? productData.seller.name : "No Brand Info"}
            likes={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}K` : "0"}
            breadcrumbs={`Home > ${productData.category ? productData.category.name : 'Category'} > ${productData.name}`}
            productName={productData.name}
            rating={productData.averageRating || 0}
            reviews={productData.reviewCount || 0}
            price={productData.price}
            HeartIcon={FaHeart}
            StarIcon={FaStar}
          />

          <PromotionBanner
            text="Get 20% off your first purchase with an instant coupon!"
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
                ? productData.options[0].size || "Default Option"
                : "Quantity"
            }
            price={productData.price}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
          />

          <TotalSummary
            quantity={quantity}
            totalPrice={totalPrice}
          />

          {/* ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ ActionBar에 onBuyNow prop 전달 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ */}
          <ActionBar
            wishlistCount={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}K` : "0"}
            HeartIcon={FaHeart}
            productId={productData.id}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
          {/* ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ */}
        </div>
      </div>

      {/* Product Reviews Section (기존 코드 유지) */}
      <div className={styles.productReviewsSection}>
        {/* ... (기존 리뷰 섹션 렌더링 로직) ... */}
        <h2>Product Reviews ({reviews.length > 0 ? reviews.length : '0'})</h2>
        {reviewsLoading && <p>Loading reviews...</p>}
        {reviewsError && <p className={styles.errorMessage}>Error loading reviews: {reviewsError.message}</p>}
        {!reviewsLoading && !reviewsError && reviews.length === 0 && (
          <p>No reviews written yet.</p>
        )}
        {!reviewsLoading && !reviewsError && reviews.length > 0 && (
          <ul className={styles.reviewList}>
            {reviews.map((review) => (
              <li key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewAuthorInfo}>
                  <span className={styles.reviewAuthorName}>
                    {review.user ? review.user.name : 'Anonymous User'}
                  </span>
                  <span className={styles.reviewDate}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className={styles.reviewRating}>
                  {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                </div>
                {review.reviewImageUrl && (
                  <img src={`${process.env.REACT_APP_API_BASE_URL}${review.reviewImageUrl}`} alt={`Review for ${productData.name}`} className={styles.reviewImage} />
                )}
                <p className={styles.reviewComment}>{review.comment}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

export default ProductPage;
