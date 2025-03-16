import React, {use, useState} from "react";
import Popup from "src/ui/Popup/Popup";
import Button from "src/ui/Button/Button";

import waiting from "src/images/svg/waiting.svg";

import styles from "./Waiting.module.scss";

interface WaitingPageProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const WaitingPage: React.FC<WaitingPageProps> = ({ setPage, setStep }) => {
    const [isDisabled, setIsDisabled] = useState(false);
    const [isEnabled, setIsEnabled] = useState(true);

    const handleSubmit = () => {
        if (isEnabled) {
            setPage("approved");
            setStep(7);
        } else {
            setPage("canceled");
            setStep(9);
        }

    };

    return (
        <Popup title="Верификация документов" onSubmit={handleSubmit}>
            <div className={styles.waitingContent}>
                <img src={waiting} alt="Загрузка" />
                <h3>Заявка на верификацию отправлена</h3>
                <p>Ожидайте решения.</p>
            </div>

            <Button type="button" variant="primary" disabled={isDisabled} onClick={handleSubmit}>
                Далее
            </Button>
        </Popup>
    );
};

export default WaitingPage;