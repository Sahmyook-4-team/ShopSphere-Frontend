import React, { useState } from "react";
import styles from "../../styles/UserInfoModal.module.css";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";



const UserInfoModal = ({ onClose }) => {
  const { userInfo, setUserInfo } = useAuth();


  const [formData, setFormData] = useState({
    name: userInfo?.name || "",
    phoneNumber: userInfo?.phoneNumber || "",
    email: userInfo?.email || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    let response;
  
    try {
      console.log("📡 PATCH 요청 URL:", `http://localhost:8080/api/users/${userInfo.id}`);
      console.log("📡 formData:", formData);
  
      response = await axios.patch(
        `http://localhost:8080/api/users/${userInfo.id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("✅ 성공:", response.data);
  
      if (!userInfo) {
        console.warn("🚨 userInfo가 null입니다. 로그인 정보가 없는 상태에서 모달 열림");
        return null;
      }
  
      alert("회원정보가 수정되었습니다.");
      setUserInfo(response.data); // ✅ 이제 바깥에서도 접근 가능
      onClose();
    } catch (err) {
      console.error("❌ 에러:", err);
      alert("수정 실패: " + (err.response?.data?.message || "서버 오류"));
    }
  };


  if (!userInfo) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <h2>회원정보 변경</h2>

        <div className={styles.infoItem}>
          <span className={styles.label}>이름</span>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>휴대폰번호</span>
          <input
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <div className={styles.infoItem}>
          <span className={styles.label}>이메일</span>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={styles.input}
          />
        </div>

        <button className={styles.closeBtn} onClick={handleSave}>확인</button>
      </div>
    </div>
  );
};

export default UserInfoModal;
