import React from "react";
import "../styles/Header.css";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
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
        <Link to="/mypage">마이</Link> {/* ✅ 수정됨 */}
        <Link to="/search">검색</Link>
        <Link to="/cart">장바구니</Link>
      </div>

    </header>
  );
};

export default Header;
