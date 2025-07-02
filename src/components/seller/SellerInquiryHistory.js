import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import styles from './SellerInquiryHistory.module.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const SellerInquiryHistory = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/mypage/inquiries`);
        // 응답이 배열인지 확인하고, 아니라면 빈 배열로 설정
        setInquiries(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        console.error("문의 내역 조회 오류:", err);
        setInquiries([]); // 에러 발생 시 빈 배열로 설정
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);

  if (loading) return <div className="loading-message">로딩 중...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>문의 내역</h1>
      
      <div className={styles.inquiryList}>
        {inquiries.length === 0 ? (
          <div className={styles.emptyInquiryView}>
            <div className={styles.emptyIcon}>📄</div>
            <p>진행중인 문의가 없습니다</p>
          </div>
        ) : (
          inquiries.map((inquiry) => (
            <Link to={`/mypage/inquiries/${inquiry.id}`} key={inquiry.id} className={styles.inquiryCard}>
              <img 
                src={inquiry.sellerProfileImageUrl || 'https://via.placeholder.com/80'} 
                alt="product" 
                className={styles.productImage}
              />
              <div className={styles.inquiryContent}>
                <div className={styles.inquiryCardTitle}>{inquiry.sellerName || '판매자'}</div>
                <div className={styles.inquiryCategory}>{inquiry.title || '제목 없음'}</div>
                <div className={styles.inquirySnippet}>
                  {inquiry.contentSnippet || '내용이 없습니다.'}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerInquiryHistory;