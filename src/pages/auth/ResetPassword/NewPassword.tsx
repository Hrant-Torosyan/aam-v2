import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { resetPass } from "src/store/auth/authAPI";
import { AppDispatch, RootState } from "src/store/store";
import { setNewPassword, setConfirmPassword } from "src/store/auth/authSlice";

import PasswordInput from "src/ui/PasswordInput/PasswordInput";

import Back from "src/images/svg/smallLeft.svg";

import Button from "src/ui/Button/Button";
import styles from "./ResetPassword.module.scss";
import ErrorMessage from "src/ui/ErrorMessage/ErrorMessage";

interface NewPasswordProps {
    setStep: (step: number) => void;
    code: string;
    setPage: (page: string) => void;
}

const NewPassword: React.FC<NewPasswordProps> = ({ setStep, code }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { email, newPassword, confirmPassword } = useSelector((state: RootState) => state.auth);

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

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
            const res = await dispatch(
                resetPass({
                    email,
                    code,
                    password: newPassword,
                    passwordConfirm: confirmPassword,
                })
            );


            if (res.meta.requestStatus === "fulfilled") {
                navigate("/");
            } else {
                setError("Что-то пошло не так");
            }
        } catch (error) {
            setError("Что-то пошло не так");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={styles.resetPassword}>
            {loading ? (
                <div className={styles.loader}>
                    <img
                        src="https://i.pinimg.com/originals/92/63/9c/92639cac9c1a0451744f9077ddec0bed.gif"
                        alt="loader"
                    />
                </div>
            ) : (
                <>
                    <div className={styles.mainClassname}>
                        <div onClick={() => setStep(1)} className={styles.prevBtn}>
                            <img src={Back} alt="back"/>
                        </div>
                        <h1>Восстановление пароля</h1>
                    </div>
                    <p>Создайте новый пароль</p>
                    {error && <ErrorMessage message={error} />}

                    <PasswordInput
                        value={newPassword}
                        placeholder="Введите новый пароль"
                        onChange={(e) => {
                            if (e.target.value.length >= 7) {
                                setError("");
                            }
                            dispatch(setNewPassword(e.target.value));
                        }}
                        type="password"
                        error={error ? true : false}
                    />

                    <PasswordInput
                        value={confirmPassword}
                        placeholder="Повторите пароль"
                        onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
                        type="password"
                        error={error ? true : false}
                    />

                    <div className={styles.buttonStyle}>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            Сохранить
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
};

export default NewPassword;