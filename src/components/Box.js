import React, { useState } from 'react';
import axios from 'axios';
import "../styles/style.css";
import { Header } from "./Header";

export const Box = () => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    // 임의 데이터
    setName(Math.random());
    setPhoneNumber(Math.random());
    setAddress(Math.random());
    setMessage(Math.random());

    try {
      const response = await axios.post('http://localhost:8080/api/users/register', {
        id,
        password,
        name,
        phoneNumber,
        address,
      });
      alert("회원가입 성공");
      // 성공 후 처리 (예: 로그인 페이지로 리디렉션)
    } catch (error) {
      alert('회원가입 실패:', error);
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

              {/* ✅ 비밀번호 확인 필드 추가 */}
              <label htmlFor="confirmPassword" className="text-wrapper-9">비밀번호 확인</label>
              <input id="confirmPassword" type="password" className="view-9" placeholder="한번 더 입력하세요" />

              <label htmlFor="email" className="text-wrapper-4">이메일</label>
              <input id="email" type="email" className="view-4" style={{ marginTop: '10px' }} placeholder="이메일을 입력하세요" />

              <p className="p">계정 분실시 본인인증 정보로 활용됩니다.</p>

              <label htmlFor="referrer" className="text-wrapper-5">친구 초대 추천인 아이디(선택)</label>
              <input id="referrer" type="text" className="view-5" style={{ marginTop: '10px' }} />

              <p className="text-wrapper-8">
                가입 후 추천인과 신규회원 모두 적립금 5,000원을 드립니다.
              </p>

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

export default Box;
