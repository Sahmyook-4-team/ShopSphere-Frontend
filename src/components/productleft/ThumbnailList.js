import React from 'react';
import styles from '../../styles/ThumbnailList.module.css';

const ThumbnailList = ({ images, onSelectImage, selectedImageUrl }) => {
  if (!images || images.length === 0) return null;

  return (
    <div className={styles.thumbnailList}>
      {images.map((image) => (
        <div
          key={image.id}
          className={`${styles.thumbnailItem} ${
            process.env.REACT_APP_API_BASE_URL + image.imageUrl === selectedImageUrl ? styles.selected : ''
          }`}
          onClick={() => onSelectImage(process.env.REACT_APP_API_BASE_URL + image.imageUrl)}
        >
          <img
            src={process.env.REACT_APP_API_BASE_URL + image.imageUrl}
            alt={`Thumbnail ${image.displayOrder}`}
            className={styles.thumbnailImage}
          />
        </div>
      ))}
    </div>
  );
};

export default ThumbnailList;