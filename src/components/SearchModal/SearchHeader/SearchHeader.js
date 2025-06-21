// src/components/SearchModal/SearchHeader/SearchHeader.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate 임포트
import styles from './SearchHeader.module.css';

const SearchHeader = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handleSearch = () => {
    if (searchTerm.trim() !== '') {
      // 검색어가 있을 경우, 검색 결과 페이지로 이동하면서 검색어를 쿼리 파라미터로 전달
      navigate(`/search-results?query=${encodeURIComponent(searchTerm.trim())}`);
      if (onClose) { // 모달이 열려있었다면 닫기
        onClose();
      }
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className={styles.headerContainer}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyPress={handleKeyPress} // Enter 키 이벤트 핸들러 추가
      />
      <button 
        className={`${styles.iconButton} ${styles.searchIcon}`} 
        aria-label="검색"
        onClick={handleSearch} // 클릭 이벤트 핸들러 추가
      >
        🔍︎
      </button>
      <button 
        className={`${styles.iconButton} ${styles.closeButton}`} 
        onClick={onClose} 
        aria-label="닫기"
      >
        ×
      </button>
    </div>
  );
};

export default SearchHeader;