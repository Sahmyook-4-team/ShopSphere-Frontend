import React from "react";
import "../styles/Header.css";

export const Header = () => {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-button">☰</button>
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
        <a href="/">오프라인 스토어</a>
        <a href="/">좋아요</a>
        <a href="/">마이</a>
        <a href="/">검색</a>
        <a href="/">장바구니</a>
      </div>
    </header>
  );
};
