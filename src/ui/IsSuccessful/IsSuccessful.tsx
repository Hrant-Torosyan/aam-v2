import React, { useEffect } from "react";

import styles from "./IsSuccessful.module.scss";

interface IsSuccessfulProps {
    info: boolean;
    setIsOpen: (isOpen: boolean) => void;
    delay: number;
}

const IsSuccessful: React.FC<IsSuccessfulProps> = ({ info, setIsOpen, delay }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [setIsOpen, delay]);

    return (
        <div id="isSuccessful" className={styles.isSuccessful}>
            <div
                id={info ? "isSuccessfulContent" : "isSuccessfulContentFailed"}
                className={`${styles.isSuccessfulContent} ${
                    info ? "" : styles.failed
                }`}
            >
                <img
                    id="isSuccessfulImage"
                    src={info ? "./images/successful.svg" : "./images/failed.svg"}
                    alt=""
                />
                <h3 id="isSuccessfulHeading">
                    {info ? "Операция успешна!" : "Ошибка!"}
                </h3>
                {info && <p id="isSuccessfulMessage">Окно закроется автоматически.</p>}
                {!info && (
                    <div
                        id="isSuccessfulButtonContainer"
                        onClick={() => setIsOpen(false)}
                        className={styles.buttonStyleToo}
                    >
                        <button id="isSuccessfulButton">
                            <span>OK</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IsSuccessful;