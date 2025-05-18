import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // ✅ 추가

  useEffect(() => {
    const savedLogin = localStorage.getItem("isLoggedIn");
    const savedName = localStorage.getItem("userName");
    const savedUserInfo = localStorage.getItem("userInfo");
  
    console.log("복구된 값", {
      savedLogin,
      savedName,
      savedUserInfo,
    });
  
    if (savedLogin === "true" && savedName && savedUserInfo) {
      setIsLoggedIn(true);
      setUserName(savedName);
      try {
        setUserInfo(JSON.parse(savedUserInfo));
      } catch (e) {
        console.error("userInfo 파싱 실패", e);
      }
    }
  
    setIsInitialized(true);
  }, []);
  

  useEffect(() => {
    localStorage.setItem("isLoggedIn", isLoggedIn);
    localStorage.setItem("userName", userName);
    if (userInfo) {
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
  }, [isLoggedIn, userName, userInfo]);

  const logout = () => {
    setIsLoggedIn(false);
    setUserName("");
    setUserInfo(null);
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userName");
    localStorage.removeItem("userInfo");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userName,
        userInfo,
        setIsLoggedIn,
        setUserName,
        setUserInfo,
        logout,
        isInitialized, // ✅ 외부 제공
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
