import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Mypage from "./components/Mypage";
import { AuthProvider, useAuth } from "./components/contexts/AuthContext";
import "./App.css";
import Main from "./components/main";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";

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
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />      {/* ✅ 여기 있어야 함 */}
        <Route path="/signup" element={<Signup />} /> {/* ✅ 회원가입 라우팅 */}
        <Route path="/mypage" element={<Mypage />} /> {/* ✅ 마이페이지 라우팅 */}
        <Route path="/mypage/profile" element={<Profile />} /> {/* ✅ 프로필 라우팅 */}
      </Routes>
    </>
  );
}

export default App;
