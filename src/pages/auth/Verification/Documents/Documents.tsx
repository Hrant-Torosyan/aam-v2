import React from "react";
import backup from "src/images/svg/backup.svg";
import styles from "./Documents.module.scss";

interface DocumentsPageProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ setPage, setStep }) => {
    const handleClickLink = () => {
        // Navigate to official website or next step
        setPage("waiting");
        setStep(6);
    };

    return (
        <div style={{width: '100%'}}>
            <div className={styles.documentsContent}>
                <img src={backup} alt="Upload verification" />
                <h3>Подтвердите вашу личность</h3>
                <p>
                    Для завершения верификации загрузите фото паспорта по ссылке на официальном сайте.
                </p>
            </div>

            <button
                className={styles.button}
                onClick={handleClickLink}
                type="button"
            >
                Перейти по ссылке
            </button>
        </div>
    );
};

export default DocumentsPage;