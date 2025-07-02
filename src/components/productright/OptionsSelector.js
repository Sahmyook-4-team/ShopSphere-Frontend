// src/components/productright/OptionsSelector.js

import React from 'react';
import styles from '../../styles/OptionsSelector.module.css';

function OptionsSelector({ options, onOptionSelect }) {
  
  const handleSelectChange = (e) => {
    // 버튼이 아니므로 e.preventDefault()는 필요 없습니다.
    const selectedId = e.target.value;
    if (selectedId) {
      const selectedOptionObject = options.find(opt => opt.id === parseInt(selectedId));
      onOptionSelect(selectedOptionObject);
    }
    // 선택 후 드롭다운을 기본값("옵션을 선택해주세요")으로 되돌려 사용자가 다른 옵션을 계속 선택할 수 있도록 합니다.
    e.target.value = ""; 
  };

  // 상품에 옵션이 없으면 사용자에게 명확히 알려줍니다.
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