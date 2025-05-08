import React from "react";
import "../styles/style.css";
import { Header } from "./Header";

export const Box = () => {
  const handleSubmit = () => {
    // 여기에 가입 처리 로직을 추가하세요.
    console.log("가입하기 버튼 클릭됨");
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

          <label htmlFor="username" className="text-wrapper-3">아이디</label>
          <input id="username" type="text" className="view-2" placeholder="아이디를 입력하세요"/>

          <label htmlFor="password" className="text-wrapper-2">비밀번호</label>
          <input id="password" type="password" className="view-3" placeholder="비밀번호를 입력하세요"/>

          {/* ✅ 비밀번호 확인 필드 추가 */}
          <label htmlFor="confirmPassword" className="text-wrapper-9">비밀번호 확인</label>
          <input id="confirmPassword" type="password" className="view-9" placeholder="한번 더 입력하세요"/>

          <label htmlFor="email" className="text-wrapper-4">이메일</label>
          <input id="email" type="email" className="view-4" style={{ marginTop: '10px' }} placeholder="이메일을 입력하세요"/>

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
