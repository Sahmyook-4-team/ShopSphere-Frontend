    // MyOrderHistorySection.jsx
    import React, { useState, useEffect } from 'react';
    import OrderList from './OrderList';
    import styles from './MyOrderHistorySection.module.css';
    import Header from "../Header";
    import axios from 'axios'; // 실제 API 호출 시

    const MyOrderHistorySection = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserOrders = async () => {
          try {
            setLoading(true);
            const response = await axios.get(`http://localhost:8080/api/orders`);
            setOrders(response.data || []); 
            setLoading(false); // API 호출 완료 후 loading false로 설정
          } catch (err) {
            setError(err.message || '주문 내역을 불러오는데 실패했습니다.');
            setLoading(false); // 에러 발생 시에도 loading false로 설정
          }
        };
    
        fetchUserOrders();
      }, []);
   
   
     if (loading) {
       return <div className={styles.message}>로딩 중...</div>;
     }
   
     if (error) {
       return <div className={`${styles.message} ${styles.error}`}>오류: {error}</div>;
     }
   
     // "주문 완료" 상태의 주문만 필터링
     const completedOrders = orders.filter(order => order.orderStatus === 'COMPLETED');
     
     // 만약 completedOrders 배열 자체가 비어있다면, 
     // OrderList에 빈 배열이 전달되고 OrderList 내부에서 "주문 내역이 없습니다."를 표시함.
     // 또는 여기서도 한 번 더 체크해서 다른 메시지를 보여줄 수도 있음.
     // 예: if (orders.length === 0) return <div className={styles.message}>전체 주문 내역이 없습니다.</div>;
     //     else if (completedOrders.length === 0) return <div className={styles.message}>완료된 주문 내역이 없습니다.</div>;
   
     return (
       <>
         <Header />
         <div className={styles.orderHistoryContainer}>
           <div className={styles.header}>
             리뷰 쓰고 최대 2,000P 받기
           </div>
           <div className={styles.content}>
             <OrderList orders={completedOrders} />
           </div>
         </div>
       </>
     );
   };
   
   export default MyOrderHistorySection;