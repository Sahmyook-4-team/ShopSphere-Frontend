// src/components/InquiryChatRoom.js
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import styles from '../../styles/InquiryHistory.module.css';

const InquiryChatRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

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
          roomId: parseInt(roomId),
          content: newMessage,
          isFromAdmin: false
        },
        { withCredentials: true }
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

  useEffect(() => {
    if (roomId) {
      fetchMessages();
    }
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (loading) return <div className="loading">로딩 중...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="chat-room-container">
      <div className="chat-header">
        <button onClick={() => navigate(-1)} className="back-button">
          <ArrowLeft size={20} />
        </button>
        <h2>1:1 문의</h2>
      </div>

      <div className="messages-container">
        {messages.length === 0 ? (
          <div className="no-messages">아직 메시지가 없습니다. 메시지를 입력해주세요.</div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={styles.message + `message ${message.isFromAdmin ? 'admin' : 'user'}`}
            >
              <div className={styles.messageContent}>{message.content}</div>
              <div className={styles.messageTime}>
                {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={sendMessage} className="message-input-container">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="메시지를 입력하세요..."
          className={styles.messageInput}
        />
        <button type="submit" className={styles.sendButton}>
          <Send size={20} />
        </button>
      </form>
    </div>
  );
};

export default InquiryChatRoom;