// src/components/MyReviews/WrittenReviewItem.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from './WrittenReviewItem.module.css';
import axios from 'axios'; // API 호출용
import { FaEllipsisV, FaTrashAlt } from 'react-icons/fa'; // 아이콘 사용 예시

// 가정: 부모 컴포넌트로부터 onDeleteSuccess 콜백 함수를 props로 받음
const WrittenReviewItem = ({ review, onDeleteSuccess }) => { 
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const menuRef = useRef(null); // 옵션 메뉴 외부 클릭 감지용

  // 외부 클릭 시 옵션 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowOptionsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  if (!review || !review.product || !review.user) {
    return null;
  }

  const { id: reviewId, product, rating, comment, createdAt, reviewImageUrl } = review;
  
  const getRepresentativeImageUrl = (images) => {
    if (!images || images.length === 0) return 'https://via.placeholder.com/70x70.png?text=No+Image';
    const mainImage = images.find(img => img.displayOrder === 0) || images[0];
    return mainImage.imageUrl;
  };
  const representativeProductImage = getRepresentativeImageUrl(product.images);
  
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '');
  };

  const toggleOptionsMenu = (event) => {
    event.stopPropagation(); // 이벤트 버블링 방지
    setShowOptionsMenu(prev => !prev);
  };

  const handleDeleteClick = () => {
    setShowOptionsMenu(false); // 옵션 메뉴 닫기
    setShowDeleteModal(true);  // 삭제 확인 모달 열기
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setError('');
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/reviews/${reviewId}`, {
        withCredentials: true,
      });
      setShowDeleteModal(false);
      if (onDeleteSuccess) {
        onDeleteSuccess(reviewId); // 부모 컴포넌트에 삭제 성공 알림
      }
    } catch (err) {
      console.error("리뷰 삭제 실패:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || '리뷰 삭제 중 오류가 발생했습니다.');
      // 모달에 에러 메시지를 표시할 수도 있음
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className={styles.itemContainer}>
        <div className={styles.productSection}>
          <img src={representativeProductImage} alt={product.name} className={styles.productImage} />
          <div className={styles.productInfo}>
            <p className={styles.productName}>{product.name}</p>
          </div>
          <div className={styles.actions} ref={menuRef}> {/* ref 추가 */}
            <button onClick={toggleOptionsMenu} className={styles.menuButton} aria-label="리뷰 옵션">
              {/* <FaEllipsisV /> */} ... {/* 아이콘 또는 텍스트 */}
            </button>
            {showOptionsMenu && (
              <div className={styles.optionsMenu}>
                {/* <button className={styles.optionButton}>리뷰 수정</button> */} {/* 수정 기능은 추후 구현 */}
                <button onClick={handleDeleteClick} className={`${styles.optionButton} ${styles.deleteOption}`}>
                  {/* <FaTrashAlt />  */}리뷰 삭제
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.reviewContent}>
          <div className={styles.ratingAndDate}>
            <span className={styles.stars}>
              {Array(5).fill(0).map((_, i) => (
                <span key={i} className={i < rating ? styles.filledStar : styles.emptyStar}>★</span>
              ))}
            </span>
            <span className={styles.date}>{formatDate(createdAt)}</span>
          </div>
          <p className={styles.reviewText}>{comment}</p>
          {reviewImageUrl && (
            <img src={`${process.env.REACT_APP_API_BASE_URL}${reviewImageUrl}`} alt="리뷰 이미지" className={styles.reviewImage} />
          )}
        </div>
        <div className={styles.pointNotice}>
          <span className={styles.pointDate}>06월 27일</span> 포인트 지급 예정
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3 className={styles.modalTitle}>리뷰 삭제</h3>
            <p className={styles.modalText}>리뷰를 삭제하면 지급되었던 포인트는 회수됩니다.</p>
            <p className={styles.modalSubText}>
              배송 완료일부터 180일 이내의 주문 상품은 다시 리뷰를 남기실 수 있지만, 30일 이내 리뷰 작성 건만 포인트가 지급되는 점 참고해 주세요.
            </p>
            {error && <p className={styles.modalError}>{error}</p>}
            <div className={styles.modalActions}>
              <button onClick={() => {setShowDeleteModal(false); setError('');}} className={`${styles.modalButton} ${styles.cancelButton}`}>
                취소
              </button>
              <button onClick={confirmDelete} className={`${styles.modalButton} ${styles.confirmButton}`} disabled={isDeleting}>
                {isDeleting ? '삭제 중...' : '확인'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WrittenReviewItem;