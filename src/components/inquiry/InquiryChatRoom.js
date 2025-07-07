// src/components/InquiryChatRoom.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import styles from '../../styles/InquiryChatRoom.module.css';

const InquiryChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);
  const [currentUser, setCurrentUser] = useState(null); // 현재 로그인한 사용자 정보 상태

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

  // 메시지 전송
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/api/inquiry-chats/messages`,
        {
          chatRoomId: parseInt(roomId),
          message: newMessage
        },
        { 
          headers: {
            'Content-Type': 'application/json'
          },
          withCredentials: true 
        }
      );
      
      setMessages([...messages, response.data]);
      setNewMessage('');
    } catch (err) {
      console.error('메시지 전송 실패:', err);
      alert('메시지 전송에 실패했습니다.');
    }
  };

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

  useEffect(() => {
    if (roomId && currentUser) {
      fetchMessages();
    }
  }, [roomId, currentUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading || !currentUser) return <div className={styles.loading}>로딩 중...</div>;
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
            // 현재 사용자가 보낸 메시지인지 확인
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
          />
          <button 
            type="submit" 
            className={styles.sendButton} 
            disabled={!newMessage.trim()}
            aria-label="메시지 보내기"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default InquiryChatRoom;