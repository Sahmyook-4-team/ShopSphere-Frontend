import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Mypage.css";
import chevronRight from "../assets/Mypage/chevron-right.svg";
import image2 from "../assets/Mypage/image-2.svg";
import settings from "../assets/Mypage/settings.svg";
import vector from "../assets/Mypage/vector.svg";
import Header from "./Header";
import axios from "axios";
import defaultProfileImage from "../assets/Profile/image.svg"; // 기본 프로필 이미지 경로

const Mypage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: "Guest" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        //console.log("사용자 정보 요청 시작...");
        
        // 1. 먼저 세션 체크
        const checkResponse = await axios.get(
          "http://localhost:8080/api/users/check",
          { 
            withCredentials: true,
            validateStatus: (status) => status < 500
          }
        );
        
        //console.log("세션 체크 응답:", checkResponse.data);
  
        if (checkResponse.data.isLoggedIn) {
          // 2. 로그인된 경우에만 사용자 정보 요청
          //console.log("사용자 정보 요청 중...");
          const userResponse = await axios.get(
            "http://localhost:8080/api/users/me",
            { 
              withCredentials: true,
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              }
            }
          );
          
          //console.log("사용자 정보 응답:", userResponse);
          
          if (userResponse.status === 200) {
            setUserInfo({
              name: userResponse.data.name || "사용자",
              email: userResponse.data.email || "",
              id: userResponse.data.id || "",
              phoneNumber: userResponse.data.phoneNumber || "",
              address: userResponse.data.address || "",
              role: userResponse.data.role || "USER",
              profileImageUrl: userResponse.data.profileImageUrl || null // ★ 핵심: 프로필 이미지 URL 추가
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
        "http://localhost:8080/api/users/logout",
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

  // 문의 내역으로 이동하는 핸들러 함수
  const handleInquiryClick = () => {
    navigate("/mypage/inquiries"); // InquiryHistory 페이지의 라우트 경로
  };

  // 각 항목별로 클릭 이벤트를 처리하기 위한 맵핑 객체 (선택 사항)
  // 여기서는 1:1 문의 내역만 처리하므로 간단하게 함수를 직접 사용해도 됩니다.
  const navigationMap = {
    "1:1 문의 내역": handleInquiryClick,
    "취소/반품/교환 내역": () => navigate("/mypage/cancelreturn"),
    // 다른 항목들도 필요하면 여기에 추가할 수 있습니다.
    // "주문 내역": () => navigate("/mypage/orders"),
    // "나의 맞춤 정보": () => navigate("/mypage/custom-info"),
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
                {/* 프로필 이미지 렌더링 */}
                {userInfo?.profileImageUrl ? ( // ★ 핵심: 상태에 저장된 URL이 있으면
                  <img
                    src={userInfo.profileImageUrl} // ★ 핵심: 해당 URL을 이미지 소스로 사용
                    alt="프로필"
                    className="profile-image"
                    onError={(e) => { e.target.src = defaultProfileImage; }}
                  />
                ) : ( // URL이 없으면 (null 또는 빈 문자열)
                  <img
                    src={defaultProfileImage} // 기본 이미지 사용
                    alt="기본 프로필"
                    className="profile-image"
                  />
                )}
                <div className="text-wrapper"> {/* 사용자 이름 */}
                  {userInfo?.name || "사용자"}
                </div>
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
            <div className="view-3">
              <div className="text-wrapper-3">후기 작성</div>
              <div className="text-wrapper-4">0개</div>
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
            "1:1 문의 내역", // 이 항목을 클릭하면 이동해야 합니다.
            "상품 문의 내역",
            "공지사항",
          ].map((label, i) => {
            const viewClass = `view-${i + 11}`;
            const textClass = `text-wrapper-${i + 11}`;

            // ✅ 클릭 핸들러를 조건부로 적용합니다.
            const handleClick = navigationMap[label] || (() => console.log(`${label} 클릭됨`));

            return (
              <div
                key={i}
                className={`screen ${viewClass}`}
                onClick={handleClick} // ✅ 클릭 이벤트 추가
                style={{ cursor: "pointer" }} // ✅ 클릭 가능함을 시각적으로 나타냅니다.
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
