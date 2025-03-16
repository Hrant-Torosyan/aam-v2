import React, { useState } from "react";
import MainRegister from "./MainRegister";
import LoginPage from "../Login/LoginPage";
import VerificationPage from "../Verification/Verification";
import Email from "../ResetPassword/Email";
import CheckResetCode from "../ResetPassword/ResetPassword";

interface RegisterPageProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setPage }) => {
    const [step, setStep] = useState(0);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleRegistrationComplete = (userEmail: string) => {
        setEmail(userEmail);
        setStep(1);
    };

    const handleLoginComplete = () => {
        setStep(2);
        setPage("verify");
    };


    return (
        <div>
            {step === 0 && (
                <MainRegister setPage={setPage} setStep={setStep} onComplete={handleRegistrationComplete} />
            )}

            {step === 1 && (
                <LoginPage
                    setPage={setPage}
                    onLoginComplete={handleLoginComplete}
                    email={email}
                    password={password}
                    setEmail={setEmail}
                    setPassword={setPassword}
                />
            )}

            {step === 2 && (
                <VerificationPage setPage={setPage} setStep={setStep} />
            )}

            {step === 3 && (
                <div>
                    <Email setPage={setPage} setStep={setStep} />
                    <CheckResetCode setPage={setPage} />
                </div>
            )}

        </div>
    );
};

export default RegisterPage;