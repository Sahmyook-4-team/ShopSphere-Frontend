// src/pages/SearchResultsPage.jsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/SearchResultsPage.module.css';
import ProductCard from '../components/ProductCard/ProductCard'; // ProductCard 임포트
import Header from '../components/Header';


function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchResultsPage = () => {
  const queryParams = useQuery();
  const searchTerm = queryParams.get('query');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalCount, setTotalCount] = useState(0); // 상품 총 개수 상태 추가

  // 필터 및 정렬 상태 예시
  const [sortOption, setSortOption] = useState('musinsa_recommend');
  // const [filters, setFilters] = useState({ gender: null, color: null, ... });

  useEffect(() => {
    if (!searchTerm) {
      setLoading(false);
      setProducts([]);
      setTotalCount(0);
      return;
    }

    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: API 호출 시 정렬, 필터, 페이지네이션 파라미터 추가
        // 예: `/api/products/search?keyword=${encodeURIComponent(searchTerm)}&sort=${sortOption}&page=0&size=20`
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/search?keyword=${encodeURIComponent(searchTerm)}&sort=${sortOption}`);
        // 페이지네이션을 사용한다면 response.data.content, response.data.totalElements 등을 사용
        setProducts(response.data); 
        setTotalCount(response.data.length); // 페이지네이션 미사용 시, 전체 길이를 사용
                                            // 페이지네이션 사용 시: response.data.totalElements
      } catch (err) {
        console.error("Error fetching search results:", err);
        setError("상품을 검색하는 중 오류가 발생했습니다.");
        setProducts([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchTerm, sortOption]); // searchTerm 또는 sortOption 변경 시 재호출

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  if (loading) {
    return <div className={styles.loadingMessage}>검색 중...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <>
    <Header />
    <div className={styles.pageContainer}>
      <div className={styles.categoryNav}>
        <span className={styles.currentCategoryTitle}>{searchTerm ? `"${searchTerm}" 검색 결과` : '검색 결과'}</span>
        {/* TODO: 연관 카테고리 링크들 (예: 검색어가 "청바지"일 때 "상의 > 데님 팬츠" 등) */}
      </div>

      <div className={styles.filterSortBar}>
        <div className={styles.viewTypeSection}>
          {/* 이미지의 '상품', '스냅/코디' 등 탭 */}
          <button className={`${styles.viewTypeButton} ${styles.active}`}>상품</button>
          <button className={styles.viewTypeButton}>스냅</button>
          <button className={styles.viewTypeButton}>매거진</button>
          {/* ... */}
        </div>
        <div className={styles.filterControls}>
          {/* 이미지의 필터 버튼들 (무진장, 무배당일, 성별, 컬러 등) */}
          <button className={styles.filterChip}>무료배송</button>
          <button className={styles.filterDropdown}>남 <span className={styles.arrowDown}>▼</span></button>
          <button className={styles.filterDropdown}>컬러 <span className={styles.arrowDown}>▼</span></button>
          {/* ... */}
        </div>
        <div className={styles.sortSection}>
          <span className={styles.totalCount}>{totalCount.toLocaleString()}개</span>
          <select value={sortOption} onChange={handleSortChange} className={styles.sortSelect}>
            <option value="musinsa_recommend">쇼핑몰 추천순</option>
            <option value="sales_volume_desc">판매량 많은 순</option> {/* 백엔드 정렬 값과 일치해야 함 */}
            <option value="created_at_desc">최신 등록순</option>
            <option value="price_asc">낮은 가격순</option>
            <option value="price_desc">높은 가격순</option>
            {/* ... */}
          </select>
        </div>
      </div>

      {products.length > 0 ? (
        <div className={styles.productListGrid}>
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className={styles.noResultsMessage}>
          "{searchTerm}"에 대한 검색 결과가 없습니다.
          <p>다른 검색어를 입력하시거나 철자가 정확한지 확인해주세요.</p>
        </div>
      )}
      
      {/* TODO: 페이지네이션 컴포넌트 */}
      {/* {totalCount > 0 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />} */}
    </div>
    </>
  );
};

export default SearchResultsPage;