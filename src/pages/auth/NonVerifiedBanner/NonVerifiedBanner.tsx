import React, { useState } from 'react';
import styles from './NonVerifiedBanner.module.scss';
import attention from 'src/images/svg/attention.svg';
import VerificationPopup from 'src/ui/VerificationPopup/VerificationPopup';

interface NonVerifiedBannerProps {
    setPage?: React.Dispatch<React.SetStateAction<string>>;
    setStep?: React.Dispatch<React.SetStateAction<number>>;
}

const NonVerifiedBanner: React.FC<NonVerifiedBannerProps> = ({ setPage, setStep }) => {
    const [showPopup, setShowPopup] = useState(false);

    const handleVerificationClick = (e: React.MouseEvent<HTMLSpanElement>) => {
        e.preventDefault();
        // Set initial verification page and step
        if (setPage) setPage("documents");
        if (setStep) setStep(1);
        setShowPopup(true);
    };

    const handleClose = () => {
        setShowPopup(false);
    };

    return (
        <>
            <div className={styles.nonVerifiedBanner}>
                <div className={styles.textWrapper}>
                    <img src={attention} alt="attention" className={styles.icon} />
                    <p className={styles.title}>Профиль не верифицирован</p>
                </div>
                <p className={styles.description}>
                    <span className={styles.link} onClick={handleVerificationClick}>
                        Подтвердите
                    </span>{" "}
                    свою личность, чтобы получить полный доступ к возможностям.
                </p>
            </div>

            {/* The VerificationPopup component with the document step */}
            <VerificationPopup
                isOpen={showPopup}
                onClose={handleClose}
                page="documents"
                setPage={setPage || (() => {})}
                step={1}
                setStep={setStep || (() => {})}
            />
        </>
    );
};

export default NonVerifiedBanner;