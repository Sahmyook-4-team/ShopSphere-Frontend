import React, { useState, useEffect } from 'react';
import styles from './ProductEditModal.module.css'; // 모달 전용 CSS Module
import axios from 'axios';

const ProductEditModal = ({ product, onClose, onSave }) => {
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    // 이미지 수정은 복잡하므로 이 예제에서는 제외 (필요시 추가 구현)
    // const [imageFiles, setImageFiles] = useState([]);
    // const [currentImageUrls, setCurrentImageUrls] = useState([]);

    const [isSubmitting, setIsSubmitting] = useState(false);

    // 상품 데이터로 폼 초기화 및 카테고리 로드
    useEffect(() => {
        if (product) {
            setProductName(product.name || '');
            setDescription(product.description || '');
            setPrice(product.price !== null ? String(product.price) : '');
            setStockQuantity(product.stockQuantity !== null ? String(product.stockQuantity) : '');
            setSelectedCategoryId(product.category ? String(product.category.id) : '');
            // setCurrentImageUrls(product.images ? product.images.map(img => img.imageUrl) : []);
        }

        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
                setCategories(response.data || []);
            } catch (error) {
                console.error("카테고리 목록 로드 실패 (모달):", error);
            }
        };
        fetchCategories();
    }, [product, process.env.REACT_APP_API_BASE_URL]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product) return;

        setIsSubmitting(true);
        const updatedProductData = {
            name: productName,
            description: description,
            price: parseInt(price, 10),
            stockQuantity: parseInt(stockQuantity, 10),
            categoryId: parseInt(selectedCategoryId, 10),
            // imageUrl: currentImageUrls.length > 0 ? currentImageUrls[0] : null, // 대표 이미지 URL (Product 엔티티에 있다면)
            // ProductDTO.UpdateRequest에 맞춰 필요한 필드 전달
        };

        try {
            // 백엔드의 상품 수정 API 호출
            const response = await axios.put(
                `${process.env.REACT_APP_API_BASE_URL}/api/products/${product.id}`,
                updatedProductData,
                { withCredentials: true }
            );
            onSave(response.data); // 부모 컴포넌트에 수정된 상품 데이터 전달
            alert('상품 정보가 성공적으로 수정되었습니다.');
            onClose(); // 모달 닫기
        } catch (error) {
            console.error("상품 수정 실패:", error.response ? error.response.data : error.message);
            alert(`상품 수정 중 오류가 발생했습니다: ${error.response ? error.response.data.message : error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!product) return null; // product 데이터가 없으면 모달을 렌더링하지 않음

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>상품 정보 수정 (상품명: {product.name})</h2>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="editProductName" className={styles.label}>상품명</label>
                        <input
                            type="text"
                            id="editProductName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="editDescription" className={styles.label}>상품 설명</label>
                        <textarea
                            id="editDescription"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                            rows="4"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="editPrice" className={styles.label}>가격 (원)</label>
                        <input
                            type="text"
                            id="editPrice"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={styles.input}
                            min="0"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="editStockQuantity" className={styles.label}>재고 수량</label>
                        <input
                            type="text"
                            id="editStockQuantity"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            className={styles.input}
                            min="0"
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="editCategory" className={styles.label}>카테고리</label>
                        <select
                            id="editCategory"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* 이미지 수정 UI는 복잡하여 이 예제에서는 생략합니다. */}
                    {/* 필요하다면 여기에 이미지 업로드/삭제/순서 변경 UI 추가 */}

                    <div className={styles.buttonContainer}>
                        <button type="submit" className={styles.saveButton} disabled={isSubmitting}>
                            {isSubmitting ? "저장 중..." : "변경사항 저장"}
                        </button>
                        <button type="button" onClick={onClose} className={styles.cancelButton} disabled={isSubmitting}>
                            취소
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductEditModal;