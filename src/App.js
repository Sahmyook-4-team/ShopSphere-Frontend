import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login"; // 로그인 페이지
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
          <Link to="/signup">회원가입</Link>
          <span> </span> {/* 공백 추가 ㅋㅋ */}
          <Link to="/login">로그인</Link>
        </nav>
      )}

      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
