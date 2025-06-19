// src/components/modal/ProfileImageChangeModal.js
import React from 'react';
import styles from '../../styles/ProfileImageChangeModal.module.css'; // 새 CSS 모듈 파일

const ProfileImageChangeModal = ({ onClose, onUpload }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onUpload(file); // 선택된 파일을 부모 컴포넌트로 전달
      onClose(); // 파일 선택 후 자동으로 닫히게 하려면 주석 해제
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h3 className={styles.modalTitle}>프로필 이미지 변경</h3>
          <button className={styles.closeButton} onClick={onClose}>
            × {/* X 아이콘 */}
          </button>
        </div>
        <div className={styles.modalBody}>
          {/* 실제 파일 입력을 위한 input, 시각적으로는 label을 클릭 */}
          <input
            type="file"
            id="profileImageUpload"
            accept="image/*" // 이미지 파일만 허용
            style={{ display: 'none' }} // 실제 input은 숨김
            onChange={handleFileChange}
          />
          <label htmlFor="profileImageUpload" className={styles.uploadOption}>
            사진 올리기
          </label>
          {/* 필요하다면 다른 옵션들 (예: 기본 이미지로 변경, 사진 삭제 등) 추가 */}
          {/* <div className={styles.uploadOption}>기본 이미지로 변경</div> */}
          {/* <div className={`${styles.uploadOption} ${styles.deleteOption}`}>사진 삭제</div> */}
        </div>
      </div>
    </div>
  );
};

export default ProfileImageChangeModal;