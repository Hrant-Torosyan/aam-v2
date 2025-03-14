import React from "react";
import styles from "./Button.module.scss";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps {
	onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
	children: React.ReactNode;
	type?: "button" | "submit" | "reset";
	variant?: ButtonVariant;
	className?: string;
	disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
										   onClick,
										   children,
										   type = "button",
										   variant = "primary",
										   className = "",
										   disabled = false,
									   }) => {
	const buttonStyleClass = variant === "primary" ? styles.buttonStyle : styles.buttonStyleToo;

	return (
		<div className={`${buttonStyleClass} ${disabled ? styles.dis : ""}`}>
			<button type={type} onClick={onClick} className={className} disabled={disabled}>
				<span>{children}</span>
			</button>
		</div>
	);
};

export default Button;