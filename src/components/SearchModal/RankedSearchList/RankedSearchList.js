// src/components/SearchModal/RankedSearchList/RankedSearchList.jsx
import React from 'react';
import styles from './RankedSearchList.module.css';
import SearchListItem from '../SearchListItem/SearchListItem';

const RankedSearchList = ({ title, items, timestamp }) => {
  const midIndex = Math.ceil(items.length / 2);
  const firstHalf = items.slice(0, midIndex);
  const secondHalf = items.slice(midIndex);

  return (
    <div className={styles.listContainer}>
      <div className={styles.titleHeader}>
        <h3 className={styles.title}>{title}</h3>
        {timestamp && <span className={styles.timestamp}>{timestamp}</span>}
      </div>
      <div className={styles.columns}>
        <div className={styles.column}>
          {firstHalf.map(item => (
            <SearchListItem key={item.rank} rank={item.rank} term={item.term} change={item.change} />
          ))}
        </div>
        <div className={styles.column}>
          {secondHalf.map(item => (
            <SearchListItem key={item.rank} rank={item.rank} term={item.term} change={item.change} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RankedSearchList;