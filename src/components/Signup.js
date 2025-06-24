import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../styles/Signup.css"; // 여러분의 기존 CSS 파일을 사용합니다.
import { Header } from "./Header"; // Header 컴포넌트를 사용합니다.

export const Signup = () => {
  const navigate = useNavigate();
  const confirmPasswordRef = useRef(null);

  // 기존 입력 필드 상태
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // 역할(role) 선택을 위한 상태 변수 추가 (기본값: 'USER')
  const [role, setRole] = useState('USER');

  const handleSubmit = async (event) => {
    event.preventDefault(); // 폼 기본 제출 방지

    if (password !== confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      confirmPasswordRef.current.focus();
      return;
    }

    // 간단한 필수 입력 필드 검사 (필요에 따라 추가/수정)
    if (!id || !password || !name || !email) {
        alert("아이디, 비밀번호, 이름, 이메일은 필수 입력 항목입니다.");
        return;
    }
    // 이메일 형식 검사 (간단한 버전)
    if (email && !/\S+@\S+\.\S+/.test(email)) {
        alert("올바른 이메일 형식을 입력해주세요.");
        return;
    }


    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/users/register`, {
        id,
        password,
        name,
        phoneNumber,
        address,
        email,
        role // 선택된 role 값을 함께 전송
      }, {
        withCredentials: true, // 세션/쿠키 기반 인증 시 필요
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('회원가입 응답:', response.data);
      alert("회원가입 성공!");
      navigate("/login"); // 회원가입 성공 후 로그인 페이지로 이동

    } catch (error) {
      let errorMessage = "회원가입 처리 중 오류가 발생했습니다.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      alert(`회원가입 실패: ${errorMessage}`);
      console.error("회원가입 에러:", error.response || error);
    }
  };

  return (
    <>
      <Header />
      <div className="box-wrapper">
        <div className="box">
          {/* form 태그로 감싸고 onSubmit 핸들러 연결 */}
          <form className="view" onSubmit={handleSubmit}>
            <div className="overlap">
              <div className="rectangle" />
              <div className="rectangle-2" />

              <div className="overlap-group-wrapper">
                <div className="overlap-group">
                  <div className="text-wrapper-6">회원가입</div>
                </div>
              </div>

              {/* 아이디 */}
              <label htmlFor="id" className="text-wrapper-3">아이디</label>
              <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                required
                className='view-2'
                placeholder="사용할 아이디를 입력하세요"
              />

              {/* 비밀번호 */}
              <label htmlFor="password" className="text-wrapper-2">비밀번호</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className='view-3'
                placeholder="비밀번호를 입력하세요"
              />

              {/* 비밀번호 확인 */}
              <label htmlFor="confirmPassword" className="text-wrapper-9">비밀번호 확인</label>
              <input
                id="confirmPassword"
                type="password"
                className="view-9"
                placeholder="비밀번호를 다시 한번 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                ref={confirmPasswordRef}
                required
              />

              {/* 역할(Role) 선택 UI 추가 */}
              {/* 기존 스타일 클래스명을 참고하여 레이아웃 조정이 필요할 수 있습니다. */}
              {/* 예시: div로 감싸고, 내부 요소들에 스타일 적용 */}
              <div className="role-selector-container" style={{ marginTop: '15px', marginBottom: '5px' }}> {/* 간격 조정을 위한 스타일 */}
                <label className="text-wrapper-role" style={{ display: 'block', marginBottom: '5px' }}>가입 유형</label>
                <div className="role-options">
                  <label htmlFor="roleUser" style={{ marginRight: '20px', cursor: 'pointer' }}>
                    <input
                      type="radio"
                      id="roleUser"
                      name="roleType" // 라디오 버튼 그룹명
                      value="USER"
                      checked={role === 'USER'}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ marginRight: '5px' }}
                    />
                    일반 회원
                  </label>
                  <label htmlFor="roleSeller" style={{ cursor: 'pointer' }}>
                    <input
                      type="radio"
                      id="roleSeller"
                      name="roleType" // 라디오 버튼 그룹명
                      value="SELLER"
                      checked={role === 'SELLER'}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ marginRight: '5px' }}
                    />
                    판매자 회원
                  </label>
                </div>
              </div>


              {/* 이메일 */}
              <label htmlFor="email" className="text-wrapper-4">이메일</label>
              <input id="email"
                type="email"
                className="view-4"
                // style={{ marginTop: '10px' }} // 역할 선택 UI로 인해 간격 조정 필요시 제거 또는 수정
                placeholder="이메일 주소를 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="p">계정 분실 시 본인인증 정보로 활용됩니다.</p>

              {/* 이름 */}
              <label htmlFor="name" className="text-wrapper-5">이름</label>
              <input
                id="name"
                type="text"
                className="view-5"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{ marginTop: '10px' }} 
                placeholder="실명을 입력하세요"
                required
              />

              {/* 휴대폰번호 */}
              <label htmlFor="phone" className="text-wrapper-10">휴대폰번호</label>
              <input
                id="phone"
                type="tel" // 전화번호 입력에 더 적합한 타입
                className="view-10"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                style={{ marginTop: '10px' }} 
                placeholder="예: 01012345678 (선택)"
              />

              {/* 주소 */}
              <label htmlFor="address" className="text-wrapper-11">주소</label>
              <input
                id="address"
                type="text"
                className="view-11"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{ marginTop: '10px' }} 
                placeholder="배송받을 주소를 입력하세요 (선택)"
              />

              {/* 기존 onClick에서 type="submit"으로 변경 */}
              <button type="submit" className="view-7"> 
                <span className="text-wrapper-7">가입하기</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;