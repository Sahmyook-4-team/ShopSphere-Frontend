// Mypage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Mypage.css";
import chevronRight from "../assets/Mypage/chevron-right.svg";
import image2 from "../assets/Mypage/image-2.svg";
import settings from "../assets/Mypage/settings.svg";
import vector from "../assets/Mypage/vector.svg";
import Header from "./Header";
import axios from "axios";
import defaultProfileImage from "../assets/Profile/image.svg";

const Mypage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "Guest" });
  const [isLoading, setIsLoading] = useState(true);
  // --- 추가 ---
  // MyReviewsPage로 이동하는 라우트 경로 (App.js에 정의되어 있어야 함)
  // 예를 들어, App.js에 <Route path="/mypage/my-reviews" element={<MyReviewsPage />} /> 가 있다고 가정
  const myReviewsPath = "/mypage/my-reviews"; 


  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const checkResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/check`, // 환경 변수 사용
          { 
            withCredentials: true,
            validateStatus: (status) => status < 500
          }
        );
  
        if (checkResponse.data.isLoggedIn) {
          const userResponse = await axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/users/me`, // 환경 변수 사용
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );
          
          if (userResponse.status === 200) {
            setUserInfo({
              name: userResponse.data.name || "사용자",
              email: userResponse.data.email || "",
              id: userResponse.data.id || "",
              phoneNumber: userResponse.data.phoneNumber || "",
              address: userResponse.data.address || "",
              role: userResponse.data.role || "USER",
              profileImageUrl: userResponse.data.profileImageUrl || null
            });
            setIsLoggedIn(true);
          } else {
            throw new Error(`사용자 정보 조회 실패: ${userResponse.status}`);
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("오류 발생:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchUserInfo();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/logout`, // 환경 변수 사용
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUserInfo({ name: "Guest" });
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <div>로딩 중...</div>
        </div>
      </>
    );
  }

  const handleInquiryClick = () => {
    navigate("/mypage/inquiries");
  };

  const navigationMap = {
    "1:1 문의 내역": handleInquiryClick,
    "취소/반품/교환 내역": () => navigate("/mypage/cancelreturn"),
    "주문 내역": () => navigate("/mypage/orders"),
    // "나의 맞춤 정보": () => navigate("/mypage/custom-info"),
    // --- "후기 작성" 항목에 대한 네비게이션 추가 ---
    "후기 작성": () => navigate(myReviewsPath), // App.js에 정의된 경로로 이동
  };


  return (
    <>
      <Header />
      <div className="screen">
        <div className="div">
          <div className="overlap">
            {isLoggedIn && (
              <>
                <div className="bell">
                  <div className="overlap-group">
                    <img className="vector" alt="Vector" src={vector} />
                  </div>
                </div>
                <img
                  className="settings"
                  alt="Settings"
                  src={settings}
                  onClick={() => navigate("/mypage/profile")}
                  style={{ cursor: "pointer" }}
                />
                <button 
                  className="logout-link" 
                  onClick={handleLogout}
                  style={{ 
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    font: 'inherit',
                    cursor: 'pointer',
                    color: 'inherit',
                    textDecoration: 'underline'
                  }}
                >
                  로그아웃
                </button>
              </>
            )}

            {isLoggedIn ? (
              <div className="profile-section">
                <div className="profile-info">
                  {userInfo?.profileImageUrl ? (
                    <img
                      src={userInfo.profileImageUrl}
                      alt="프로필"
                      className="profile-image"
                      onError={(e) => { e.target.src = defaultProfileImage; }}
                    />
                  ) : (
                    <img
                      src={defaultProfileImage}
                      alt="기본 프로필"
                      className="profile-image"
                    />
                  )}
                  <div className="text-wrapper">{userInfo?.name || "사용자"}</div>
                </div>
              </div>
            ) : (
              <Link
                className="text-wrapper-2"
                to="/login"
                style={{ cursor: "pointer" }}
              >
                로그인/회원가입하기
              </Link>
            )}

            <div className="view">
              <div className="text-wrapper-3">적립금</div>
              <div className="text-wrapper-4">0원</div>
            </div>
            <div className="view-2">
              <div className="text-wrapper-3">쿠폰</div>
              <div className="text-wrapper-4">0개</div>
            </div>
            {/* "후기 작성" 섹션을 클릭 가능하게 변경 */}
            <div 
              className="view-3" 
              onClick={navigationMap["후기 작성"]} // navigationMap 사용
              style={{ cursor: "pointer" }} // 클릭 가능 표시
            >
              <div className="text-wrapper-3">후기 작성</div>
              <div className="text-wrapper-4">0개</div> {/* 이 개수는 동적으로 바뀔 수 있음 */}
            </div>
          </div>

          {[
            "주문 내역",
            "취소/반품/교환 내역",
            "재입고 알림 내역",
            "최근 본 상품",
            "나의 브랜드 리스트",
            "나의 맞춤 정보",
            "고객센터",
            "1:1 문의 내역",
            "상품 문의 내역",
            "공지사항",
          ].map((label, i) => {
            const viewClass = `view-${i + 11}`;
            const textClass = `text-wrapper-${i + 11}`;
            
            const handleClick = navigationMap[label] || (() => console.log(`${label} 클릭됨 (네비게이션 미설정)`));

            return (
              <div
                key={i}
                className={`screen ${viewClass}`}
                onClick={handleClick}
                style={{ cursor: navigationMap[label] ? "pointer" : "default" }} // 핸들러 있으면 포인터
              >
                <div className={textClass}>{label}</div>
                <img className="chevron-right" alt=">" src={chevronRight} />
              </div>
            );
          })}

          <img className="image" alt="Image" src={image2} />
        </div>
      </div>
    </>
  );
};

export default Mypage;