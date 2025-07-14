// src/components/InquiryChatRoom.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import styles from '../../styles/InquiryChatRoom.module.css';

const InquiryChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [stompClient, setStompClient] = useState(null);

  // 메시지 불러오기
  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/api/inquiry-chats/rooms/${roomId}/messages`,
        { withCredentials: true }
      );
      setMessages(response.data);
    } catch (err) {
      console.error('메시지 불러오기 실패:', err);
      setError('메시지를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 메시지 보내기
  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !stompClient?.connected) return;
  
    const chatMessage = {
      senderId: currentUser.id,
      message: newMessage,
      chatRoomId: parseInt(roomId)  // 백엔드에서 Long 타입을 기대하므로 정수로 변환
    };
  
    // WebSocket으로 메시지 전송 (content-type 헤더 추가)
    stompClient.publish({
      destination: `/app/inquiry-chat/${roomId}`,
      body: JSON.stringify(chatMessage),
      headers: {
        'content-type': 'application/json'  // 이 헤더가 중요합니다!
      }
    });
  
    // 로딩 상태 표시를 위한 임시 메시지
    // const tempId = `temp-${Date.now()}`;
    // const tempMessage = {
    //   ...chatMessage,
    //   id: tempId,
    //   tempId: chatMessage.id,  // 원본 메시지 ID 저장
    //   sentAt: new Date().toISOString(),
    //   isTemp: true
    // };
  
    // setMessages(prev => [...prev, tempMessage]);
    // setNewMessage('');
  };

  // 메시지 수신 핸들러
  const onMessageReceived = useCallback((payload) => {
    try {
      const message = JSON.parse(payload.body);
    
      
      setMessages(prev => {
        // tempId가 일치하는 임시 메시지 제거 및 중복 체크
        const filtered = prev.filter(m => 
          !m.isTemp || (message.id && m.tempId !== message.id)
        );
        
        // 이미 동일한 ID의 메시지가 있으면 무시
        if (message.id && filtered.some(m => m.id === message.id)) {
          return filtered;
        }
        
        // 새로운 메시지 추가 (유효한 ID가 있는 경우에만)
        return message.id ? [...filtered, message] : filtered;
      });
    } catch (error) {
      console.error('메시지 파싱 오류:', error);
    }
  }, []);

  // 스크롤을 가장 아래로 이동
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 현재 로그인한 사용자 정보 가져오기
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL}/api/users/me`,
          {
            withCredentials: true,
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            validateStatus: (status) => status < 500,
          }
        );

        if (response.status === 200 && response.data) {
          setCurrentUser({
            id: response.data.id,
            name: response.data.name || '사용자',
            email: response.data.email || '',
          });
        } else {
          navigate('/login');
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
        navigate('/login');
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  // WebSocket 연결 설정
  useEffect(() => {
    if (!currentUser || !roomId) return;

    const socket = new SockJS(`${process.env.REACT_APP_API_BASE_URL}/ws`);
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket 연결 성공');
        client.subscribe(`/topic/inquiry-chat/${roomId}`, onMessageReceived);
        fetchMessages();
      },
      onStompError: (frame) => {
        console.error('WebSocket 오류 발생:', frame);
      },
      onWebSocketClose: () => {
        console.log('WebSocket 연결 종료');
      }
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client.connected) {
        client.deactivate();
      }
    };
  }, [roomId, currentUser, onMessageReceived]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if ((loading || !currentUser) && !stompClient?.connected) {
    return <div className={styles.loading}>연결 중...</div>;
  }
  
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.chatRoomContainer}>
      <div className={styles.chatHeader}>
        <button onClick={() => navigate(-1)} className={styles.backButton} aria-label="뒤로 가기">
          <ArrowLeft size={20} />
        </button>
        <h2>1:1 문의</h2>
      </div>

      <div className={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div className={styles.noMessages}>아직 메시지가 없습니다. 메시지를 입력해주세요.</div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = currentUser && message.senderId === currentUser.id;
            
            return (
              <div
                key={message.id}
                className={`${styles.message} ${isCurrentUser ? styles.sent : styles.received}`}
              >
                <div className={styles.messageContent}>{message.message}</div>
                <div className={styles.messageTime}>
                  {new Date(message.sentAt).toLocaleTimeString('ko-KR', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false
                  })}
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputContainer}>
        <form onSubmit={sendMessage} className={styles.messageForm}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className={styles.messageInput}
            aria-label="메시지 입력"
            disabled={!stompClient?.connected}
          />
          <button 
            type="submit" 
            className={styles.sendButton} 
            disabled={!newMessage.trim() || !stompClient?.connected}
            aria-label="메시지 보내기"
          >
            <Send size={18} />
          </button>
        </form>
        {!stompClient?.connected && (
          <div className={styles.connectionStatus}>연결 중입니다. 잠시만 기다려주세요...</div>
        )}
      </div>
    </div>
  );
};

export default InquiryChatRoom;