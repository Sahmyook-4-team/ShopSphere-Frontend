import React, { createContext, useState, useContext, useEffect } from "react";

// Context 생성
const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userInfo, setUserInfo] = useState(null); // ✅ 전체 유저 정보 상태 추가

  // ✅ 새로고침 시 로그인 정보 복구
  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn") === "true";
    const savedName = localStorage.getItem("userName");
    const savedUserInfo = localStorage.getItem("userInfo");

    if (savedLogin && savedName && savedUserInfo) {
      setIsLoggedIn(true);
      setUserName(savedName);
      try {
        setUserInfo(JSON.parse(savedUserInfo)); // 문자열 → 객체 변환
      } catch (e) {
        console.error("userInfo 파싱 실패", e);
      }
    }
  }, []);

  // ✅ 상태 변경 시 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("userName", userName);
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [isLoggedIn, userName, userInfo]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        userName,
        setUserName,
        userInfo,
        setUserInfo, // ✅ 외부에서 userInfo 설정 가능
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook으로 쉽게 사용
export const useAuth = () => useContext(AuthContext);
