import { Card, CardContent } from "@/components/ui/card";
import { MessageSquarePlus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from './SellerInquiryHistory.module.css';
import { useNavigate } from 'react-router-dom';

const SellerInquiryHistory = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItemId, setOrderItemId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      setIsModalOpen(true);
    }
  };

  // 채팅방 생성 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!orderItemId.trim()) {
      alert("주문 상품 ID를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/inquiry-chats/rooms?orderItemId=${orderItemId}`,
        {},
        { withCredentials: true }
      );
      
      if (response.data?.id) {
        navigate(`/inquiry/chat/${response.data.id}`);
      }
    } catch (err) {
      console.error("채팅방 생성 실패:", err);
      alert("채팅방을 생성하는 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
      setIsModalOpen(false);
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
                    <div className={styles.inquiryHeader}>
                      <h3>{room.productName || '상품 문의'}</h3>
                      {room.orderItemId && (
                        <span className={styles.orderNumber}>주문번호: {room.orderItemId}</span>
                      )}
                    </div>
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

      {/* 주문 상품 ID 입력 모달 */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2>새 문의 시작하기</h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={styles.closeButton}
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.formGroup}>
                <label htmlFor="orderItemId">주문 상품 ID</label>
                <input
                  type="text"
                  id="orderItemId"
                  value={orderItemId}
                  onChange={(e) => setOrderItemId(e.target.value)}
                  placeholder="주문 상품 ID를 입력하세요"
                  required
                />
                <p className={styles.helpText}>문의하실 상품의 주문 상품 ID를 입력해주세요.</p>
              </div>
              <div className={styles.modalActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.cancelButton}
                  disabled={isSubmitting}
                >
                  취소
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '처리 중...' : '문의 시작하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInquiryHistory;