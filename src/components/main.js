import React from "react";

import Header from "./Header";
import Top from "./main/Top";
import Middle from "./main/Middle";
import Bottom from "./main/Bottom";
import styles from "../styles/Main.module.css";

export const Main = () => {
    return (
        <>  
            <Header />
            <div style={{ position: "relative", top: "71px"}}>
                <Top />
                <Middle />
                <div className={styles.wrapperRow}>
                    <Bottom />
                    <Bottom />
                    <Bottom />
                    <Bottom />
                </div>
            </div>
        </>
    );
};

export default Main;