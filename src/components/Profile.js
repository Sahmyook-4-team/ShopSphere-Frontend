import React, { useState, useEffect } from "react";
import chevronRight2 from "../assets/Profile/chevron-right-2.svg";
import chevronRight from "../assets/Profile/chevron-right.svg";
import image from "../assets/Profile/image.svg";
import styles from "../styles/Profile.module.css";
import Header from "./Header";
import UserInfoModal from "./modal/UserInfoModal";
import UserDeleteModal from "./modal/UserDeleteModal";
import PasswordChangeModal from "./modal/PasswordChangeModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "Guest" });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error("사용자 정보를 불러오는 중 오류 발생:", err);
        setError("사용자 정보를 불러오는 데 실패했습니다.");
        if (err.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  // Handle user info update
  const handleUserInfoUpdate = async (updatedInfo) => {
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/users/update`,
        updatedInfo,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      setUserInfo(prev => ({ ...prev, ...response.data }));
      return { success: true };
    } catch (err) {
      console.error("사용자 정보 업데이트 중 오류 발생:", err);
      return { 
        success: false, 
        error: err.response?.data?.message || "업데이트에 실패했습니다." 
      };
    }
  };

  // Handle password change
  const handlePasswordChange = async (currentPassword, newPassword) => {
    try {
      await axios.patch(
        `http://localhost:8080/api/users/${userInfo.id}/password`,
        { currentPassword, newPassword },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      return { success: true };
    } catch (err) {
      console.error("비밀번호 변경 중 오류 발생:", err);
      return { 
        success: false, 
        error: err.response?.data?.message || "비밀번호 변경에 실패했습니다." 
      };
    }
  };

  const handleDelete = async () => {
    if (!userInfo) return;

    try {
      await axios.delete(`http://localhost:8080/api/users/${userInfo.id}`, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      alert("탈퇴가 완료되었습니다.");
      // Clear any existing user data
      setUserInfo({ name: "Guest" });
      // Redirect to home or login page
      navigate("/");
    } catch (err) {
      console.error("회원 탈퇴 중 오류 발생:", err);
      alert("탈퇴 실패: " + (err.response?.data?.message || "서버 오류"));
      return { success: false };
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
            {isLoading ? '로딩 중...' : userInfo?.name || "순수한라탄백"}
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
        <UserInfoModal 
          userInfo={userInfo}
          onUpdate={handleUserInfoUpdate}
          onClose={() => setShowModal(false)} 
        />
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
        <PasswordChangeModal 
          onClose={() => setShowPasswordModal(false)}
          onChangePassword={handlePasswordChange}
        />
      )}
    </>
  );
};

export default Profile;
