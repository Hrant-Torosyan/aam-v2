import React, { useState } from "react";
import { useCheckEmailMutation } from "src/store/auth/authAPI";

import Input from "src/ui/Input/Input";
import Button from "src/ui/Button/Button";
import Loader from "src/ui/Loader/Loader";
import Popup from "src/ui/Popup/Popup";

import styles from "./ResetPassword.module.scss";

interface EmailProps {
    setPage: (newPage: string) => void;
    setStep: (newStep: number) => void;
    onSubmit?: (emailValue: string) => Promise<void>;
    isLoading?: boolean;
}

const Email: React.FC<EmailProps> = ({ setPage, setStep, onSubmit, isLoading }) => {
    const [email, setEmail] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [checkEmail, { isLoading: isCheckingEmail }] = useCheckEmailMutation();

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!email.trim()) {
            setError("Заполните поле");
            return;
        }

        if (!emailRegex.test(email)) {
            setError("Неправильный формат email");
            return;
        }

        setLoading(true);
        setError("");

        try {
            if (onSubmit) {
                await onSubmit(email);
            } else {
                const result = await checkEmail(email).unwrap();
                console.log("Email check result:", result);
                setStep(1);
            }
        } catch (error: any) {
            console.error("Ошибка при проверке e-mail:", error);
            if (error?.data) {
                console.error("API Response Error:", error.data);
            }
            setError("Такой e-mail не существует");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        setEmail(newEmail);

        if (emailRegex.test(newEmail)) {
            setError("");
        }
    };

    return (
        <Popup
            title="Восстановление пароля"
            onSubmit={handleRegister}
            error={error}
            isLoading={loading || isCheckingEmail || isLoading}
            onBack={() => setPage("login")}
            className={styles.resetPassword}
        >
            {loading || isCheckingEmail || isLoading ? (
                <Loader />
            ) : (
                <>
                    <p>Введите E-mail, на который зарегистрирован аккаунт</p>

                    <Input
                        type="text"
                        value={email}
                        placeholder="Email"
                        onChange={handleEmailChange}
                        error={Boolean(error)}
                    />

                    <div>
                        <Button type="submit" variant="primary" disabled={loading || isCheckingEmail || isLoading}>
                            Далее
                        </Button>
                    </div>
                </>
            )}
        </Popup>
    );
};

export default Email;
