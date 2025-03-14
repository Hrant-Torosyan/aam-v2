import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "src/store/auth/authAPI";
import Button from "src/ui/Button/Button";
import PasswordInput from "src/ui/PasswordInput/PasswordInput";
import ErrorMessage from "src/ui/ErrorMessage/ErrorMessage";
import Input from "src/ui/Input/Input";

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
		let valid = true;
		if (!email.trim()) {
			setGlobalError("Заполните поле");
			valid = false;
		}
		if (!password.trim()) {
			setGlobalError("Заполните поле");
			valid = false;
		}
		return valid;
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
		<form id={styles.loginPage} onSubmit={handleLogin}>
			<h1 className={styles.title}>Вход</h1>
			<h2 className={styles.subtitle}>Добро пожаловать!</h2>
			{globalError && <ErrorMessage message={globalError} />}
			<div
				className={
					isAuthError || isInputError(email)
						? `${styles.inputWrapper} ${styles.error}`
						: styles.inputWrapper
				}
			>
				<Input
					type="text"
					value={email}
					placeholder="Электронная почта"
					onChange={(e) => setEmail(e.target.value)}
					error={Boolean(isAuthError || isInputError(email))}
				/>
			</div>
			<div
				className={
					isAuthError || isInputError(password)
						? `${styles.inputWrapper} ${styles.error}`
						: styles.inputWrapper
				}
			>
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
		</form>
	);
};

export default LoginPage;