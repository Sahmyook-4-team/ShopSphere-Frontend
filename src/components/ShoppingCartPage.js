// src/components/ShoppingCartPage.js

import React, { useState, useEffect } from 'react';
import styles from '../styles/ShoppingCartPage.module.css';
import ProductItem from './ProductItem';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { loadTossPayments } from '@tosspayments/payment-sdk';
import Header from './Header';

const ShoppingCartPage = () => {
    const navigate = useNavigate();
    const [isAllSelected, setIsAllSelected] = useState(true);
    const [productGroups, setProductGroups] = useState([]);

    const getAllItems = () => productGroups.flatMap(group => group.items);
    const totalCount = getAllItems().length;
    const selectedCount = getAllItems().filter(item => item.isChecked).length;
  
    useEffect(() => {
        if (totalCount > 0) {
            setIsAllSelected(selectedCount === totalCount);
        } else {
            setIsAllSelected(false);
        }
    }, [selectedCount, totalCount]);

    const fetchCartItems = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/cart`, { withCredentials: true });
            const items = response.data.items || [];
            
            const formattedItems = items.map(item => ({
                id: item.id,
                product: item.product,
                option: item.option,
                name: item.product.name,
                brand: item.product.brand,
                optionsText: item.option ? `옵션: ${item.option.size}` : null,
                pricePerItem: item.product.price + (item.option?.additionalPrice || 0),
                productImage: item.product.images?.find(img => img.displayOrder === 0)?.imageUrl,
                quantity: item.quantity,
                isChecked: true, // 기본값은 모두 선택
                productId: item.product.id,
            }));

            if (formattedItems.length > 0) {
                setProductGroups([{ id: 'group1', groupName: '내 장바구니', items: formattedItems }]);
            } else {
                setProductGroups([]);
            }
        } catch (error) {
            if (error.response?.status === 401) {
                alert('로그인이 필요합니다.');
                navigate('/login');
            } else {
                console.error('장바구니 불러오기 실패:', error);
                setProductGroups([]);
            }
        }
    };
  
    useEffect(() => {
        fetchCartItems();
    }, []);

    // --- 핸들러 함수들 (기존 기능 모두 복원 및 개선) ---

    const handleSelectAllToggle = () => {
        const nextState = !isAllSelected;
        setIsAllSelected(nextState);
        setProductGroups(prevGroups =>
            prevGroups.map(group => ({
                ...group,
                items: group.items.map(item => ({ ...item, isChecked: nextState }))
            }))
        );
    };

    const handleProductCheckToggle = (groupId, itemId) => {
        setProductGroups(prevGroups =>
            prevGroups.map(group =>
                group.id === groupId
                    ? { ...group, items: group.items.map(item => item.id === itemId ? { ...item, isChecked: !item.isChecked } : item) }
                    : group
            )
        );
    };

    const handleProductQuantityChange = async (groupId, itemId, newQuantity) => {
        if (newQuantity < 1) return;
        try {
            await axios.put(`${process.env.REACT_APP_API_BASE_URL}/api/cart/items/${itemId}`, { quantity: newQuantity }, { withCredentials: true });
            
            setProductGroups(prevGroups =>
                prevGroups.map(group =>
                    group.id === groupId
                        ? { ...group, items: group.items.map(item => item.id === itemId ? { ...item, quantity: newQuantity } : item) }
                        : group
                )
            );
        } catch (err) {
            alert(`수량 변경에 실패했습니다: ${err.response?.data?.message || err.message}`);
            fetchCartItems();
        }
    };

    const handleRemoveProduct = async (groupId, itemId) => {
        try {
            await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/items/${itemId}`, { withCredentials: true });
            
            setProductGroups(prevGroups =>
                prevGroups
                    .map(group =>
                        group.id === groupId
                            ? { ...group, items: group.items.filter(item => item.id !== itemId) }
                            : group
                    )
                    .filter(group => group.items.length > 0)
            );
        } catch (err) {
            alert("상품 삭제에 실패했습니다.");
        }
    };

    const handleDeleteSelected = async () => {
        const idsToDelete = getAllItems().filter(item => item.isChecked).map(item => item.id);
        if (idsToDelete.length === 0) {
            alert("삭제할 상품을 선택해주세요.");
            return;
        }

        try {
            await Promise.all(
                idsToDelete.map(id => axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/cart/items/${id}`, { withCredentials: true }))
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
            alert("선택한 상품 삭제에 실패했습니다.");
        }
    };

    const handleOrder = async () => {
        const selectedItems = getAllItems().filter(item => item.isChecked);
        if (selectedItems.length === 0) {
            alert("주문할 상품을 선택해주세요.");
            return;
        }
        const orderItems = selectedItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            optionId: item.option?.id, 
        }));
        try {
            const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ items: orderItems, shippingAddress: "기본 배송지" }),
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.message || '주문 생성에 실패했습니다.');
            const toss = await loadTossPayments(process.env.REACT_APP_TOSS_CLIENT_KEY);
            toss.requestPayment('카드', {
                amount: resData.totalAmount, orderId: resData.transactionId,
                orderName: `${selectedItems[0].name}` + (selectedItems.length > 1 ? ` 외 ${selectedItems.length - 1}건` : ''),
                customerName: resData.user.name, successUrl: `${window.location.origin}/payment/success`,
                failUrl: `${window.location.origin}/payment/fail`,
            });
        } catch (err) {
            alert(`주문 처리 실패: ${err.message}`);
        }
    };
    
    const totalOrderAmount = getAllItems()
        .filter(i => i.isChecked)
        .reduce((sum, i) => sum + i.pricePerItem * i.quantity, 0);

    return (
        <>
            <Header />
            <div className={styles.pageContainer}>
                <header className={styles.headerContainer}>
                    <button className={styles.backButton} onClick={() => navigate('/')}>←</button>
                    <div className={styles.titleWrapper}>
                        <h1 className={styles.pageTitle}>장바구니</h1>
                        <span className={styles.freeShippingBadge}>무료배송</span>
                    </div>
                    <div className={styles.headerSpacer}></div>
                </header>
                
                {totalCount > 0 ? (
                    <>
                        <div className={styles.selectionBar}>
                            <div className={styles.selectAllWrapper} onClick={handleSelectAllToggle}>
                                <div className={`${styles.customCheckbox} ${isAllSelected ? styles.checked : ''}`}>
                                    {isAllSelected && <span className={styles.checkmark}>✓</span>}
                                </div>
                                <label className={styles.selectAllLabel}>전체선택 ({selectedCount}/{totalCount})</label>
                            </div>
                            <button className={styles.deleteSelectedButton} onClick={handleDeleteSelected}>선택삭제</button>
                        </div>

                        <main className={styles.productListArea}>
                            {productGroups.map(group => (
                                <div key={group.id} className={styles.productGroupContainer}>
                                    <h2 className={styles.productGroupHeader}>{group.groupName}</h2>
                                    {group.items.map(item => (
                                        <ProductItem
                                            key={item.id}
                                            product={item.product}
                                            options={{ size: item.optionsText }} 
                                            productImage={item.productImage}
                                            finalPrice={(item.pricePerItem * item.quantity).toLocaleString()}
                                            initialQuantity={item.quantity}
                                            isChecked={item.isChecked}
                                            onQuantityChange={(newQuantity) => handleProductQuantityChange(group.id, item.id, newQuantity)}
                                            onCheckToggle={() => handleProductCheckToggle(group.id, item.id)}
                                            onRemove={() => handleRemoveProduct(group.id, item.id)}
                                            isFromProductPage={false}
                                        />
                                    ))}
                                </div>
                            ))}
                        </main>

                        <footer className={styles.footerSection}>
                            <div className={styles.maxDiscountTextContainer}>
                                <span className={styles.maxDiscountText}>최대 할인 받을 수 있어요!</span>
                            </div>
                            <button className={styles.orderButton} onClick={handleOrder}>
                                {totalOrderAmount.toLocaleString()}원 주문
                            </button>
                        </footer>
                    </>
                ) : (
                    <main className={styles.productListArea} style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                        <div style={{ padding: '50px 20px', textAlign: 'center', color: '#777' }}>
                            장바구니에 담긴 상품이 없습니다.
                        </div>
                    </main>
                )}
            </div>
        </>
    );
};

export default ShoppingCartPage;
