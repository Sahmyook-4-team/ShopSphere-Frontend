// src/components/SellerPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import axios from 'axios';
import styles from './SellerPage.module.css'; // 기존 CSS Module
import ProductEditModal from './ProductEditModal'; // 수정 모달 import
import SalesStatistics from './SalesStatistics'; // 판매 통계 컴포넌트 import

const SellerPage = () => {
    const navigate = useNavigate();

    const [myProducts, setMyProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState(null); // 현재 수정 중인 상품 데이터
    const [showEditModal, setShowEditModal] = useState(false);  // 모달 표시 여부 상태
    const [viewMode, setViewMode] = useState('grid'); // 'grid' 또는 'list'

    const fetchMyProducts = async () => {
        setIsLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/seller/products`, { withCredentials: true });
            setMyProducts(response.data || []);
        } catch (error) {
            console.error("내가 등록한 상품 목록을 불러오는 데 실패했습니다:", error.response ? error.response.data : error.message);
            if (error.response && error.response.status === 401) {
                alert("로그인이 필요합니다.");
                navigate('/login');
            } else {
                alert("상품 목록을 불러올 수 없습니다.");
            }
            setMyProducts([]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        // ... (기존 판매자 역할 확인 및 상품 목록 로드 로직 동일) ...
        const userRole = localStorage.getItem('userRole');
        if (userRole !== 'SELLER') {
            alert('판매자만 접근할 수 있는 페이지입니다.');
            navigate('/');
            return;
        }

        fetchMyProducts();
    }, [navigate, process.env.REACT_APP_API_BASE_URL]);

    const handleRegisterProduct = () => {
        navigate('/seller/product/new');
    };

    const handleDeleteProduct = async (productId, productName) => {
        if (window.confirm(`상품 '${productName}'을(를) 정말 삭제하시겠습니까?`)) {
            try {
                await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productId}`, { withCredentials: true });
                alert(`상품 '${productName}'이(가) 성공적으로 삭제되었습니다.`);
                setMyProducts(prevProducts => prevProducts.filter(product => product.id !== productId));
            } catch (error) {
                console.error(`상품 '${productName}'삭제 실패:`, error.response ? error.response.data : error.message);
                alert(`상품 '${productName}' 삭제 중 오류가 발생했습니다: ${error.response ? error.response.data.message : error.message}`);
            }
        }
    };

    // 수정 버튼 클릭 핸들러
    const handleEditProduct = (product) => {
        setEditingProduct(product); // 수정할 상품 정보 설정
        setShowEditModal(true);     // 모달 표시
    };

    // 모달에서 저장 완료 시 호출될 함수
    const handleSaveEdit = (updatedProduct) => {
        // 상품 목록에서 수정된 상품 정보 업데이트
        fetchMyProducts();
        setMyProducts(prevProducts =>
            prevProducts.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
        );
        setShowEditModal(false); // 모달 닫기
        setEditingProduct(null); // 수정 중인 상품 정보 초기화
    };

    // 모달 닫기 함수
    const handleCloseModal = () => {
        setShowEditModal(false);
        setEditingProduct(null);
    };

    const getRepresentativeImageUrl = (product) => {
        // ... (기존 로직 동일)
        if (product.representativeImageUrl) {
            return product.representativeImageUrl;
        }
        if (product.images && product.images.length > 0) {
            const repImage = product.images.find(img => img.displayOrder === 0);
            if (repImage) {
                return repImage.imageUrl;
            }
            return product.images[0].imageUrl;
        }
        return '/placeholder-image.png';
    };

    const formatPrice = (price) => {
        // ... (기존 로직 동일)
        if (price === null || price === undefined) return '가격 정보 없음';
        return `${price.toLocaleString()}원`;
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>판매자 센터</h1>

                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>상품 관리</h2>
                    <div className={styles.buttonGroup}>
                        <button onClick={handleRegisterProduct} className={styles.actionButton}>
                            새 상품 등록하기
                        </button>
                        <button 
                            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')} 
                            className={`${styles.viewToggleButton} ${viewMode === 'list' ? styles.activeView : ''}`}
                            title={viewMode === 'grid' ? '리스트 보기로 전환' : '그리드 보기로 전환'}
                        >
                            {viewMode === 'grid' ? '☰ 리스트 보기' : '☷ 그리드 보기'}
                        </button>
                    </div>
                    <div className={styles.contentArea}>
                        {isLoading ? (
                            <p className={styles.loadingText}>상품 목록을 불러오는 중...</p>
                        ) : myProducts.length > 0 ? (
                            <ul className={`${styles.productList} ${viewMode === 'list' ? styles.listView : ''}`}>
                                {myProducts.map((product) => (
                                    <li key={product.id} className={`${styles.productItem} ${viewMode === 'list' ? styles.listItem : ''}`}>
                                        {viewMode === 'grid' && (
                                            <img
                                                src={`${process.env.REACT_APP_API_BASE_URL}${getRepresentativeImageUrl(product)}`}
                                                alt={product.name}
                                                className={styles.productImage}
                                                onError={(e) => { e.target.onerror = null; e.target.src = '/placeholder-image.png'; }}
                                            />
                                        )}
                                        <div className={styles.productInfo}>
                                            <h3 className={styles.productName} title={product.name}>{product.name}</h3>
                                            <div className={styles.productDetails}>
                                                <p className={styles.productPrice}>{formatPrice(product.price)}</p>
                                                <p className={styles.productIdText}>ID: {product.id}</p>
                                            </div>
                                            <div className={styles.productActions}>
                                                <button
                                                    onClick={() => handleEditProduct(product)}
                                                    className={`${styles.actionButton} ${styles.editButton}`}
                                                >
                                                    수정
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                                    className={styles.deleteButton}
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className={styles.noProductsText}>등록된 상품이 없습니다.</p>
                        )}
                    </div>
                </section>

                {/* 판매 통계 섹션 */}
                <SalesStatistics />

            </div>

            {/* 상품 수정 모달 (조건부 렌더링) */}
            {showEditModal && editingProduct && (
                <ProductEditModal
                    product={editingProduct}
                    onClose={handleCloseModal}
                    onSave={handleSaveEdit}
                />
            )}
        </>
    );
};

export default SellerPage;