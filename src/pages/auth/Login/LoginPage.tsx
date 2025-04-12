import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "src/store/auth/authAPI";
import Button from "src/ui/Button/Button";
import PasswordInput from "src/ui/PasswordInput/PasswordInput";
import Input from "src/ui/Input/Input";
import Popup from "src/ui/Popup/Popup";
import styles from "./LoginPage.module.scss";

interface LoginPageProps {
	setPage: (page: string) => void;
	onLoginComplete: (isNewUser: boolean) => void;
	email: string;
	password: string;
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	setPassword: React.Dispatch<React.SetStateAction<string>>;
}

const LoginPage: React.FC<LoginPageProps> = ({
	 setPage,
	 onLoginComplete,
	 email,
	 password,
	 setEmail,
	 setPassword,
 }) => {
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState("");

	const [login, { isLoading, isError }] = useLoginMutation();

	useEffect(() => {
		if (isError) {
			setErrorMessage("Неправильный логин или пароль");
		}
	}, [isError]);

	const validateInputs = (): boolean => {
		if (!email.trim() || !password.trim()) {
			setErrorMessage("Заполните все поля");
			return false;
		}
		return true;
	};

	const handleLogin = async (event: React.FormEvent) => {
		event.preventDefault();
		setErrorMessage("");

		if (!validateInputs()) return;

		try {
			await login({ email, password }).unwrap();
			const isNewUser = true;
			onLoginComplete(isNewUser);

			navigate("/");
		} catch {
			setErrorMessage("Ошибка входа");
		}
	};

	return (
		<Popup
			title="Вход"
			onSubmit={handleLogin}
			submitButtonText="Войти"
			isLoading={isLoading}
			error={errorMessage}
			className={styles.loginPage}
		>
			<h2 className={styles.subtitle}>Добро пожаловать!</h2>
			<Input
				type="text"
				value={email}
				placeholder="Электронная почта"
				onChange={(e) => setEmail(e.target.value)}
				error={!!errorMessage}
			/>
			<PasswordInput
				type="password"
				value={password}
				placeholder="Пароль"
				onChange={(e) => setPassword(e.target.value)}
				error={!!errorMessage}
			/>
			<p className={styles.forgotPassword} onClick={() => setPage("resetPassword")}>
				Забыли пароль?
			</p>
			<Button type="submit" disabled={isLoading} variant="primary">
				Войти
			</Button>
			<Button onClick={() => setPage("register")} variant="secondary">
				Регистрация
			</Button>
		</Popup>
	);
};

export default LoginPage;