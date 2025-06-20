// src/components/SearchModal/SearchListItem/SearchListItem.jsx
import React from 'react';
import styles from './SearchListItem.module.css';

const SearchListItem = ({ rank, term, change }) => {
  const getChangeIcon = () => {
    if (change === 'up') return <span className={`${styles.changeIcon} ${styles.up}`}>▲</span>;
    if (change === 'down') return <span className={`${styles.changeIcon} ${styles.down}`}>▼</span>;
    if (change === 'new') return <span className={`${styles.changeIcon} ${styles.new}`}>N</span>; // 이미지에 없는 'NEW'도 추가해봄
    if (change === 'none') return <span className={`${styles.changeIcon} ${styles.none}`}>-</span>;
    return null;
  };

  return (
    <div className={styles.item}>
      <span className={styles.rank}>{rank}</span>
      <span className={styles.term}>{term}</span>
      {change && getChangeIcon()}
    </div>
  );
};

export default SearchListItem;