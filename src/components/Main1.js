import React from "react";

import Header from "./Header";
import Top from "./main/Top";
import Middle from "./main/Middle";
import Bottom from "./main/Bottom";
import ChatBot from "./chatbot/ChatBot";
import styles from "../styles/Main.module.css";

export const Main = () => {
    return (
        <>  
            <Header />
            <div style={{ position: "relative", top: "71px"}}>
                <Top />
                <Middle />
                <div className={styles.wrapperRow}>
                    <Bottom productIdFromProps={1} />
                    <Bottom productIdFromProps={2} />
                    <Bottom productIdFromProps={3} />
                    <Bottom productIdFromProps={1} />
                </div>
            </div>{/* position: relative */}
            <ChatBot />
        </>
    );
};

export default Main;