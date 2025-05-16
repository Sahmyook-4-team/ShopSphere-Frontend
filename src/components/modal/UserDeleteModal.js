import React from "react";
import styles from "../../styles/UserInfoModal.module.css"; // 기존 모달 스타일 재사용

const UserDeleteModal = ({ onClose, onConfirm }) => {
  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
        <h3>정말 탈퇴하시겠습니까?</h3>
        <p>이 작업은 되돌릴 수 없습니다.</p>
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "space-between" }}>
          <button onClick={onConfirm} style={{ backgroundColor: "red", color: "white" }}>
            네, 탈퇴할게요
          </button>
          <button onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default UserDeleteModal;
