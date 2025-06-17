import React, { useState, useRef, useEffect } from "react";
import styles from "../../styles/UserInfoModal.module.css";

const PasswordChangeModal = ({ onChangePassword, onClose }) => {
    const currentPwRef = useRef();

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
        if (!form.currentPassword) {
            setError("현재 비밀번호를 입력해주세요.");
            currentPwRef.current?.focus();
            return false;
        }
        if (!form.newPassword) {
            setError("새 비밀번호를 입력해주세요.");
            return false;
        }
        if (form.newPassword !== form.confirmPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        
        if (!validateForm()) return;
        
        setError("");
        setIsSubmitting(true);

        try {
            const result = await onChangePassword(form.currentPassword, form.newPassword);
            
            if (result.success) {
                alert("비밀번호가 성공적으로 변경되었습니다.");
                onClose();
            } else {
                if (result.error?.includes("일치하지 않습니다")) {
                    setError("현재 비밀번호가 일치하지 않습니다.");
                    setForm(prev => ({
                        ...prev,
                        currentPassword: ""
                    }));
                    currentPwRef.current?.focus();
                } else {
                    setError(result.error || "비밀번호 변경에 실패했습니다.");
                }
            }
        } catch (err) {
            console.error("비밀번호 변경 중 오류 발생:", err);
            setError("처리 중 오류가 발생했습니다. 다시 시도해주세요.");
        } finally {
            setIsSubmitting(false);
        }
    };



    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                <h2>비밀번호 변경</h2>

                <input
                    type="password"
                    name="currentPassword"
                    placeholder="현재 비밀번호"
                    value={form.currentPassword}
                    onChange={handleChange}
                    className={styles.input}
                    ref={currentPwRef} // ✅ ref 연결
                />
                <br/><br/>
                <input
                    type="password"
                    name="newPassword"
                    placeholder="새 비밀번호"
                    value={form.newPassword}
                    onChange={handleChange}
                    className={styles.input}
                />
                <br/><br/>
                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="새 비밀번호 확인"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    className={styles.input}
                /><br/><br/>
                {error && <div className={styles.errorMessage} style={{ marginBottom: '15px' }}>{error}</div>}
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
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? '변경 중...' : '변경하기'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
