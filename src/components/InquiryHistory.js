import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, Home } from "lucide-react";
import React from "react";
// CSS 파일을 import 합니다.
import "../styles/InquiryHistory.css";

const InquiryHistory = () => {
  return (
    <div className="inquiry-page-container">
      {/* 고정된 모바일 뷰 컨테이너 */}
      <Card className="inquiry-card">
        <CardContent className="inquiry-card-content">
          {/* 배경 이미지 및 오버레이 */}
          <div className="inquiry-background">
            <div className="inquiry-overlay" />
          </div>

          {/* Header Section */}
          <header className="inquiry-header">
            <div className="inquiry-header-top">
              <ArrowLeft className="inquiry-icon arrow-left-icon" />
              <h1 className="inquiry-title">1:1 문의내역</h1>
              <Home className="inquiry-icon home-icon" />
            </div>

            <div className="inquiry-header-bottom">
              <span className="inquiry-view-all">전체보기</span>
              <div className="inquiry-filter">
                <span className="inquiry-filter-text">전체 시기</span>
                <ChevronDown className="inquiry-icon chevron-down-icon" />
              </div>
            </div>
          </header>

          {/* Content Area - 문의 내역이 없을 때 메시지 */}
          <main className="inquiry-main-content">
            <p className="inquiry-empty-message">문의하신 내역이 없습니다.</p>
            {/* 여기에 실제 문의 내역 리스트가 들어갈 수 있습니다. */}
          </main>

          {/* Bottom Inquiry Button */}
          <div className="inquiry-ask-button">
            <span className="inquiry-ask-button-text">1:1문의하기</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InquiryHistory;