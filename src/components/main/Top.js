import React from "react";

// 현재 제공해주신 import 문들을 기준으로 포함
import image from "../../assets/Top/최저가상점.png";
import image2 from "../../assets/Top/가성비템.png";
import image3 from "../../assets/Top/체형별코디.png"; // 체형별 코디 (svg로 되어 있음)
import image4 from "../../assets/Top/러닝.png"; // 러닝 (svg로 되어 있음)
import image5 from "../../assets/Top/축구.png"; // 축구 (svg로 되어 있음)
import image6 from "../../assets/Top/피트니스.png"; // 피트니스 (svg로 되어 있음)

import styles from "../../styles/Top.module.css";

export const Top = () => {
  return (
    <div className={styles.box}>
      <div className={styles.element}>
        <div className={styles.overlap}>
          <div className={styles.view} /> {/* 아마도 상단 배경 또는 다른 역할 */}

          <div className={styles.div}> {/* 상단 카테고리 아이콘 그룹 (반소매, 후드 등) */}
            {/* 반소매 */}
            <div className={styles["div-2"]}>
              <div className={styles["text-wrapper"]}>반소매</div>
              <div className={`${styles.rectangle} ${styles.topImageBanSomae}`} />
            </div>
            {/* 후드 */}
            <div className={styles["div-3"]}>
              <div className={styles["text-wrapper-2"]}>후드</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageHood}`} />
            </div>
            {/* 니트 */}
            <div className={styles["div-4"]}>
              <div className={styles["text-wrapper-3"]}>니트</div>
              <div className={`${styles.rectangle} ${styles.topImageKnit}`} />
            </div>
            {/* 자켓 */}
            <div className={styles["div-5"]}>
              <div className={styles["text-wrapper-4"]}>자켓</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageJacket}`} />
            </div>
            {/* 맨투맨 */}
            <div className={styles["div-6"]}>
              <div className={styles["text-wrapper-5"]}>맨투맨</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageMtm}`} />
            </div>
            {/* 가디건 */}
            <div className={styles["div-7"]}>
              <div className={styles["text-wrapper-6"]}>가디건</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageCardigan}`} />
            </div>
            {/* 집업 */}
            <div className={styles["div-8"]}>
              <div className={styles["text-wrapper-7"]}>집업</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageZipup}`} />
            </div>
            {/* 로퍼/부츠 */}
            <div className={styles["div-9"]}>
              <div className={styles["text-wrapper-8"]}>로퍼/부츠</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageShoes}`} />
            </div>
            {/* 슬리퍼 */}
            <div className={styles["div-10"]}>
              <div className={styles["text-wrapper-5"]}>슬리퍼</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageSlipper}`} />
            </div>
            {/* 푸드 */}
            <div className={styles["div-11"]}>
              <div className={styles["text-wrapper-7"]}>푸드</div>
              <div className={`${styles["rectangle-2"]} ${styles.topImageFood}`} />
            </div>
          </div> {/* .div 닫힘: 상단 카테고리 그룹 끝 */}

          {/* ------------------------------------------- */}
          {/* 하단 필터링 UI 그룹 시작 (최저가 상점, 가성비 템 등) */}
          {/* ------------------------------------------- */}
          <div className={styles["view-2"]}>
            <div className={styles["overlap-group-wrapper"]}>
              <div className={styles["overlap-group"]}>
                <div className={styles["text-wrapper-9"]}>최저가 상점</div>
                <img className={styles.image} alt="Image" src={image} /> {/* import된 image 변수 사용 */}
              </div>
            </div>

            <div className={styles["overlap-wrapper"]}>
              <div className={styles["overlap-2"]}>
                <div className={styles["text-wrapper-10"]}>가성비 템</div>
                <img className={styles.img} alt="Image" src={image2} /> {/* import된 image2 변수 사용 */}
              </div>
            </div>

            <div className={styles["div-wrapper"]}>
              <div className={styles["overlap-3"]}>
                <div className={styles["text-wrapper-11"]}>체형별 코디</div>
                <img className={styles["image-2"]} alt="Image" src={image3} /> {/* import된 image3 변수 사용 */}
              </div>
            </div>

            {/* 축구 */}
            <div className={styles["view-3"]}>
              <div className={styles["overlap-4"]}>
                <div className={styles["text-wrapper-10"]}>축구</div>
                <img className={styles.img} alt="Image" src={image5} /> {/* import된 image5 변수 사용 */}
              </div>
            </div>

            {/* 러닝 */}
            <div className={styles["view-4"]}>
              <div className={styles["overlap-4"]}>
                <div className={styles["text-wrapper-10"]}>러닝</div>
                <img className={styles.img} alt="Image" src={image4} /> {/* import된 image4 변수 사용 */}
              </div>
            </div>

            {/* 피트니스 */}
            <div className={styles["view-5"]}>
              <div className={styles["overlap-5"]}>
                <div className={styles["text-wrapper-12"]}>피트니스</div>
                <img className={styles.img} alt="Image" src={image6} /> {/* import된 image6 변수 사용 */}
              </div>
            </div>
          </div> {/* .view-2 닫힘: 하단 필터링 UI 그룹 끝 */}

          <div className={styles["view-6"]} /> {/* 추가적인 view-6 (하단 검은색 배경?) */}
        </div> {/* <-- .overlap 닫힘 (여기서 닫혀야 함) */}
      </div> {/* <-- .element 닫힘 (여기서 닫혀야 함) */}
    </div>
  );
};

export default Top;