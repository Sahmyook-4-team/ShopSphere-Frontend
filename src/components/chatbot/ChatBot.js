import React, { useState, useEffect } from 'react';
import styles from '../../styles/ChatBot.module.css';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [modelName, setModelName] = useState("gemini-pro");
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);

  // 백엔드 API를 통해 채팅 메시지 전송
  const sendMessageToBackend = async (message) => {
    try {
      setIsLoading(true);
      const response = await axios.post(`${API_BASE_URL}/api/chatbot`, {
        message,
        modelType: modelName,
        chatHistory: chatHistory
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      // API 응답이 문자열로 오는 경우 처리
      const botResponse = typeof response.data === 'string' 
        ? response.data 
        : response.data.response || '응답을 처리할 수 없습니다.';
      
      return botResponse;
    } catch (error) {
      console.error('챗봇 API 호출 중 오류:', error);
      return '챗봇 응답을 가져오는 중 오류가 발생했습니다.';
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    const userInput = inputValue.trim();
    if (!userInput || isLoading) return;

    // 모델 전환 로직 (필요시 유지)
    if (['gemini-pro', '쇼핑몰', '미카사', '성진우', '채나윤'].includes(userInput)) {
      setModelName(userInput === '쇼핑몰' ? 'gemini-pro' : userInput);
      setInputValue('');
      return;
    }

    // 사용자 메시지 추가
    const userMessage = { text: userInput, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    // 채팅 기록 업데이트 (API 요청용)
    const updatedChatHistory = [
      ...chatHistory,
      { role: 'user', content: userInput }
    ];
    setChatHistory(updatedChatHistory);

    try {
      // 백엔드 API를 통해 응답 받기
      const botResponse = await sendMessageToBackend(userInput);
      
      // 봇 응답 추가
      const botMessage = { text: botResponse, sender: 'bot' };
      setMessages(prev => [...prev, botMessage]);
      
      // 채팅 기록에 봇 응답 추가
      setChatHistory(prev => [
        ...prev,
        { role: 'assistant', content: botResponse }
      ]);
    } catch (error) {
      console.error('채팅 중 오류:', error);
      const errorMessage = { 
        text: '챗봇 응답을 가져오는 중 오류가 발생했습니다.', 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  return (
    <>
      <button className={styles.chatButton} onClick={toggleChat}>
        <span className="material-icons">chat</span>
      </button>
      
      {isOpen && (
        <div className={styles.chatModal}>
          <div className={styles.chatHeader}>
            <h3>{modelName} 챗봇</h3>
            <button onClick={toggleChat} className={styles.closeButton}>&times;</button>
          </div>
          <div className={styles.chatMessages}>
            {messages.length === 0 ? (
              <div className={`${styles.message} ${styles.botMessage}`}>
                안녕하세요! {modelName} 챗봇입니다. 무엇을 도와드릴까요?
              </div>
            ) : (
              <>
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
                  >
                    {message.text}
                  </div>
                ))}
              </>
            )}
          </div>
          <form onSubmit={handleSendMessage} className={styles.chatInputContainer}>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className={styles.chatInput}
            />
            <button type="submit" className={styles.sendButton}>전송</button>
          </form>
        </div>
      )}
    </>
  );
};

export default ChatBot;
