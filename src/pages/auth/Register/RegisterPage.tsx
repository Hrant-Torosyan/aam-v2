import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { setStep } from "../../../store/auth/authSlice";
import MainRegister from "./MainRegister";
import LoginPage from "../Login/LoginPage";
import Email from "../ResetPassword/Email";
import CheckResetCode from "../ResetPassword/ResetPassword";

interface RegisterPageProps {
    setPage: (page: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setPage }) => {
    const dispatch = useDispatch<AppDispatch>();

    const { step } = useSelector((state: RootState) => state.auth);

    const handleSetStep = (newStep: number) => {
        dispatch(setStep(newStep));
    };


    return (
        <div>
            {step === 0 ? (
                <MainRegister
                    setPage={setPage} setStep={handleSetStep}
                />
            ) : step === 1 ? (
                <LoginPage setPage={setPage} />
            ) : step === 2 ? (
                <Email setPage={setPage} setStep={handleSetStep}/>
            ) : (
                <CheckResetCode setPage={setPage} />
            )}
        </div>
    );
};

export default RegisterPage;