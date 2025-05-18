import React, { useState } from "react";
import chevronRight2 from "../assets/Profile/chevron-right-2.svg";
import chevronRight from "../assets/Profile/chevron-right.svg";
import image from "../assets/Profile/image.svg";
import styles from "../styles/Profile.module.css";
import Header from "./Header";
import UserInfoModal from "./modal/UserInfoModal";
import { useAuth } from "./contexts/AuthContext"; // ✅ isInitialized 가져오기
import UserDeleteModal from "./modal/UserDeleteModal";
import PasswordChangeModal from "./modal/PasswordChangeModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { userInfo, setUserInfo, isInitialized } = useAuth(); // ✅ 추가
  const navigate = useNavigate();

  // ✅ 로그인 복구 중일 때 렌더링 보류
  if (!isInitialized) return null;

  const handleDelete = async () => {
    if (!userInfo) return;

    const userId = userInfo.id;
    try {
      await axios.delete(`http://localhost:8080/api/users/${userId}`, {
        withCredentials: true,
      });
      alert("탈퇴 완료되었습니다.");
      setUserInfo(null);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("탈퇴 실패: " + (err.response?.data?.message || "서버 오류"));
    }
  };

  return (
    <>
      <Header />
      <div className={styles.screen}>
        <div className={styles.div}>
          <div className={styles.view}>
            <div className={styles.view2} />
            <div className={styles.textWrapper}>프로필 설정</div>
          </div>

          <div className={styles.view3} />
          <div className={styles.textWrapper2}>
            {userInfo?.name || "순수한라탄백"}
          </div>

          <div className={styles.divWrapper}>
            <div className={styles.textWrapper3}>프로필 이미지 변경</div>
          </div>

          <div className={styles.view4}>
            <div className={styles.textWrapper3}>닉네임 변경</div>
          </div>

          <div
            className={styles.textWrapper4}
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
          >
            회원정보변경
            <br />
            <div className={styles.infoHint}>
              (이름, 휴대폰번호,이메일)
            </div>
          </div>

          <div
            className={styles.textWrapper5}
            onClick={() => setShowPasswordModal(true)}
            style={{ cursor: "pointer" }}
          >
            비밀번호변경
          </div>
          <p className={styles.p}>개인정보 수집 및 이용 안내</p>

          <img className={styles.image} alt="Image" src={image} />
          <img className={styles.chevronRight} alt="Chevron right" src={chevronRight} />
          <img className={styles.img} alt="Chevron right" src={chevronRight2} />
        </div>
      </div>

      {showModal && userInfo && (
        <UserInfoModal onClose={() => setShowModal(false)} />
      )}

      <a
        href="#"
        className={styles.withdrawLink}
        onClick={(e) => {
          e.preventDefault();
          setShowDeleteModal(true);
        }}
      >
        회원 탈퇴
      </a>

      {showDeleteModal && (
        <UserDeleteModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
        />
      )}

      {showPasswordModal && (
        <PasswordChangeModal onClose={() => setShowPasswordModal(false)} />
      )}
    </>
  );
};

export default Profile;
