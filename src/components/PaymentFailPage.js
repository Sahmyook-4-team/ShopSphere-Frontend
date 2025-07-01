// src/pages/PaymentFailPage.js
import React from 'react';
import { useSearchParams, Link } from 'react-router-dom';

function PaymentFailPage() {
    const [searchParams] = useSearchParams();
    const errorMessage = searchParams.get('message') || '알 수 없는 오류로 결제에 실패했습니다.';
    const errorCode = searchParams.get('code');

    return (
        <div>
            <h2>결제 실패</h2>
            <p>오류 메시지: {errorMessage}</p>
            {errorCode && <p>오류 코드: {errorCode}</p>}
            <Link to="/">홈으로 돌아가기</Link>
        </div>
    );
}

export default PaymentFailPage;