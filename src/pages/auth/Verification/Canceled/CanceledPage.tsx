import React from "react";
import Popup from "src/ui/Popup/Popup";
import Button from "src/ui/Button/Button";

import canceled from "src/images/svg/cancel.svg";

import styles from "./Canceled.module.scss";

interface  CanceledPageProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
}

const CanceledPage: React.FC<CanceledPageProps> = ({ setPage }) => {

    return (
        <Popup title="Отклонено">
            <div className={styles.canceledContent}>
                <img src={canceled} alt="canceled" />
                <h3>К сожалению, ваши документы не прошли проверку.</h3>
                <p>Пожалуйста, проверьте данные и попробуйте снова.</p>
            </div>

            <Button type="button" variant="primary" disabled={false} onClick={() => setPage("documents")}>
                Отправить заново
            </Button>
        </Popup>
    );
};

export default CanceledPage;
