import React from "react";
import Popup from "src/ui/Popup/Popup";
import Button from "src/ui/Button/Button";

import approved from "src/images/svg/approved.svg";

import styles from "./Approved.module.scss";

interface ApprovedPageProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const ApprovedPage: React.FC<ApprovedPageProps> = ({ setPage, setStep }) => {

    const handleSubmit = () => {
        setPage("sign");
        setStep(8);
    };

    return (
        <Popup title="Одобрено" onSubmit={handleSubmit}>
            <div className={styles.approvedContent}>
                <img src={approved} alt="Загрузка" />
                <h3>Ваши документы успешно одобрены.</h3>
                <p>Вы можете продолжить использование сервиса.</p>
            </div>

            <Button type="button" variant="primary" disabled={false}  onClick={handleSubmit}>
                Далее
            </Button>
            <Button type="button" variant="secondary" disabled={false} onClick={() => setPage("documents")}>
                Назад
            </Button>
        </Popup>
    );
};

export default ApprovedPage;
