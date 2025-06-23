// Middle.js (일부 수정)

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { ViewByAnima } from "./ViewByAnima";
import { ViewWrapperByAnima } from "./ViewWrapperByAnima";
import styles from "../../styles/Middle.module.css"; // Middle.module.css 사용

// 가격대 정의 (value는 API 파라미터로 변환될 값)
const priceRanges = [
  { label: "3만원 이하", value: { maxPrice: 30000 }, id: "range1" },
  { label: "3~5만원", value: { minPrice: 30000, maxPrice: 50000 }, id: "range2" },
  { label: "5~10만원", value: { minPrice: 50000, maxPrice: 100000 }, id: "range3" },
  { label: "10만원 이상", value: { minPrice: 100000 }, id: "range4" },
  // { label: "전체 가격", value: {}, id: "rangeAll" }, // "전체보기" 버튼으로 대체 가능
];

export const Middle = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  // 기본 선택 가격대를 첫 번째 항목으로 설정하거나, "전체보기" 상태를 별도로 관리
  const [selectedPriceRangeId, setSelectedPriceRangeId] = useState(priceRanges[0].id); // ID로 선택 관리
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  const [currentSortOption, setCurrentSortOption] = useState("musinsa_recommend");

  const handleCategorySelect = (categoryId) => {
    setSelectedCategoryId(categoryId);
  };

  const handlePriceRangeSelect = (priceRangeId) => {
    setSelectedPriceRangeId(priceRangeId);
  };

  const fetchProducts = useCallback(async () => {
    setLoadingProducts(true);
    setProductsError(null);
    try {
      const params = {
        sort: currentSortOption,
      };
      if (selectedCategoryId !== null) {
        params.categoryId = selectedCategoryId;
      }

      // 선택된 priceRangeId에 해당하는 priceRange 객체 찾기
      const currentPriceFilter = priceRanges.find(range => range.id === selectedPriceRangeId);
      if (currentPriceFilter && currentPriceFilter.value.minPrice !== undefined) {
        params.minPrice = currentPriceFilter.value.minPrice;
      }
      if (currentPriceFilter && currentPriceFilter.value.maxPrice !== undefined) {
        params.maxPrice = currentPriceFilter.value.maxPrice;
      }
      // "전체보기"의 경우 minPrice, maxPrice 파라미터를 보내지 않음 (selectedPriceRangeId가 'rangeAll' 등일 때)

      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products`, { params });
      setProducts(response.data || []);
    } catch (err) {
      setProductsError("상품을 불러오는 데 실패했습니다.");
      console.error("Error fetching products:", err);
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [selectedCategoryId, selectedPriceRangeId, currentSortOption]); // 의존성 변경

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
            onClick={() => handlePriceRangeSelect(null)}
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

        {loadingProducts && <div className={styles.loadingMessage}>상품 로딩 중...</div>}
        {productsError && <div className={styles.errorMessage}>{productsError}</div>}
        {!loadingProducts && !productsError && products.length === 0 && (
          <div className={styles.noProductsMessage}>조건에 맞는 상품이 없습니다.</div>
        )}

        {/* 상품 목록 표시 - 최대 4개만 렌더링 */}
        <div className={styles.productGrid}>
          {products.slice(0, 5).map((product) => ( // .slice(0, 4) 추가
            <ViewWrapperByAnima key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Middle;