// src/components/SearchModal/RecentSearches/RecentSearches.jsx
import React from 'react';
import styles from './RecentSearches.module.css';

const RecentSearches = ({ searches, onRemove, onRemoveAll }) => {
  return (
    <div className={styles.recentContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>최근 검색어</h3>
        {searches && searches.length > 0 && (
          <button className={styles.removeAllButton} onClick={onRemoveAll}>
            모두삭제
          </button>
        )}
      </div>
      {searches && searches.length > 0 ? (
        <div className={styles.tags}>
          {searches.map((term, index) => (
            <span key={index} className={styles.tag}>
              {term}
              <button className={styles.removeTagButton} onClick={() => onRemove(term)}>
                ×
              </button>
            </span>
          ))}
        </div>
      ) : (
        <p className={styles.noRecentSearches}>최근 검색어가 없습니다.</p>
      )}
    </div>
  );
};

export default RecentSearches;