// src/components/Middle/Middle.js (경로는 예시)
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ViewByAnima } from "./ViewByAnima"; // 경로 확인 필요
import { ViewWrapperByAnima } from "./ViewWrapperByAnima"; // 경로 확인 필요
import styles from "../../styles/Middle.module.css"; // 경로 확인 필요

const priceRanges = [
  { label: "3만원 이하", value: { maxPrice: 30000 }, id: "range1" },
  { label: "3~5만원", value: { minPrice: 30000, maxPrice: 50000 }, id: "range2" },
  { label: "5~10만원", value: { minPrice: 50000, maxPrice: 100000 }, id: "range3" },
  { label: "10만원 이상", value: { minPrice: 100000 }, id: "range4" },
  // { label: "전체 가격", value: {}, id: "rangeAll" }, // 전체보기 버튼으로 대체
];

// 스켈레톤 아이템 컴포넌트
const SkeletonProductCard = () => (
  <div className={styles.skeletonProductCard}>
    <div className={styles.skeletonImage}></div>
    <div className={styles.skeletonTextShort}></div>
    <div className={styles.skeletonTextLong}></div>
    <div className={styles.skeletonTextMedium}></div>
  </div>
);

export const Middle = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedPriceRangeId, setSelectedPriceRangeId] = useState(priceRanges[0].id); // 기본 첫번째 가격대
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productsError, setProductsError] = useState(null);
  const [currentSortOption, setCurrentSortOption] = useState("musinsa_recommend");

  // 페이징은 현재 5개 고정이므로 UI상태는 불필요, API 요청 시 page:0, size:5 고정
  // const [currentPage, setCurrentPage] = useState(0);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
    // setCurrentPage(0); // 필터 변경 시 첫 페이지로 (페이징 UI 구현 시)
  };

  const handlePriceRangeSelect = (priceRangeId) => {
    setSelectedPriceRangeId(priceRangeId);
    // setCurrentPage(0); // 필터 변경 시 첫 페이지로 (페이징 UI 구현 시)
  };

  const handleSortChange = (sortOption) => {
    setCurrentSortOption(sortOption);
    // setCurrentPage(0); // 정렬 변경 시 첫 페이지로 (페이징 UI 구현 시)
  };

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    // setProducts([]); // 로딩 시작 시 기존 상품 목록을 비우지 않고 스켈레톤으로 대체

    try {
      const params = {
        sort: currentSortOption,
        page: 0, // 항상 첫 페이지
        size: 5, // 5개만 요청
      };

      if (selectedCategoryId !== null) {
        params.categoryId = selectedCategoryId;
      }

      const currentPriceFilter = priceRanges.find(range => range.id === selectedPriceRangeId);
      if (selectedPriceRangeId !== null && currentPriceFilter) { // "전체보기" (null)가 아닐 때만 적용
          if (currentPriceFilter.value.minPrice !== undefined) {
            params.minPrice = currentPriceFilter.value.minPrice;
          }
          if (currentPriceFilter.value.maxPrice !== undefined) {
            params.maxPrice = currentPriceFilter.value.maxPrice;
          }
      }
      
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`, { params });
      
      if (response.data && response.data.content) {
        setProducts(response.data.content);
        // 페이징 정보 필요시:
        // setCurrentPage(response.data.number);
        // setTotalPages(response.data.totalPages);
      } else {
        setProducts([]); // 응답 형식이 맞지 않으면 빈 배열
      }

    } catch (err) {
      setProductsError("상품을 불러오는 데 실패했습니다. 잠시 후 다시 시도해주세요.");
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategoryId, selectedPriceRangeId, currentSortOption]); // currentPage가 바뀌면 다시 호출 (페이징 구현 시)

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className={styles.element}>
      <div className={styles.contentWrapper}>
        <ViewByAnima
          onCategorySelect={handleCategorySelect}
          selectedCategoryId={selectedCategoryId}
        />

        <div className={styles.priceBestHeader}>
          <span className={styles.priceBestTitle}>가격대별 BEST</span>
          <button
            className={styles.viewAllButton}
            onClick={() => handlePriceRangeSelect(null)} // 전체보기는 ID를 null로 전달
          >
            전체보기 &gt;
          </button>
        </div>

        <div className={styles.priceFilterTabsContainer}>
          {priceRanges.map((range) => (
            <div
              key={range.id}
              className={`${styles.priceFilterTab} ${
                selectedPriceRangeId === range.id ? styles.selectedPriceTab : ""
              }`}
              onClick={() => handlePriceRangeSelect(range.id)}
            >
              {range.label}
            </div>
          ))}
        </div>

        {/* 로딩 중일 때 스켈레톤 UI */}
        {loadingProducts && (
          <div className={styles.productGrid}>
            {[...Array(5)].map((_, index) => (
              <SkeletonProductCard key={`skeleton-${index}`} />
            ))}
          </div>
        )}

        {/* 로딩 완료 후 */}
        {!loadingProducts && (
          <>
            {productsError && <div className={styles.errorMessage}>{productsError}</div>}
            {!productsError && products.length === 0 && (
              <div className={styles.noProductsMessage}>조건에 맞는 상품이 없습니다.</div>
            )}
            {!productsError && products.length > 0 && (
              <div className={styles.productGrid}>
                {products.map((product) => (
                  <ViewWrapperByAnima key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Middle;