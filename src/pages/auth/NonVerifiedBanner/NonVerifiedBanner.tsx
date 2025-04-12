import React, {Suspense} from 'react';
import styles from './NonVerifiedBanner.module.scss';
import attention from 'src/images/svg/attention.svg';
import VerificationPage from "@/pages/auth/Verification/Verification";
import DocumentsPage from "@/pages/auth/Verification/Documents/Documents";
import WaitingPage from "@/pages/auth/Verification/Waiting/Waiting";
import ApprovedPage from "@/pages/auth/Verification/Approved/Approved";
import SignPage from "@/pages/auth/Verification/Sign/Sign";
import CanceledPage from "@/pages/auth/Verification/Canceled/CanceledPage";
import Loader from "@/ui/Loader/Loader";
import {Outlet} from "react-router";

interface NonVerifiedBannerProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const NonVerifiedBanner: React.FC<NonVerifiedBannerProps> = ({ setPage, setStep,  }) => {
    const handleVerification = () => {
        setStep(2);
        setPage("verify");
        console.log('Navigating to verification page');
    };

    return (
        <div className={styles.nonVerifiedBanner}>
            <div className={styles.textWrapper}>
                <img src={attention} alt="attention" className={styles.icon} />
                <p className={styles.title}>Профиль не верифицирован</p>
            </div>
            <p className={styles.description}>
                <span className={styles.link} onClick={handleVerification}>
                    Подтвердите
                </span>{" "}
                свою личность, чтобы получить полный доступ к возможностям.
            </p>
        </div>
    );
};

export default NonVerifiedBanner;
//
// switch (page) {
//     case "verify":
//         return <VerificationPage setPage={setPage} setStep={setStep} />;
//     case "documents":
//         return <DocumentsPage setPage={setPage} setStep={setStep} />;
//     case "waiting":
//         return <WaitingPage setPage={setPage} setStep={setStep} />;
//     case "approved":
//         return <ApprovedPage setPage={setPage} setStep={setStep} />;
//     case "sign":
//         return <SignPage />;
//     case "canceled":
//         return <CanceledPage setPage={setPage} />;
//     default:
//         return (
//             <Suspense fallback={<Loader />}>
//                 <Outlet />
//             </Suspense>
//         );
// }