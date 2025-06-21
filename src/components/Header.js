import React, { useState } from "react"; 
import "../styles/Header.css"; // 이 경로로 보아 Header.js는 예를 들어 src/layout/Header.js 와 같은 위치에 있을 수 있습니다.
import { Link } from "react-router-dom";
import SearchModal from "../components/SearchModal/SearchModal"; 

export const Header = () => {
  // 3. 모달의 열림/닫힘 상태를 관리하는 state를 선언합니다. 초기값은 false(닫힘).
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // 4. "검색" 링크 클릭 시 실행될 핸들러 함수입니다.
  const handleSearchLinkClick = (event) => {
    event.preventDefault(); // Link의 기본 동작(페이지 이동)을 막습니다.
    setIsSearchModalOpen(true); // 모달을 열도록 상태를 변경합니다.
  };

  // 5. SearchModal에서 닫기 버튼 등을 클릭했을 때 모달을 닫는 함수입니다.
  const closeSearchModal = () => {
    setIsSearchModalOpen(false); // 모달을 닫도록 상태를 변경합니다.
  };

  return (
    // 6. Header 컴포넌트와 SearchModal을 함께 반환하기 위해 Fragment(<></>)로 감싸줍니다.
    <>
      <header className="header">
        <div className="header-left">
          <button className="menu-button">☰</button>
          {/* 이게 주석이라고?ㅋㅋㅋ */}
          <div className="nav-links">
            <a href="/">MUSINSA</a>
            <a href="/">BEAUTY</a>
            <a href="/">PLAYER</a>
            <a href="/">OUTLET</a>
            <a href="/">BOUTIQUE</a>
            <a href="/">SHOES</a>
            <a href="/">KIDS</a>
            <a href="/">ISI SNAP</a>
          </div>
        </div>
        
        <div className="header-right">
          <Link to="/store">오프라인 스토어</Link>
          <Link to="/likes">좋아요</Link>
          <Link to="/mypage">마이</Link>
          <Link to="/search" onClick={handleSearchLinkClick}>검색</Link>
          <Link to="/cart">장바구니</Link>
        </div>
      </header>

      <SearchModal isOpen={isSearchModalOpen} onClose={closeSearchModal} />
    </>
  );
};

export default Header;