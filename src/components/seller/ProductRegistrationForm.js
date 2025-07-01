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
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [categories, setCategories] = useState([]);
    const [imageFiles, setImageFiles] = useState([]); // 업로드할 이미지 파일들 (File 객체)
    const [previewImageUrls, setPreviewImageUrls] = useState([]); // 로컬 미리보기용 Data URL들
    const [imageUrls, setImageUrls] = useState([]); // 서버에서 받은 이미지 URL들
    const [isUploading, setIsUploading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [formError, setFormError] = useState(''); // 폼 관련 에러 메시지
    const [options, setOptions] = useState([
        { size: '', stockQuantity: 0, additionalPrice: 0 }
    ]); // 상품 옵션 상태

    // 카테고리 목록 로드
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/categories`);
                setCategories(response.data || []);
            } catch (error) {
                console.error("카테고리 목록을 불러오는 데 실패했습니다:", error);
                setFormError("카테고리 목록을 불러올 수 없습니다. 페이지를 새로고침 해주세요.");
            }
        };
        fetchCategories();
    }, []); // REACT_APP_API_BASE_URL은 일반적으로 변경되지 않으므로, 의존성 배열에서 제거 가능 (환경변수)

    // 이미지 파일 선택 핸들러 (로컬 미리보기 기능 추가)
    const handleImageChange = async (e) => {
        const files = Array.from(e.target.files);
        setFormError(''); // 이전 에러 메시지 초기화

        if (files.length === 0) {
            setImageFiles([]);
            setPreviewImageUrls([]);
            return;
        }

        // 최대 파일 개수 제한 (예: 5개)
        if (files.length > 5) {
            setFormError("이미지는 최대 5개까지 첨부할 수 있습니다.");
            e.target.value = null; // 파일 선택 초기화
            return;
        }
        
        setImageFiles(files); // File 객체 저장
        setImageUrls([]); // 새 파일 선택 시 기존 서버 URL 초기화
        setPreviewImageUrls([]); // 로컬 미리보기 URL 초기화
        setUploadProgress(0);

        const fileReadPromises = files.map(file => {
            return new Promise((resolve, reject) => {
                // 파일 크기 제한 (예: 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    reject(new Error(`'${file.name}' 파일 크기는 5MB를 초과할 수 없습니다.`));
                    return;
                }
                // 파일 타입 제한 (예: jpg, png, gif)
                if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
                    reject(new Error(`'${file.name}' 파일은 지원되지 않는 형식입니다. (JPG, PNG, GIF 만 가능)`));
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result); // Data URL 반환
                };
                reader.onerror = (error) => {
                    reject(new Error(`'${file.name}' 파일을 읽는 중 오류 발생: ${error}`));
                };
                reader.readAsDataURL(file);
            });
        });

        try {
            const loadedPreviewUrls = await Promise.all(fileReadPromises);
            setPreviewImageUrls(loadedPreviewUrls);
        } catch (error) {
            console.error("이미지 미리보기 생성 실패:", error);
            setFormError(error.message || "이미지 미리보기 중 오류가 발생했습니다.");
            setImageFiles([]); // 오류 시 파일 목록 초기화
            setPreviewImageUrls([]);
            e.target.value = null; // 파일 선택 input 초기화
        }
    };

    // 이미지 업로드 핸들러
    const handleImageUpload = async () => {
        if (imageFiles.length === 0) {
            setFormError("업로드할 이미지를 선택해주세요.");
            return;
        }
        setFormError('');
        setIsUploading(true);
        setUploadProgress(0);

        const uploadedUrlsFromResponse = [];
        try {
            // tempProductIdForPath는 백엔드 설계에 따라 달라짐
            // 여기서는 상품 ID 없이 업로드 가능하거나, 임시 ID를 사용하는 API로 가정
            const tempProductIdForPath = 0; // 또는 사용자 ID 등, 실제 백엔드 API 명세 확인 필요

            for (let i = 0; i < imageFiles.length; i++) {
                const formData = new FormData();
                formData.append('file', imageFiles[i]);

                const response = await axios.post(
                    `${process.env.REACT_APP_API_BASE_URL}/api/files/upload/product-image/${tempProductIdForPath}`,
                    formData,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' },
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.total) {
                                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                                // 여러 파일 업로드 시, 전체 진행률 또는 마지막 파일 진행률 표시 (개선 가능)
                                setUploadProgress(percentCompleted);
                            }
                        }
                    }
                );
                // 백엔드 응답에서 imageUrl 필드를 확인해야 함
                // 예시: response.data가 { "imageUrl": "http://..." } 형태라고 가정
                if (response.data && response.data.imageUrl) {
                    uploadedUrlsFromResponse.push(response.data.imageUrl);
                } else {
                    // 서버 응답에 imageUrl이 없는 경우에 대한 처리
                    console.warn(`서버 응답에 imageUrl이 없습니다. 파일: ${imageFiles[i].name}`, response.data);
                    // 부분 성공 처리 또는 전체 실패 처리 결정 필요
                }
            }
            setImageUrls(uploadedUrlsFromResponse);
            setPreviewImageUrls([]); // 서버 업로드 성공 시 로컬 미리보기는 비움 (서버 URL로 대체)
            alert("이미지 업로드 완료!");
        } catch (error) {
            console.error("이미지 업로드 실패:", error.response ? error.response.data : error.message);
            setFormError(`이미지 업로드 중 오류: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsUploading(false);
        }
    };

    // 옵션 추가 핸들러
    const addOption = () => {
        setOptions([...options, { size: '', stockQuantity: 0, additionalPrice: 0 }]);
    };

    // 옵션 제거 핸들러
    const removeOption = (index) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        setOptions(newOptions);
    };

    // 옵션 변경 핸들러
    const handleOptionChange = (index, field, value) => {
        const newOptions = [...options];
        newOptions[index] = {
            ...newOptions[index],
            [field]: field === 'size' ? value : parseInt(value, 10) || 0
        };
        setOptions(newOptions);
    };

    // 상품 등록 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError(''); // 이전 에러 메시지 초기화

        if (imageUrls.length === 0) {
            setFormError("상품 이미지를 먼저 업로드해주세요 (선택 후 '이미지 업로드' 버튼 클릭).");
            return;
        }
        if (!selectedCategoryId) {
            setFormError("카테고리를 선택해주세요.");
            return;
        }
        if (!productName.trim() || !description.trim() || !price) {
            setFormError("모든 필수 항목(상품명, 설명, 가격)을 입력해주세요.");
            return;
        }
        if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
            setFormError("가격은 0 이상의 숫자여야 합니다.");
            return;
        }

        // 옵션 유효성 검사
        const hasEmptyOption = options.some(option => !option.size.trim());
        if (hasEmptyOption) {
            setFormError("모든 옵션의 사이즈를 입력해주세요.");
            return;
        }

        const hasDuplicateSizes = new Set(options.map(opt => opt.size)).size !== options.length;
        if (hasDuplicateSizes) {
            setFormError("중복된 사이즈가 있습니다. 각 옵션의 사이즈는 고유해야 합니다.");
            return;
        }

        setIsSubmitting(true);

        const productData = {
            name: productName,
            description: description,
            price: parseFloat(price),
            stockQuantity: options.reduce((sum, opt) => sum + (parseInt(opt.stockQuantity, 10) || 0), 0), // 모든 옵션의 재고 합계
            categoryId: parseInt(selectedCategoryId, 10),
            imageUrl: imageUrls[0],
            additionalImageUrls: imageUrls.slice(1),
            options: options.map(opt => ({
                size: opt.size,
                stockQuantity: parseInt(opt.stockQuantity, 10) || 0,
                additionalPrice: parseInt(opt.additionalPrice, 10) || 0
            }))
        };

        try {
            await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/products`, productData, { withCredentials: true });
            alert("상품이 성공적으로 등록되었습니다!");
            navigate('/seller'); // 등록 후 판매자 페이지로 이동 (또는 상품 목록 등)
        } catch (error) {
            console.error("상품 등록 실패:", error.response ? error.response.data : error.message);
            setFormError(`상품 등록 중 오류: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // 이미지 제거 핸들러 (로컬 미리보기에서 특정 이미지 제거)
    const handleRemovePreviewImage = (indexToRemove) => {
        // previewImageUrls에서 해당 인덱스 이미지 제거
        setPreviewImageUrls(prev => prev.filter((_, index) => index !== indexToRemove));
        // imageFiles에서도 해당 인덱스 파일 제거
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    return (
        <>
            <Header />
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>새 상품 등록</h1>
                {formError && <p className={styles.errorMessage}>{formError}</p>}
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* ... (상품명, 설명, 가격, 재고, 카테고리 입력 필드는 동일) ... */}
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
                            step="any" // 소수점 입력 가능
                            required
                        />
                    </div>

                    {/* 상품 옵션 */}
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
                                <p style={{ color: '#666', fontSize: '0.9em', textAlign: 'center', padding: '15px' }}>
                                    옵션을 추가해주세요.
                                </p>
                            ) : (
                                options.map((option, index) => (
                                    <div key={index} className={styles.optionRow}>
                                        <div className={styles.optionInputContainer}>
                                            <label className={styles.optionLabel}>
                                                사이즈 <span className={styles.requiredField}></span>
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
                                                재고 <span className={styles.requiredField}></span>
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
                            <div style={{ marginTop: '10px', fontSize: '0.85em', color: '#666' }}>
                                총 재고 수량: {options.reduce((sum, opt) => sum + (parseInt(opt.stockQuantity, 10) || 0), 0)}개
                            </div>
                        )}
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
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* 상품 이미지들 업로드 */}
                    <div className={styles.formGroup}>
                        <label htmlFor="images" className={styles.label}>
                            상품 이미지 (첫 번째 이미지가 대표 이미지, 최대 5개, 각 5MB 이하, JPG/PNG/GIF)
                            <span className={styles.required}>*</span>
                        </label>
                        <input
                            type="file"
                            id="images"
                            multiple
                            onChange={handleImageChange}
                            className={styles.fileInput}
                            accept="image/jpeg, image/png, image/gif"
                        />
                        {imageFiles.length > 0 && previewImageUrls.length > 0 && ( // 로컬 미리보기가 있을 때만 업로드 버튼 표시
                            <button
                                type="button"
                                onClick={handleImageUpload}
                                className={styles.uploadButton}
                                disabled={isUploading || imageUrls.length > 0 } // 이미 서버 업로드 완료 시 비활성화
                            >
                                {isUploading ? `업로드 중... ${uploadProgress}%` : 
                                 imageUrls.length > 0 ? '이미지 업로드 완료' : `선택된 ${imageFiles.length}개 이미지 서버에 업로드`}
                            </button>
                        )}
                    </div>

                    {/* --- 미리보기 섹션 수정 --- */}
                    {/* 1. 로컬 파일 미리보기 (파일 선택 후, 서버 업로드 전) */}
                    {previewImageUrls.length > 0 && (
                        <div className={styles.imagePreviewContainer}>
                            <h3 className={styles.subTitle}>선택된 이미지 미리보기 (업로드 전):</h3>
                            <ul className={styles.imagePreviewList}>
                                {previewImageUrls.map((url, index) => (
                                    <li key={`preview-${index}`} className={styles.imagePreviewItem}>
                                        <img src={url} alt={`미리보기 ${index + 1}`} className={styles.previewImage} />
                                        <p className={styles.imageNameText}>{imageFiles[index]?.name}</p>
                                        <button 
                                            type="button" 
                                            onClick={() => handleRemovePreviewImage(index)}
                                            className={styles.removeImageButton}
                                            aria-label={`미리보기 ${index + 1} 이미지 제거`}
                                            disabled={isUploading || imageUrls.length > 0} // 업로드 중이거나, 서버 업로드 완료 후에는 로컬 제거 비활성화
                                        >
                                            X
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* 2. 서버 업로드 후 이미지 목록 (서버 URL 사용) */}
                    {imageUrls.length > 0 && (
                        <div className={styles.imagePreviewContainer}>
                            <h3 className={styles.subTitle}>업로드된 이미지 (서버 저장됨):</h3>
                            <ul className={styles.imagePreviewList}>
                                {imageUrls.map((url, index) => (
                                    <li key={`server-${index}`} className={styles.imagePreviewItem}>
                                        <img src={`${process.env.REACT_APP_API_BASE_URL}${url}`} alt={`서버 이미지 ${index + 1}`} className={styles.previewImage} />
                                        {/* <p className={styles.imageUrlText}>{url}</p> */}
                                    </li>
                                ))}
                            </ul>
                            <p className={styles.infoText}>이미지가 서버에 업로드되었습니다. 내용을 확인 후 상품을 등록해주세요.</p>
                        </div>
                    )}
                    
                    <button
                        type="submit"
                        className={styles.submitButton}
                        // imageUrls (서버에 업로드된 이미지 URL)가 있어야 등록 가능
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