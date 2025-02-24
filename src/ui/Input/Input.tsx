import React from "react";

import styles from "./Input.module.scss";

interface InputProps {
    type: string;
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean | null;
    className?: string;
}

const Input: React.FC<InputProps> = ({ type, value, placeholder, onChange, error }) => {
    return (
        <div className={styles.mainInput}>
            <div className={`${styles.inputStyle} ${error ? styles.error : ""}`}>
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                />
            </div>
        </div>
    );
};

export default Input;