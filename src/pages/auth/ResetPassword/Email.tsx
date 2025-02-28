import React, { useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store/store";
import { checkEmail } from "src/store/auth/authAPI";
import { setEmail } from "src/store/auth/authSlice";

import Input from "src/ui/Input/Input";
import ErrorMessage from "src/ui/ErrorMessage/ErrorMessage";
import Button from "src/ui/Button/Button";
import Loader from "src/ui/Loader/Loader";

import Back from "src/images/svg/smallLeft.svg";

import styles from "./ResetPassword.module.scss";

const Email: React.FC<{ setPage: (newPage: string) => void, setStep: (newStep: number) => void }> = ({ setPage, setStep }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { email } = useSelector((state: RootState) => state.auth);

    const [error, setError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

        try {
            const action = await dispatch(checkEmail(email));

            if (action.meta.requestStatus === "fulfilled") {
                setStep(1);
            } else {
                setError("Такой e-mail не существует");
            }
        } catch (error) {
            console.error("Ошибка при проверке e-mail:", error);
            setError("Ошибка при проверке e-mail");
        } finally {
            setLoading(false);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newEmail = e.target.value;
        if (emailRegex.test(newEmail)) {
            setError("");
        }
        dispatch(setEmail(newEmail));
    };

    return (
        <form onSubmit={handleRegister} className={styles.resetPassword} id="email">
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className={styles.mainClassname}>
                        <div onClick={() => setPage("login")} className={styles.prevBtn}>
                            <img src={Back} alt="back" />
                        </div>
                        <h1>Восстановление пароля</h1>
                    </div>
                    <p>Введите E-mail, на который зарегистрирован аккаунт</p>

                    {error && <ErrorMessage message={error} />}

                    <Input
                        type="text"
                        value={email}
                        placeholder="Email"
                        onChange={handleEmailChange}
                        error={Boolean(error)}
                    />

                    <div className={styles.buttonStyle}>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                        >
                            Далее
                        </Button>
                    </div>
                </>
            )}
        </form>
    );
};

export default Email;