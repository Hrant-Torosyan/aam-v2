import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setFullName, setConfirmPassword, setConfirmOne, setConfirmTwo } from "../../../store/auth/authSlice";
import { signup } from "src/store/auth/authAPI";
import { RootState, AppDispatch } from "src/store/store";
import { useNavigate } from "react-router-dom";
import Input from "src/ui/Input/Input";
import PasswordInput from "src/ui/PasswordInput/PasswordInput";
import Button from "src/ui/Button/Button";
import ErrorMessage from "src/ui/ErrorMessage/ErrorMessage";
import styles from "./RegisterPage.module.scss";
import Back from "src/images/svg/smallLeft.svg";
import check from 'src/images/svg/shape.svg';

interface MainRegisterProps {
    setPage: (page: string) => void;
    setStep: (newStep: number) => void;
}

const MainRegister: React.FC<MainRegisterProps> = ({ setPage, setStep }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const { email, fullName, confirmOne, confirmTwo, confirmPassword } = useSelector(
        (state: RootState) => state.auth
    );
    const [password, setPassword] = useState("");
    const [globalError, setGlobalError] = useState("");

    useEffect(() => {
        dispatch(setFullName(""));
        dispatch(setEmail(""));
        dispatch(setConfirmPassword(""));
        dispatch(setConfirmOne(false));
        dispatch(setConfirmTwo(false));
        setPassword("");
    }, [dispatch]);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();

        setGlobalError("");

        if (!fullName.trim()) {
            setGlobalError("Заполните поле");
            return;
        }
        if (!email.trim()) {
            setGlobalError("Заполните поле для email");
            return;
        }
        if (!emailRegex.test(email)) {
            setGlobalError("Неправильный формат email");
            return;
        }
        if (!password.trim()) {
            setGlobalError("Заполните поле для пароля");
            return;
        }
        if (password.length < 7) {
            setGlobalError("Пароль должен быть не менее 7 символов");
            return;
        }
        if (!confirmPassword.trim()) {
            setGlobalError("Заполните поле для подтверждения пароля");
            return;
        }
        if (confirmPassword !== password) {
            setGlobalError("Пароли не совпадают");
            return;
        }
        if (!confirmOne || !confirmTwo) {
            setGlobalError("Необходимо подтвердить данные и согласиться с политикой конфиденциальности");
            return;
        }

        try {
            await dispatch(
                signup({
                    email,
                    password,
                    confirmPassword,
                    fullName,
                })
            ).unwrap();
            navigate("/");
        } catch (error) {
            setGlobalError("Такой e-mail уже существует");
            console.error("Registration failed:", error);
        }
    };

    return (
        <form className={styles.registerPage} onSubmit={handleRegister}>
            <div className={styles.mainClassname}>
                <div onClick={() => setPage("login")} className={styles.prevBtn}>
                    <img src={Back} alt="back"/>
                </div>
                <h1>Регистрация</h1>
            </div>

            {globalError && <ErrorMessage message={globalError}/>}

            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    value={fullName}
                    placeholder="Имя"
                    onChange={(e) => dispatch(setFullName(e.target.value))}
                    error={Boolean(globalError && !fullName.trim())}
                />
            </div>

            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    value={email}
                    placeholder="Электронная почта"
                    onChange={(e) => dispatch(setEmail(e.target.value))}
                    error={Boolean(globalError && !email.trim())}
                />
            </div>

            <div className={styles.inputWrapper}>
                <PasswordInput
                    value={password}
                    placeholder="Пароль"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    error={globalError && password.length < 8}
                />
            </div>

            <div className={styles.inputWrapper}>
                <PasswordInput
                    value={confirmPassword}
                    placeholder="Повторите пароль"
                    onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
                    type="password"
                    error={globalError && confirmPassword !== password}
                />
            </div>

            <div
                className={styles.checkBox}
                onClick={() => dispatch(setConfirmOne(!confirmOne))}
            >
                <div
                    className={`${styles.checkBoxMain} ${confirmOne ? styles.active : ""} ${globalError && !confirmOne ? styles.error : ""}`}
                >
                    {confirmOne && <img src={check} alt="check"/>}
                </div>
                <p>Подтверждаю данные</p>
            </div>

            <div
                className={styles.checkBox}
                onClick={() => dispatch(setConfirmTwo(!confirmTwo))}
            >
                <div
                    className={`${styles.checkBoxMain} ${confirmTwo ? styles.active : ""} ${globalError && !confirmTwo ? styles.error : ""}`}
                >
                    {confirmTwo && <img src={check} alt="check"/>}
                </div>
                <p>Согласен с условиями политики конфиденциальности</p>
            </div>

            <Button type="submit" variant="primary">
                Регистрация
            </Button>
        </form>
    );
};

export default MainRegister;