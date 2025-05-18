import React from "react";
import styles from "../styles/SearchDialog.module.css";

const popularKeywords = [
  { rank: 1, keyword: "무료반품", change: "up" },
  { rank: 2, keyword: "반팔", change: "down" },
  { rank: 3, keyword: "무신사 스탠다드", change: "same" },
  { rank: 4, keyword: "바람막이", change: "down" },
  { rank: 5, keyword: "버뮤다팬츠", change: "same" },
  { rank: 6, keyword: "아디다스", change: "same" },
  { rank: 7, keyword: "셔츠", change: "same" },
  { rank: 8, keyword: "레인부츠", change: "same" },
  { rank: 9, keyword: "양말", change: "same" },
  { rank: 10, keyword: "푸마", change: "up" },
];

const trendingKeywords = [
  "키링",
  "노스페이스",
  "토런스",
  "로토토베베",
  "던스트",
  "던스트 포 우먼",
  "윈드브레이커",
  "데님팬츠",
  "피브",
  "호카",
];

const getSymbol = (change) => {
  if (change === "up") return "▲";
  if (change === "down") return "▼";
  return "-";
};

const SearchDialog = () => {
  return (
    <div className={styles.view}>
      <div className={styles["search-box"]}>
        <div className={styles["search-bar-placeholder"]}>검색어를 입력하세요</div>

        <section className={styles["search-section"]}>
          <h3 className={styles["section-title"]}>인기 검색어</h3>
          {popularKeywords.map((item) => (
            <div key={item.rank} className={styles["search-row"]}>
              <span className={styles.rank}>{item.rank}</span>
              <span className={styles.keyword}>{item.keyword}</span>
              <span className={styles.change}>{getSymbol(item.change)}</span>
            </div>
          ))}
          <div className={styles.timestamp}>05.16 10:20, 기준</div>
        </section>

        <section className={styles["search-section"]}>
          <h3 className={styles["section-title"]}>급상승 검색어</h3>
          {trendingKeywords.map((keyword, index) => (
            <div key={index} className={styles["search-row"]}>
              <span className={styles.rank}>{index + 1}</span>
              <span className={styles.keyword}>{keyword}</span>
            </div>
          ))}
          <div className={styles.timestamp}>05.16 10:20, 기준</div>
        </section>
      </div>
    </div>
  );
};

export default SearchDialog;
