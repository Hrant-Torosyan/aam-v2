import React from "react";
import Popup from "src/ui/Popup/Popup";
import VerificationPage from "src/pages/auth/Verification/Verification";
import DocumentsPage from "src/pages/auth/Verification/Documents/Documents";
import WaitingPage from "src/pages/auth/Verification/Waiting/Waiting";
import ApprovedPage from "src/pages/auth/Verification/Approved/Approved";
import SignPage from "src/pages/auth/Verification/Sign/Sign";
import CanceledPage from "src/pages/auth/Verification/Canceled/CanceledPage";
import styles from "./VerificationPopup.module.scss";

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
    // Get the popup title based on the current page
    const getPopupTitle = () => {
        switch (page) {
            case "verify":
                return "Verification";
            case "documents":
                return "Upload Documents";
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

    // Handle back button functionality
    const handleBack = () => {
        // Logic to go to previous step based on current page
        switch (page) {
            case "documents":
                setPage("verify");
                setStep(1);
                break;
            case "waiting":
                setPage("documents");
                setStep(2);
                break;
            case "approved":
                setPage("waiting");
                setStep(3);
                break;
            case "canceled":
                setPage("verify");
                setStep(1);
                break;
            default:
                onClose(); // If can't go back, close the popup
                break;
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
            <div className={styles.popupContainer}>
                <Popup
                    title={getPopupTitle()}
                    onBack={page !== "verify" ? handleBack : undefined}
                    className={styles.verificationPopup}
                >
                    {/* Progress indicator */}
                    <div className={styles.stepsIndicator}>
                        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>
                            <div className={styles.stepNumber}>1</div>
                            <div className={styles.stepLabel}>Verify</div>
                        </div>
                        <div className={styles.stepConnector}></div>
                        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>
                            <div className={styles.stepNumber}>2</div>
                            <div className={styles.stepLabel}>Documents</div>
                        </div>
                        <div className={styles.stepConnector}></div>
                        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>
                            <div className={styles.stepNumber}>3</div>
                            <div className={styles.stepLabel}>Review</div>
                        </div>
                        <div className={styles.stepConnector}></div>
                        <div className={`${styles.step} ${step >= 4 ? styles.active : ''}`}>
                            <div className={styles.stepNumber}>4</div>
                            <div className={styles.stepLabel}>Complete</div>
                        </div>
                    </div>

                    <div className={styles.popupContent}>
                        {renderVerificationFlow()}
                    </div>

                    <button
                        type="button"
                        className={styles.closeButton}
                        onClick={onClose}
                    >
                        Close
                    </button>
                </Popup>
            </div>
        </div>
    );
};

export default VerificationPopup;