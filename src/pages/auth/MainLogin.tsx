import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAddLinkedUserMutation } from "src/store/auth/authAPI";

import LoginPage from "src/pages/auth/Login/LoginPage";
import ResetPassword from "src/pages/auth/ResetPassword/ResetPassword";
import RegisterPage from "src/pages/auth/Register/RegisterPage";
import DocumentsPage from "src/pages/auth/Verification/Documents/Documents";

import styles from "./MainLogin.module.scss";


const MainLogin: React.FC = () => {
    const [searchParams] = useSearchParams();
    const referralEmail = searchParams.get("q");

    const [page, setPage] = useState<string>(referralEmail ? "register" : "login");
    const [error, setError] = useState<string | null>(null);
    const [addLinkedUser] = useAddLinkedUserMutation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [step, setStep] = useState<number>(0);

    useEffect(() => {
        if (referralEmail) {
            const storedReferral = localStorage.getItem("referral_sent");

            if (storedReferral !== referralEmail) {
                addLinkedUser({ email: referralEmail, fullName: `user_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}` })
                    .unwrap()
                    .then(() => localStorage.setItem("referral_sent", referralEmail))
                    .catch(() => setError("Ошибка при отправке реферала. Попробуйте снова."));
            }
        }
    }, [referralEmail, addLinkedUser]);

    const handleLoginComplete = () => {
        setPage("verify");
    };

    const renderPage = () => {
        switch (page) {
            case "login":
                return <LoginPage setPage={setPage} onLoginComplete={handleLoginComplete} email={email} password={password} setEmail={setEmail} setPassword={setPassword} />;
            case "resetPassword":
                return <ResetPassword setPage={setPage} />;
            case "register":
                return <RegisterPage setPage={setPage} />;
            // case "verify":
            //     return <VerificationPage setPage={setPage} setStep={setStep} />;
            case "documents":
                return <DocumentsPage setPage={setPage} setStep={setStep} />;
            case "waiting":
                // return <WaitingPage setPage={setPage} setStep={setStep} />;
            // case "approved":
            //     return <ApprovedPage setPage={setPage} setStep={setStep} />;
            // case "sign":
            //     return <SignPage />;
            // case "canceled":
            //     return <CanceledPage setPage={setPage} />;
            // default:
                return <h2 className={styles.pageNotFound}>404 - Page Not Found</h2>;
        }
    };

    return (
        <div className={styles.mainLogin}>
            <header className={styles.mainLoginHeader}>
                <div className={styles.logo}>
                    <img src="./images/LogoLogin.png" alt="Logo" />
                </div>
            </header>

            <main className={styles.mainLoginContent}>
                <div className={styles.mainLoginForm}>
                    {error && <div className={styles.errorMessage}>{error}</div>}
                    {renderPage()}
                </div>
                <div className={styles.mainLoginImage}>
                    <div className={styles.circleSm}></div>
                    <div className={styles.circleXl}></div>
                    <img src="./images/loginImage.png" alt="Login Graphic" />
                </div>
            </main>

            <footer className={styles.mainLoginFooter}>
                <p>© ААМ, 2020–2024.</p>
            </footer>
        </div>
    );
};

export default MainLogin;