import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignupMutation } from "src/store/auth/authAPI";
import Input from "src/ui/Input/Input";
import PasswordInput from "src/ui/PasswordInput/PasswordInput";
import Button from "src/ui/Button/Button";
import ErrorMessage from "src/ui/ErrorMessage/ErrorMessage";
import styles from "./RegisterPage.module.scss";
import Back from "src/images/svg/smallLeft.svg";
import check from "src/images/svg/shape.svg";

interface MainRegisterProps {
    setPage: (page: string) => void;
    setStep: (newStep: number) => void;
}

const MainRegister: React.FC<MainRegisterProps> = ({ setPage }) => {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [confirmOne, setConfirmOne] = useState(false);
    const [confirmTwo, setConfirmTwo] = useState(false);
    const [globalError, setGlobalError] = useState("");

    const [signup, { isLoading }] = useSignupMutation();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const handleRegister = async (event: React.FormEvent) => {
        event.preventDefault();
        setGlobalError("");

        if (!fullName.trim()) return setGlobalError("Заполните поле имени");
        if (!email.trim()) return setGlobalError("Заполните поле для email");
        if (!emailRegex.test(email)) return setGlobalError("Неправильный формат email");
        if (!password.trim()) return setGlobalError("Заполните поле для пароля");
        if (password.length < 7) return setGlobalError("Пароль должен быть не менее 7 символов");
        if (!passwordConfirmation.trim()) return setGlobalError("Заполните поле подтверждения пароля");
        if (passwordConfirmation !== password) return setGlobalError("Пароли не совпадают");
        if (!confirmOne || !confirmTwo) return setGlobalError("Необходимо подтвердить данные и согласиться с политикой");

        try {
            await signup({
                email,
                password,
                fullName,
                companyName: "",
                investmentAmount: "",
                investmentExperience: "",
                referral: null,
            }).unwrap();
            navigate("/");
        } catch (error: any) {
            setGlobalError(error?.data?.detail || "Ошибка регистрации");
            console.error("Registration failed:", error);
        }
    };

    return (
        <form className={styles.registerPage} onSubmit={handleRegister}>
            <div className={styles.mainClassname}>
                <div onClick={() => setPage("login")} className={styles.prevBtn}>
                    <img src={Back} alt="Назад" />
                </div>
                <h1>Регистрация</h1>
            </div>

            {globalError && <ErrorMessage message={globalError} />}

            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    value={fullName}
                    placeholder="Имя"
                    onChange={(e) => setFullName(e.target.value)}
                    error={Boolean(globalError && !fullName.trim())}
                />
            </div>

            <div className={styles.inputWrapper}>
                <Input
                    type="text"
                    value={email}
                    placeholder="Электронная почта"
                    onChange={(e) => setEmail(e.target.value)}
                    error={Boolean(globalError && !email.trim())}
                />
            </div>

            <div className={styles.inputWrapper}>
                <PasswordInput
                    value={password}
                    placeholder="Пароль"
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    error={globalError && password.length < 7}
                />
            </div>

            <div className={styles.inputWrapper}>
                <PasswordInput
                    value={passwordConfirmation}
                    placeholder="Повторите пароль"
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    type="password"
                    error={globalError && passwordConfirmation !== password}
                />
            </div>

            <div className={styles.checkBox} onClick={() => setConfirmOne(!confirmOne)}>
                <div className={`${styles.checkBoxMain} ${confirmOne ? styles.active : ""} ${globalError && !confirmOne ? styles.error : ""}`}>
                    {confirmOne && <img src={check} alt="check" />}
                </div>
                <p>Подтверждаю данные</p>
            </div>

            <div className={styles.checkBox} onClick={() => setConfirmTwo(!confirmTwo)}>
                <div className={`${styles.checkBoxMain} ${confirmTwo ? styles.active : ""} ${globalError && !confirmTwo ? styles.error : ""}`}>
                    {confirmTwo && <img src={check} alt="check" />}
                </div>
                <p>Согласен с условиями политики конфиденциальности</p>
            </div>

            <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? "Регистрация..." : "Регистрация"}
            </Button>
        </form>
    );
};

export default MainRegister;