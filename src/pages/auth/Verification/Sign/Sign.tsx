import React, { useState } from "react";
import Popup from "src/ui/Popup/Popup";
import Button from "src/ui/Button/Button";

import styles from "./Sign.module.scss";
import {useNavigate} from "react-router-dom";


const SignPage = () => {
    const [isChecked, setIsChecked] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = () => {
        if (!isChecked) {
            return;
        }
        navigate("/");
    };

    return (
        <Popup title="Подпись договора" onSubmit={handleSubmit} submitButtonText="Подтвердить">
            <div className={styles.signContent}>
                <p>
                    Lorem ipsum dolor sit amet consectetur. Ac consectetur ut id diam. Ipsum et feugiat vitae
                    lacinia amet posuere. Nulla tincidunt et ac urna laoreet. Tellus purus risus sed egestas eu facilisi elit.
                    Nulla tincidunt et ac urna laoreet. Tellus purus risus sed egestas eu facilisi elit.Tellus purus
                    risus sed egestas eu facilisi elit.Tellus purus risus sed egestas eu facilisi elit.
                </p>
                <div className={styles.confirm}>
                    <label htmlFor="confirm" className={styles.confirmLabel}>
                        <span className={styles.confirmText}>
                             Соглашение на договор
                        </span>
                        <input
                            type="checkbox"
                            id="confirm"
                            className={styles.confirmRadio}
                            checked={isChecked}
                            onChange={() => {
                                setIsChecked(!isChecked);
                            }}
                        />
                    </label>
                </div>
            </div>
            <Button type="submit" variant="primary" disabled={!isChecked} onClick={handleSubmit} >
                Завершить верификацию
            </Button>
        </Popup>
    );
};

export default SignPage;