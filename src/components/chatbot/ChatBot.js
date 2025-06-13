import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from '../../styles/ChatBot.module.css';


const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_AI_API_KEY);
  const model = genAi.getGenerativeModel({ 
    model: "gemini-2.0-flash",
    systemInstruction: {
      role: "system",
      parts: [{
        text: `당신은 쇼핑몰 고객 서비스 챗봇입니다. 다음 가이드라인을 따라주세요:
        
        1. 항상 친절하고 예의 바른 말투를 사용하세요.
        2. 사용자에게 상품 추천, 주문 조회, 반품/교환 안내, 배송 조회 등 쇼핑 관련 질문에 답변하세요.
        3. 모르는 질문을 받으면 정확히 알려드릴 수 없다고 솔직히 말하고, 대신 고객센터 연락처를 안내해주세요.
        4. 가격, 할인, 프로모션 관련 질문에는 정확한 정보를 제공하세요.
        5. 사용자의 감정을 고려한 공감대를 형성하세요.
        6. 간결하고 명확하게 답변하세요.`
      }]
    }
  });

  // 전체 대화 기록을 포함하여 전송
  const chat = model.startChat({
    history: messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))
  });

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 사용자 메시지 추가
    const userMessage = { text: inputValue, sender: 'user' };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');

    try {
      // API 호출 응답
      const response = await chat.sendMessage(inputValue);
      const botMessage = { text: response.response.text(), sender: 'bot' };
      
      // 이전 메시지와 새로운 봇 응답을 함께 업데이트
      setMessages(prevMessages => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      // 에러 발생 시 사용자에게 알림
      const errorMessage = { text: '죄송합니다. 응답을 생성하는 중 오류가 발생했습니다.', sender: 'bot' };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
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
            <h3>쇼핑몰 챗봇</h3>
            <button onClick={toggleChat} className={styles.closeButton}>&times;</button>
          </div>
          <div className={styles.chatMessages}>
            <div 
                className={`${styles.message} ${styles.botMessage}`}
              >
                안녕하세요! 쇼핑몰 챗봇입니다. 무엇을 도와드릴까요?
              </div>
            {messages.map((message, index) => (
              <div 
                key={index} 
                className={`${styles.message} ${message.sender === 'user' ? styles.userMessage : styles.botMessage}`}
              >
                {message.text}
              </div>
            ))}
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
