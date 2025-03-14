import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "src/store/auth/authAPI";

import PasswordInput from "src/ui/PasswordInput/PasswordInput";
import Button from "src/ui/Button/Button";
import Loader from "src/ui/Loader/Loader";
import Popup from "src/ui/Popup/Popup";

import styles from "./ResetPassword.module.scss";

interface NewPasswordProps {
    setStep: (step: number) => void;
    code: string;
    setPage: (page: string) => void;
    email: string;
}

const NewPassword: React.FC<NewPasswordProps> = ({ setStep, code, email }) => {
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const [resetPassword] = useResetPasswordMutation();

    const validateInputs = () => {
        if (!newPassword.trim() || !confirmPassword.trim()) {
            setError("Заполните поле");
            return false;
        }
        if (newPassword.trim().length < 7) {
            setError("Пароль должен быть не менее 7 символов");
            return false;
        }
        if (newPassword !== confirmPassword) {
            setError("Пароли не совпадают");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateInputs()) return;

        setLoading(true);

        try {
            const requestData = {
                email,
                code,
                password: newPassword,
                passwordConfirm: confirmPassword,
            };

            const response = await resetPassword(requestData).unwrap();

            if (response) {
                navigate("/");
            } else {
                setError("Что-то пошло не так");
            }
        } catch (error: any) {
            console.error("Error resetting password:", error);
            if (error.data?.detail) {
                setError(error.data.detail);
            } else {
                setError("Что-то пошло не так");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Popup
            title="Восстановление пароля"
            onSubmit={handleSubmit}
            error={error}
            onBack={() => setStep(1)}
            className={styles.resetPassword}
        >
            {loading ? (
                <Loader />
            ) : (
                <>
                    <p>Создайте новый пароль</p>

                    <PasswordInput
                        value={newPassword}
                        placeholder="Введите новый пароль"
                        onChange={(e) => {
                            if (e.target.value.length >= 7) {
                                setError("");
                            }
                            setNewPassword(e.target.value);
                        }}
                        type="password"
                        error={Boolean(error)}
                    />

                    <PasswordInput
                        value={confirmPassword}
                        placeholder="Повторите пароль"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        type="password"
                        error={Boolean(error)}
                    />

                    <div className={styles.buttonStyle}>
                        <Button type="submit" variant="primary" disabled={loading}>
                            Сохранить
                        </Button>
                    </div>
                </>
            )}
        </Popup>
    );
};

export default NewPassword;