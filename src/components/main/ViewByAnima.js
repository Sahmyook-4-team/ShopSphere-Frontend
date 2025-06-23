import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../../styles/ViewByAnima.module.css";

const categoryIcons = {
  "가방 · 지갑": styles.bagImage,
  셔츠: styles.shirtImage,
  모자: styles.hatImage,
  트레이닝: styles.trainingImage,
  디지털: styles.digitalImage,
  패션소품: styles.fashionImage,
  언더웨어: styles.underwearImage,
  // "전체" 버튼에 대한 아이콘도 필요하다면 여기에 추가
  "전체": styles.allImage, // 예시: '전체' 버튼 아이콘
};

const ITEMS_PER_ROW = 8; // 한 줄에 표시할 아이템 개수

export const ViewByAnima = ({ onCategorySelect, selectedCategoryId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
        
        // API 응답 데이터 앞에 "전체" 카테고리 객체를 추가
        const allCategory = { id: null, name: "전체" }; // "전체" 카테고리의 id는 null로 설정
        const fetchedCategories = response.data || [];
        setCategories([allCategory, ...fetchedCategories]); // "전체"를 맨 앞에 추가

        setError(null);
      } catch (err) {
        setError("카테고리를 불러오는 데 실패했습니다.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return <div className={styles.loadingMessage}>카테고리 로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  // 카테고리("전체" 포함)를 ITEMS_PER_ROW 개수만큼 그룹화
  const categoryRows = [];
  if (categories.length > 0) { // categories 상태는 이제 "전체"를 포함함
    for (let i = 0; i < categories.length; i += ITEMS_PER_ROW) {
      categoryRows.push(categories.slice(i, i + ITEMS_PER_ROW));
    }
  }

  return (
    <div className={styles.viewByAnimaContainer}>
      {categoryRows.length > 0 ? (
        categoryRows.map((row, rowIndex) => (
          <div key={rowIndex} className={styles.viewByAnimaRow}>
            {row.map((category) => (
              <div
                key={category.id === null ? 'all' : category.id} // "전체" 버튼의 key를 고유하게 설정
                className={`${styles.roundButton} ${
                  selectedCategoryId === category.id ? styles.selected : ""
                }`}
                onClick={() => onCategorySelect(category.id)} // "전체"의 id는 null
              >
                <div
                  className={`${styles.roundIcon} ${
                    categoryIcons[category.name] || styles.defaultIcon
                  }`}
                />
                <span>{category.name}</span>
              </div>
            ))}
          </div>
        ))
      ) : (
        !loading && <div className={styles.viewByAnimaRow}><div>카테고리가 없습니다.</div></div>
      )}
    </div>
  );
};

export default ViewByAnima;