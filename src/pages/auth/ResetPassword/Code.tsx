import React, { useState, useEffect } from "react";
import { useValidateCodeMutation } from "src/store/auth/authAPI";

import Button from "src/ui/Button/Button";
import ErrorMessage from "src/ui/ErrorMessage/ErrorMessage";
import Loader from "src/ui/Loader/Loader";

import Back from "src/images/svg/smallLeft.svg";
import styles from "./ResetPassword.module.scss";

interface CodeProps {
    setStep: (step: number) => void;
    email: string;
    onCodeValidated?: (code: string) => Promise<void>;
}

const Code: React.FC<CodeProps> = ({ setStep, email, onCodeValidated }) => {
    const [inputs, setInputs] = useState<string[]>(new Array(4).fill(""));
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const [validateCode] = useValidateCodeMutation();

    useEffect(() => {
        setIsInputEmpty(inputs.some((input) => input.trim() === ""));
    }, [inputs]);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newInputs = [...inputs];
        newInputs[index] = value;
        setInputs(newInputs);

        if (value.length === 1 && index < inputs.length - 1) {
            const nextInput = document.getElementById(`code-input-${index + 1}`) as HTMLInputElement;
            nextInput?.focus();
        } else if (value === "" && index > 0) {
            const prevInput = document.getElementById(`code-input-${index - 1}`) as HTMLInputElement;
            prevInput?.focus();
        }
    };

    const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
        const paste = event.clipboardData.getData("text");
        if (/^\d{4}$/.test(paste)) {
            setInputs(paste.split(""));
            event.preventDefault();
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrorMessage("");

        const enteredCode = inputs.join("");

        if (!enteredCode.trim() || enteredCode.length !== 4) {
            setErrorMessage("Введите код");
            return;
        }

        setLoading(true);

        try {
            if (onCodeValidated) {
                await onCodeValidated(enteredCode);
            } else {
                await validateCode({ code: enteredCode, email }).unwrap();
                setStep(2);
            }
        } catch (error: any) {
            console.error("Error validating code:", error);
            setErrorMessage("Неверный код. Попробуйте снова.");
            setInputs(new Array(4).fill(""));
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className={styles.resetPassword} onSubmit={handleSubmit}>
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className={styles.mainClassname}>
                        <div onClick={() => setStep(0)} className={styles.prevBtn}>
                            <img src={Back} alt="back" />
                        </div>
                        <h1>Восстановление пароля</h1>
                    </div>
                    <p>Введите код, который мы отправили на Вашу почту</p>

                    {errorMessage && (
                        <ErrorMessage message={errorMessage} />
                    )}

                    <div className={styles.codeInputs}>
                        {inputs.map((input, index) => (
                            <div
                                key={index}
                                className={!errorMessage ? styles.codeInput : `${styles.codeInput} ${styles.error}`}
                            >
                                <input
                                    id={`code-input-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={input}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className={!errorMessage ? "" : styles.errorInput}
                                />
                            </div>
                        ))}
                    </div>

                    <div className={isInputEmpty ? `${styles.buttonStyle} ${styles.dis}` : styles.buttonStyle}>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isInputEmpty || loading}
                        >
                            Далее
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
};

export default Code;