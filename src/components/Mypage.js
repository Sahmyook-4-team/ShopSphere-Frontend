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

// 백엔드 API의 기본 URL을 환경 변수에서 가져옵니다.
// .env 파일에 REACT_APP_API_BASE_URL=http://localhost:8080 와 같이 정의해야 합니다.
// 환경 변수가 로드되지 않을 경우를 대비하여 fallback 값을 설정할 수도 있습니다.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

const Mypage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "Guest" });
  const [isLoading, setIsLoading] = useState(true);
  
  // MyReviewsPage로 이동하는 라우트 경로 (App.js에 정의되어 있어야 함)
  const myReviewsPath = "/mypage/my-reviews"; 

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // 로그인 상태를 확인하는 API 호출
        const checkResponse = await axios.get(
          `${API_BASE_URL}/api/users/check`, // 환경 변수에서 가져온 URL 사용
          { 
            withCredentials: true,
            validateStatus: (status) => status < 500 // 500 미만의 모든 상태 코드를 성공으로 처리 (에러 핸들링 유연성 증가)
          }
        );
  
        if (checkResponse.data.isLoggedIn) {
          // 사용자 정보를 가져오는 API 호출
          const userResponse = await axios.get(
            `${API_BASE_URL}/api/users/me`, // 환경 변수에서 가져온 URL 사용
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
            // 사용자 정보 조회 실패 시 에러 처리
            throw new Error(`사용자 정보 조회 실패: ${userResponse.status}`);
          }
        } else {
          // 로그인되어 있지 않으면 로그인 페이지로 리다이렉트
          navigate("/login");
        }
      } catch (error) {
        // 오류 발생 시 콘솔에 상세 정보 로깅 후 로그인 페이지로 리다이렉트
        console.error("오류 발생:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        navigate("/login");
      } finally {
        // 로딩 상태 해제
        setIsLoading(false);
      }
    };
    
    fetchUserInfo(); // 컴포넌트 마운트 시 사용자 정보 가져오기
  }, [navigate]); // navigate가 변경될 때마다 useEffect 재실행 (드물지만 안전을 위해)

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/users/logout`, // 환경 변수에서 가져온 URL 사용
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUserInfo({ name: "Guest" });
      navigate("/login"); // 로그아웃 후 로그인 페이지로 이동
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
    }
  };

  // 로딩 중일 때 표시할 UI
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

  // 1:1 문의 내역 클릭 핸들러
  const handleInquiryClick = () => {
    navigate("/mypage/inquiries");
  };

  // 다양한 메뉴 항목에 대한 네비게이션 맵
  const navigationMap = {
    "1:1 문의 내역": handleInquiryClick,
    "취소/반품/교환 내역": () => navigate("/mypage/cancelreturn"),
    "주문 내역": () => navigate("/mypage/orders"),
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
                {/* 알림 및 설정 아이콘 */}
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
                {/* 로그아웃 버튼 */}
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

            {/* 사용자 프로필 정보 또는 로그인/회원가입 링크 */}
            {isLoggedIn ? (
              <div className="profile-section">
                <div className="profile-info">
                  {/* 프로필 이미지 표시 (없으면 기본 이미지) */}
                  {userInfo?.profileImageUrl ? (
                    <img
                      src={userInfo.profileImageUrl}
                      alt="프로필"
                      className="profile-image"
                      onError={(e) => { e.target.src = defaultProfileImage; }} // 이미지 로드 실패 시 기본 이미지
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

            {/* 적립금, 쿠폰, 후기 작성 섹션 */}
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
              onClick={navigationMap["후기 작성"]} 
              style={{ cursor: "pointer" }} 
            >
              <div className="text-wrapper-3">후기 작성</div>
              <div className="text-wrapper-4">0개</div> 
            </div>
          </div>

          {/* 동적으로 생성되는 메뉴 리스트 */}
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
            const viewClass = `view-${i + 11}`; // CSS 클래스명 계산
            const textClass = `text-wrapper-${i + 11}`; // CSS 클래스명 계산
            
            // navigationMap에 정의된 핸들러 사용, 없으면 기본 로깅 함수
            const handleClick = navigationMap[label] || (() => console.log(`${label} 클릭됨 (네비게이션 미설정)`));

            return (
              <div
                key={i}
                className={`screen ${viewClass}`}
                onClick={handleClick}
                style={{ cursor: navigationMap[label] ? "pointer" : "default" }} // 핸들러가 있으면 포인터 커서 적용
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