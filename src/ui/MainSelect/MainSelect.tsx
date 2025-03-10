import React, { useState } from "react";
import styles from "./MainSelect.module.scss";

interface AccountDetails {
    name: string;
    type?: string;
    info?: string;
    currency?: string;
}

interface MainSelectProps {
    selectTitle: string;
    selectValue: string | AccountDetails;
    setSelectValue: (value: string | AccountDetails) => void;
    dataSelect: Array<string | AccountDetails>;
}

const MainSelect: React.FC<MainSelectProps> = ({ selectTitle, dataSelect, selectValue, setSelectValue }) => {
    const [isActiveSelect, setIsActiveSelect] = useState(false);

    const handleSelectChange = (value: string | AccountDetails) => {
        setSelectValue(value);
        setIsActiveSelect(false);
    };

    return (
        <>
            <p className={styles.selectTitle}>{selectTitle}</p>
            <div
                onClick={() => setIsActiveSelect(!isActiveSelect)}
                className={`${styles.mainSelect} ${isActiveSelect ? styles.activeSl : ""}`}
            >
                <p className={styles.selectValueText}>
                    {typeof selectValue === "object" ? (selectValue.info || selectValue.name) : selectValue}
                </p>
                <img src="./images/angle.png" alt="angle" className={styles.angleIcon} />
                {isActiveSelect && (
                    <div className={styles.mainSelectItem}>
                        {dataSelect.map((item, key) => (
                            <div key={key} onClick={(e) => {
                                e.stopPropagation();
                                handleSelectChange(item);
                            }}>
                                <p>{typeof item === "object" ? item.name : item}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default MainSelect;