import React, { useState } from "react";
import { useCheckEmailMutation, useValidateCodeMutation } from "src/store/auth/authAPI";

import Email from "./Email";
import Code from "./Code";
import NewPassword from "./NewPassword";

import styles from "./ResetPassword.module.scss";

interface ResetPasswordProps {
    setPage: (page: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ setPage }) => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState<string>("");
    const [enteredCode, setEnteredCode] = useState<string>("");
    const [error, setError] = useState<string>("");

    const [checkEmail, { isLoading: isCheckingEmail }] = useCheckEmailMutation();
    const [validateCode] = useValidateCodeMutation();

    const handleCheckEmail = async (emailValue: string) => {
        try {
            setEmail(emailValue);
            await checkEmail(emailValue).unwrap();
            setError("");
            setStep(1);
        } catch (error: any) {
            console.error("Error during email check:", error);
            setError(error?.data?.message || "This email address is not registered or another error occurred.");
        }
    };

    const handleValidateCode = async (code: string) => {
        try {
            await validateCode({ code, email }).unwrap();
            setEnteredCode(code);
            setError("");
            setStep(2);
        } catch (error: any) {
            console.error("Error during code validation:", error);
            setError("Неверный код. Попробуйте снова.");
        }
    };

    return (
        <div className={styles.resetPasswordWrapper}>
            {step === 0 ? (
                <Email
                    onSubmit={handleCheckEmail}
                    setPage={setPage}
                    setStep={setStep}
                    isLoading={isCheckingEmail}
                />
            ) : step === 1 ? (
                <Code
                    setStep={setStep}
                    email={email}
                    onCodeValidated={handleValidateCode}
                    error={error}
                />
            ) : (
                <NewPassword
                    setPage={setPage}
                    setStep={setStep}
                    code={enteredCode}
                    email={email}
                />
            )}
        </div>
    );
};

export default ResetPassword;