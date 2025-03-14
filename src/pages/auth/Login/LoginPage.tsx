import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "src/store/auth/authAPI";
import Button from "src/ui/Button/Button";
import PasswordInput from "src/ui/PasswordInput/PasswordInput";
import Input from "src/ui/Input/Input";
import Popup from "src/ui/Popup/Popup";
import styles from "./LoginPage.module.scss";

const LoginPage = ({ setPage }: { setPage: (page: string) => void }) => {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [globalError, setGlobalError] = useState("");

	const [login, { isLoading, isError, error }] = useLoginMutation();

	useEffect(() => {
		if (!isError && !error) return;
		if (isError) {
			setGlobalError("Неправильный логин или пароль");
		}
	}, [isError, error]);

	const validateInputs = (): boolean => {
		if (!email.trim() || !password.trim()) {
			setGlobalError("Заполните все поля");
			return false;
		}
		return true;
	};

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		setGlobalError("");

		if (!validateInputs()) return;

		try {
			await login({ email, password }).unwrap();
			navigate("/");
		} catch (err) {
			console.error(err);
		}
	};

	const handleForgotPassword = () => setPage("resetPassword");
	const handleRegisterClick = () => setPage("register");
	const isInputError = (value: string) => !value.trim() && globalError;
	const isAuthError = globalError === "Неправильный логин или пароль";

	return (
		<Popup
			title="Вход"
			onSubmit={handleLogin}
			submitButtonText="Войти"
			isLoading={isLoading}
			error={globalError}
			className={styles.loginPage} // Используем className вместо id
		>
			<h2 className={styles.subtitle}>Добро пожаловать!</h2>
			<div className={isAuthError || isInputError(email) ? `${styles.inputWrapper} ${styles.error}` : styles.inputWrapper}>
				<Input
					type="text"
					value={email}
					placeholder="Электронная почта"
					onChange={(e) => setEmail(e.target.value)}
					error={Boolean(isAuthError || isInputError(email))}
				/>
			</div>
			<div className={isAuthError || isInputError(password) ? `${styles.inputWrapper} ${styles.error}` : styles.inputWrapper}>
				<PasswordInput
					placeholder="Пароль"
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					error={Boolean(isAuthError || isInputError(password))}
				/>
			</div>
			<p className={styles.forgotPassword} onClick={handleForgotPassword}>
				Забыли пароль?
			</p>
			<div className={styles.buttonStyle}>
				<Button type="submit" disabled={isLoading} variant="primary">
					Войти
				</Button>
			</div>
			<div className={styles.buttonStyleToo}>
				<Button onClick={handleRegisterClick} variant="secondary">
					Регистрация
				</Button>
			</div>
		</Popup>
	);
};

export default LoginPage;
