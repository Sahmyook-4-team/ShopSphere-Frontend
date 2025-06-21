import React, { useState, useEffect } from 'react';
import axios from 'axios'; // API 호출용
import styles from './ReviewWriteForm.module.css';
import { FaChevronLeft } from 'react-icons/fa'; // 뒤로가기 아이콘
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위해

// 가정: ProductDTO.Response 타입 정의가 어딘가에 있거나, 필요한 필드만 사용
// interface ProductImageDTO {
//   imageUrl: string;
//   displayOrder?: number;
//   // ... other fields
// }
// interface ProductInfo { // ProductDTO.Response 와 유사
//   id: number;
//   name: string;
//   images?: ProductImageDTO[];
//   // ... other fields
// }

const ReviewWriteForm = ({ productId, initialProductInfo }) => {
  const [rating, setRating] = useState(0); // 0: 선택 안됨, 1~5: 선택된 별점
  const [comment, setComment] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [productInfo, setProductInfo] = useState(initialProductInfo); // 상품 정보
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // 페이지 이동 훅

  useEffect(() => {
    if (!initialProductInfo && productId) {
      const fetchProductInfo = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/products/${productId}`);
          setProductInfo(response.data); 
        } catch (err) {
          console.error("상품 정보 로드 실패:", err);
          setError("상품 정보를 불러오는 데 실패했습니다. 페이지를 새로고침하거나 다시 시도해주세요.");
        }
      };
      fetchProductInfo();
    } else if (initialProductInfo) {
        setProductInfo(initialProductInfo);
    }
  }, [productId, initialProductInfo]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      // 파일 크기 제한 (예: 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('이미지 파일 크기는 5MB를 초과할 수 없습니다.');
        setSelectedFile(null);
        setPreviewImage(null);
        event.target.value = null; // 파일 선택 초기화
        return;
      }
      // 파일 타입 제한 (예: jpg, png, gif)
      if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
        setError('지원되는 이미지 파일 형식은 JPG, PNG, GIF 입니다.');
        setSelectedFile(null);
        setPreviewImage(null);
        event.target.value = null; // 파일 선택 초기화
        return;
      }
      setError(''); // 이전 에러 메시지 초기화
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewImage(null);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewImage(null);
    // 파일 input의 값을 초기화하여 같은 파일을 다시 선택할 수 있도록 함
    const fileInput = document.getElementById('photoInput');
    if (fileInput) {
      fileInput.value = null;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!productId) {
      setError('리뷰를 작성할 상품 정보가 없습니다.');
      return;
    }
    if (rating === 0) {
      setError('별점을 선택해주세요.');
      return;
    }
    if (comment.trim().length < 10) { 
      setError('리뷰 내용을 10자 이상 입력해주세요.');
      return;
    }
    setError('');
    setSuccessMessage('');
    setIsSubmitting(true);

    const formData = new FormData();
    const reviewData = {
      productId: parseInt(productId, 10), // productId는 숫자여야 함
      rating: rating,
      comment: comment,
    };
    formData.append('request', new Blob([JSON.stringify(reviewData)], { type: "application/json" }));

    if (selectedFile) {
      formData.append('reviewImageFile', selectedFile);
    }

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/reviews`, formData, {
        // headers: {
        //   'Content-Type': 'multipart/form-data',
        // },
        withCredentials: true, 
      });
      setSuccessMessage(response.data.message || '리뷰가 성공적으로 등록되었습니다.');
      setRating(0);
      setComment('');
      handleRemoveImage(); // 이미지 및 파일 인풋 초기화
      // 예시: 2초 후 이전 페이지(주문 내역 등)로 이동
      setTimeout(() => {
        navigate(-1); // 브라우저의 뒤로 가기 기능과 동일
      }, 2000);
    } catch (err) {
      console.error('리뷰 등록 실패:', err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || '리뷰 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getProductImageUrl = () => {
    if (productInfo && productInfo.images && productInfo.images.length > 0) {
      const mainImage = productInfo.images.find(img => img.displayOrder === 0) || productInfo.images[0];
      return mainImage.imageUrl;
    }
    // productInfo.imageUrl은 ProductDTO.Response 에 있는 대표 이미지 필드를 참조하는 경우
    if (productInfo && productInfo.imageUrl) {
        return productInfo.imageUrl;
    }
    return 'https://via.placeholder.com/60x60.png?text=No+Image';
  };

  const handleBack = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  if (!productInfo && !error && productId) { // productId가 있는데 productInfo가 아직 로드 안됐을 때
    return <div className={styles.loadingMessage}>상품 정보를 불러오는 중...</div>;
  }
  
  if (error && !productInfo) {
    return (
        <div className={styles.reviewWriteContainer}>
            <div className={styles.header}>
                <button onClick={handleBack} className={styles.backButton} aria-label="뒤로 가기">
                    <FaChevronLeft />
                </button>
                <h1>리뷰쓰기</h1>
            </div>
            <div className={styles.errorMessageContainer}>
                <p className={styles.errorMessage}>{error}</p>
                <button onClick={handleBack} className={styles.goBackButton}>이전 페이지로</button>
            </div>
        </div>
    );
  }
  
  if (!productId) { // productId 자체가 없을 때 (잘못된 접근)
    return (
        <div className={styles.reviewWriteContainer}>
             <div className={styles.header}>
                <button onClick={handleBack} className={styles.backButton} aria-label="뒤로 가기">
                    <FaChevronLeft />
                </button>
                <h1>리뷰쓰기</h1>
            </div>
            <div className={styles.errorMessageContainer}>
                <p className={styles.errorMessage}>리뷰를 작성할 상품을 찾을 수 없습니다.</p>
                 <button onClick={handleBack} className={styles.goBackButton}>이전 페이지로</button>
            </div>
        </div>
    );
  }


  return (
    <div className={styles.reviewWriteContainer}>
      <div className={styles.header}>
        <button onClick={handleBack} className={styles.backButton} aria-label="뒤로 가기">
            <FaChevronLeft />
        </button>
        <h1>리뷰쓰기</h1>
      </div>

      {productInfo && (
        <div className={styles.productInfoSection}>
          <img src={getProductImageUrl()} alt={productInfo.name || '상품 이미지'} className={styles.productImage} />
          <div className={styles.productNameAndOption}>
            <p className={styles.productName}>{productInfo.name || '상품명 없음'}</p>
            {/* <p className={styles.productOption}>아이보리 / FREE</p> */}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className={styles.reviewForm}>
        <div className={styles.ratingSection}>
          <p className={styles.sectionTitle}>별점 평가</p> {/* UI 이미지와 유사하게 수정 */}
          <div className={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button // span 대신 button으로 변경하여 접근성 향상
                type="button" // form 제출 방지
                key={star}
                className={`${styles.star} ${star <= rating ? styles.selected : ''}`}
                onClick={() => handleRatingChange(star)}
                aria-label={`${star}점`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className={styles.commentSection}>
          {/* 상품 후기 작성 제목은 UI 이미지에 없음, 필요시 추가 */}
          <textarea
            className={styles.commentTextarea}
            value={comment}
            onChange={handleCommentChange}
            placeholder="솔직한 리뷰를 남겨주세요 (최소 10자)"
            rows="10" // UI 이미지와 유사하게 줄 수 조정
            maxLength={2000} // 최대 글자 수 제한
          />
          <div className={styles.commentLength}>
            {comment.length} / 2000
          </div>
        </div>

        <div className={styles.photoAttachSection}>
          {/* 사진 첨부 제목은 UI 이미지에 없음, 필요시 추가 */}
          <label htmlFor="photoInput" className={styles.photoAttachButton}>
            <span className={styles.cameraIcon}>📷</span> 사진 첨부
          </label>
          <input
            type="file"
            id="photoInput" // label의 htmlFor와 매칭
            accept="image/jpeg, image/png, image/gif" // 구체적인 accept 타입 명시
            onChange={handleFileChange}
            className={styles.photoInput}
          />
          {previewImage && (
            <div className={styles.previewContainer}>
              <img src={previewImage} alt="첨부 이미지 미리보기" className={styles.previewImage} />
              <button type="button" onClick={handleRemoveImage} className={styles.removeImageButton} aria-label="이미지 제거">X</button>
            </div>
          )}
          <p className={styles.photoAttachGuide}>
            * 상품과 관련 없는 사진의 경우 경고 없이 삭제될 수 있습니다.
          </p>
        </div>
        
        {error && <p className={styles.errorMessage}>{error}</p>}
        {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

        <button type="submit" className={styles.submitButton} disabled={isSubmitting || !productInfo}>
          {isSubmitting ? '등록 중...' : '리뷰 등록'}
        </button>
      </form>
    </div>
  );
};

export default ReviewWriteForm;