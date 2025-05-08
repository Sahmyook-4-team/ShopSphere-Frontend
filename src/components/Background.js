import React from "react";
import { useNavigate } from "react-router-dom";
import SVG2 from "../assets/SVG-2.svg";
import SVG from "../assets/SVG.svg";
import ButtonSVG from "../assets/button-SVG.svg";
import Image from "../assets/image.svg";
import "../styles/background.css";
import { Header } from "./Header";

const Background = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate("/box");
  };

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
                  id="username"
                  type="text"
                  className="input-box"
                  placeholder="아이디"
                />

                {/* 비밀번호 입력 */}
                <label htmlFor="password" className="label-text">
                  비밀번호
                </label>
                <input
                  id="password"
                  type="password"
                  className="input-box"
                  placeholder="비밀번호"
                />

                {/* 로그인 버튼 */}
                <button className="login-button">로그인</button>

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
                <div className="container-2">
                  <div
                    className="link-2"
                    style={{ transform: "translateX(-10px)" }}
                  >
                    <img
                      className="SVG"
                      alt="kakao"
                      src={SVG}
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

export default Background;
