import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
} from "react-router-dom";
import Mypage from "./components/Mypage";
import "./App.css";

import KakaoCallback from "./components/KakaoCallback";
import InquiryHistory from "./components/InquiryHistory";
import Main from "./components/Main1"; // 바꿈
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";

import  CartOption from "./components/CartOption";
import SearchDialog from "./components/SearchDialog";


function App() {
  return (
    <Router>
      <MainLayout />
    </Router>
  );
}

function MainLayout() {
  const location = useLocation();
  const hiddenNavPaths = ["/login", "/mypage", "/cartoption", "/mypage/profile"];
  const hideNav = hiddenNavPaths.includes(location.pathname);

  return (
    <>
      <Routes>
         <Route path="/oauth/kakao/callback" element={<KakaoCallback />} />
        <Route path="/cartoption" element={<CartOption />} />
        <Route path="/searchdialog" element={<SearchDialog />} />
        <Route path="/mypage/inquiries" element={<InquiryHistory />} />
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
