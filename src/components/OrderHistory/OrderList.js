// OrderList.jsx
import React from 'react';
import OrderItemCard from './OrderItemCard';
import styles from './OrderList.module.css';

const OrderList = ({ orders }) => { // 'orders'는 "COMPLETED" 상태의 주문 목록
  // "COMPLETED" 상태의 주문들에서 모든 주문 항목(items)을 추출하여 하나의 리스트로 만듦
  const allCompletedOrderItems = orders.reduce((acc, order) => {
    if (order.items && order.items.length > 0) {
      // 각 주문 항목에 orderStatus 정보를 추가해서 전달할 수 있음 (필요하다면)
      // 여기서는 OrderItemCard가 orderStatus를 직접 받지 않는다고 가정하고 item만 전달
      // 또는, order.orderStatus를 각 item에 주입
      const itemsWithStatus = order.items.map(item => ({ ...item, orderStatus: order.orderStatus }));
      acc.push(...itemsWithStatus);
    }
    return acc;
  }, []);

  // 만약 allCompletedOrderItems가 비어있다면 "주문 내역이 없습니다." 메시지 표시
  if (allCompletedOrderItems.length === 0) {
    return <div className={styles.noOrders}>주문 내역이 없습니다.</div>;
  }

  return (
    <div className={styles.listContainer}>
      {allCompletedOrderItems.map((item, index) => (
        <OrderItemCard 
          key={item.id || `item-${index}-${new Date().getTime()}`} // 더 고유한 key 사용 권장
          item={item} 
          orderStatus={item.orderStatus} // item에 주입된 orderStatus 사용
        />
      ))}
    </div>
  );
};

export default OrderList;