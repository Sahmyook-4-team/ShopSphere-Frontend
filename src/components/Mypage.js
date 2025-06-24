import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Mypage.css";
import chevronRight from "../assets/Mypage/chevron-right.svg";
import image2 from "../assets/Mypage/image-2.svg";
import settings from "../assets/Mypage/settings.svg";
import vector from "../assets/Mypage/vector.svg";
import Header from "./Header"; // Header 컴포넌트 임포트 경로가 Header.js라면 './Header'가 맞습니다.
import axios from "axios";
import defaultProfileImage from "../assets/Profile/image.svg";

const Mypage = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 초기값을 false로 설정
  const [userInfo, setUserInfo] = useState({ name: "Guest" }); // 초기 사용자 이름 설정
  const [isLoading, setIsLoading] = useState(true); // 초기 로딩 상태 true

  // MyReviewsPage로 이동하는 라우트 경로 (App.js에 정의되어 있어야 함)
  const myReviewsPath = "/mypage/my-reviews";

  useEffect(() => {
    const fetchUserInfo = async () => {
      setIsLoading(true); // API 요청 시작 시 로딩 상태 true
      try {
        // `/api/users/me` 엔드포인트로 직접 사용자 정보 요청 (로그인 상태 확인 겸함)
        const userResponse = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/me`,
          {
            withCredentials: true, // 세션 쿠키 전송을 위해 필수
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            // 백엔드에서 401을 보내도 에러로 처리하지 않고, 응답 객체를 받아서 직접 상태 코드 확인
            validateStatus: (status) => status < 500, // 500 미만의 모든 상태 코드를 성공으로 간주 (401 포함)
          }
        );

        if (userResponse.status === 200 && userResponse.data) {
          // 성공적으로 사용자 정보를 받아온 경우 (로그인 된 상태)
          setUserInfo({
            name: userResponse.data.name || "사용자",
            email: userResponse.data.email || "",
            id: userResponse.data.id || "",
            phoneNumber: userResponse.data.phoneNumber || "",
            address: userResponse.data.address || "",
            role: userResponse.data.role || "USER",
            profileImageUrl: userResponse.data.profileImageUrl || null,
          });
          setIsLoggedIn(true);
        } else if (userResponse.status === 401) {
          // 백엔드에서 401 Unauthorized 응답을 받은 경우 (로그인되지 않은 상태)
          setIsLoggedIn(false);
          // 여기서 alert을 띄우거나 바로 리다이렉트 할 수 있습니다.
          // alert("로그인이 필요합니다. 로그인 페이지로 이동합니다."); // 선택적 알림
          navigate("/login");
        } else {
          // 200도 아니고 401도 아닌 다른 오류 (예: 403, 404 등 validateStatus로 인해 여기로 올 수 있음)
          // 혹은 userResponse.data가 없는 경우 등 예외적인 상황
          throw new Error(
            userResponse.data?.message ||
              `사용자 정보 조회 실패: ${userResponse.status}`
          );
        }
      } catch (error) {
        // 네트워크 오류 또는 validateStatus 범위를 벗어난 5xx 오류, 또는 위에서 throw new Error()한 경우
        console.error("마이페이지 정보 로딩 중 오류 발생:", {
          message: error.message,
          response: error.response?.data, // axios 에러 객체는 response 속성을 가질 수 있음
          status: error.response?.status,
        });
        setIsLoggedIn(false); // 오류 발생 시 로그인되지 않은 상태로 간주
        // 사용자에게 오류를 알리고 로그인 페이지로 이동시킬 수 있습니다.
        // alert("오류가 발생하여 로그인 페이지로 이동합니다."); // 선택적 알림
        navigate("/login");
      } finally {
        setIsLoading(false); // API 요청 완료 후 로딩 상태 해제
      }
    };

    fetchUserInfo(); // 컴포넌트 마운트 시 사용자 정보 가져오기
  }, [navigate]); // navigate 함수가 변경될 때 (거의 없음) 또는 초기 마운트 시 실행

  // 로그아웃 핸들러 (기존과 동일)
  const handleLogout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/users/logout`,
        {},
        { withCredentials: true }
      );
      setIsLoggedIn(false);
      setUserInfo({ name: "Guest" }); // 사용자 정보 초기화
      localStorage.removeItem('userId'); // 일반 로그인 시 저장했던 정보도 삭제 (선택적)
      localStorage.removeItem('userName'); // 일반 로그인 시 저장했던 정보도 삭제 (선택적)
      localStorage.removeItem('userRole'); // 역할 정보도 삭제
      navigate("/login");
    } catch (error) {
      console.error("로그아웃 중 오류:", error);
      // 사용자에게 로그아웃 실패 알림 (선택적)
      // alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  // 로딩 중일 때 표시할 UI (기존과 동일)
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

  // 로그인되지 않았을 때 (fetchUserInfo에서 navigate("/login")으로 처리되지만, 만약을 위한 방어 코드)
  // 또는 isLoading이 false가 되었지만 isLoggedIn이 여전히 false인 경우 (이론상 fetchUserInfo에서 처리되어야 함)
  // if (!isLoading && !isLoggedIn) {
  //   // 이 블록은 fetchUserInfo의 navigate 로직 때문에 거의 도달하지 않을 수 있습니다.
  //   // 하지만 명시적으로 로그인 페이지로 보내는 로직을 둘 수도 있습니다.
  //   // navigate("/login"); // 이미 fetchUserInfo에서 처리 중
  //   return ( // 로그인 페이지로 리다이렉션 되기 전 잠시 보일 수 있는 UI 또는 null
  //     <>
  //       <Header />
  //       <div className="screen" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
  //         <div>로그인 정보가 없습니다. 로그인 페이지로 이동합니다...</div>
  //       </div>
  //     </>
  //   );
  // }

  // 1:1 문의 내역 클릭 핸들러 (기존과 동일)
  const handleInquiryClick = () => {
    navigate("/mypage/inquiries");
  };

  // 다양한 메뉴 항목에 대한 네비게이션 맵 (기존과 동일)
  const navigationMap = {
    "1:1 문의 내역": handleInquiryClick,
    "취소/반품/교환 내역": () => navigate("/mypage/cancelreturn"),
    "주문 내역": () => navigate("/mypage/orders"),
    "후기 작성": () => navigate(myReviewsPath),
  };

  return (
    <>
      <Header />
      <div className="screen">
        <div className="div">
          <div className="overlap">
            {/* isLoggedIn 상태에 따라 UI 렌더링 (Header 로그인/로그아웃 버튼과 유사한 로직) */}
            {isLoggedIn ? (
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
                  onClick={() => navigate("/mypage/profile")} // 프로필 수정 페이지로 이동
                  style={{ cursor: "pointer" }}
                />
                {/* 로그아웃 버튼 */}
                <button
                  className="logout-link"
                  onClick={handleLogout}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    font: "inherit",
                    cursor: "pointer",
                    color: "inherit", // 부모 요소의 색상 상속 또는 특정 색상 지정
                    textDecoration: "underline",
                  }}
                >
                  로그아웃
                </button>

                {/* 사용자 프로필 정보 */}
                <div className="profile-section">
                  <div className="profile-info">
                    {/* 프로필 이미지 표시 (없으면 기본 이미지) */}
                    {userInfo?.profileImageUrl ? (
                      <img
                        src={`${process.env.REACT_APP_API_BASE_URL}${userInfo.profileImageUrl}`}
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
              </>
            ) : (
              // 로그인이 되어 있지 않다면, 로그인/회원가입 링크 표시
              // 이론적으로 이 부분은 fetchUserInfo에서 /login으로 리다이렉트 되므로 거의 보이지 않아야 함
              <Link
                className="text-wrapper-2" // CSS 클래스 확인 필요
                to="/login"
                style={{ cursor: "pointer", textDecoration: "none", color: "blue" }} // 예시 스타일
              >
                로그인/회원가입하기
              </Link>
            )}

            {/* 적립금, 쿠폰, 후기 작성 섹션 - 로그인 되었을 때만 의미가 있을 수 있음 */}
            {isLoggedIn && (
              <>
                <div className="view">
                  <div className="text-wrapper-3">적립금</div>
                  <div className="text-wrapper-4">0원</div> {/* 실제 데이터 연동 필요 */}
                </div>
                <div className="view-2">
                  <div className="text-wrapper-3">쿠폰</div>
                  <div className="text-wrapper-4">0개</div> {/* 실제 데이터 연동 필요 */}
                </div>
                <div
                  className="view-3"
                  onClick={navigationMap["후기 작성"]}
                  style={{ cursor: "pointer" }}
                >
                  <div className="text-wrapper-3">후기 작성</div>
                  <div className="text-wrapper-4">0개</div> {/* 실제 데이터 연동 필요 */}
                </div>
              </>
            )}
          </div>

          {/* 동적으로 생성되는 메뉴 리스트 - 로그인 되었을 때만 의미가 있을 수 있음 */}
          {isLoggedIn && [
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
                className={`screen ${viewClass}`} // CSS 클래스 확인 (screen과 view-n을 같이 쓰는게 맞는지)
                onClick={handleClick}
                style={{ cursor: navigationMap[label] ? "pointer" : "default" }}
              >
                <div className={textClass}>{label}</div>
                <img className="chevron-right" alt=">" src={chevronRight} />
              </div>
            );
          })}

          {/* 하단 이미지 - 로그인 여부와 관계 없이 보일 수 있음 */}
          <img className="image" alt="Image" src={image2} />
        </div>
      </div>
    </>
  );
};

export default Mypage;