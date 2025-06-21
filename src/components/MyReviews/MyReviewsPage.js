// src/components/MyReviews/MyReviewsPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './MyReviewsPage.module.css';
import WritableReviewItem from './WritableReviewItem';
import WrittenReviewItem from './WrittenReviewItem';
import { FaChevronLeft } from 'react-icons/fa'; // 뒤로가기 아이콘
import { useNavigate } from 'react-router-dom'; // 페이지 이동 훅
import Header from '../Header';

const MyReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('writable'); // 'writable' or 'written'
  const [writableReviews, setWritableReviews] = useState([]); // 작성 가능한 리뷰 (OrderItemDTO[] 형태)
  const [writtenReviews, setWrittenReviews] = useState([]);   // 작성한 리뷰 (ReviewDTO.Response[] 형태)
  const [loadingWritable, setLoadingWritable] = useState(true);
  const [loadingWritten, setLoadingWritten] = useState(true);
  const [error, setError] = useState(''); // 공통 에러 메시지 또는 각 탭별 에러 상태 관리 가능
  const navigate = useNavigate();

  // API 호출 함수들을 분리하여 재사용성 높임
  const fetchWritableReviewsAPI = async () => {
    setLoadingWritable(true);
    setError(''); // 이전 에러 초기화
    try {
      const ordersResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, { withCredentials: true });
      const allOrders = ordersResponse.data || [];

      const writtenResponse = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reviews/my-reviews`, { withCredentials: true });
      const userWrittenReviews = writtenResponse.data || [];
      const writtenProductIds = userWrittenReviews.map(review => review.product.id);

      const writableItems = [];
      allOrders.forEach(order => {
        if (order.orderStatus === 'COMPLETED' && order.items) {
          order.items.forEach(item => {
            // 백엔드에서 hasReviewed 필드를 내려준다면 그 값을 사용
            // if (item.product && !item.hasReviewed) { 
            // 현재는 클라이언트에서 writtenProductIds 와 비교
            if (item.product && !writtenProductIds.includes(item.product.id)) {
              writableItems.push({ ...item, orderDate: order.orderDate });
            }
          });
        }
      });
      setWritableReviews(writableItems);
    } catch (err) {
      console.error("작성 가능한 리뷰 로드 실패:", err.response ? err.response.data : err.message);
      setError("작성 가능한 리뷰 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoadingWritable(false);
    }
  };

  const fetchWrittenReviewsAPI = async () => {
    setLoadingWritten(true);
    setError(''); // 이전 에러 초기화
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/reviews/my-reviews`, { withCredentials: true });
      setWrittenReviews(response.data || []);
    } catch (err) {
      console.error("작성한 리뷰 로드 실패:", err.response ? err.response.data : err.message);
      setError("작성한 리뷰 정보를 불러오는 데 실패했습니다.");
    } finally {
      setLoadingWritten(false);
    }
  };
  
  useEffect(() => {
    // 처음 마운트될 때 및 activeTab 변경 시 데이터 로드
    if (activeTab === 'writable') {
      fetchWritableReviewsAPI();
      // 다른 탭의 카운트를 위해 미리 로드해둘 수 있음 (선택적)
      if (writtenReviews.length === 0 && !loadingWritten && !error) {
          fetchWrittenReviewsAPI();
      }
    } else if (activeTab === 'written') {
      fetchWrittenReviewsAPI();
      // 다른 탭의 카운트를 위해 미리 로드해둘 수 있음 (선택적)
      if (writableReviews.length === 0 && !loadingWritable && !error) {
          fetchWritableReviewsAPI();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // error, loadingWritten, loadingWritable, writtenReviews.length, writableReviews.length를 의존성 배열에서 제거하여 무한 루프 방지

  const handleBack = () => {
    navigate(-1); 
  };

  const handleDeleteReviewSuccess = (deletedReviewId) => {
    setWrittenReviews(prevReviews => prevReviews.filter(review => review.id !== deletedReviewId));
    // "작성 가능한 리뷰" 목록도 갱신해야 할 수 있습니다.
    // 가장 간단한 방법은 다시 불러오는 것입니다.
    if (activeTab === 'written') { // 현재 탭이 '작성한 리뷰'일 때만
        fetchWritableReviewsAPI(); // 작성 가능한 리뷰 목록 강제 새로고침
    }
  };
  
  const renderContent = () => {
    if (activeTab === 'writable') {
      if (loadingWritable) return <p className={styles.loadingText}>작성 가능한 리뷰를 불러오는 중...</p>;
      if (error && writableReviews.length === 0) return <p className={styles.errorText}>{error}</p>; // 에러 발생 시 에러 메시지 표시
      if (!loadingWritable && writableReviews.length === 0 && !error) return <p className={styles.emptyText}>작성 가능한 리뷰가 없습니다.</p>;
      return writableReviews.map((item, index) => (
        <WritableReviewItem key={item.id || `writable-${index}-${new Date().getTime()}`} orderItem={item} orderDate={item.orderDate} />
      ));
    } else { // activeTab === 'written'
      if (loadingWritten) return <p className={styles.loadingText}>작성한 리뷰를 불러오는 중...</p>;
      if (error && writtenReviews.length === 0) return <p className={styles.errorText}>{error}</p>; // 에러 발생 시 에러 메시지 표시
      if (!loadingWritten && writtenReviews.length === 0 && !error) return <p className={styles.emptyText}>작성한 리뷰가 없습니다.</p>;
      return writtenReviews.map((review) => (
        <WrittenReviewItem 
          key={review.id} 
          review={review} 
          onDeleteSuccess={handleDeleteReviewSuccess}
        />
      ));
    }
  };

  return (
    <>
    <Header />
    <div className={styles.myReviewsContainer}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton} aria-label="뒤로 가기">
          <FaChevronLeft />
        </button>
        <h1>나의 리뷰</h1>
      </div>

      <div className={styles.tabContainer}>
        <button
          className={`${styles.tabButton} ${activeTab === 'writable' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('writable')}
        >
          작성 가능한 리뷰 ({loadingWritable ? '...' : writableReviews.length})
        </button>
        <button
          className={`${styles.tabButton} ${activeTab === 'written' ? styles.activeTab : ''}`}
          onClick={() => setActiveTab('written')}
        >
          작성한 리뷰 ({loadingWritten ? '...' : writtenReviews.length})
        </button>
      </div>

      {activeTab === 'writable' && writableReviews.length > 0 && ( // 작성 가능한 리뷰가 있을 때만 배너 표시
        <div className={styles.pointBanner}>
          ✏️ 리뷰 1개 작성하시면 <span className={styles.pointHighlight}>최대 1,500P</span> 드려요
        </div>
      )}
      
      <div className={styles.mainContentLayout}> {/* 메인 콘텐츠와 사이드바를 위한 레이아웃 div */}
        <div className={styles.contentArea}>
          {renderContent()}
        </div>
      </div>
    </div>
    </>  
    );
};

export default MyReviewsPage;