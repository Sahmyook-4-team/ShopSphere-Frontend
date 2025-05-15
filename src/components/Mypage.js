import React from "react";
import chevronRight from "../assets/Mypage/chevron-right.svg";
import image2 from "../assets/Mypage/image-2.svg";
import settings from "../assets/Mypage/settings.svg";
import vector from "../assets/Mypage/vector.svg";
import "../styles/Mypage.css";
import Header from "./Header";

export const Mypage = () => {
  return (
    <>
    <Header/>
    <div className="screen">
      <div className="div">
        <div className="overlap">
          <div className="bell">
            <div className="overlap-group">
              <img className="vector" alt="Vector" src={vector} />
            </div>
          </div>
          <div className="text-wrapper">마이</div>
          <img className="settings" alt="Settings" src={settings} />
          <div className="text-wrapper-2">로그인/회원가입하기</div>

          <div className="view">
            <div className="text-wrapper-3">적립금</div>
            <div className="text-wrapper-4">0원</div>
          </div>
          <div className="view-2">
            <div className="text-wrapper-3">쿠폰</div>
            <div className="text-wrapper-4">0개</div>
          </div>
          <div className="view-3">
            <div className="text-wrapper-3">후기 작성</div>
            <div className="text-wrapper-4">0개</div>
          </div>
        </div>

        <div className="div-2">
          <div className="text-wrapper-5">취소/반품/교환 내역</div>
          <img className="chevron-right" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="view-4">
          <div className="text-wrapper-5">재입고 알림 내역</div>
          <img className="chevron-right" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="view-5">
          <div className="text-wrapper-5">최근 본 상품</div>
          <img className="chevron-right" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="view-6">
          <div className="text-wrapper-5">나의 브랜드 리스트</div>
          <img className="chevron-right" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="view-7">
          <div className="text-wrapper-5">나의 맞춤 정보</div>
          <img className="chevron-right" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="view-8">
          <div className="text-wrapper-5">고객센티</div>
          <img className="chevron-right" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="element">
          <div className="text-wrapper-5">1:1 문의 내역</div>
          <img className="chevron-right" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="view-9">
          <div className="text-wrapper-6">상품 문의 내역</div>
          <img className="chevron-right-2" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="view-10">
          <div className="text-wrapper-5">공지사항</div>
          <img className="chevron-right" alt="Chevron right" src={chevronRight} />
        </div>
        <div className="view-11">
          <div className="text-wrapper-7">주문 내역</div>
          <img className="chevron-right-3" alt="Chevron right" src={chevronRight} />
        </div>

        <img className="image" alt="Image" src={image2} />
      </div>
    </div>
    </>
  );
};

export default Mypage;
