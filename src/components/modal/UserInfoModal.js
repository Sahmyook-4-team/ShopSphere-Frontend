import React, { useState } from "react";
import styles from "../../styles/UserInfoModal.module.css";
import axios from "axios";

const UserInfoModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      // TODO: 사용자 ID를 어떻게 가져올지 결정해야 함
      const userId = 1; // 임시 사용자 ID
      
      console.log("📡 PATCH 요청 URL:", `http://localhost:8080/api/users/${userId}`);
      console.log("📡 formData:", formData);
  
      const response = await axios.patch(
        `http://localhost:8080/api/users/update`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("✅ 성공:", response.data);
  
      alert("회원정보가 수정되었습니다.");
      onClose();
    } catch (err) {
      console.error("❌ 에러:", err);
      alert("수정 실패: " + (err.response?.data?.message || "서버 오류"));
    }
  };


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
