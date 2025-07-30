// src/pages/PaymentSuccessPage.js

import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import '../styles/PaymentSuccessPage.css'; // CSS 파일 import

function PaymentSuccessPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const confirmPayment = async () => {
            const paymentKey = searchParams.get('paymentKey');
            const orderId = searchParams.get('orderId');
            const amount = searchParams.get('amount');

            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders/payment/confirm`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ paymentKey, orderId, amount }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || '결제 승인에 실패했습니다.');
                }
                
                // 성공 시, 결제 완료 페이지나 주문 상세 페이지로 이동
                await response.json();
                alert('결제가 성공적으로 완료되었습니다.');
                navigate(`/mypage/orders`); // 주문 내역 페이지로 이동

            } catch (error) {
                console.error("Payment confirmation failed:", error);
                // 실패 페이지로 이동 시, 실패 관련 정보를 쿼리 파라미터로 전달할 수 있습니다.
                navigate(`/payment/fail?message=${encodeURIComponent(error.message)}`); 
            }
        };

        confirmPayment();
    }, [searchParams, navigate]);

    return (
        <div className="success-page-container">
            <div className="success-card">
                <div className="spinner"></div>
                <h2>결제 승인 중...</h2>
                <p>잠시만 기다려주세요. 자동으로 페이지가 이동됩니다.</p>
            </div>
        </div>
    );
}

export default PaymentSuccessPage;