import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Signup.css";
import { Header } from "./Header";

export const Signup = () => {
  const navigate = useNavigate();
  const confirmPasswordRef = useRef(null);

  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      confirmPasswordRef.current.focus(); // 참조를 사용하여 focus 호출
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        id,
        password,
        name,
        phoneNumber,
        address,
        email
      }, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      console.log(response); // 또는  
      console.log(response.data);
      alert("회원가입 성공");
      // 회원가입 성공 후 로그인 페이지로 이동
      navigate("/login");
    } catch (error) {
      alert(`회원가입 실패: ${error.response.data.message}`);
    }
  };

  return (
    <>
      <Header />
      <div className="box-wrapper">
        <div className="box">
          <div className="view">
            <div className="overlap">
              <div className="rectangle" />
              <div className="rectangle-2" />

              <div className="overlap-group-wrapper">
                <div className="overlap-group">
                  <div className="text-wrapper-6">회원가입</div>
                </div>
              </div>

              <label htmlFor="id" className="text-wrapper-3">아이디</label>
              <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className='view-2'
              />

              <label htmlFor="password" className="text-wrapper-2">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='view-3'
              />

              <label htmlFor="confirmPassword" className="text-wrapper-9">비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                className="view-9"
                placeholder="한번 더 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                ref={confirmPasswordRef} // 입력 필드에 참조 추가
              />

              <label htmlFor="email" className="text-wrapper-4">이메일</label>
              <input id="email"
                type="email"
                className="view-4"
                style={{ marginTop: '10px' }}
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <p className="p">계정 분실시 본인인증 정보로 활용됩니다.</p>

              <label htmlFor="name" className="text-wrapper-5">이름</label>
              <input
                id="name"
                type="text"
                className="view-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginTop: '10px' }} />

              <label htmlFor="phone" className="text-wrapper-10">휴대폰번호</label>
              <input
                id="phone"
                type="text"
                className="view-10"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ marginTop: '10px' }} />

              <label htmlFor="address" className="text-wrapper-11">주소</label>
              <input
                id="address"
                type="text"
                className="view-11"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ marginTop: '10px' }} />

              <button className="view-7" onClick={handleSubmit}>
                <span className="text-wrapper-7">가입하기</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;