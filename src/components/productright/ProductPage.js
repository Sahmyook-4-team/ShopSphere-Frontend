import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
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

  const [reviews, setReviews] = useState([]); // 리뷰 목록 상태
  const [reviewsLoading, setReviewsLoading] = useState(true); // 리뷰 로딩 상태
  const [reviewsError, setReviewsError] = useState(null); // 리뷰 에러 상태

  // 수량 변경 핸들러
  const handleQuantityChange = useCallback((newQuantity) => {
    if (newQuantity >= 1) { // 최소 수량은 1
      setQuantity(newQuantity);
    }
  }, []);

  // 장바구니 추가 함수
  const handleAddToCart = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/cart/items`,
        {
          productId: productData.id,
          quantity: quantity,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Item added to cart successfully!');
      // navigate('/cart'); // Uncomment if you have react-router-dom's navigate
    } catch (cartError) {
      console.error("Error adding to cart:", cartError);
      alert(`Error adding to cart: ${cartError.response?.data?.message || cartError.message}`);
    }
  };

  // 상품 상세 정보 및 리뷰 API 호출 (Combined useEffect)
  useEffect(() => {
    const fetchProductAndReviews = async () => {
      if (!productId) return;

      // Fetch Product Details
      try {
        setLoading(true);
        setError(null);

        const productResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productId}`);
        setProductData(productResponse.data);

        // Set initial total price based on fetched product price
        setTotalPrice(productResponse.data.price * quantity);

      } catch (productFetchError) {
        setError(productFetchError);
        console.error("Error fetching product details:", productFetchError);
      } finally {
        setLoading(false);
      }

      // Fetch Reviews
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
  }, [productId, quantity]); // Re-run when productId changes, quantity included to re-calculate initial totalPrice if quantity state changes before productData is set.

  // Update total price when quantity or productData.price changes
  useEffect(() => {
    if (productData && productData.price) {
      setTotalPrice(productData.price * quantity);
    }
  }, [quantity, productData]);


  // 로딩 중 UI
  if (loading) {
    return <div className={styles.productPageContainer}><p className={styles.loadingMessage}>Loading product information...</p></div>;
  }

  // 에러 발생 시 UI
  if (error) {
    return <div className={styles.productPageContainer}><p className={styles.errorMessage}>Error: {error.message}</p></div>;
  }

  // 상품 데이터가 없을 경우 (로딩 완료 후에도 productData가 null인 경우)
  if (!productData) {
    return <div className={styles.productPageContainer}><p className={styles.infoMessage}>Product information not found.</p></div>;
  }

  // productData가 성공적으로 로드된 후의 렌더링
  return (
    <>
      <Header />
      <div className={styles.productPageContainer}>
        {/* 좌측 패널: 상품 이미지 갤러리 */}
        <div className={styles.leftPanel}>
          <ProductImageGallery
            imagesData={productData.images || []} // API로 받은 이미지 목록 전달 (없으면 빈 배열)
            productName={productData.name}
            productDescription={productData.description}
          />
        </div>

        {/* 우측 패널: 상품 정보 및 액션 */}
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
            text="첫 구매시 20% 할인 쿠폰 즉시 지급!"
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

          <ActionBar
            wishlistCount={productData.interestCount !== undefined ? `${(productData.interestCount / 1000).toFixed(1)}K` : "0"}
            HeartIcon={FaHeart}
            productId={productData.id}
            onAddToCart={handleAddToCart}
          />
        </div>
      </div>

      {/* Product Reviews Section */}
      <div className={styles.productReviewsSection}>
        <h2>상품 리뷰 ({reviews.length > 0 ? reviews.length : '0'})</h2>
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
                  <img src={`${process.env.REACT_APP_API_BASE_URL}${review.reviewImageUrl}`} alt={`Review image ${review.id}`} className={styles.reviewImage} />
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