import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import axios from 'axios'; // ❗️ axios import 추가
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

  const handleQuantityChange = useCallback((newQuantity) => {
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
      // ❗️ 개선됨: fetch 대신 axios로 통일하여 일관성 유지
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

      const createdOrder = response.data; // .json() 과정이 필요 없음

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

  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!productId) return;
      try {
        setLoading(true);
        setError(null);
        
        const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productId}`);
        setProductData(productResponse.data);
        setTotalPrice(productResponse.data.price * quantity);
      } catch (productFetchError) {
        setError(productFetchError);
        console.error("Error fetching product details:", productFetchError);
      } finally {
        setLoading(false);
      }
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
  }, [productId, quantity]);

  useEffect(() => {
    if (productData && productData.price) {
      setTotalPrice(productData.price * quantity);
    }
  }, [quantity, productData]);

  if (loading) return <div className={styles.productPageContainer}><p className={styles.loadingMessage}>Loading product information...</p></div>;
  if (error) return <div className={styles.productPageContainer}><p className={styles.errorMessage}>Error: {error.message}</p></div>;
  if (!productData) return <div className={styles.productPageContainer}><p className={styles.infoMessage}>Product information not found.</p></div>;

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