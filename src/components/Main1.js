// Main.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import Top from "./main/Top";
import Middle from "./main/Middle";
import Bottom from "./main/Bottom";
import ChatBot from "./chatbot/ChatBot"; // ChatBot 컴포넌트 import
import styles from "../styles/Main.module.css"; // Main.module.css (필요하다면)

export const Main = () => {
    const [userRole, setUserRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedRole = localStorage.getItem('userRole');
        if (storedRole) {
            setUserRole(storedRole);
        }
    }, []);

    const handleGoToSellerPage = () => {
        navigate("/seller");
    };

    // 판매자 페이지 버튼 스타일 (챗봇 버튼 위에 위치하도록)
    const sellerPageButtonStyle = {
        position: 'fixed', // 화면에 고정
        bottom: '100px',   // 챗봇 버튼 기본 bottom(30px) + 챗봇 버튼 높이(60px) + 간격(10px)
        right: '30px',     // 챗봇 버튼과 동일한 right 값
        padding: '12px 20px', // 패딩 조정
        fontSize: '14px',     // 폰트 크기 조정
        color: 'white',
        backgroundColor: '#007bff',
        border: 'none',
        borderRadius: '8px', // 둥근 모서리
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)', // 그림자 효과
        zIndex: 999, // 챗봇 버튼(z-index: 1000) 바로 아래 또는 독립적으로
        transition: 'all 0.3s ease', // 부드러운 효과
    };

    // 판매자 페이지 버튼 호버 스타일 (인라인 스타일로는 직접 적용 어려움, CSS 클래스 권장)
    // 만약 인라인으로 하고 싶다면 onMouseEnter, onMouseLeave 이벤트 핸들러 사용 필요
    // 여기서는 기본 스타일만 적용

    return (
        <>
            <Header />
            {/* 메인 컨텐츠 영역, 하단 고정 요소들과 겹치지 않도록 padding-bottom 조절 가능 */}
            <div style={{ position: "relative", top: "71px", paddingBottom: "180px" }}> {/* 하단 고정 요소들 공간 확보 */}
                <Top />
                <Middle />
                <div className={styles.wrapperRow}>
                    <Bottom productIdFromProps={100} />
                    <Bottom productIdFromProps={101} />
                    <Bottom productIdFromProps={102} />
                    <Bottom productIdFromProps={103} />
                </div>
            </div>

            {/* 역할(role)이 'SELLER'일 때만 판매자 페이지 버튼 렌더링 */}
            {userRole === 'SELLER' && (
                <button
                    onClick={handleGoToSellerPage}
                    style={sellerPageButtonStyle}
                    // 호버 효과를 위해 className을 추가하고 CSS 파일에서 관리하는 것이 더 좋음
                    // 예: className={`${styles.fixedButton} ${styles.sellerButton}`}
                >
                    판매자 페이지
                </button>
            )}

            <ChatBot />
        </>
    );
};

export default Main;