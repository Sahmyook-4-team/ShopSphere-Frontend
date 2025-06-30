// src/components/ShoppingCartPage/ShoppingCartPage.js (또는 실제 경로)
import React, { useState, useEffect } from 'react';
import styles from '../styles/ShoppingCartPage.module.css'; // 실제 ShoppingCartPage.module.css 경로
import ProductItem from './ProductItem';   // 실제 ProductItem 
import { useNavigate } from 'react-router-dom'; //뒤로가기버튼
import axios from 'axios';  //axios
import { addToCart } from '../lib/cartUtils';
import Header from './Header'; // 경로가 다를 경우 수정



const ShoppingCartPage = () => {
const navigate = useNavigate(); //뒤로가기버튼
const [isAllSelected, setIsAllSelected] = useState(true);
// 상품 데이터를 그룹화하여 관리
const [productGroups, setProductGroups] = useState([]);

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

  
  
  const handleDeleteSelected = async () => {
    const selectedIds = getAllItems()
      .filter(item => item.isChecked)
      .map(item => item.id); // 장바구니 항목 ID만 추출
  
    try {
      // 백엔드에 동시에 삭제 요청
      await Promise.all(
        selectedIds.map(id =>
          axios.delete(`http://localhost:8080/api/cart/items/${id}`, { withCredentials: true })
        )
      );
  
      // 프론트 상태에서도 제거
      setProductGroups(prevGroups =>
        prevGroups
          .map(group => ({
            ...group,
            items: group.items.filter(item => !item.isChecked)
          }))
          .filter(group => group.items.length > 0)
      );
    } catch (err) {
      alert("선택한 상품 삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };
  
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

  const handleRemoveProduct = async (groupId, itemId) => {
    try {
      // ✅ 먼저 DB에서 삭제
      await axios.delete(`http://localhost:8080/api/cart/items/${itemId}`, {
        withCredentials: true
      });
  
      // ✅ 프론트 상태에서도 제거
      setProductGroups(prevGroups =>
        prevGroups
          .map(group =>
            group.id === groupId
              ? {
                  ...group,
                  items: group.items.filter(item => item.id !== itemId)
                }
              : group
          )
          .filter(group => group.items.length > 0)
      );
    } catch (err) {
      alert("상품 삭제 중 오류가 발생했습니다.");
      console.error(err);
    }
  };
  

  // 총 주문 금액 계산
  const totalOrderAmount = getAllItems()
    .filter(item => item.isChecked)
    .reduce((sum, item) => {
      const price = parseFloat(item.finalPrice.replace(/,/g, ''));
      return sum + (price * item.quantity);
    }, 0)
    .toLocaleString();

  
  const fetchCartItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/cart', { withCredentials: true });
      const cartItems = response.data.items;
  
      const formattedItems = cartItems.map(item => {
        const mainImage = item.product.images?.find(img => img.displayOrder === 0)?.imageUrl;
      
        return {
          id: item.id,
          product: item.product,
          brand: item.product.brand,
          name: item.product.name,
          options: item.option ? item.option.size : '옵션 없음',
          originalPrice: (item.product.price + (item.option?.additionalPrice || 0)).toLocaleString(),
          finalPrice: item.totalPrice.toLocaleString(),
          productImage: mainImage
            ? `http://localhost:8080${mainImage}`
            : "https://via.placeholder.com/100x100.png?text=No+Image",
          quantity: item.quantity,
          isChecked: true,
          discountText: '장바구니 할인',
          productId: item.product.id
        };
      });
      
      console.log("백엔드 응답 cartItems:", cartItems);
      console.log("렌더링용 formattedItems:", formattedItems);


      setProductGroups([
        {
          id: 'group1',
          groupName: '내 장바구니',
          items: formattedItems
        }
      ]);
    } catch (error) {
      console.error('장바구니 불러오기 실패:', error);
      alert('장바구니 정보를 불러오지 못했습니다.');
    }
  };
  

  useEffect(() => {
    fetchCartItems(); // ✅ 아까 만든 함수 호출!
  }, []);
  
  

  return (
    <>
    <Header />
    <div className={styles.pageContainer}>
      <header className={styles.headerContainer}>
        <button
          className={styles.backButton}
          aria-label="홈으로 이동"
          onClick={() => navigate('/')} // ← 홈으로 이동하는 동작
        >
          ←
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
        <button
          className={styles.deleteSelectedButton}
          onClick={handleDeleteSelected} // ✅ 함수 연결!
        >
          선택삭제
        </button>
      </div>

      <main className={styles.productListArea}>
        {productGroups.map(group => (
          <div key={group.id} className={styles.productGroupContainer}>
            <h2 className={styles.productGroupHeader}>{group.groupName}</h2>
            {group.items.map(item => (
              <ProductItem
              product={item.product}
              productImage={item.productImage}
              originalPrice={item.originalPrice}   
              finalPrice={item.finalPrice} 
              initialQuantity={item.quantity}
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
    </>
  );
};

export default ShoppingCartPage;