// src/components/ShoppingCartPage/ShoppingCartPage.js (또는 실제 경로)
import React, { useState, useEffect } from 'react';
import styles from '../styles/ShoppingCartPage.module.css'; // 실제 ShoppingCartPage.module.css 경로
import ProductItem from './ProductItem';   // 실제 ProductItem 경로

const ShoppingCartPage = () => {
  const [isAllSelected, setIsAllSelected] = useState(true);
  // 상품 데이터를 그룹화하여 관리
  const [productGroups, setProductGroups] = useState([
    {
      id: "group1",
      groupName: "이브클로젯 배송상품",
      items: [
        {
          id: "item1_1",
          brand: "이브클로젯",
          name: "[1+1세일] [당일 출고/M-4XL] 빅사이즈 면 밴딩 빅사이즈 일자 치노 슬랙스 팬츠 6081",
          options: "블랙 / 블랙 / M",
          originalPrice: "68,800",
          finalPrice: "46,800",
          productImage: "https://user-images.githubusercontent.com/12693899/231149998-091a100f-8c7c-4861-ac0b-0447190d0b0a.png",
          quantity: 1,
          isChecked: true,
          discountText: "더담고할인",
        },
      ]
    },
    {
      id: "group2",
      groupName: "오비비스토어 배송상품",
      items: [
        {
          id: "item2_1",
          brand: "오비비스토어",
          name: "[1+1/오늘출발] 사이드 스냅 버뮤다 하프 팬츠 반바지 (4color)",
          options: "그레이_M (28-30) / 선택안함 (1장만구매)",
          originalPrice: "45,800",
          finalPrice: "25,800",
          productImage: "https://via.placeholder.com/100x100.png?text=Product2", // 실제 이미지로 교체 필요
          quantity: 1,
          isChecked: true,
          discountText: "더담고할인",
        },
        // 오비비스토어 다른 상품이 있다면 여기에 추가
      ]
    }
  ]);

  // 전체 상품 수 및 선택된 상품 수 계산
  const getAllItems = () => productGroups.flatMap(group => group.items);
  const totalCount = getAllItems().length;
  const selectedCount = getAllItems().filter(item => item.isChecked).length;

  // 전체 선택/해제 상태 업데이트 로직
  useEffect(() => {
    if (totalCount > 0) {
      setIsAllSelected(selectedCount === totalCount);
    } else {
      setIsAllSelected(false);
    }
  }, [selectedCount, totalCount]);

  const handleSelectAllToggle = () => {
    const newSelectAllState = !isAllSelected;
    setIsAllSelected(newSelectAllState);
    setProductGroups(prevGroups =>
      prevGroups.map(group => ({
        ...group,
        items: group.items.map(item => ({ ...item, isChecked: newSelectAllState }))
      }))
    );
  };

  const handleProductCheckToggle = (groupId, itemId) => {
    setProductGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map(item =>
                item.id === itemId ? { ...item, isChecked: !item.isChecked } : item
              )
            }
          : group
      )
    );
  };

  const handleProductQuantityChange = (groupId, itemId, newQuantity) => {
    setProductGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? {
              ...group,
              items: group.items.map(item =>
                item.id === itemId ? { ...item, quantity: Math.max(1, newQuantity) } : item
              )
            }
          : group
      )
    );
  };

  const handleRemoveProduct = (groupId, itemId) => {
    setProductGroups(prevGroups =>
      prevGroups.map(group =>
        group.id === groupId
          ? { ...group, items: group.items.filter(item => item.id !== itemId) }
          : group
      ).filter(group => group.items.length > 0) // 아이템이 없는 그룹은 제거 (선택사항)
    );
  };

  // 총 주문 금액 계산
  const totalOrderAmount = getAllItems()
    .filter(item => item.isChecked)
    .reduce((sum, item) => {
      const price = parseFloat(item.finalPrice.replace(/,/g, ''));
      return sum + (price * item.quantity);
    }, 0)
    .toLocaleString();

  return (
    <div className={styles.pageContainer}>
      <header className={styles.headerContainer}>
        <button className={styles.backButton} aria-label="뒤로 가기">
          ← {/* 화살표를 이모티콘으로 변경 */}
        </button>
        <div className={styles.titleWrapper}>
          <h1 className={styles.pageTitle}>장바구니</h1>
          <span className={styles.freeShippingBadge}>무료배송</span>
        </div>
        <div className={styles.headerSpacer}></div>
      </header>

      <div className={styles.selectionBar}>
        <div className={styles.selectAllWrapper} onClick={handleSelectAllToggle}>
          <div
            className={`${styles.customCheckbox} ${isAllSelected && totalCount > 0 ? styles.checked : ''}`}
            role="checkbox"
            aria-checked={isAllSelected && totalCount > 0}
            tabIndex="0"
          >
            {isAllSelected && totalCount > 0 && <span className={styles.checkmark}>✓</span>}
          </div>
          <label className={styles.selectAllLabel}>
            전체선택 ({selectedCount}/{totalCount})
          </label>
        </div>
        <button className={styles.deleteSelectedButton}>선택삭제</button> {/* TODO: 선택삭제 기능 구현 */}
      </div>

      <main className={styles.productListArea}>
        {productGroups.map(group => (
          <div key={group.id} className={styles.productGroupContainer}>
            <h2 className={styles.productGroupHeader}>{group.groupName}</h2>
            {group.items.map(item => (
              <ProductItem
                key={item.id}
                productImage={item.productImage}
                brand={item.brand}
                name={item.name}
                discountText={item.discountText}
                options={item.options}
                initialQuantity={item.quantity}
                originalPrice={item.originalPrice}
                finalPrice={item.finalPrice}
                currency="원"
                isChecked={item.isChecked}
                onQuantityChange={(newQuantity) => handleProductQuantityChange(group.id, item.id, newQuantity)}
                onCheckToggle={() => handleProductCheckToggle(group.id, item.id)}
                onRemove={() => handleRemoveProduct(group.id, item.id)}
              />
            ))}
          </div>
        ))}
        {totalCount === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#777' }}>
            장바구니에 담긴 상품이 없습니다.
          </div>
        )}
      </main>

      {totalCount > 0 && ( // 상품이 있을 때만 푸터 표시
        <footer className={styles.footerSection}>
          <div className={styles.maxDiscountTextContainer}>
            <span className={styles.maxDiscountText}>최대 할인 받을 수 있어요!</span>
          </div>
          <button className={styles.orderButton}>
            {totalOrderAmount}원 주문
          </button>
        </footer>
      )}
    </div>
  );
};

export default ShoppingCartPage;