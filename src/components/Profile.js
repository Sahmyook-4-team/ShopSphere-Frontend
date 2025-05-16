import React from "react";
import chevronRight2 from "../assets/Profile/chevron-right-2.svg";
import chevronRight from "../assets/Profile/chevron-right.svg";
import image from "../assets/Profile/image.svg";
import styles from "../styles/Profile.module.css";

export const Profile = () => {
  return (
    <div className={styles.screen}>
      <div className={styles.div}>
        {/* 상단 프로필 설정 */}
        <div className={styles.view}>
          <div className={styles.view2} />
          <div className={styles.textWrapper}>프로필 설정</div>
        </div>

        {/* 닉네임 및 프로필 */}
        <div className={styles.view3} />
        <div className={styles.textWrapper2}>순수한라탄백</div>

        {/* 프로필 이미지 변경 버튼 */}
        <div className={styles.divWrapper}>
          <div className={styles.textWrapper3}>프로필 이미지 변경</div>
        </div>

        {/* 닉네임 변경 버튼 */}
        <div className={styles.view4}>
          <div className={styles.textWrapper3}>닉네임 변경</div>
        </div>

        {/* 기타 정보 */}
        <div className={styles.textWrapper4}>회원정보변경<br/><div className={styles.infoHint}>(이름, 휴대폰번호,이메일)</div></div>
        <div className={styles.textWrapper5}>비밀번호변경</div>
        <p className={styles.p}>개인정보 수집 및 이용 안내</p>


        {/* 이미지 및 아이콘 */}
        <img className={styles.image} alt="Image" src={image} />
        <img className={styles.chevronRight} alt="Chevron right" src={chevronRight} />
        <img className={styles.img} alt="Chevron right" src={chevronRight2} />
      </div>
    </div>
  );
};

export default Profile;
