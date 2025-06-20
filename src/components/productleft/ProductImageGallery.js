// src/components/productleft/ProductImageGallery.js
import React, { useState, useEffect, useCallback } from 'react';
import MainImageView from './MainImageView';
import ThumbnailList from './ThumbnailList';
import styles from '../../styles/ProductImageGallery.module.css'; // 경로 다시 확인!

// 🔽 productDescription prop 추가
const ProductImageGallery = ({ imagesData = [], productName, productDescription }) => {
  const [selectedImageUrl, setSelectedImageUrl] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const API_BASE_URL = "http://localhost:8080";

  // ... (useEffect, findIndexByUrl, handleSelectImage, handlePrevImage, handleNextImage 로직은 동일) ...
  useEffect(() => {
    if (imagesData && imagesData.length > 0) {
      const sortedImages = [...imagesData].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      let initialImageIndex = sortedImages.findIndex(img => img.isRepresentative === true);
      if (initialImageIndex === -1) {
        initialImageIndex = 0;
      }
      setCurrentIndex(initialImageIndex);
      // sortedImages[initialImageIndex] 가 undefined가 아닐 때만 imageUrl에 접근
      if (sortedImages[initialImageIndex]) {
        setSelectedImageUrl(API_BASE_URL + sortedImages[initialImageIndex].imageUrl);
      } else {
        setSelectedImageUrl(''); // 예외 처리: 이미지가 있지만 인덱스가 유효하지 않은 경우
      }
    } else {
      setSelectedImageUrl('');
      setCurrentIndex(0);
    }
  }, [imagesData]);

  const findIndexByUrl = useCallback((url) => {
    if (!imagesData || imagesData.length === 0) return -1;
    const sortedImages = [...imagesData].sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    return sortedImages.findIndex(img => (API_BASE_URL + img.imageUrl) === url);
  }, [imagesData, API_BASE_URL]);

  const handleSelectImage = useCallback((imageUrl) => {
    setSelectedImageUrl(imageUrl);
    const newIndex = findIndexByUrl(imageUrl);
    if (newIndex !== -1) {
      setCurrentIndex(newIndex);
    }
  }, [findIndexByUrl]);

  const handlePrevImage = useCallback(() => {
    if (!imagesData || imagesData.length === 0) return;
    const sortedImages = [...imagesData].sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    const newIndex = (currentIndex - 1 + sortedImages.length) % sortedImages.length;
    setCurrentIndex(newIndex);
    setSelectedImageUrl(API_BASE_URL + sortedImages[newIndex].imageUrl);
  }, [currentIndex, imagesData, API_BASE_URL]);

  const handleNextImage = useCallback(() => {
    if (!imagesData || imagesData.length === 0) return;
    const sortedImages = [...imagesData].sort((a,b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    const newIndex = (currentIndex + 1) % sortedImages.length;
    setCurrentIndex(newIndex);
    setSelectedImageUrl(API_BASE_URL + sortedImages[newIndex].imageUrl);
  }, [currentIndex, imagesData, API_BASE_URL]);


  if (!imagesData || imagesData.length === 0) {
    // 상품 이미지가 없을 경우에도 설명은 보여줄 수 있도록 수정
    if (productDescription) {
        return (
            <div className={styles.galleryContainer}>
                <div className={styles.noImagePlaceholder}>상품 이미지가 없습니다.</div>
                {/* 상품 설명 표시 영역 */}
                {productDescription && (
                  <div className={styles.productDescriptionArea}>
                    <p>{productDescription}</p>
                  </div>
                )}
            </div>
        );
    }
    return <div className={styles.galleryContainer}>상품 정보가 없습니다.</div>;
  }

  const sortedThumbnails = [...imagesData].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  return (
    <div className={styles.galleryContainer}>
      {/* 썸네일과 메인 이미지를 감싸는 div 추가 (레이아웃 유연성 확보) */}
      <div className={styles.imageDisplayArea}>
        <ThumbnailList
          images={sortedThumbnails}
          onSelectImage={handleSelectImage}
          selectedImageUrl={selectedImageUrl}
        />
        <MainImageView
          imageUrl={selectedImageUrl}
          productName={productName}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
          showButtons={imagesData.length > 1}
        />
      </div>

      {/* 상품 설명 표시 영역 */}
      {productDescription && (
        <div className={styles.productDescriptionArea}>
          {/* HTML 태그가 포함된 설명일 경우 dangerouslySetInnerHTML 사용 고려 (XSS 주의)
              일반 텍스트라면 <p> 또는 <div>로 충분 */}
          <p>{productDescription}</p>
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;