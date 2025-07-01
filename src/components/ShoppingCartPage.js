// src/components/ShoppingCartPage/ShoppingCartPage.js (또는 실제 경로)
import React, { useState, useEffect } from 'react';
import styles from '../styles/ShoppingCartPage.module.css'; // 실제 ShoppingCartPage.module.css 경로
import ProductItem from './ProductItem';   // 실제 ProductItem 
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadTossPayments } from '@tosspayments/payment-sdk'; // 토스페이먼츠 SDK 로더 추가
import Header from './Header'; // 경로가 다를 경우 수정

const ShoppingCartPage = () => {
  const navigate = useNavigate();
  const [isAllSelected, setIsAllSelected] = useState(true);
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

  // ====================================================================
  // ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼ "주문하기" 로직 추가 ▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼▼
  // ====================================================================
  const handleOrder = async () => {
    // 1. 선택된 상품 목록 추출
    const selectedItems = getAllItems().filter(item => item.isChecked);

    if (selectedItems.length === 0) {
      alert("주문할 상품을 선택해주세요.");
      return;
    }

    // 2. 백엔드에 보낼 데이터 형식으로 변환
    const orderItems = selectedItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity,
      optionId: item.option?.id, // 옵션이 있는 경우 optionId 포함
    }));

    // 3. 백엔드에 '결제 대기' 주문 생성 요청
    try {
      const createOrderResponse = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          items: orderItems,
          // TODO: 실제 배송지 정보는 사용자 정보나 별도 입력 폼에서 가져와야 합니다.
          shippingAddress: "기본 배송지를 입력해주세요.",
        }),
      });

      if (!createOrderResponse.ok) {
        const errorData = await createOrderResponse.json();
        throw new Error(errorData.message || '주문 생성에 실패했습니다. 재고를 확인해주세요.');
      }

      const createdOrder = await createOrderResponse.json();

      // 4. 토스페이먼츠 결제창 호출
      const tossPayments = await loadTossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY);

      tossPayments.requestPayment('카드', {
        amount: createdOrder.totalAmount,
        orderId: createdOrder.transactionId,
        orderName: `${selectedItems[0].name}` + (selectedItems.length > 1 ? ` 외 ${selectedItems.length - 1}건` : ''),
        customerName: createdOrder.user.name,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
      }).catch(function (error) {
        if (error.code === 'USER_CANCEL') {
          alert('결제를 취소했습니다.');
        } else {
          alert(`결제 실패: ${error.message}`);
        }
      });

    } catch (error) {
      console.error("Order process failed:", error);
      alert(`주문 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  };
  // ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲ "주문하기" 로직 추가 ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲
  
  const handleDeleteSelected = async () => {
    const selectedIds = getAllItems()
      .filter(item => item.isChecked)
      .map(item => item.id);
  
    try {
      await Promise.all(
        selectedIds.map(id =>
          axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/items/${id}`, { withCredentials: true })
        )
      );
  
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
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/items/${itemId}`, {
        withCredentials: true
      });
  
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

  const totalOrderAmount = getAllItems()
    .filter(item => item.isChecked)
    .reduce((sum, item) => sum + item.totalPrice, 0) // API에서 받은 totalPrice를 직접 사용
    .toLocaleString();

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, { withCredentials: true });
      const cartItems = response.data.items;
  
      const formattedItems = cartItems.map(item => {
        const mainImage = item.product.images?.find(img => img.displayOrder === 0)?.imageUrl;
      
        return {
          id: item.id, // 장바구니 항목 ID
          product: item.product,
          option: item.option, // 옵션 정보 전체를 저장
          brand: item.product.brand,
          name: item.product.name,
          optionsText: item.option ? item.option.size : '옵션 없음',
          originalPrice: (item.product.price + (item.option?.additionalPrice || 0)).toLocaleString(),
          totalPrice: item.totalPrice, // 숫자 형식으로 유지
          productImage: mainImage
            ? `${process.env.REACT_APP_API_BASE_URL}${mainImage}`
            : "https://via.placeholder.com/100x100.png?text=No+Image",
          quantity: item.quantity,
          isChecked: true,
          productId: item.product.id
        };
      });
      
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
    fetchCartItems();
  }, []);

  return (
    <>
      <Header />
      <div className={styles.pageContainer}>
        <header className={styles.headerContainer}>
          <button
            className={styles.backButton}
            aria-label="홈으로 이동"
            onClick={() => navigate('/')}
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
            onClick={handleDeleteSelected}
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
                  key={item.id} // key 추가
                  product={item.product}
                  productImage={item.productImage}
                  originalPrice={item.originalPrice}
                  finalPrice={item.totalPrice.toLocaleString()} // 표시할 때만 문자열로
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

        {totalCount > 0 && (
          <footer className={styles.footerSection}>
            <div className={styles.maxDiscountTextContainer}>
              <span className={styles.maxDiscountText}>최대 할인 받을 수 있어요!</span>
            </div>
            <button 
              className={styles.orderButton}
              onClick={handleOrder} // "주문하기" 함수 연결
            >
              {totalOrderAmount}원 주문
            </button>
          </footer>
        )}
      </div>
    </>
  );
};

export default ShoppingCartPage;