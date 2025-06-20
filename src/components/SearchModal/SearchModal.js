// src/components/SearchModal/SearchModal.jsx
import React, { useState } from 'react';
import styles from './SearchModal.module.css';
import SearchHeader from './SearchHeader/SearchHeader';
import RecentSearches from './RecentSearches/RecentSearches';
import RankedSearchList from './RankedSearchList/RankedSearchList';

// 목업 데이터
const mockRecentSearches = ['스니커즈', '에어포스', '여름원피스', '나이키 운동화', '선크림 추천'];

const mockPopularSearches = [
  { rank: 1, term: '무료반품', change: 'none' },
  { rank: 2, term: '레인부츠', change: 'down' },
  { rank: 3, term: '반팔', change: 'down' }, // 이미지상으로는 파란 아래 화살표
  { rank: 4, term: '버뮤다팬츠', change: 'up' }, // 이미지상으로는 빨간 위 화살표
  { rank: 5, term: '무신사 스탠다드', change: 'up' },
  { rank: 6, term: '아디다스', change: 'none' },
  { rank: 7, term: '반바지', change: 'up' },
  { rank: 8, term: '베이프', change: 'down' },
  { rank: 9, term: '나이키', change: 'none' },
  { rank: 10, term: '모자', change: 'up' },
];

const mockTrendingSearches = [
  { rank: 1, term: '여름 셔츠' },
  { rank: 2, term: '민소매' },
  { rank: 3, term: '시어서커 셔츠' },
  { rank: 4, term: '스커트' },
  { rank: 5, term: '휠라' },
  { rank: 6, term: '후드티' },
  { rank: 7, term: '패딩' },
  { rank: 8, term: '여름 가디건' },
  { rank: 9, term: '문스타 레인부츠' },
  { rank: 10, term: '슬림핏 반팔' },
];

const SearchModal = ({ isOpen, onClose }) => {
  const [recentSearches, setRecentSearches] = useState(mockRecentSearches);

  const handleRemoveRecentSearch = (termToRemove) => {
    setRecentSearches(recentSearches.filter(term => term !== termToRemove));
  };

  const handleRemoveAllRecentSearches = () => {
    setRecentSearches([]);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContainer}>
        <SearchHeader onClose={onClose} />
        <div className={styles.modalContent}>
          <RecentSearches
            searches={recentSearches}
            onRemove={handleRemoveRecentSearch}
            onRemoveAll={handleRemoveAllRecentSearches}
          />
          <RankedSearchList
            title="인기 검색어"
            items={mockPopularSearches}
            timestamp="06.20 15:20, 기준"
          />
          <RankedSearchList
            title="급상승 검색어"
            items={mockTrendingSearches}
            timestamp="06.20 15:20, 기준"
          />
        </div>
      </div>
    </div>
  );
};

export default SearchModal;