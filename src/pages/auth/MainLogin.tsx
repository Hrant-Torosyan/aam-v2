import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useAddLinkedUserMutation } from "src/store/auth/authAPI";

import LoginPage from "src/pages/auth/Login/LoginPage";
import ResetPassword from "src/pages/auth/ResetPassword/ResetPassword";
import RegisterPage from "src/pages/auth/Register/RegisterPage";

import styles from "./MainLogin.module.scss";

const generateLinkedUserId = () => {
    return `user_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
};

const MainLogin: React.FC = () => {
    const [searchParams] = useSearchParams();
    const innerQ = searchParams.get("q");

    const [page, setPage] = useState<string>(innerQ ? "register" : "login");
    const [error, setError] = useState<string | null>(null);

    const [addLinkedUser] = useAddLinkedUserMutation();

    useEffect(() => {
        if (innerQ) {
            const storedReferral = localStorage.getItem("referral_sent");

            if (storedReferral !== innerQ) {
                const linkedUserId = generateLinkedUserId();

                addLinkedUser({
                    email: innerQ,
                    fullName: linkedUserId,
                })
                    .unwrap()
                    .then(() => {
                        localStorage.setItem("referral_sent", innerQ);
                    })
                    .catch((error) => {
                        setError("Ошибка при отправке реферала. Попробуйте снова.");
                        console.error("Error sending referral:", error);
                    });
            }
        }
    }, [innerQ, addLinkedUser]);

    const renderPage = () => {
        switch (page) {
            case "login":
                return <LoginPage setPage={setPage} />;
            case "resetPassword":
                return <ResetPassword setPage={setPage} />;
            case "register":
                return <RegisterPage setPage={setPage} />;
            default:
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