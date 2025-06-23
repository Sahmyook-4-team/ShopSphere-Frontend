import React, { useState, useEffect } from "react";
import axios from "axios"; // axios import
import styles from "../../styles/ViewByAnima.module.css";

// 각 카테고리 버튼에 대한 기본 아이콘 매핑 (필요시 확장)
const categoryIcons = {
  "가방 · 지갑": styles.bagImage,
  셔츠: styles.shirtImage,
  모자: styles.hatImage,
  트레이닝: styles.trainingImage,
  디지털: styles.digitalImage,
  패션소품: styles.fashionImage,
  언더웨어: styles.underwearImage,
  // API에서 가져온 카테고리 이름과 매칭되는 아이콘 클래스를 추가해야 함
};

export const ViewByAnima = ({ onCategorySelect, selectedCategoryId }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // API_BASE_URL은 환경변수 등으로 관리하는 것이 좋습니다.
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`); // 실제 API 엔드포인트로 변경
        setCategories(response.data || []); // API 응답 구조에 따라 response.data.categories 등일 수 있음
        setError(null);
      } catch (err) {
        setError("카테고리를 불러오는 데 실패했습니다.");
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []); // 컴포넌트 마운트 시 한 번만 실행

  if (loading) {
    return <div className={styles.loadingMessage}>카테고리 로딩 중...</div>;
  }

  if (error) {
    return <div className={styles.errorMessage}>{error}</div>;
  }

  return (
    <div className={styles.viewByAnima}>
      {/* "전체" 카테고리 버튼 (선택 사항) */}
      <div
        className={`${styles.roundButton} ${
          selectedCategoryId === null ? styles.selected : "" // '전체' 선택 시 스타일
        }`}
        onClick={() => onCategorySelect(null)} // null을 전체 카테고리로 가정
      >
        <div className={`${styles.roundIcon} ${styles.allImage}`} /> {/* 전체 아이콘 스타일 필요 */}
        <span>전체</span>
      </div>

      {categories.length > 0 ? (
        categories.map((category) => (
          <div
            key={category.id}
            className={`${styles.roundButton} ${
              selectedCategoryId === category.id ? styles.selected : "" // 선택된 버튼 스타일
            }`}
            onClick={() => onCategorySelect(category.id)}
          >
            {/* API에서 아이콘 정보를 주지 않는다면, category.name을 기반으로 아이콘 매핑 */}
            <div
              className={`${styles.roundIcon} ${
                categoryIcons[category.name] || styles.defaultIcon // 매핑된 아이콘 또는 기본 아이콘
              }`}
            />
            <span>{category.name}</span>
          </div>
        ))
      ) : (
        !loading && <div>카테고리가 없습니다.</div>
      )}
    </div>
  );
};

export default ViewByAnima;