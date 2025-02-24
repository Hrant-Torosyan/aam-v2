import React, { useState } from "react";

import eye from "src/images/svg/eye.svg";
import eyeHide from "src/images/svg/eyeHide.svg";

import styles from "./PasswordInput.module.scss";

interface PasswordInputProps {
    value: string;
    placeholder: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: boolean | string | null;
    type?: string;
    className?: string;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ value, placeholder, onChange, error }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

    return (
        <div className={`${styles.passwordWrapper} ${error ? styles.error : ""}`}>
            <input
                type={showPassword ? "text" : "password"}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className={styles.passwordInput}
            />
            <button
                type="button"
                className={styles.toggleButton}
                onClick={togglePasswordVisibility}
            >
                <img src={showPassword ? eye : eyeHide} alt="toggle visibility" />
            </button>
            {error && typeof error === "string" && (
                <p className={styles.errorMessage}>{error}</p>
            )}
        </div>
    );
};

export default PasswordInput;