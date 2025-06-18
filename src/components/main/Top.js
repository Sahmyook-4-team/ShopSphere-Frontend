import React from "react";

import image from "../../assets/Top/최저가상점.png";
import image2 from "../../assets/Top/가성비템.png";
import image3 from "../../assets/Top/image-3.svg";
import image4 from "../../assets/Top/image-4.svg";
import image5 from "../../assets/Top/image-5.svg";
import image6 from "../../assets/Top/image-6.svg";

import styles from "../../styles/Top.module.css";

export const Top = () => {
  return (
    <div className={styles.box}>
      <div className={styles.element}>
        <div className={styles.overlap}>
          <div className={styles.view} />

          <div className={styles.div}>
            <div className={styles["div-2"]}>
              <div className={styles["text-wrapper"]}>반소매</div>
              <div className={styles.rectangle} />
            </div>
            <div className={styles["div-3"]}>
              <div className={styles["text-wrapper-2"]}>후드</div>
              <div className={styles["rectangle-2"]} />
            </div>
            <div className={styles["div-4"]}>
              <div className={styles["text-wrapper-3"]}>니트</div>
              <div className={styles.rectangle} />
            </div>
            <div className={styles["div-5"]}>
              <div className={styles["text-wrapper-4"]}>자켓</div>
              <div className={styles["rectangle-2"]} />
            </div>
            <div className={styles["div-6"]}>
              <div className={styles["text-wrapper-5"]}>맨투맨</div>
              <div className={styles["rectangle-2"]} />
            </div>
            <div className={styles["div-7"]}>
              <div className={styles["text-wrapper-6"]}>가디건</div>
              <div className={styles["rectangle-2"]} />
            </div>
            <div className={styles["div-8"]}>
              <div className={styles["text-wrapper-7"]}>집업</div>
              <div className={styles["rectangle-2"]} />
            </div>
            <div className={styles["div-9"]}>
              <div className={styles["text-wrapper-8"]}>로퍼/부츠</div>
              <div className={styles["rectangle-2"]} />
            </div>
            <div className={styles["div-10"]}>
              <div className={styles["text-wrapper-5"]}>슬리퍼</div>
              <div className={styles["rectangle-2"]} />
            </div>
            <div className={styles["div-11"]}>
              <div className={styles["text-wrapper-7"]}>푸드</div>
              <div className={styles["rectangle-2"]} />
            </div>
          </div>

          <div className={styles["view-2"]}>
            <div className={styles["overlap-group-wrapper"]}>
              <div className={styles["overlap-group"]}>
                <div className={styles["text-wrapper-9"]}>최저가 상점</div>
                <img className={styles.image} alt="Image" src={image} />
              </div>
            </div>

            <div className={styles["overlap-wrapper"]}>
              <div className={styles["overlap-2"]}>
                <div className={styles["text-wrapper-10"]}>가성비 템</div>
                <img className={styles.img} alt="Image" src={image2} />
              </div>
            </div>

            <div className={styles["div-wrapper"]}>
              <div className={styles["overlap-3"]}>
                <div className={styles["text-wrapper-11"]}>체형별 코디</div>
                <img className={styles["image-2"]} alt="Image" src={image3} />
              </div>
            </div>

            <div className={styles["view-3"]}>
              <div className={styles["overlap-4"]}>
                <div className={styles["text-wrapper-10"]}>축구</div>
                <img className={styles.img} alt="Image" src={image5} />
              </div>
            </div>

            <div className={styles["view-4"]}>
              <div className={styles["overlap-4"]}>
                <div className={styles["text-wrapper-10"]}>러닝</div>
                <img className={styles.img} alt="Image" src={image4} />
              </div>
            </div>

            <div className={styles["view-5"]}>
              <div className={styles["overlap-5"]}>
                <div className={styles["text-wrapper-12"]}>피트니스</div>
                <img className={styles.img} alt="Image" src={image6} />
              </div>
            </div>
          </div>

          <div className={styles["view-6"]} />
        </div>
      </div>
    </div>
  );
};

export default Top;