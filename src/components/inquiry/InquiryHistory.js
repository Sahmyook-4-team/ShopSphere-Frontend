import { Card, CardContent } from "@/components/ui/card";
import { MessageSquarePlus } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/InquiryHistory.module.css";

const InquiryHistory = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // 채팅방 목록 불러오기
  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/inquiry-chats/rooms`,
        {
          withCredentials: true
        }
      );

      if (Array.isArray(response.data)) {
        setInquiries(response.data);
      } else {
        console.error('예상치 못한 응답 형식:', response.data);
        setInquiries([]);
      }
    } catch (err) {
      console.error("문의 내역 불러오기 실패:", err);
      if (err.response?.status === 401) {
        setError("로그인이 필요합니다. 다시 로그인해주세요.");
      } else {
        setError("문의 내역을 불러오는데 실패했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 채팅방 생성 또는 이동
  const handleCreateOrOpenChat = (roomId) => {
    if (roomId) {
      navigate(`/inquiry/chat/${roomId}`);
    } else {
      alert("상품을 선택해주세요. (상품 선택 화면으로 이동)");
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  if (loading) return <div className={styles.loading}>로딩 중...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.inquiryPageContainer}>
      <div className={styles.inquiryHeader}>
        <h1>1:1 문의</h1>
        <button
          onClick={() => handleCreateOrOpenChat()}
          className={styles.newInquiryButton}
        >
          <MessageSquarePlus size={20} />
          <span>새 문의하기</span>
        </button>
      </div>

      <div className={styles.inquiryList}>
        {inquiries.length === 0 ? (
          <div className={styles.noInquiries}>
            <p>문의 내역이 없습니다.</p>
            <p>새로운 문의를 시작해보세요!</p>
          </div>
        ) : (
          inquiries.map((room, index) => (
            <Card
              key={room.id}
              className={styles.inquiryCard}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleCreateOrOpenChat(room.id)}
            >
              <CardContent className={styles.cardContent}>
                <div className={styles.inquiryItem}>
                  <div className={styles.inquiryInfo}>
                    <h3>{room.productName || '상품 문의'}</h3>
                    <p className={styles.lastMessage}>
                      {room.lastMessage || '대화를 시작해보세요!'}
                    </p>
                    <p className={styles.lastUpdated}>
                      {room.updatedAt ? new Date(room.updatedAt).toLocaleString() : ''}
                    </p>
                  </div>
                  <div className={`${styles.statusBadge} ${room.status === 'ANSWERED' ? styles.answered : styles.pending}`}>
                    {room.status === 'ANSWERED' ? '답변 완료' : '대기 중'}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default InquiryHistory;