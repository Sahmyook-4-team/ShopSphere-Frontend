import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get("code");

    if (code) {
      axios.get(`http://localhost:8080/api/auth/oauth/kakao/callback?code=${code}`)
        .then((res) => {
          const { token, userId, name } = res.data;
          localStorage.setItem("token", token);
          alert(`로그인 성공! ${name}`);
          navigate("/"); // 홈 등으로 이동
        })
        .catch(() => {
          alert("카카오 로그인 실패");
          navigate("/login");
        });
    }
  }, []);

  return <div>로그인 처리 중...</div>;
};

export default KakaoCallback;