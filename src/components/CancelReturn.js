import React, { useState } from 'react';
import styles from '../styles/CancelReturn.module.css'; // Import CSS Module

// A simple SVG search icon
const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={styles.searchIconSvg} // Apply module class if specific styling needed, or keep as is if only used for structure
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

function CancelReturn() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'cancelReturn', 'exchange'

  const hasHistory = false;

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className={styles.orderHistoryContainer}>
      <h1 className={styles.pageTitle}>취소/반품/교환 내역</h1>

      <div className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="상품명 / 브랜드명으로 검색하세요."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <SearchIcon />
      </div>

      <nav className={styles.tabsNavigation}>
        <button
          className={`${styles.tabItem} ${activeTab === 'all' ? styles.active : ''}`}
          onClick={() => handleTabClick('all')}
        >
          전체
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === 'cancelReturn' ? styles.active : ''}`}
          onClick={() => handleTabClick('cancelReturn')}
        >
          취소/반품
        </button>
        <button
          className={`${styles.tabItem} ${activeTab === 'exchange' ? styles.active : ''}`}
          onClick={() => handleTabClick('exchange')}
        >
          교환
        </button>
      </nav>

      <div className={styles.historyContent}>
        {hasHistory ? (
          <p>여기에 내역이 표시됩니다.</p>
        ) : (
          <p className={styles.noHistoryMessage}>취소/반품/교환 내역이 없습니다.</p>
        )}
      </div>
    </div>
  );
}

export default CancelReturn;