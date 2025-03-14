import React, { ReactNode } from "react";
import ErrorMessage from "src/ui/ErrorMessage/ErrorMessage";
import Back from "src/images/svg/smallLeft.svg";
import styles from "./Popup.module.scss";

interface PopupProps {
    title: string;
    children: ReactNode;
    onBack?: () => void;
    onSubmit: (e: React.FormEvent) => void;
    submitButtonText?: string;
    isLoading?: boolean;
    error?: string;
    className?: string;
}

const Popup: React.FC<PopupProps> = ({
     title,
     children,
     onBack,
     onSubmit,
     error,
     className = "",
 }) => {
    return (
        <form className={`${styles.registerPage} ${className}`} onSubmit={onSubmit}>
            <div className={styles.mainClassname}>
                {onBack && (
                    <div onClick={onBack} className={styles.prevBtn}>
                        <img src={Back} alt="Назад" />
                    </div>
                )}
                <h1>{title}</h1>
            </div>

            {error && <ErrorMessage message={error} />}

            {children}
        </form>
    );
};


export default Popup;