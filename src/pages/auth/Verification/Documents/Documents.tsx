import React from "react";
import Popup from "src/ui/Popup/Popup";
import Button from "src/ui/Button/Button";

import backup from "src/images/svg/backup.svg";

import styles from "./Documents.module.scss";


interface DocumentsPageProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const DocumentsPage: React.FC<DocumentsPageProps> = ({ setPage, setStep }) => {

    const handleSubmit = () => {
        setPage("waiting");
        setStep(6);
    };

    return (
        <Popup title="Верификация докуменов" onSubmit={handleSubmit} submitButtonText="Подтвердить">
            <div className={styles.documentsContent}>
                <img src={backup} alt="backup"/>
                <h3>Подтвердите вашу личность</h3>
                <p>
                    Для завершения верификации загрузите фото паспорта по ссылке на официальном сайте.
                </p>
            </div>

            <Button type="submit" variant="primary" disabled={false}>
                Перейти по ссылка
            </Button>
        </Popup>
    );
};

export default DocumentsPage;