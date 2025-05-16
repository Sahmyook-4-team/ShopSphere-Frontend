import React from "react";
import { useAuth } from "./contexts/AuthContext";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import "../styles/Mypage.css";
import chevronRight from "../assets/Mypage/chevron-right.svg";
import image2 from "../assets/Mypage/image-2.svg";
import settings from "../assets/Mypage/settings.svg";
import vector from "../assets/Mypage/vector.svg";
import Header from "./Header";

const Mypage = () => {
  const { isLoggedIn, userName } = useAuth();
  const navigate = useNavigate(); // ✅ 추가
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
                {/* settings 클릭 시 이동 */}
                <img
                  className="settings"
                  alt="Settings"
                  src={settings}
                  onClick={() => navigate("/mypage/profile")}
                  style={{ cursor: "pointer" }} // 마우스 오버 시 포인터
                />
              </>
            )}


            {isLoggedIn ? (
              <div className="profile-section">
                <div className="profile-info">
                  <div className="profile-image" />
                  <div className="text-wrapper">{"최진환"}</div>
                </div>
              </div>
            ) : (
              <div
                className="text-wrapper-2"
                onClick={() => navigate("/login")} // ✅ 클릭 시 로그인 페이지로 이동
                style={{ cursor: "pointer" }}      // ✅ 시각적 피드백
              >
                로그인/회원가입하기
              </div>
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

          {/* 메뉴 항목 리스트 */}
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
            return (
              <div key={i} className={`screen ${viewClass}`}>
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
