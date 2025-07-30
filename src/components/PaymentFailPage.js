// src/pages/PaymentFailPage.js

import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import '../styles/PaymentFailPage.css'; // CSS 파일 import

function PaymentFailPage() {
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get('message') || '알 수 없는 오류로 결제에 실패했습니다.';
    const errorCode = searchParams.get('code');

    return (
        <div className="fail-page-container">
            <div className="fail-card">
                <h2>결제 실패</h2>
                <div className="error-details">
                    <p><strong>오류 메시지:</strong> {errorMessage}</p>
                    {errorCode && <p><strong>오류 코드:</strong> {errorCode}</p>}
                </div>
                <Link to="/" className="home-link">홈으로 돌아가기</Link>
            </div>
        </div>
    );
}

export default PaymentFailPage;