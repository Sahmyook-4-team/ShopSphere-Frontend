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
import { AuthProvider } from "./components/contexts/AuthContext"; // ✅ 추가
import "./App.css";
import KakaoCallback from "./components/KakaoCallback";

function App() {
  return (
    <AuthProvider> {/* ✅ 전역 상태 감싸기 */}
      <Router>
        <MainLayout />
      </Router>
    </AuthProvider>
  );
}

function MainLayout() {
  const location = useLocation();
  const hiddenNavPaths = ["/login", "/mypage", "/cartoption"];
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
          <span> </span>
          <Link to="/cartoption">장바구니</Link>
        </nav>
      )}
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/kakao-callback" element={<KakaoCallback />} />
        <Route path="/cartoption" element={<CartOption />} />
      </Routes>
    </>
  );
}

export default App;
