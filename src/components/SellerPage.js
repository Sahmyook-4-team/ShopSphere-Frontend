import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header'; // Header 컴포넌트 경로가 맞는지 확인해주세요.
// import styles from '../styles/SellerPage.module.css'; // 전용 CSS 모듈 (선택 사항)

const SellerPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // (선택 사항) 판매자 역할이 아닐 경우 접근 제한 로직
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'SELLER') {
            alert('판매자만 접근할 수 있는 페이지입니다.');
            navigate('/'); // 혹은 로그인 페이지로 이동
        }
    }, [navigate]);

    // 각 기능에 대한 실제 구현은 추후 추가됩니다.
    const handleRegisterProduct = () => {
        console.log("상품 등록 기능 실행");
        // navigate('/seller/product/new'); // 예시: 상품 등록 페이지로 이동
        alert("상품 등록 기능은 준비 중입니다.");
    };

    const handleDeleteProduct = (productId) => {
        console.log(`${productId} 상품 삭제 기능 실행`);
        alert(`${productId} 상품 삭제 기능은 준비 중입니다.`);
    };

    return (
        <>
            <Header />
            <div style={styles.container}>
                <h1 style={styles.pageTitle}>판매자 센터</h1>

                {/* 상품 관리 섹션 */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>상품 관리</h2>
                    <div style={styles.buttonGroup}>
                        <button onClick={handleRegisterProduct} style={styles.actionButton}>
                            새 상품 등록하기
                        </button>
                    </div>
                    <div style={styles.contentArea}>
                        <p>등록된 상품 목록이 여기에 표시됩니다.</p>
                        {/* 예시 상품 목록 (향후 동적으로 생성) */}
                        <ul style={styles.productList}>
                            <li style={styles.productItem}>
                                <span>상품 A (ID: 101)</span>
                                <button onClick={() => handleDeleteProduct(101)} style={styles.deleteButton}>삭제</button>
                            </li>
                            <li style={styles.productItem}>
                                <span>상품 B (ID: 102)</span>
                                <button onClick={() => handleDeleteProduct(102)} style={styles.deleteButton}>삭제</button>
                            </li>
                        </ul>
                    </div>
                </section>

                {/* 판매 통계 섹션 */}
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>판매 통계</h2>
                    <div style={styles.contentArea}>
                        <p>년도별/월별/주별 판매량 데이터 및 차트가 여기에 표시됩니다.</p>
                        {/* 예시 통계 선택 옵션 */}
                        <div style={styles.statsOptions}>
                            <select style={styles.selectBox}>
                                <option value="yearly">년도별</option>
                                <option value="monthly">월별</option>
                                <option value="weekly">주별</option>
                            </select>
                            <button style={{ ...styles.actionButton, marginLeft: '10px' }}>조회하기</button>
                        </div>
                        <div style={styles.chartPlaceholder}>
                            {/* 실제 차트 라이브러리가 여기에 통합될 수 있습니다. */}
                            판매량 차트 영역
                        </div>
                    </div>
                </section>

                {/* 추가 기능 섹션 (필요에 따라) */}
                {/* 
                <section style={styles.section}>
                    <h2 style={styles.sectionTitle}>정산 관리</h2>
                    <div style={styles.contentArea}>
                        <p>판매 대금 정산 내역이 여기에 표시됩니다.</p>
                    </div>
                </section>
                */}
            </div>
        </>
    );
};

// 간단한 인라인 스타일 객체 (실제 프로젝트에서는 CSS 파일 또는 CSS-in-JS 사용 권장)
const styles = {
    container: {
        padding: '20px',
        maxWidth: '1200px',
        margin: '90px auto 0', // Header 높이(71px) + 추가 여백
        fontFamily: 'Arial, sans-serif',
    },
    pageTitle: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '30px',
        fontSize: '2em',
    },
    section: {
        backgroundColor: '#f9f9f9',
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    },
    sectionTitle: {
        color: '#555',
        borderBottom: '2px solid #007bff',
        paddingBottom: '10px',
        marginBottom: '20px',
        fontSize: '1.5em',
    },
    contentArea: {
        color: '#666',
    },
    buttonGroup: {
        marginBottom: '20px',
    },
    actionButton: {
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        padding: '10px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '1em',
        transition: 'background-color 0.2s ease',
    },
    productList: {
        listStyle: 'none',
        padding: 0,
    },
    productItem: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 0',
        borderBottom: '1px solid #ddd',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    statsOptions: {
        marginBottom: '20px',
    },
    selectBox: {
        padding: '8px',
        borderRadius: '4px',
        borderColor: '#ccc',
    },
    chartPlaceholder: {
        border: '1px dashed #ccc',
        padding: '50px',
        textAlign: 'center',
        color: '#aaa',
        marginTop: '20px',
        borderRadius: '5px',
    }
};

// actionButton 호버 스타일 (JavaScript로 직접 제어는 복잡하므로 CSS 클래스 사용 권장)
// 예: styles.actionButton[':hover'] = { backgroundColor: '#0056b3' }; (React에서는 이렇게 동작하지 않음)


export default SellerPage;