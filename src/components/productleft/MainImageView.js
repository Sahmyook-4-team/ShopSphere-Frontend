import React from 'react';
import styles from '../../styles/MainImageView.module.css'; // 경로 확인
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // 아이콘 import

const MainImageView = ({ imageUrl, productName, onPrev, onNext, showButtons }) => {
  return (
    // 래퍼 div 추가
    <div className={`${styles.mainImageWrapper} ${!imageUrl ? styles.noImage : ''}`}>
      {showButtons && ( // 이미지가 2개 이상일 때만 버튼 표시
        <>
          <button
            className={`${styles.navigationButton} ${styles.prev}`}
            onClick={onPrev}
            aria-label="이전 이미지"
          >
            <FaChevronLeft className={styles.navIcon} />
          </button>
          <button
            className={`${styles.navigationButton} ${styles.next}`}
            onClick={onNext}
            aria-label="다음 이미지"
          >
            <FaChevronRight className={styles.navIcon} />
          </button>
        </>
      )}
      {/* 기존 이미지 표시 컨테이너 */}
      <div className={styles.mainImageContainer}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={productName || '상품 이미지'}
            className={styles.mainImage}
          />
        ) : (
          '이미지를 준비 중입니다.'
        )}
      </div>
    </div>
  );
};

export default MainImageView;