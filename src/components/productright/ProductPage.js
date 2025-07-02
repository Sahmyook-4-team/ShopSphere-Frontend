// src/components/productright/ProductPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import axios from 'axios';
import styles from '../../styles/ProductPage.module.css';

// 하위 컴포넌트 import (경로를 다시 한번 확인해주세요)
import ProductImageGallery from '../productleft/ProductImageGallery';
import ProductHeader from './ProductHeader';
import PromotionBanner from './PromotionBanner';
import PointsInfo from './PointsInfo';
import OptionsSelector from './OptionsSelector';
import TotalSummary from './TotalSummary';
import ActionBar from './ActionBar';
import Header from '../Header';
import ProductItem from '../ProductItem';

// 아이콘 import
import { FaHeart, FaStar, FaChevronRight } from 'react-icons/fa';

function ProductPage() {
    const { productId } = useParams();
    const navigate = useNavigate();

    // --- 상태 관리 (State) ---
    const [productData, setProductData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    // --- 데이터 로딩 ---
    useEffect(() => {
        const fetchProductAndReviews = async () => {
            if (!productId) {
                setError(new Error("상품 ID가 URL에 없습니다."));
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const productUrl = `${process.env.REACT_APP_API_BASE_URL}/api/products/${productId}`;
                const productResponse = await axios.get(productUrl);
                setProductData(productResponse.data);

                const reviewUrl = `${process.env.REACT_APP_API_BASE_URL}/api/reviews/product/${productId}`;
                const reviewResponse = await axios.get(reviewUrl);
                setReviews(reviewResponse.data);

            } catch (fetchError) {
                console.error("❌ 데이터 로딩 중 오류 발생:", fetchError);
                setError(fetchError);
            } finally {
                setLoading(false);
            }
        };
        
        fetchProductAndReviews();
    }, [productId]);

    // --- 핸들러 함수들 ---

    const handleOptionSelect = (option) => {
        if (!option) return;
        if (selectedOptions.some(item => item.option.id === option.id)) {
            alert("이미 선택한 옵션입니다.");
            return;
        }
        setSelectedOptions(prev => [...prev, { option: option, quantity: 1 }]);
    };
    
    const handleQuantityChange = (optionId, newQuantity) => {
        if (newQuantity < 1) return;
        setSelectedOptions(prev => prev.map(item =>
            item.option.id === optionId ? { ...item, quantity: newQuantity } : item
        ));
    };

    const handleRemoveOption = (optionId) => {
        setSelectedOptions(prev => prev.filter(item => item.option.id !== optionId));
    };

    const handleAddToCart = async () => {
        if (selectedOptions.length === 0) {
            alert("상품 옵션을 선택해주세요.");
            return;
        }
        try {
            await Promise.all(selectedOptions.map(item => 
                axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/cart/items`, { 
                    productId: productData.id, 
                    quantity: item.quantity, 
                    optionId: item.option.id
                }, { withCredentials: true })
            ));
            alert('선택한 상품들을 장바구니에 담았습니다.');
            setSelectedOptions([]);
        } catch (cartError) {
            alert(`장바구니 추가 실패: ${cartError.response?.data?.message || cartError.message}`);
        }
    };
    
    const handleBuyNow = async () => {
        if (selectedOptions.length === 0) {
            alert("구매할 상품 옵션을 선택해주세요.");
            return;
        }
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
                items: selectedOptions.map(item => ({
                    productId: productData.id, quantity: item.quantity, optionId: item.option.id,
                })),
                shippingAddress: "기본 배송지",
            }, { withCredentials: true });
            const order = res.data;
            const toss = await loadTossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY);
            toss.requestPayment('카드', {
                amount: order.totalAmount, orderId: order.transactionId,
                orderName: `${productData.name}` + (order.items.length > 1 ? ` 외 ${order.items.length - 1}건` : ''),
                customerName: order.user.name, successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (error) {
            alert(`구매 처리 실패: ${error.response?.data?.message || error.message}`);
        }
    };

    // --- 동적 계산 ---
    const calculateTotalPrice = () => {
        if (!productData) return 0;
        return selectedOptions.reduce((total, item) => 
            total + (productData.price + (item.option.additionalPrice || 0)) * item.quantity, 0
        );
    };

    // --- 조건부 렌더링 ---
    if (loading) return <div className={styles.productPageContainer}><p className={styles.loadingMessage}>Loading...</p></div>;
    if (error) return <div className={styles.productPageContainer}><p className={styles.errorMessage}>Error: {error.message}</p></div>;
    if (!productData) return <div className={styles.productPageContainer}><p className={styles.infoMessage}>상품 정보를 찾을 수 없습니다.</p></div>;

    // --- 최종 렌더링 ---
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
                        brandLogoText={productData.seller?.name.substring(0, 2).toUpperCase() || "SP"}
                        brandName={productData.seller?.name || "브랜드 정보 없음"}
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
                        price={productData.price}
                    />
                    
                    <OptionsSelector
                        options={productData.options || []}
                        onOptionSelect={handleOptionSelect}
                    />

                    <div className={styles.selectedItemsContainer}>
                        {selectedOptions.map(item => (
                            <ProductItem
                                key={item.option.id}
                                product={productData}
                                options={item.option}
                                initialQuantity={item.quantity}
                                onQuantityChange={(newQuantity) => handleQuantityChange(item.option.id, newQuantity)}
                                onRemove={() => handleRemoveOption(item.option.id)}
                                finalPrice={((productData.price + (item.option.additionalPrice || 0)) * item.quantity).toLocaleString()}
                                isFromProductPage={true}
                            />
                        ))}
                    </div>
                    
                    <TotalSummary totalPrice={calculateTotalPrice()} />
                    
                    <ActionBar
                        onAddToCart={handleAddToCart}
                        onBuyNow={handleBuyNow}
                        product={productData}
                        HeartIcon={FaHeart}
                        wishlistCount={productData.interestCount || 0}
                    />
                </div>
            </div>
            <div className={styles.productReviewsSection}>
                <h2>상품 리뷰 ({reviews.length})</h2>
                {reviews.length > 0 ? (
                    <ul className={styles.reviewList}>
                        {reviews.map((review) => (
                            <li key={review.id} className={styles.reviewItem}>
                                <div className={styles.reviewAuthorInfo}>
                                    <span className={styles.reviewAuthorName}>{review.user?.name || 'Anonymous'}</span>
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
                ) : (
                    <p>아직 리뷰가 작성되지 않았습니다.</p>
                )}
            </div>
        </>
    );
}

export default ProductPage;