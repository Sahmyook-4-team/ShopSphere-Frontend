import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import SVG2 from "../assets/Login/SVG-2.svg"; // 사용하지 않는 import 제거
import SVG from "../assets/Login/SVG.svg";
// import ButtonSVG from "../assets/Login/button-SVG.svg"; // 사용하지 않는 import 제거
import Image from "../assets/Login/image.svg";
import "../styles/Login.css";
import { Header } from "./Header";
import axios from "axios";

// 🌟🌟🌟 여기에 카카오 개발자 센터에서 확인한 JavaScript Key를 직접 입력하세요 🌟🌟🌟
// (예시: 'YOUR_ACTUAL_JAVASCRIPT_KEY_HERE')
const KAKAO_JAVASCRIPT_KEY_HARDCODED = "a2b2dd3527355a719a1c8b5e4a7959bc"; // <---- 여기를 실제 JavaScript 키로 변경!!!

// 🌟🌟🌟 여기에 카카오 개발자 센터에 등록한 프론트엔드 Redirect URI를 직접 입력하세요 🌟🌟🌟
const KAKAO_REDIRECT_URI_HARDCODED = "http://localhost:3000/oauth/kakao/callback"; // <---- 여기를 3000번 포트로 변경!!!

// 백엔드 API URL (일반 로그인용. 카카오 로그인 콜백은 프론트엔드에서 처리)
// const SPRING_BOOT_API_URL = "http://localhost:8080";


const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
        // 1. 일반 로그인 요청 (이전에 수정했듯이, 백엔드 경로가 '/api/users/login'인지 다시 한번 확인!)
        const response = await axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/users/login`, // 💡 이 경로가 맞는지 다시 확인하세요!
            { id, password },
            {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("✅ 로그인 응답 데이터:", response.data);

        // 🚨 세션 기반 로그인 시 JWT 토큰 저장 로직은 불필요!
        //    'response.data'에 직접 접근하여 필요한 정보(id, name 등)를 사용합니다.
        if (response.data && response.data.id) { // 응답 데이터가 있고, 'id' 필드가 있는지 확인
            // 세션 기반에서는 JWT 토큰을 localStorage에 저장할 필요가 없습니다.
            // localStorage.setItem('jwtToken', response.data.token); // 이 줄을 제거하거나 주석 처리!

            localStorage.setItem('userId', response.data.id);
            localStorage.setItem('userName', response.data.name); // 백엔드 응답에 'name' 필드가 있는지 확인
            if (response.data.role) {
              localStorage.setItem('userRole', response.data.role); // 'userRole' 키로 저장
              console.log("✅ 사용자 역할 저장됨:", response.data.role);
          }

            alert("로그인 성공");
            setMessage("로그인 성공!");
            navigate("/mypage");
        } else {
            // 백엔드에서 사용자 정보는 주지만, 어떤 이유로 id가 없는 경우 (매우 드물겠지만)
            throw new Error("로그인 성공했지만 사용자 정보를 가져올 수 없습니다.");
        }

    } catch (error) {
        console.error("❌ 로그인 오류:", error);
        const errorMessage = error.response?.data?.message ||
                             error.message ||
                             "로그인 중 오류가 발생했습니다.";
        alert(`로그인 실패: ${errorMessage}`);
        setMessage(`로그인 실패: ${errorMessage}`);
    }
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  // 🌟🌟🌟 handleKakaoLogin 함수 수정 🌟🌟🌟
  const handleKakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.Auth) {
      alert("Kakao SDK가 아직 로드되지 않았습니다. 잠시 후 다시 시도해주세요.");
      return;
    }
    
    // 🌟🌟🌟 여기가 가장 중요합니다. 3000번 포트로 변경 🌟🌟🌟
    window.Kakao.Auth.authorize({
      redirectUri: KAKAO_REDIRECT_URI_HARDCODED, // 하드코딩된 3000번 포트 주소 사용
    });
  };

  // 🌟🌟🌟 useEffect 내부 수정 🌟🌟🌟
  useEffect(() => {
    // KAKAO_JAVASCRIPT_KEY_HARDCODED가 유효한지 확인
    if (!KAKAO_JAVASCRIPT_KEY_HARDCODED || KAKAO_JAVASCRIPT_KEY_HARDCODED === "YOUR_ACTUAL_JAVASCRIPT_KEY_HERE") {
        console.error("카카오 JavaScript 키가 제대로 설정되지 않았습니다. 'YOUR_ACTUAL_JAVASCRIPT_KEY_HERE' 부분을 실제 키로 변경해주세요.");
        return;
    }

    if (window.Kakao && !window.Kakao.isInitialized()) {
      // 🌟🌟🌟 여기도 JavaScript Key로 변경 🌟🌟🌟
      window.Kakao.init(KAKAO_JAVASCRIPT_KEY_HARDCODED);
      console.log("✅ Kakao SDK Initialized with key:", KAKAO_JAVASCRIPT_KEY_HARDCODED);
    }
  }, []);

  return (
    <>
      <Header />
      <div className="background">
        <div className="overlap">
          <div className="main">
            <div className="section">
              <div className="form">
                {/* 아이디 입력 */}
                <label htmlFor="id" className="label-text">아이디</label>
                <input
                  type="text"
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                  className="login-input"
                />

                {/* 비밀번호 입력 */}
                <label htmlFor="password" className="label-text">비밀번호</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="login-input"
                />

                {/* 로그인 버튼 */}
                <button className="login-button" onClick={handleSubmit}>로그인</button>

                {/* 자동 로그인 */}
                <div className="label">
                  <input type="checkbox" id="seller-login" />
                  <label htmlFor="auto-login" className="text-wrapper-4">판매자 로그인</label>
                </div>

                {/* 아이디/비번 찾기 */}
                <div className="list">
                  <div className="overlap-group">
                    <div className="find-info">
                      <a href="#" className="find-link">아이디 찾기</a>
                      <span className="divider">|</span>
                      <a href="#" className="find-link">비밀번호 찾기</a>
                    </div>
                  </div>
                </div>

                {/* 간편 로그인 */}
                <div className="container-2">
                  {/* 카카오 로그인 */}
                  <div
                    className="link-2"
                    style={{ transform: "translateX(-10px)", cursor: "pointer" }}
                    onClick={handleKakaoLogin}
                  >
                    <img
                      className="SVG"
                      alt="kakao"
                      src={SVG}
                      style={{ transform: "translateX(-10px)" }}
                    />
                    <div className="text-wrapper-5">카카오 로그인</div>
                  </div>

                  {/* Apple 로그인 */}
                  <div className="link-3" style={{ transform: "translateX(-10px)" }}>
                    <img
                      className="SVG"
                      alt="apple"
                      src={Image}
                      style={{ transform: "translateX(-10px)" }}
                    />
                    <div className="text-wrapper-6">Apple 로그인</div>
                  </div>
                </div>

                {/* 회원가입 버튼 */}
                <button className="signup-button" onClick={handleSignup}>회원가입</button>

                {/* 메시지 표시 */}
                <div className="login-message">{message}</div>
              </div>
            </div>
          </div>

          <div className="overlap-2">
            <div className="vertical-divider-5" />
            <div className="vertical-divider-6" />
          </div>

          <header className="header">
            <div className="heading">
              <div className="text-wrapper-8">로그인/회원가입</div>
            </div>
          </header>
        </div>
      </div>
    </>
  );
};

export default Login;
