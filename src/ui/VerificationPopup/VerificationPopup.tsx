import React, { useEffect, useRef } from "react";
import VerificationPage from "src/pages/auth/Verification/Verification";
import DocumentsPage from "src/pages/auth/Verification/Documents/Documents";
import WaitingPage from "src/pages/auth/Verification/Waiting/Waiting";
import ApprovedPage from "src/pages/auth/Verification/Approved/Approved";
import SignPage from "src/pages/auth/Verification/Sign/Sign";
import CanceledPage from "src/pages/auth/Verification/Canceled/CanceledPage";
import styles from "./VerificationPopup.module.scss";

interface CustomPopupHeaderProps {
    title: string;
}

// Custom wrapper component that adds the blue header styling
const CustomPopupHeader: React.FC<CustomPopupHeaderProps> = ({ title }) => {
    return (
        <div className={styles.customHeader}>
            <h1>{title}</h1>
        </div>
    );
};

interface VerificationPopupProps {
    isOpen: boolean;
    onClose: () => void;
    page: string;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    step: number;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const VerificationPopup: React.FC<VerificationPopupProps> = ({
                                                                 isOpen,
                                                                 onClose,
                                                                 page,
                                                                 setPage,
                                                                 step,
                                                                 setStep
                                                             }) => {
    // Reference for the popup container
    const popupRef = useRef<HTMLDivElement>(null);

    // Outside click handler
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                isOpen &&
                popupRef.current &&
                !popupRef.current.contains(event.target as Node)
            ) {
                onClose();
            }
        };

        // Add event listener when popup is open
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Cleanup the event listener
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    // Get the popup title based on the current page
    const getPopupTitle = () => {
        switch (page) {
            case "verify":
                return "Verification";
            case "documents":
                return "Верификация документов";
            case "waiting":
                return "Application Under Review";
            case "approved":
                return "Approval Confirmed";
            case "sign":
                return "Sign Documents";
            case "canceled":
                return "Application Canceled";
            default:
                return "Verification Process";
        }
    };

    // Render verification flow components based on page state
    const renderVerificationFlow = () => {
        switch (page) {
            case "verify":
                return <VerificationPage setPage={setPage} setStep={setStep} />;
            case "documents":
                return <DocumentsPage setPage={setPage} setStep={setStep} />;
            case "waiting":
                return <WaitingPage setPage={setPage} setStep={setStep} />;
            case "approved":
                return <ApprovedPage setPage={setPage} setStep={setStep} />;
            case "sign":
                return <SignPage />;
            case "canceled":
                return <CanceledPage setPage={setPage} />;
            default:
                return <div>Please select a verification step</div>;
        }
    };

    if (!isOpen) return null;

    return (
        <div className={styles.popupOverlay}>
            <div
                ref={popupRef}
                className={styles.popupContainer}
            >
                <div className={styles.verificationPopup}>
                    {/* Custom header with blue background and gradient text */}
                    <CustomPopupHeader title={getPopupTitle()} />

                    {/* Popup content */}
                    <div className={styles.popupContent}>
                        {renderVerificationFlow()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerificationPopup;