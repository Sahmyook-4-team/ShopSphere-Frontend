import React, { useState, useEffect } from "react";
import styles from "../../styles/UserInfoModal.module.css";

const UserInfoModal = ({ userInfo, onUpdate, onClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Initialize form with user data when component mounts or userInfo changes
  useEffect(() => {
    if (userInfo) {
      setFormData({
        name: userInfo.name || "",
        phoneNumber: userInfo.phoneNumber || "",
        email: userInfo.email || "",
      });
    }
  }, [userInfo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (isSubmitting) return;
    
    setError("");
    setIsSubmitting(true);
    
    try {
      const result = await onUpdate(formData);
      if (result.success) {
        onClose();
      }
    } catch (err) {
      console.error("❌ 에러:", err);
      setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
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

        {error && <div className={styles.errorMessage}>{error}</div>}
        <div className={styles.buttonContainer}>
          <button 
            className={`${styles.button} ${styles.cancelButton}`} 
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button 
            className={`${styles.button} ${styles.saveButton}`} 
            onClick={handleSave}
            disabled={isSubmitting}
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserInfoModal;
