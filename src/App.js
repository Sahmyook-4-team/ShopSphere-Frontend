import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Mypage from "./components/Mypage";
import CartOption from "./components/CartOption";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import Profile from "./components/Profile"; // ✅ 추가
import SearchDialog from "./components/SearchDialog"; // 검색 다이얼로그 ✅ 추가
import "./App.css";
import KakaoCallback from "./components/KakaoCallback";
import InquiryHistory from "./components/InquiryHistory";

// ✅ 인증 복구가 끝난 후에만 렌더링
function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

function AppContent() {
  const { isInitialized } = useAuth();

  if (!isInitialized) return <div>로딩 중...</div>; // ✅ 복구 전에는 대기

  return <MainLayout />;
}

function MainLayout() {
  const location = useLocation();
  const hiddenNavPaths = ["/login", "/mypage", "/cartoption", "/mypage/profile"];
  const hideNav = hiddenNavPaths.includes(location.pathname);

  return (
    <>
      {!hideNav && (
        <nav>
          <Link to="/signup">회원가입</Link>
          <span> </span>
          <Link to="/login">로그인</Link>
          <span> </span>
          <Link to="/mypage">마이페이지</Link>
          <span> </span> {/* 공백 추가 ㅋㅋ */}
          <Link to="/searchdialog">검색창</Link>
          <span> </span>
          <Link to="/cartoption">장바구니</Link>
        </nav>
      )}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/profile" element={<Profile />} />
        <Route path="/kakao-callback" element={<KakaoCallback />} />
        <Route path="/cartoption" element={<CartOption />} />
          <Route path="/searchdialog" element={<SearchDialog />} />
          <Route path="/mypage/inquiries" element={<InquiryHistory />} />
      </Routes>
    </>
  );
}

export default App;
