import React, { useState, useRef } from "react";
import styles from "../../styles/UserInfoModal.module.css";
import axios from "axios";

const PasswordChangeModal = ({ onClose }) => {
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

    const handleSubmit = async () => {
        if (form.newPassword !== form.confirmPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        try {
            // TODO: 사용자 ID를 어떻게 가져올지 결정해야 함
            const userId = 1; // 임시 사용자 ID
            await axios.patch(`http://localhost:8080/api/users/${userId}/password`, form, {
                withCredentials: true,
            });

            alert("비밀번호가 변경되었습니다.");

            // 🔄 form 전체 초기화
            setForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });

            onClose(); // 모달 닫기

        } catch (err) {
            const msg = err.response?.data?.message || "서버 오류";

            if (msg.includes("일치하지 않습니다")) {
                alert("현재 비밀번호가 일치하지 않습니다.");

                // 🔄 currentPassword만 초기화하고 포커스
                setForm((prev) => ({
                    ...prev,
                    currentPassword: "",
                }));
                currentPwRef.current?.focus();
                return;
            }

            alert("변경 실패: " + msg);
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
                <button className={styles.closeBtn} onClick={handleSubmit}>변경하기</button>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
