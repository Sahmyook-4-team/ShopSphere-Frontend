// src/components/SearchModal/SearchHeader/SearchHeader.jsx
import React from 'react';
import styles from './SearchHeader.module.css';

const SearchHeader = ({ onClose }) => {
  return (
    <div className={styles.headerContainer}>
      <input
        type="text"
        placeholder="검색어를 입력하세요"
        className={styles.searchInput}
      />
      <button className={`${styles.iconButton} ${styles.searchIcon}`} aria-label="검색">
        🔍︎
      </button>
      <button className={`${styles.iconButton} ${styles.closeButton}`} onClick={onClose} aria-label="닫기">
        ×
      </button>
    </div>
  );
};

export default SearchHeader;