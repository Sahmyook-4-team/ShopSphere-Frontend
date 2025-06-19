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
import Main from "./components/Main1";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Profile from "./components/Profile";
import CartOption from "./components/CartOption";
import SearchDialog from "./components/SearchDialog";
import ShoppingCartPage from "./components/ShoppingCartPage";
import ProductItem from "./components/ProductItem";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/kakao-callback" element={<KakaoCallback />} />
        <Route path="/cartoption" element={<CartOption />} />
        <Route path="/searchdialog" element={<SearchDialog />} />
        <Route path="/mypage/inquiries" element={<InquiryHistory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/profile" element={<Profile />} />
        <Route path="/cart" element={<ShoppingCartPage />} />
      </Routes>
    </Router>
  );
}

export default App;