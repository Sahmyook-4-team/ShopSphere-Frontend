import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import styles from '../../styles/ChatBot.module.css';
import bots from './bots.json';



const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [modelName, setModelName] = useState("쇼핑몰");

  const genAi = new GoogleGenerativeAI(process.env.REACT_APP_GOOGLE_AI_API_KEY);

  // 모델 초기화 함수
  const initModel = (botConfig) => {
    return genAi.getGenerativeModel(botConfig);
  };

  // 채팅 세션 초기화 함수
  const initChat = (modelInstance, messageHistory) => {
    return modelInstance.startChat({
      history: messageHistory.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      })),
    });
  };

  // 초기 모델 및 채팅 설정
  let model;
  let chat;
  switch (modelName) {
    case "쇼핑몰":
      model = initModel(bots.bots[0]);
      chat = initChat(model, messages);
      break;
    case "미카사":
      model = initModel(bots.bots[1]);
      chat = initChat(model, messages);
      break;
    case "성진우":
      model = initModel(bots.bots[2]);
      chat = initChat(model, messages);
      break;
    default:
      break;
  }

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    // 이스터에그
    switch (inputValue) {
      case "미카사":
        setModelName("미카사");
        console.log("미카사 모델로 전환");
        break;
      case "성진우":
        setModelName("성진우");
        console.log("성진우 모델로 전환");
        break;
      default:
        break;
    }




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
            <h3>{modelName} 챗봇</h3>
            <button onClick={toggleChat} className={styles.closeButton}>&times;</button>
          </div>
          <div className={styles.chatMessages}>
            <div 
                className={`${styles.message} ${styles.botMessage}`}
              >
                안녕하세요! {modelName} 챗봇입니다. 무엇을 도와드릴까요?
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
