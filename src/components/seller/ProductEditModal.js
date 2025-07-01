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
    const [options, setOptions] = useState([{ size: '', stockQuantity: 0, additionalPrice: 0 }]);

    // 상품 데이터로 폼 초기화 및 카테고리 로드
    useEffect(() => {
        if (product) {
            setProductName(product.name || '');
            setDescription(product.description || '');
            setPrice(product.price !== null ? String(product.price) : '');
            setStockQuantity(product.stockQuantity !== null ? String(product.stockQuantity) : '');
            setSelectedCategoryId(product.category ? String(product.category.id) : '');
            // 상품 옵션이 있으면 설정, 없으면 기본값
            if (product.options && product.options.length > 0) {
                setOptions(product.options.map(opt => {
                    // opt에 id 속성이 있는 경우에만 id를 포함시킵니다.
                    const option = {
                        ...('id' in opt && { id: opt.id }),
                        size: opt.size || '',
                        stockQuantity: opt.stockQuantity || 0,
                        additionalPrice: opt.additionalPrice || 0
                    };
                    return option;
                }));
            }
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

    // 옵션 추가 (새 옵션은 id 없이 추가)
    const addOption = () => {
        setOptions([...options, { size: '', stockQuantity: 0, additionalPrice: 0 }]);
    };

    // 옵션 삭제
    const removeOption = (index) => {
        if (options.length <= 1) return; // 최소 한 개의 옵션은 유지
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    // 옵션 변경 핸들러
    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index] = { ...newOptions[index], [field]: value };
        setOptions(newOptions);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!product) return;

        // 옵션 유효성 검사
        const hasEmptySize = options.some(opt => !opt.size.trim());
        if (hasEmptySize) {
            alert('모든 옵션의 사이즈를 입력해주세요.');
            return;
        }

        // 중복된 사이즈가 있는지 확인
        const sizes = options.map(opt => opt.size.trim().toLowerCase());
        const uniqueSizes = new Set(sizes);
        if (sizes.length !== uniqueSizes.size) {
            alert('중복된 사이즈가 있습니다. 각 옵션의 사이즈는 고유해야 합니다.');
            return;
        }

        setIsSubmitting(true);

        // 총 재고 수량 계산 (옵션 재고의 합계)
        const totalStock = options.reduce((sum, opt) => sum + (parseInt(opt.stockQuantity, 10) || 0), 0);

        const updatedProductData = {
            name: productName,
            description: description,
            price: parseInt(price, 10),
            stockQuantity: totalStock, // 옵션 재고의 합계로 설정
            categoryId: parseInt(selectedCategoryId, 10),
            options: options.map(opt => ({
                id: opt.id || undefined, // 새 옵션은 id가 없을 수 있음
                size: opt.size,
                stockQuantity: parseInt(opt.stockQuantity, 10) || 0,
                additionalPrice: parseInt(opt.additionalPrice, 10) || 0
            }))
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

                    {/* 상품 옵션 섹션 */}
                    <div className={styles.formGroup}>
                        <div className={styles.optionHeader}>
                            <span className={styles.optionTitle}>상품 옵션 <span className={styles.required}>*</span></span>
                            <button
                                type="button"
                                onClick={addOption}
                                className={styles.addOptionButton}
                            >
                                <span>+</span> 옵션 추가
                            </button>
                        </div>

                        <div className={styles.optionsContainer}>
                            {options.length === 0 ? (
                                <p className={styles.noOptionsText}>옵션을 추가해주세요.</p>
                            ) : (
                                options.map((option, index) => (
                                    <div key={option.id || index} className={styles.optionRow}>
                                        <div className={styles.optionInputContainer}>
                                            <label className={styles.optionLabel}>
                                                사이즈 <span className={styles.requiredField}>*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="예: S, M, L"
                                                value={option.size}
                                                onChange={(e) => handleOptionChange(index, 'size', e.target.value)}
                                                className={styles.optionInput}
                                                required
                                            />
                                        </div>

                                        <div className={styles.optionInputContainer}>
                                            <label className={styles.optionLabel}>
                                                재고 <span className={styles.requiredField}>*</span>
                                            </label>
                                            <input
                                                type="number"
                                                value={option.stockQuantity}
                                                onChange={(e) => handleOptionChange(index, 'stockQuantity', e.target.value)}
                                                min="0"
                                                className={styles.optionInput}
                                                required
                                            />
                                        </div>

                                        <div className={styles.optionInputContainer}>
                                            <label className={styles.optionLabel}>
                                                추가 가격 (원)
                                            </label>
                                            <input
                                                type="number"
                                                value={option.additionalPrice}
                                                onChange={(e) => handleOptionChange(index, 'additionalPrice', e.target.value)}
                                                min="0"
                                                className={styles.optionInput}
                                            />
                                        </div>

                                        {options.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOption(index)}
                                                className={styles.removeOptionButton}
                                                title="옵션 삭제"
                                                aria-label="옵션 삭제"
                                            >
                                                ×
                                            </button>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>

                        {options.length > 0 && (
                            <div className={styles.totalStockInfo}>
                                총 재고 수량: {options.reduce((sum, opt) => sum + (parseInt(opt.stockQuantity, 10) || 0), 0)}개
                            </div>
                        )}
                    </div>

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