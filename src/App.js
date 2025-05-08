import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Box from "./components/Box";
import Background from "./components/Background"; // 로그인 페이지
import "./App.css";

function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();

  // "/login" 경로에서는 nav 숨김
  const hideNav = location.pathname === "/login";

  return (
    <>
      {!hideNav && (
        <nav>
          <Link to="/box">회원가입</Link>
          <span> </span> {/* 공백 추가 ㅋㅋ */}
          <Link to="/login">로그인</Link>
        </nav>
      )}

      <Routes>
        <Route path="/box" element={<Box />} />
        <Route path="/login" element={<Background />} />
      </Routes>
    </>
  );
}

export default App;
