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
import InquiryHistory from "./components/inquiry/InquiryHistory";
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
import SellerPage from './components/seller/SellerPage'; // 판매자 페이지 컴포넌트
import ProductRegistrationForm from './components/seller/ProductRegistrationForm'; 
import PaymentSuccessPage from './components/PaymentSuccessPage'; // 생성할 컴포넌트
import PaymentFailPage from './components/PaymentFailPage'; 
import InquiryChatRoom from './components/inquiry/InquiryChatRoom';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/payment/success" element={<PaymentSuccessPage />} />
        <Route path="/payment/fail" element={<PaymentFailPage />} />

        {/* 👇 이 부분을 수정했습니다 👇 */}
        <Route 
          path="/" 
          element={
            <div className="app-container">
              <Main />
            </div>
          } 
        />
        
        <Route path="/oauth/kakao/callback" element={<KakaoCallback />} /> 
        <Route path="/cartoption" element={<CartOption />} />
        <Route path="/searchdialog" element={<SearchDialog />} />
        <Route path="/mypage/inquiries" element={<InquiryHistory />} />
        {/* '/' 경로가 중복되므로 아래 라인은 삭제해도 됩니다. */}
        {/* <Route path="/" element={<Main />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/mypage/profile" element={<Profile />} />
        <Route path="/product/:productId" element={<ProductPage />} />      
        <Route path="/cart" element={<ShoppingCartPage />} />
        <Route path="/search-results" element={<SearchResultsPage />} />
        <Route path="/products/:productId" element={<ProductPage />} />
        <Route path="/mypage/cancelreturn" element={<CancelReturn />} />
        <Route path="/mypage/orders" element={<MyOrderHistorySection />} />
        <Route path="/write-review/:productId" element={<ReviewWritePage />} />
        <Route path="/mypage/my-reviews" element={<MyReviewsPage />} />
        <Route path="/seller" element={<SellerPage />} />
        <Route path="/seller/product/new" element={<ProductRegistrationForm />} /> 
        <Route path="/inquiry" element={<InquiryHistory />} />
        <Route path="/inquiry/chat/:roomId" element={<InquiryChatRoom />} />
      </Routes>
    </Router>
  );
}

const ReviewWritePage = () => {
  const { productId } = useParams();
  return <ReviewWriteForm productId={productId} />;
};

export default App;