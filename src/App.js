import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useParams,
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
import ProductPage from "./components/productright/ProductPage"; // ◀️ ProductPage 컴포넌트 import
import ShoppingCartPage from "./components/ShoppingCartPage";
import SearchResultsPage from './components/SearchResultsPage'; // 새로 만들 검색 결과 페이지
import ProductItem from "./components/ProductItem";
import CancelReturn from "./components/CancelReturn";
import MyOrderHistorySection from "./components/OrderHistory/MyOrderHistorySection";
import ReviewWriteForm from "./components/ReviewWrite/ReviewWriteForm";
import MyReviewsPage from "./components/MyReviews/MyReviewsPage";
import SellerPage from './components/SellerPage'; // 판매자 페이지 컴포넌트

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/kakao-callback" element={<KakaoCallback />} />
        <Route path="/cartoption" element={<CartOption />} />
        <Route path="/searchdialog" element={<SearchDialog />} />
        <Route path="/mypage/inquiries" element={<InquiryHistory />} />
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />      {/* ✅ 여기 있어야 함 */}
        <Route path="/signup" element={<Signup />} /> {/* ✅ 회원가입 라우팅 */}
        <Route path="/mypage" element={<Mypage />} /> {/* ✅ 마이페이지 라우팅 */}
        <Route path="/mypage/profile" element={<Profile />} /> {/* ✅ 프로필 라우팅 */}
        {/* ✅ 상품 상세 페이지 라우트 추가 (동적 파라미터 productId 사용) */}
        <Route path="/product/:productId" element={<ProductPage />} />      
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/mypage/cancelreturn" element={<CancelReturn />} />
        <Route path="/mypage/orders" element={<MyOrderHistorySection />} />
        <Route path="/write-review/:productId" element={<ReviewWritePage />} />
        <Route path="/mypage/my-reviews" element={<MyReviewsPage />} />
        <Route path="/seller-page" element={<SellerPage />} /> {/* 판매자 페이지 라우트 */}
      </Routes>
    </Router>
  );
}

const ReviewWritePage = () => {
  const { productId } = useParams(); // URL에서 productId를 가져옴
  // 필요하다면 여기서 productId로 상품 정보를 미리 가져와서 ReviewWriteForm에 initialProductInfo로 전달할 수 있습니다.
  // 또는 ReviewWriteForm 내부에서 직접 가져오도록 둡니다.
  return <ReviewWriteForm productId={productId} />;
};

export default App;