import React, { createContext, useState, useContext, useEffect } from "react";

// Context 생성
const AuthContext = createContext();

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");

  // 새로고침 시 로그인 유지 (localStorage 활용)
  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn") === "true";
    const savedName = localStorage.getItem("userName");

    if (savedLogin && savedName) {
      setIsLoggedIn(true);
      setUserName(savedName);
    }
  }, []);

  // 상태 변경 시 저장
  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("userName", userName);
  }, [isLoggedIn, userName]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userName, setUserName }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook으로 쉽게 사용
export const useAuth = () => useContext(AuthContext);
