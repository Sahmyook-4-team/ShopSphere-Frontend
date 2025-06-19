// src/components/Profile.js
import React, { useState, useEffect } from "react";
import chevronRight2 from "../assets/Profile/chevron-right-2.svg"; // 실제 경로 및 사용 여부 확인
import chevronRight from "../assets/Profile/chevron-right.svg";   // 실제 경로 및 사용 여부 확인
// import image from "../assets/Profile/image.svg"; // defaultProfileImage로 대체되었으므로 제거 가능
import styles from "../styles/Profile.module.css";
import Header from "./Header";
import UserInfoModal from "./modal/UserInfoModal";
import UserDeleteModal from "./modal/UserDeleteModal";
import PasswordChangeModal from "./modal/PasswordChangeModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileImageChangeModal from "./modal/ProfileImageChangeModal";
import defaultProfileImage from "../assets/Profile/image.svg"; // 기본 프로필 이미지 경로

export const Profile = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileImageModal, setShowProfileImageModal] = useState(false);

  const [userInfo, setUserInfo] = useState({
    name: "Guest",
    email: "",
    phoneNumber: "",
    address: "",
    role: "",
    profileImageUrl: "", // 백엔드 응답 필드명과 일치 (또는 profileImageUrl)
  });
  const [isLoading, setIsLoading] = useState(true); // 페이지 초기 로딩 및 업로드 시 사용
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // 1. 사용자 정보 불러오기 (백엔드 API /me 호출)
  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("http://localhost:8080/api/users/me", {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        });
        setUserInfo(response.data); // 백엔드 DTO의 필드명(profileImageUrl)과 일치해야 함
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
    setIsLoading(true);
    try {
      const response = await axios.patch(
        `http://localhost:8080/api/users/update`,
        updatedInfo,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setUserInfo(prev => ({ ...prev, ...response.data }));
      setShowModal(false); // 성공 시 모달 닫기
      alert("회원 정보가 성공적으로 변경되었습니다.");
      return { success: true };
    } catch (err) {
      console.error("사용자 정보 업데이트 중 오류 발생:", err);
      return {
        success: false,
        error: err.response?.data?.message || "업데이트에 실패했습니다."
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (currentPassword, newPassword) => {
    setIsLoading(true);
    try {
      await axios.patch(
        `http://localhost:8080/api/users/password`,
        { currentPassword, newPassword },
        {
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' },
        }
      );
      setShowPasswordModal(false); // 성공 시 모달 닫기
      alert("비밀번호가 성공적으로 변경되었습니다.");
      return { success: true };
    } catch (err) {
      console.error("비밀번호 변경 중 오류 발생:", err);
      return {
        success: false,
        error: err.response?.data?.message || "비밀번호 변경에 실패했습니다."
      };
    } finally {
      setIsLoading(false);
    }
  };

  // Handle account deletion
  const handleDelete = async () => {
    if (!userInfo || !userInfo.id) return { success: false, error: "사용자 정보가 없습니다." };
    setIsLoading(true);
    try {
      await axios.delete(`http://localhost:8080/api/users/delete`, { // userId를 URL에 포함하지 않음 (세션 기반)
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      alert("탈퇴가 완료되었습니다.");
      setUserInfo({ name: "Guest", profileImageUrl: "" }); // 상태 초기화
      setShowDeleteModal(false); // 모달 닫기
      navigate("/"); // 홈으로 리다이렉트
      return { success: true };
    } catch (err) {
      console.error("회원 탈퇴 중 오류 발생:", err);
      alert("탈퇴 실패: " + (err.response?.data?.message || "서버 오류"));
      return { success: false, error: err.response?.data?.message || "서버 오류" };
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 프로필 이미지 업로드 처리 함수
  const handleProfileImageUpload = async (selectedFile) => {
    if (!selectedFile) return;

    // --- 프론트엔드 즉시 미리보기 (선택 사항) ---
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserInfo(currentUserInfo => ({
        ...currentUserInfo,
        profileImageUrl: reader.result
      }));
    };
    reader.readAsDataURL(selectedFile);
    // --- 미리보기 끝 ---

    const formData = new FormData();
    formData.append("profileImageFile", selectedFile);

    setShowProfileImageModal(false); // 파일 선택 후 바로 모달 닫기

    // --- 실제 백엔드 API 호출 ---
    try {
      console.log("백엔드로 전송할 FormData 파일:", formData.get("profileImageFile"));
      setIsLoading(true); // 업로드 시작 시 로딩 상태 true
      const response = await axios.patch(
        `http://localhost:8080/api/users/profile-image`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // 업로드 성공 후, 백엔드에서 반환된 최종 이미지 URL로 상태 업데이트
      // 중요: response.data.profileImageUrl 이 백엔드 응답의 실제 필드명인지 확인!
      setUserInfo(currentUserInfo => ({
        ...currentUserInfo,
        profileImageUrl: response.data.profileImageUrl
      }));
      alert("프로필 이미지가 성공적으로 변경되었습니다.");

    } catch (err) {
      console.error("프로필 이미지 업로드 중 실제 오류 발생 (백엔드 호출 시):", err);
      alert("이미지 업로드에 실패했습니다. " + (err.response?.data?.message || "알 수 없는 오류입니다."));
      // 실패 시 롤백 로직 (예: 사용자 정보를 다시 불러와서 미리보기 된 이미지를 서버 값으로 되돌림)
      // 또는, 업로드 시도 전의 profileImageUrl을 임시 저장했다가 에러 시 복원할 수 있습니다.
      // 간단하게는 fetchUserData()를 다시 호출하여 서버의 최신 상태로 돌릴 수 있습니다.
      // fetchUserData(); // 이 경우, 미리보기로 바뀐 이미지가 다시 서버 값으로 돌아감
    } finally {
      setIsLoading(false); // 업로드 완료/실패 후 로딩 상태 false
    }
    // --- API 호출 끝 ---
  };

  return (
    <>
      <Header />
      <div className={styles.screen}>
        <div className={styles.div}> {/* 전체 컨테이너 */}
          <div className={styles.view}> {/* 상단 '프로필 설정' 타이틀 바 */}
            <div className={styles.view2} />
            <div className={styles.textWrapper}>프로필 설정</div>
          </div>

          <div className={styles.profileHeader}>
            {isLoading && !userInfo?.name ? ( // 초기 로딩 중이면서 아직 userInfo.name이 없을 때만 플레이스홀더
              <div className={`${styles.profileAvatar} ${styles.avatarPlaceholder}`} />
            ) : userInfo?.profileImageUrl ? (
              <img
                src={userInfo.profileImageUrl}
                alt="프로필"
                className={styles.profileAvatar}
                onError={(e) => { e.target.src = defaultProfileImage; }}
              />
            ) : (
              <img
                src={defaultProfileImage}
                alt="기본 프로필"
                className={styles.profileAvatar}
              />
            )}
            <div className={styles.profileName}>
              {isLoading && !userInfo?.name ? '로딩 중...' : userInfo?.name || "사용자"}
            </div>
          </div>

          <div
            className={`${styles.profileMenuItem} ${styles.divWrapper}`}
            onClick={() => setShowProfileImageModal(true)}
          >
            <div className={styles.textWrapper3}>프로필 이미지 변경</div>
            {/* <img className={styles.chevronRightIcon} alt="이동" src={someChevronIcon} /> */}
          </div>

          {/* 닉네임 변경 버튼 (UI상으로는 존재하나 기능은 아직 미구현 상태로 보임) */}
          {/* <div className={`${styles.profileMenuItem} ${styles.view4}`}>
            <div className={styles.textWrapper3}>닉네임 변경</div>
            <img className={styles.chevronRightIcon} alt="이동" src={someChevronIcon} />
          </div> */}


          <div
            className={`${styles.profileMenuItem} ${styles.textWrapper4}`}
            onClick={() => setShowModal(true)}
          >
            <div>
              회원정보변경
              <div className={styles.infoHint}>
                (이름, 휴대폰번호,이메일)
              </div>
            </div>
            <img className={styles.chevronRight1} alt="이동" src={chevronRight} />
          </div>

          <div
            className={`${styles.profileMenuItem} ${styles.textWrapper5}`}
            onClick={() => setShowPasswordModal(true)}
          >
            비밀번호변경
            <img className={styles.chevronRight2} alt="이동" src={chevronRight2} />
          </div>

          <p className={styles.p}>개인정보 수집 및 이용 안내</p>

          <a
            href="#"
            className={styles.withdrawLink}
            onClick={(e) => { e.preventDefault(); setShowDeleteModal(true); }}
          >
            회원 탈퇴
          </a>
        </div>
      </div>

      {/* 모달 렌더링 */}
      {showModal && userInfo && (
        <UserInfoModal
          userInfo={userInfo}
          onUpdate={handleUserInfoUpdate}
          onClose={() => setShowModal(false)}
        />
      )}
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
      {showProfileImageModal && (
        <ProfileImageChangeModal
          onClose={() => setShowProfileImageModal(false)}
          onUpload={handleProfileImageUpload}
        />
      )}
    </>
  );
};

export default Profile;