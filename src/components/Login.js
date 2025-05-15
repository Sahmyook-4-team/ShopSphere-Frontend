import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SVG2 from "../assets/SVG-2.svg";
import SVG from "../assets/SVG.svg";
import ButtonSVG from "../assets/button-SVG.svg";
import Image from "../assets/image.svg";
import "../styles/Login.css";
import { Header } from "./Header";
import axios from 'axios';
import { useEffect } from "react";

const Login = () => {

  // 로그인
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/users/login', {
        id,
        password,
      });
      setMessage('로그인 성공!');
      setLoggedInUser(response.data);
      console.log('로그인 성공:', response.data);
      alert("로그인 성공");
      // 성공 후 처리 (예: 메인 페이지로 리디렉션, 사용자 정보 저장)
    } catch (error) {
      setMessage('로그인 실패: ' + error.response.data.message);
      console.error('로그인 실패:', error);
      setLoggedInUser(null);
      alert("로그인 실패");
    }

  };

  // 회원 가입 이동
  const navigate = useNavigate();

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
    window.Kakao.init("a2b2dd3527355a719a1c8b5e4a7959bc"); // 👉 JavaScript 키 입력
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
                <label htmlFor="username" className="label-text">
                  아이디
                </label>
                <input
                  type="text"
                  id="id"
                  value={id}
                  onChange={(e) => setId(e.target.value)}
                  required
                />

                {/* 비밀번호 입력 */}
                <label htmlFor="password" className="label-text">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                {/* 로그인 버튼 */}
                <button className="login-button" onClick={handleSubmit}>로그인</button>

                {/* 자동 로그인 */}
                <div className="label">
                  <input type="checkbox" id="auto-login" />
                  <label htmlFor="auto-login" className="text-wrapper-4">
                    자동 로그인
                  </label>
                </div>

                {/* 아이디/비번 찾기 */}
                <div className="list">
                  <div className="overlap-group">
                    <div className="find-info">
                      <a href="#" className="find-link">
                        아이디 찾기
                      </a>
                      <span className="divider">|</span>
                      <a href="#" className="find-link">
                        비밀번호 찾기
                      </a>
                    </div>
                  </div>
                </div>

                {/* 간편 로그인 */}
                {/*카카오 로그인*/}
                <div className="container-2">
        <div
          className="link-2"
          style={{ transform: "translateX(-10px)", cursor: 'pointer' }} // cursor 추가
          onClick={handleKakaoLogin} // 클릭 이벤트 핸들러 추가
        >
          <img
            className="SVG"
            alt="kakao"
            src={require("../assets/kakao-icon.svg")}
            style={{ transform: "translateX(-10px)" }}
          />
          <div className="text-wrapper-5">카카오 로그인</div>
        </div>

                  <div
                    className="link-3"
                    style={{ transform: "translateX(-10px)" }}
                  >
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
