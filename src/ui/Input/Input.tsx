import React from "react";

import styles from "./Input.module.scss";

interface InputProps {
    type: string;
    value: string;
    placeholder: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean | null;
    className?: string;
    name?: string;
    onClick?: () => void;
    readOnly?: boolean;
}

const Input: React.FC<InputProps> = ({
     type,
     value,
     placeholder,
     onChange,
     error,
     name,
     onClick,
     readOnly,
 }) => {
    return (
        <div className={styles.mainInput}>
            <div className={`${styles.inputStyle} ${error ? styles.error : ""}`}>
                <input
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    name={name}
                    onClick={onClick}
                    readOnly={readOnly}
                />
            </div>
        </div>
    );
};

export default Input;