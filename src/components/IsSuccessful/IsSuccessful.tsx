import React, { Dispatch, SetStateAction, useEffect } from "react";
import { useTogglePopUpMutation } from "src/store/analytics/analyticsAPI";
import styles from './IsSuccessful.module.scss';

interface IsSuccessfulProps {
    info: boolean;
    delay: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setIsOpenTransfer?: Dispatch<SetStateAction<boolean>>;
}

const IsSuccessful: React.FC<IsSuccessfulProps> = ({ info, delay, setIsOpen }) => {
    const [togglePopUp] = useTogglePopUpMutation();

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsOpen(false);
        }, delay);

        return () => clearTimeout(timer);
    }, [delay, setIsOpen, togglePopUp]);

    const handleClose = () => {
        setIsOpen(false);
    };

    return (
        <div className={styles.isSuccessful}>
            <div className={`${styles.isSuccessfulContent} ${info ? '' : styles.failed}`}>
                <img
                    src={info ? "./images/successful.svg" : "./images/failed.svg"}
                    alt={info ? "Success" : "Failure"}
                />
                <h3>{info ? "Операция успешна!" : "Ошибка!"}</h3>
                {info ? (
                    <p>Окно закроется автоматически.</p>
                ) : (
                    <div onClick={handleClose} className={styles.buttonStyleToo}>
                        <button>
                            <span>OK</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IsSuccessful;