import React, { useState } from "react";
import MainRegister from "./MainRegister";
import LoginPage from "../Login/LoginPage";
import Email from "../ResetPassword/Email";
import CheckResetCode from "../ResetPassword/ResetPassword";

interface RegisterPageProps {
    setPage: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setPage }) => {
    const [step, setStep] = useState(0);

    return (
        <div>
            {step === 0 ? (
                <MainRegister setPage={setPage} setStep={setStep} />
            ) : step === 1 ? (
                <LoginPage setPage={setPage} />
            ) : step === 2 ? (
                <Email setPage={setPage} setStep={setStep} />
            ) : (
                <CheckResetCode setPage={setPage} />
            )}
        </div>
    );
};

export default RegisterPage;