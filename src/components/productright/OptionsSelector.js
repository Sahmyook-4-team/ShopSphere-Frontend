// src/components/productright/OptionsSelector.js

import React from 'react';
import styles from '../../styles/OptionsSelector.module.css';

function OptionsSelector({ options, onOptionSelect }) {
  
  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      const selectedOptionObject = options.find(opt => opt.id === parseInt(selectedId));
      onOptionSelect(selectedOptionObject);
    }
    // 선택 후 드롭다운을 기본값으로 되돌려 다시 선택할 수 있도록 함
    e.target.value = ""; 
  };

  // 상품에 옵션이 없으면 아무것도 렌더링하지 않습니다.
  if (!options || options.length === 0) {
    return (
      <div className={styles.optionsContainer}>
        <p className={styles.noOptionsText}>선택 가능한 옵션이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.optionsContainer}>
        <select className={styles.optionDropdown} onChange={handleSelectChange} defaultValue="">
            <option value="" disabled>옵션을 선택해주세요</option>
            {options.map(opt => (
                <option key={opt.id} value={opt.id}>
                    {opt.size} {opt.additionalPrice > 0 ? `(+${opt.additionalPrice.toLocaleString()}원)` : ''}
                </option>
            ))}
        </select>
    </div>
  );
}

export default OptionsSelector;