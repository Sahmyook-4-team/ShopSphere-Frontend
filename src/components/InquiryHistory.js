import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronDown, Home } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/InquiryHistory.css";

const InquiryHistory = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 문의 내역을 불러오는 함수
  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/inquiries/my-inquiries`, {
        // !!! 세션 기반 인증을 위해 이 옵션을 추가합니다. !!!
        withCredentials: true, // 요청 시 쿠키 (세션 ID 포함)를 함께 전송
        params: {
          page: 0,
          size: 10,
          sort: 'createdAt,desc'
        }
      });
      setInquiries(response.data.content);
    } catch (err) {
      console.error("문의 내역 불러오기 실패:", err);
      // HTTP 상태 코드를 기반으로 에러 메시지 조정
      if (err.response && err.response.status === 401) {
        setError("로그인이 필요합니다. 다시 로그인해주세요.");
      } else {
        setError("문의 내역을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  // ... (JSX 렌더링 부분은 이전과 동일) ...
  return (
    <div className="inquiry-page-container">
      <Card className="inquiry-card">
        <CardContent className="inquiry-card-content">
          <div className="inquiry-background">
            <div className="inquiry-overlay" />
          </div>

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

          <main className="inquiry-main-content">
            {loading ? (
              <p className="inquiry-empty-message">문의 내역을 불러오는 중...</p>
            ) : error ? (
              <p className="inquiry-empty-message" style={{ color: 'red' }}>{error}</p>
            ) : inquiries.length === 0 ? (
              <p className="inquiry-empty-message">문의하신 내역이 없습니다.</p>
            ) : (
              <div className="inquiry-list">
                {inquiries.map((inquiry) => (
                  <div key={inquiry.inquiryId} className="inquiry-item">
                    <div className="inquiry-item-header">
                      <span className="inquiry-item-title">{inquiry.title}</span>
                      <span className={`inquiry-item-status status-${inquiry.status.toLowerCase()}`}>
                        {inquiry.status === "PENDING" ? "답변 대기" : inquiry.status === "ANSWERED" ? "답변 완료" : "닫힘"}
                      </span>
                    </div>
                    <p className="inquiry-item-content">{inquiry.content.substring(0, 50)}...</p>
                    <div className="inquiry-item-footer">
                      <span className="inquiry-item-date">{new Date(inquiry.createdAt).toLocaleDateString()}</span>
                      <span className="inquiry-item-seller">판매자: {inquiry.sellerUserName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>

          <div className="inquiry-ask-button">
            <span className="inquiry-ask-button-text">1:1문의하기</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InquiryHistory;