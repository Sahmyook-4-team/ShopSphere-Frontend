import React from 'react';
import styles from '../../styles/ThumbnailList.module.css';

const ThumbnailList = ({ images, onSelectImage, selectedImageUrl }) => {
  if (!images || images.length === 0) return null;

  const API_BASE_URL = "http://localhost:8080"; // 환경 변수로 관리하는 것이 좋음

  return (
    <div className={styles.thumbnailList}>
      {images.map((image) => (
        <div
          key={image.id}
          className={`${styles.thumbnailItem} ${
            API_BASE_URL + image.imageUrl === selectedImageUrl ? styles.selected : ''
          }`}
          onClick={() => onSelectImage(API_BASE_URL + image.imageUrl)}
        >
          <img
            src={API_BASE_URL + image.imageUrl}
            alt={`Thumbnail ${image.displayOrder}`}
            className={styles.thumbnailImage}
          />
        </div>
      ))}
    </div>
  );
};

export default ThumbnailList;