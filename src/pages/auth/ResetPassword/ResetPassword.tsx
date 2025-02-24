import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "src/store/store";
import { setStep } from "src/store/auth/authSlice";

import Code from "./Code";
import NewPassword from "./NewPassword";
import Email from "./Email";

import styles from "./ResetPassword.module.scss";

interface ResetPasswordProps {
    setPage: (page: string) => void;
}

const ResetPassword: React.FC<ResetPasswordProps> = ({ setPage }) => {
    const dispatch = useDispatch<AppDispatch>();

    const { step, enteredCode } = useSelector((state: RootState) => state.auth);

    const handleSetStep = (newStep: number) => {
        dispatch(setStep(newStep));
    };

    return (
        <div className={styles.resetPasswordWrapper}>
            {step === 0 ? (
                <Email setPage={setPage} setStep={handleSetStep} />
            ) : step === 1 ? (
                <Code setPage={setPage} setStep={handleSetStep} />
            ) : (
                <NewPassword setPage={setPage} setStep={handleSetStep} code={enteredCode} />
            )}
        </div>
    );
};

export default ResetPassword;