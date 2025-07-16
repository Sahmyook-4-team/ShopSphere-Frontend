import { Card, CardContent } from "@/components/ui/card";
import { MessageSquarePlus, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/InquiryHistory.module.css";
import Header from "../Header";

// --- 메인 컴포넌트 ---
const InquiryHistory = () => {
  const [activeTab, setActiveTab] = useState('myInquiries');

  return (
    <>
      <Header />
      <div className={styles['cs-page-container']}>
        <div className={styles['cs-title-header']}>
          <h1 className={styles['cs-page-title']}>고객센터</h1>
        </div>

        <div className={styles['cs-main-wrapper']}>
          <nav className={styles['cs-tabs-vertical']}>
            <button className={`${styles['cs-tab-item']} ${activeTab === 'faq' ? styles.active : ''}`} onClick={() => setActiveTab('faq')}>FAQ</button>
            <button className={`${styles['cs-tab-item']} ${activeTab === 'myInquiries' ? styles.active : ''}`} onClick={() => setActiveTab('myInquiries')}>내 문의내역</button>
            <button className={`${styles['cs-tab-item']} ${activeTab === 'newInquiry' ? styles.active : ''}`} onClick={() => setActiveTab('newInquiry')}>문의하기</button>
          </nav>

          <main className={styles['cs-content-area']}>
            {activeTab === 'faq' && <FaqTab />}
            {activeTab === 'myInquiries' && <MyInquiriesTab />}
            {activeTab === 'newInquiry' && <NewInquiryTab />}
          </main>
        </div>
      </div>
    </>
  );
};


// --- 자식 컴포넌트들 (모든 className 수정 완료) ---

const FaqTab = () => {
  const [openId, setOpenId] = useState(null);
  const faqItems = [
    { q: '배송기간은 어떻게 되나요?', a: '평일 기준 평균 2~3일 소요되며, 택배사 사정에 따라 달라질 수 있습니다.' },
    { q: '취소/반품했는데 사용한 쿠폰/포인트 복원되나요?', a: '네, 취소 또는 반품 완료 시 사용하신 쿠폰과 포인트는 자동으로 복원됩니다.' },
    { q: '취소/반품했는데 언제 환불되나요?', a: '카드 결제는 카드사 영업일 기준 3~5일, 무통장 입금은 1~2일 내에 처리됩니다.' },
  ];

  return (
    <div className={styles['cs-tab-content']}>
      <h3 className={styles['faq-title']}>자주 묻는 질문</h3>
      <ul className={styles['faq-list']}>
        {faqItems.map((item, index) => (
          <li key={index} className={styles['faq-item']}>
            <div className={styles['faq-question']} onClick={() => setOpenId(openId === index ? null : index)}>
              <span>{item.q}</span>
              <span className={`${styles['faq-arrow']} ${openId === index ? styles.open : ''}`}>▼</span>
            </div>
            {openId === index && <div className={styles['faq-answer']}>{item.a}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

const MyInquiriesTab = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderItemId, setOrderItemId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchInquiries = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/inquiry-chats/rooms`,
          {
            withCredentials: true
          }
        );

        if (Array.isArray(response.data)) {
          setInquiries(response.data);
        } else {
          console.error('예상치 못한 응답 형식:', response.data);
          setInquiries([]);
        }
      } catch (err) {
        console.error("문의 내역 불러오기 실패:", err);
        if (err.response?.status === 401) {
          setError("로그인이 필요합니다. 다시 로그인해주세요.");
        } else {
          setError("문의 내역을 불러오는데 실패했습니다.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchInquiries();
  }, []);


  const handleCreateOrOpenChat = (roomId) => {
    if (roomId) {
      navigate(`/inquiry/chat/${roomId}`);
    } else {
      setIsModalOpen(true);
    }
  };

  if (loading) return <div className={styles['loading-message']}>문의 내역을 불러오는 중...</div>;
  if (error) return <div className={styles['error-message']}>{error}</div>;

  return (
    <div className={styles['cs-tab-content']}>
      <h3 className={styles['faq-title']}>문의 내역</h3>
      <div className={styles.inquiryList}>
        {inquiries.length === 0 ? (
          <div className={styles.noInquiries}>
            <p>문의 내역이 없습니다.</p>
            <p>새로운 문의를 시작해보세요!</p>
          </div>
        ) : (
          inquiries.map((room, index) => (
            <Card
              key={room.id}
              className={styles.inquiryCard}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleCreateOrOpenChat(room.id)}
            >
              <CardContent className={styles.cardContent}>
                <div className={styles.inquiryItem}>
                  <div className={styles.inquiryInfo}>
                    <div className={styles.inquiryHeader}>
                      <h3>{room.productName || '상품 문의'}</h3>
                      {room.orderItemId && (
                        <span className={styles.orderNumber}>주문번호: {room.orderItemId}</span>
                      )}
                    </div>
                    <p className={styles.lastMessage}>
                      {room.lastMessage || '대화를 시작해보세요!'}
                    </p>
                    <p className={styles.lastUpdated}>
                      {room.updatedAt ? new Date(room.updatedAt).toLocaleString() : ''}
                    </p>
                  </div>
                  {/* <div className={`${styles.statusBadge} ${room.status === 'ANSWERED' ? styles.answered : styles.pending}`}>
                    {room.status === 'ANSWERED' ? '답변 완료' : '대기 중'}
                  </div> */}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const NewInquiryTab = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
          withCredentials: true
        });
        setOrders(res.data || []);
      } catch (err) {
        setError('구매 내역을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleClick = async (orderItemId) => {
    if (!orderItemId) return;
  
    try {
      // 1. 백엔드에 채팅방 생성 또는 조회를 요청한다.
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/inquiry-chats/rooms`,
        null, // POST 요청이지만 body는 비어있음
        {
          params: { orderItemId: orderItemId }, // 쿼리 파라미터로 orderItemId 전송
          withCredentials: true
        }
      );
  
      // 2. 응답으로 받은 채팅방 정보에서 채팅방 ID(roomId)를 추출한다.
      const chatRoom = response.data;
      const roomId = chatRoom.id;
  
      // 3. 획득한 실제 채팅방 ID로 채팅방 페이지로 이동한다.
      if (roomId) {
        navigate(`/inquiry/chat/${roomId}`);
      } else {
        console.error("채팅방 ID를 받아오지 못했습니다.");
        alert("채팅방에 입장하는 데 실패했습니다.");
      }
  
    } catch (error) {
      console.error("채팅방 생성/조회 실패:", error);
      alert("오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  if (loading) return <div className={styles['loading-message']}>구매 내역을 불러오는 중...</div>;
  if (error) return <div className={styles['error-message']}>{error}</div>;


  // orders 데이터를 items로 변환하는 함수
  const getOrderItems = (orders) => {
    if (!orders) return [];
    return orders.reduce((acc, order) => {
      if (order.items && order.items.length > 0) {
        // 각 주문 항목에 order 정보 추가
        const itemsWithOrderInfo = order.items.map(item => ({
          ...item,
          orderDate: order.orderDate,
          orderId: order.id
        }));
        acc.push(...itemsWithOrderInfo);
      }
      return acc;
    }, []).sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  // 대표 이미지 URL 가져오기
  const getRepresentativeImageUrl = (images) => {
    if (!images || images.length === 0) {
      return 'https://via.placeholder.com/100x100.png?text=No+Image';
    }
    const representative = images.find(img => img.displayOrder === 0) || images[0];
    return representative.imageUrl;
  };




  return (
    <div className={styles['cs-tab-content']}>
      <h3 className={styles['faq-title']}>1:1 문의할 상품 선택</h3>
      {(!orders || orders.length === 0) ? (
        <div className={styles['empty-view']}>
          <p>문의 가능한 구매 상품이 없습니다.</p>
        </div>
      ) : (
        getOrderItems(orders).map(item => (
          <div key={item.orderId} className={styles['product-card']} onClick={() => handleClick(item.id)}>
            <img src={`${process.env.REACT_APP_API_BASE_URL}${getRepresentativeImageUrl(item.product.images)}`} alt={item.productName} className={styles['product-image']} />
            <div className={styles['product-info']}>
              <p className={styles['product-name']}>{item.product.name}</p>
              <p className={styles['product-order-id']}>주문번호: {item.id}</p>
            </div>
            <div className={styles['arrow-icon']}></div>
          </div>
        ))
      )}


      
    </div>
  );
};

export default InquiryHistory;