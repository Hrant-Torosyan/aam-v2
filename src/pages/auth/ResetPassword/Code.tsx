import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { validateCode } from "src/store/auth/authAPI";
import { setEnteredCode } from "src/store/auth/authSlice";
import { AppDispatch, RootState } from "src/store/store";

import Button from "src/ui/Button/Button";
import ErrorMessage from "src/ui/ErrorMessage/ErrorMessage"

import Back from "src/images/svg/smallLeft.svg";

import styles from "./ResetPassword.module.scss";
import Loader from "src/ui/Loader/Loader";

interface CodeProps {
    setStep: (step: number) => void;
    setPage: (page: string) => void;
}

const Code: React.FC<CodeProps> = ({ setStep, setPage }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { email } = useSelector((state: RootState) => state.auth);

    const [inputs, setInputs] = useState<string[]>(new Array(4).fill(""));
    const [isInputEmpty, setIsInputEmpty] = useState(true);
    const [isCodeValid, setIsCodeValid] = useState(true);
    const [loading, setLoading] = useState(false);

    const [errorMessage, setErrorMessage] = useState<string>("");

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
        setLoading(true);

        const enteredCode = inputs.join("");

        try {
            const action = await dispatch(validateCode({ email, code: enteredCode }));

            if (action.meta.requestStatus === "fulfilled") {
                dispatch(setEnteredCode(enteredCode));
                setStep(2); // Move to the next step
            } else {
                setIsCodeValid(false);
                setErrorMessage("Неверный код. Попробуйте снова.");
                setInputs(new Array(4).fill(""));
            }
        } catch (error) {
            console.error("Error during code validation:", error);
            setIsCodeValid(false);
            setErrorMessage("Ошибка при проверке кода. Попробуйте позже.");
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
                        <div onClick={() =>  setStep(0)} className={styles.prevBtn}>
                            <img src={Back} alt="back" />
                        </div>
                        <h1>Восстановление пароля</h1>
                    </div>
                    <p>Введите код, который мы отправили на Вашу почту</p>

                    {!isCodeValid && errorMessage && (
                        <ErrorMessage message={errorMessage} />
                    )}

                    <div className={styles.codeInputs}>
                        {inputs.map((input, index) => (
                            <div
                                key={index}
                                className={isCodeValid ? styles.codeInput : `${styles.codeInput} ${styles.error}`}
                            >
                                <input
                                    id={`code-input-${index}`}
                                    type="text"
                                    maxLength={1}
                                    value={input}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className={isCodeValid ? "" : styles.errorInput} // Apply error styling to the input if the code is invalid
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