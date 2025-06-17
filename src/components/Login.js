import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SVG2 from "../assets/Login/SVG-2.svg";
import SVG from "../assets/Login/SVG.svg";
import ButtonSVG from "../assets/Login/button-SVG.svg";
import Image from "../assets/Login/image.svg";
import "../styles/Login.css";
import { Header } from "./Header";
import axios from "axios";
const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // 1. 로그인 요청
      const response = await axios.post(
        "http://localhost:8080/api/users/login", 
        { id, password },
        {
          withCredentials: true, // 쿠키를 포함하기 위한 옵션 추가
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("✅ 로그인 응답 데이터:", response.data);
      alert("로그인 성공");
      setMessage("로그인 성공!");

      // 2. 로그인 성공 후 세션 상태 확인 (디버깅용)
      try {
        const checkResponse = await axios.get(
          "http://localhost:8080/api/users/check",
          { 
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
        console.log("🔍 세션 상태 확인:", checkResponse.data);
      } catch (checkError) {
        console.error("세션 확인 중 오류:", checkError);
      }

      // 3. 마이페이지로 이동
      navigate("/mypage");

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

  const handleKakaoLogin = () => {
    if (!window.Kakao || !window.Kakao.Auth) {
      alert("Kakao SDK가 아직 로드되지 않았습니다.");
      return;
    }

    window.Kakao.Auth.authorize({
      redirectUri: "http://localhost:8080/oauth/kakao/callback",
    });
  };

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("a2b2dd3527355a719a1c8b5e4a7959bc");
      console.log("✅ Kakao SDK Initialized");
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
                <label htmlFor="username" className="label-text">아이디</label>
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
                  <input type="checkbox" id="auto-login" />
                  <label htmlFor="auto-login" className="text-wrapper-4">자동 로그인</label>
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
