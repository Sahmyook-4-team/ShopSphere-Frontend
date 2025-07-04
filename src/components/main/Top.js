import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 훅 임포트

// 현재 제공해주신 import 문들을 기준으로 포함
import image from "../../assets/Top/최저가상점.png";
import image2 from "../../assets/Top/가성비템.png";
import image3 from "../../assets/Top/체형별코디.png"; // 체형별 코디 (svg로 되어 있음)
import image4 from "../../assets/Top/러닝.png"; // 러닝 (svg로 되어 있음)
import image5 from "../../assets/Top/축구.png"; // 축구 (svg로 되어 있음)
import image6 from "../../assets/Top/피트니스.png"; // 피트니스 (svg로 되어 있음)

import image7 from "../../assets/Top/메인1.png"; // 메인1
import image8 from "../../assets/Top/메인2.png"; // 메인2
import image9 from "../../assets/Top/메인3.png"; // 메인3

import styles from "../../styles/Top.module.css";

export const Top = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  // 카테고리 클릭 시 SearchResultsPage로 이동하는 함수
  const handleCategoryClick = (categoryName) => {
    navigate(`/search-results?query=${encodeURIComponent(categoryName)}`);
  };

  return (
    <div className={styles.box}>
      <div className={styles.element}>
        <div className={styles.overlap}>
          <div className={styles.view} /> {/* 아마도 상단 배경 또는 다른 역할 */}

          {/* 상단 카테고리 아이콘 그룹 (반소매, 후드 등) */}
          <div className={styles.div}>
            {/* 반소매 */}
            <div className={styles["div-2"]} onClick={() => handleCategoryClick("반소매")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper"]}>반소매</div>
              <div className={`${styles.rectangle} ${styles.topImageBanSomae}`} />
            </div>
            {/* 후드 */}
            <div className={styles["div-3"]} onClick={() => handleCategoryClick("후드")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-2"]}>후드</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageHood}`} />
            </div>
            {/* 니트 */}
            <div className={styles["div-4"]} onClick={() => handleCategoryClick("니트")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-3"]}>니트</div>
              <div className={`${styles.rectangle} ${styles.topImageKnit}`} />
            </div>
            {/* 자켓 */}
            <div className={styles["div-5"]} onClick={() => handleCategoryClick("자켓")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-4"]}>자켓</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageJacket}`} />
            </div>
            {/* 맨투맨 */}
            <div className={styles["div-6"]} onClick={() => handleCategoryClick("맨투맨")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-5"]}>맨투맨</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageMtm}`} />
            </div>
            {/* 가디건 */}
            <div className={styles["div-7"]} onClick={() => handleCategoryClick("가디건")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-6"]}>가디건</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageCardigan}`} />
            </div>
            {/* 집업 */}
            <div className={styles["div-8"]} onClick={() => handleCategoryClick("집업")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-7"]}>집업</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageZipup}`} />
            </div>
            {/* 로퍼/부츠 */}
            <div className={styles["div-9"]} onClick={() => handleCategoryClick("로퍼/부츠")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-8"]}>로퍼/부츠</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageShoes}`} />
            </div>
            {/* 슬리퍼 */}
            <div className={styles["div-10"]} onClick={() => handleCategoryClick("슬리퍼")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-5"]}>슬리퍼</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageSlipper}`} />
            </div>
            {/* 푸드 */}
            <div className={styles["div-11"]} onClick={() => handleCategoryClick("푸드")} style={{ cursor: 'pointer' }}>
              <div className={styles["text-wrapper-7"]}>푸드</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageFood}`} />
            </div>
          </div> {/* .div 닫힘: 상단 카테고리 그룹 끝 */}

          {/* ------------------------------------------- */}
          {/* 하단 필터링 UI 그룹 시작 (최저가 상점, 가성비 템 등) */}
          {/* ------------------------------------------- */}
          <div className={styles["view-2"]}>
            <div className={styles["overlap-group-wrapper"]} onClick={() => handleCategoryClick("최저가 상점")} style={{ cursor: 'pointer' }}>
              <div className={styles["overlap-group"]}>
                <div className={styles["text-wrapper-9"]}>최저가 상점</div>
                <img className={styles.image} alt="Image" src={image} />
              </div>
            </div>

            <div className={styles["overlap-wrapper"]} onClick={() => handleCategoryClick("가성비 템")} style={{ cursor: 'pointer' }}>
              <div className={styles["overlap-2"]}>
                <div className={styles["text-wrapper-10"]}>가성비 템</div>
                <img className={styles.img} alt="Image" src={image2} />
              </div>
            </div>

            <div className={styles["div-wrapper"]} onClick={() => handleCategoryClick("체형별 코디")} style={{ cursor: 'pointer' }}>
              <div className={styles["overlap-3"]}>
                <div className={styles["text-wrapper-11"]}>체형별 코디</div>
                <img className={styles["image-2"]} alt="Image" src={image3} />
              </div>
            </div>

            {/* 축구 */}
            <div className={styles["view-3"]} onClick={() => handleCategoryClick("축구")} style={{ cursor: 'pointer' }}>
              <div className={styles["overlap-4"]}>
                <div className={styles["text-wrapper-10"]}>축구</div>
                <img className={styles.img} alt="Image" src={image5} />
              </div>
            </div>

            {/* 러닝 */}
            <div className={styles["view-4"]} onClick={() => handleCategoryClick("러닝")} style={{ cursor: 'pointer' }}>
              <div className={styles["overlap-4"]}>
                <div className={styles["text-wrapper-10"]}>러닝</div>
                <img className={styles.img} alt="Image" src={image4} />
              </div>
            </div>

            {/* 피트니스 */}
            <div className={styles["view-5"]} onClick={() => handleCategoryClick("피트니스")} style={{ cursor: 'pointer' }}>
              <div className={styles["overlap-5"]}>
                <div className={styles["text-wrapper-12"]}>피트니스</div>
                <img className={styles.img} alt="Image" src={image6} />
              </div>
            </div>
          </div> {/* .view-2 닫힘: 하단 필터링 UI 그룹 끝 */}

          <div className={styles["view-6"]} /> {/* 추가적인 view-6 (하단 검은색 배경?) */}
          <Slideshow images={[image7, image8, image9]} interval={5000} />
        </div> {/* <-- .overlap 닫힘 (여기서 닫혀야 함) */}
      </div> {/* <-- .element 닫힘 (여기서 닫혀야 함) */}
    </div>
  );
};

// 이미지 슬라이드쇼 컴포넌트
const Slideshow = ({ images, interval = 5000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // 다음 이미지로 이동
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // 이전 이미지로 이동
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval, isPaused]);

  // 화살표 버튼 스타일
  const arrowStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  };

  return (
    <div
      className={styles["view-6"]}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 왼쪽 화살표 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        style={{ ...arrowStyle, left: '10px' }}
        aria-label="이전 이미지"
      >
        &lt;
      </button>

      {/* 이미지 */}
      <img
        className={styles["view-7"]}
        alt={`슬라이드 ${currentIndex + 1}`}
        src={images[currentIndex]}
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />

      {/* 오른쪽 화살표 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        style={{ ...arrowStyle, right: '10px' }}
        aria-label="다음 이미지"
      >
        &gt;
      </button>
    </div>
  );
};

export default Top;