import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import axios from 'axios';
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
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState(null);

  const handleQuantityChange = useCallback((firstArg, secondArg) => {
    const isEvent = firstArg && typeof firstArg === 'object' && 'preventDefault' in firstArg;
    const newQuantity = isEvent ? secondArg : firstArg;
    
    if (isEvent) {
      firstArg.preventDefault();
    }
    
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  }, []);

  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/items`,
        { productId: productData.id, quantity: quantity },
        { withCredentials: true }
      );
      alert('상품을 장바구니에 담았습니다.');
    } catch (cartError) {
      console.error("Error adding to cart:", cartError);
      alert(`장바구니 추가 실패: ${cartError.response?.data?.message || cartError.message}`);
    }
  };

  const handleBuyNow = async () => {
    if (!productData) {
      alert("상품 정보를 불러오는 중입니다.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/orders`,
        {
          items: [{
            productId: productData.id,
            quantity: quantity,
          }],
          shippingAddress: productData.seller?.address || "기본 배송지를 입력해주세요.",
        },
        { withCredentials: true }
      );

      const createdOrder = response.data;

      const tossPayments = await loadTossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY);
      
      tossPayments.requestPayment('카드', {
        amount: createdOrder.totalAmount,
        orderId: createdOrder.transactionId,
        orderName: productData.name + (createdOrder.items.length > 1 ? ` 외 ${createdOrder.items.length - 1}건` : ''),
        customerName: createdOrder.user.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      }).catch(function (error) {
        if (error.code === 'USER_CANCEL') {
          alert('결제를 취소했습니다.');
        } else {
          alert(`결제 실패: ${error.message}`);
        }
      });
    } catch (error) {
      console.error("Buy now process failed:", error);
      alert(`구매 처리 중 오류가 발생했습니다: ${error.response?.data?.message || error.message}`);
    }
  };

  // ✅ 수정된 부분 1: 데이터 로딩을 위한 useEffect
  // 이 useEffect는 페이지가 처음 로드되거나 productId가 변경될 때 "단 한 번만" 실행됩니다.
  // 의존성 배열에서 quantity를 제거하여, 수량이 바뀔 때마다 불필요하게 API를 호출하는 문제를 해결했습니다.
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!productId) return;

      // 상품 데이터 로딩
      try {
        setLoading(true);
        setError(null);
        
        const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productId}`);
        setProductData(productResponse.data);
        // ❌ 여기서 setTotalPrice를 호출하지 않습니다. 가격 계산은 아래의 다른 useEffect가 전담합니다.
      } catch (productFetchError) {
        setError(productFetchError);
        console.error("Error fetching product details:", productFetchError);
      } finally {
        setLoading(false);
      }

      // 리뷰 데이터 로딩
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const reviewResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reviews/product/${productId}`);
        setReviews(reviewResponse.data);
      } catch (reviewFetchError) {
        setReviewsError(reviewFetchError);
        console.error("Error fetching product reviews:", reviewFetchError);
      } finally {
        setReviewsLoading(false);
      }
    };
    fetchProductAndReviews();
  }, [productId]); // ✅ 의존성 배열에 'productId'만 남겨두어 핵심 문제를 해결합니다.

  // ✅ 수정된 부분 2: 총 가격 계산을 위한 useEffect
  // 이 useEffect는 '수량(quantity)'이나 '상품 데이터(productData)'가 변경될 때만 실행됩니다.
  // 역할이 명확히 분리되어 효율적으로 동작합니다. (이 코드는 원래도 잘 작성되어 있었습니다.)
  useEffect(() => {
    if (productData && productData.price) {
      setTotalPrice(productData.price * quantity);
    }
  }, [quantity, productData]); // ✅ 수량이나 상품 정보가 바뀔 때만 총 가격을 다시 계산합니다.

  if (loading) return <div className={styles.productPageContainer}><p className={styles.loadingMessage}>상품 정보 로딩중...</p></div>;
  if (error) return <div className={styles.productPageContainer}><p className={styles.errorMessage}>상품 정보 로딩 실패: {error.message}</p></div>;
  if (!productData) return <div className={styles.productPageContainer}><p className={styles.infoMessage}>상품 정보를 찾을 수 없습니다.</p></div>;

  return (
    <>
      <Header />
      <div className={styles.productPageContainer}>
        <div className={styles.leftPanel}>
          <ProductImageGallery
            imagesData={productData.images || []}
            productName={productData.name}
            productDescription={productData.description}
          />
        </div>
        <div className={styles.rightPanel}>
          <ProductHeader
            brandLogoText={productData.seller?.name.substring(0, 2).toUpperCase() || "LOGO"}
            brandName={productData.seller?.name || "No Brand Info"}
            likes={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}K` : "0"}
            breadcrumbs={`Home > ${productData.category?.name || 'Category'} > ${productData.name}`}
            productName={productData.name}
            rating={productData.averageRating || 0}
            reviews={productData.reviewCount || 0}
            price={productData.price}
            HeartIcon={FaHeart}
            StarIcon={FaStar}
          />
          <PromotionBanner
            text="첫 구매시 20% 할인 쿠폰 즉시 지급!"
            ArrowRightIcon={FaChevronRight}
          />
          <PointsInfo
            maxPoints={productData.price ? Math.floor(productData.price * 0.02) : 2050}
            purchasePoints={productData.price ? Math.floor(productData.price * 0.01) : 50}
            reviewPoints={2000}
          />
          <OptionsSelector
            optionName={productData.options?.[0]?.size || "Quantity"}
            price={productData.price}
            quantity={quantity}
            onQuantityChange={handleQuantityChange}
          />
          <TotalSummary
            quantity={quantity}
            totalPrice={totalPrice}
          />
          <ActionBar
            wishlistCount={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}K` : "0"}
            HeartIcon={FaHeart}
            productId={productData.id}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>
      </div>
      <div className={styles.productReviewsSection}>
        <h2>상품 리뷰 ({reviews.length})</h2>
        {reviewsLoading && <p>리뷰 로딩중...</p>}
        {reviewsError && <p className={styles.errorMessage}>리뷰 로딩 실패: {reviewsError.message}</p>}
        {!reviewsLoading && !reviewsError && reviews.length === 0 && (
          <p>아직 리뷰가 작성되지 않았습니다.</p>
        )}
        {!reviewsLoading && !reviewsError && reviews.length > 0 && (
          <ul className={styles.reviewList}>
            {reviews.map((review) => (
              <li key={review.id} className={styles.reviewItem}>
                <div className={styles.reviewAuthorInfo}>
                  <span className={styles.reviewAuthorName}>{review.user?.name || 'Anonymous User'}</span>
                  <span className={styles.reviewDate}>{new Date(review.createdAt).toLocaleDateString()}</span>
                </div>
                <div className={styles.reviewRating}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
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