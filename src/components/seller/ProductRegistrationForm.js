// src/components/ProductRegistrationForm.js (또는 원하는 경로)
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header'; // Header 컴포넌트 경로 확인
import styles from './ProductRegistrationForm.module.css'; // CSS Module import
import axios from 'axios'; // API 호출을 위해 axios 사용

const ProductRegistrationForm = () => {
    const navigate = useNavigate();

    // 폼 입력 상태
    const [productName, setProductName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stockQuantity, setStockQuantity] = useState(''); // 재고 수량 추가
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categories, setCategories] = useState([]); // 카테고리 목록 상태
    const [imageFiles, setImageFiles] = useState([]); // 업로드할 이미지 파일들 (File 객체)
    const [imageUrls, setImageUrls] = useState([]); // 서버에서 받은 이미지 URL들
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0); // 개별 파일 업로드 진행률 (여기선 단순화)

    // 카테고리 목록 로드
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // 백엔드에서 모든 카테고리를 플랫 리스트로 가져오는 API 호출
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
                setCategories(response.data || []); // API 응답 형식에 따라 data 필드 접근
            } catch (error) {
                console.error("카테고리 목록을 불러오는 데 실패했습니다:", error);
                alert("카테고리 목록을 불러올 수 없습니다.");
            }
        };
        fetchCategories();
    }, [process.env.REACT_APP_API_BASE_URL]);

    // 이미지 파일 선택 핸들러
    const handleImageChange = (e) => {
        setImageFiles(Array.from(e.target.files));
        setImageUrls([]); // 새 파일 선택 시 기존 URL 초기화
        setUploadProgress(0);
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = async () => {
        if (imageFiles.length === 0) {
            alert("업로드할 이미지를 선택해주세요.");
            return;
        }
        setIsUploading(true);
        setUploadProgress(0); // 업로드 시작 시 진행률 초기화

        const uploadedUrls = [];
        try {
            // productId는 아직 없으므로, 임시 값(예: 0 또는 사용자 ID)을 사용하거나
            // 백엔드 API가 productId 없이도 처리 가능하도록 설계되어야 함.
            // 여기서는 임시로 'temp' 또는 사용자 관련 ID를 사용할 수 있음.
            // 혹은, 상품 기본 정보 저장 후 productId를 받아와서 이미지를 업로드하는 2단계도 가능.
            // 지금은 productId가 경로에 포함된 API를 사용한다고 가정하고,
            // 실제 productId가 없으므로 임의의 값(예: 0)을 사용. (백엔드에서 이 경우를 처리해야 함)
            const tempProductIdForPath = 0; // 또는 사용자 ID 등

            for (let i = 0; i < imageFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', imageFiles[i]);

                // 단일 파일 업로드 API 호출
                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/api/files/upload/product-image/${tempProductIdForPath}`, // productId는 임시값
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            // 간단히 마지막 파일의 진행률만 표시 (UI 개선 필요)
                            setUploadProgress(percentCompleted);
                        }
                    }
                );
                uploadedUrls.push(response.data.imageUrl); // 백엔드 응답 형식에 맞게 imageUrl 추출
            }
            setImageUrls(uploadedUrls);
            alert("이미지 업로드 완료!");
        } catch (error) {
            console.error("이미지 업로드 실패:", error.response ? error.response.data : error.message);
            alert(`이미지 업로드 중 오류가 발생했습니다: ${error.response ? error.response.data.message : error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // 상품 등록 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (imageUrls.length === 0) {
            alert("상품 이미지를 먼저 업로드해주세요.");
            return;
        }
        if (!selectedCategoryId) {
            alert("카테고리를 선택해주세요.");
            return;
        }
        if (!productName.trim() || !description.trim() || !price || !stockQuantity) {
            alert("모든 필수 항목(상품명, 설명, 가격, 재고)을 입력해주세요.");
            return;
        }

        setIsSubmitting(true);

        const productData = {
            name: productName,
            description: description,
            price: parseInt(price, 10),
            stockQuantity: parseInt(stockQuantity, 10),
            categoryId: parseInt(selectedCategoryId, 10),
            imageUrl: imageUrls[0], // 첫 번째 이미지를 대표 이미지로
            additionalImageUrls: imageUrls.slice(1), // 나머지 이미지를 추가 이미지로
            // options: [] // 옵션 기능이 있다면 추가
        };

        try {
            // 백엔드의 상품 등록 API 호출 (세션/토큰 기반 인증 필요)
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/products`, productData, { withCredentials: true });
            alert("상품이 성공적으로 등록되었습니다!");
            navigate('/seller'); // 등록 후 판매자 페이지로 이동
        } catch (error) {
            console.error("상품 등록 실패:", error.response ? error.response.data : error.message);
            alert(`상품 등록 중 오류가 발생했습니다: ${error.response ? error.response.data.message : error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>새 상품 등록</h1>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* 상품명 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="productName" className={styles.label}>상품명 <span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            id="productName"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                            className={styles.input}
                            required
                        />
                    </div>

                    {/* 상품 설명 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="description" className={styles.label}>상품 설명 <span className={styles.required}>*</span></label>
                        <textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={styles.textarea}
                            rows="5"
                            required
                        />
                    </div>

                    {/* 가격 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="price" className={styles.label}>가격 (원) <span className={styles.required}>*</span></label>
                        <input
                            type="number"
                            id="price"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={styles.input}
                            min="0"
                            required
                        />
                    </div>

                    {/* 재고 수량 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="stockQuantity" className={styles.label}>재고 수량 <span className={styles.required}>*</span></label>
                        <input
                            type="number"
                            id="stockQuantity"
                            value={stockQuantity}
                            onChange={(e) => setStockQuantity(e.target.value)}
                            className={styles.input}
                            min="0"
                            required
                        />
                    </div>


                    {/* 카테고리 선택 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="category" className={styles.label}>카테고리 <span className={styles.required}>*</span></label>
                        <select
                            id="category"
                            value={selectedCategoryId}
                            onChange={(e) => setSelectedCategoryId(e.target.value)}
                            className={styles.select}
                            required
                        >
                            <option value="">카테고리를 선택하세요</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {/* 계층 구조를 이름으로 표현 (예: 의류 > 상의 > 티셔츠) */}
                                    {/* 백엔드에서 부모 카테고리 정보까지 포함해서 내려준다면 더 좋음 */}
                                    {/* 현재는 카테고리 이름만 표시 */}
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 상품 이미지들 업로드 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="images" className={styles.label}>상품 이미지 (첫 번째 이미지가 대표 이미지) <span className={styles.required}>*</span></label>
                        <input
                            type="file"
                            id="images"
                            multiple // 여러 파일 선택 가능
                            onChange={handleImageChange}
                            className={styles.fileInput}
                            accept="image/*"
                        />
                        {imageFiles.length > 0 && (
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className={styles.uploadButton}
                                disabled={isUploading}
                            >
                                {isUploading ? `업로드 중... ${uploadProgress}%` : `선택된 ${imageFiles.length}개 이미지 업로드`}
                            </button>
                        )}
                    </div>

                    {/* 업로드된 이미지 미리보기 또는 URL 목록 */}
                    {imageUrls.length > 0 && (
                        <div className={styles.imagePreviewContainer}>
                            <h3 className={styles.subTitle}>업로드된 이미지:</h3>
                            <ul className={styles.imagePreviewList}>
                                {imageUrls.map((url, index) => (
                                    <li key={index} className={styles.imagePreviewItem}>
                                        <img src={url} alt={`상품 이미지 ${index + 1}`} className={styles.previewImage} />
                                        <p className={styles.imageUrlText}>{url}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    
                    {/* 등록 버튼 */}
                    <button
                        type="submit"
                        className={styles.submitButton}
                        disabled={isSubmitting || isUploading || imageUrls.length === 0}
                    >
                        {isSubmitting ? "등록 중..." : "상품 등록하기"}
                    </button>
                </form>
            </div>
        </>
    );
};

export default ProductRegistrationForm;