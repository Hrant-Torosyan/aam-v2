import React, { useState } from "react";
import styles from "./PopUp.module.scss";
import { useGetPopUpStateQuery, useSetPopUpStateMutation, useGetOperationsListQuery } from "src/store/analytics/analyticsAPI";
import Operations from "../Operations/Operations";
import LineChartComponent from "src/components/LineChart/LineChart";
import Select from "src/components/Select/Select";

const PopUp: React.FC = () => {
    const [selectValue, setSelectValue] = useState<string>('WEEKLY');
    const [showOperationsList, setShowOperationsList] = useState<number | null>(null);

    const { data: popUpState } = useGetPopUpStateQuery();
    const [setPopUpState] = useSetPopUpStateMutation();

    const { data: operationsData } = useGetOperationsListQuery({
        accountType: popUpState?.info || undefined,
        pageNumber: showOperationsList || undefined,
    });


    const closePopUp = () => {
        setPopUpState({ isOpen: false, info: null, type: '', balance: 0, percent: 0 });
        const event = new CustomEvent('closePopUp');
        window.dispatchEvent(event);
    };

    const handleOpenEvent = (eventName: string) => {
        closePopUp();
        setTimeout(() => {
            const event = new CustomEvent(eventName);
            window.dispatchEvent(event);
        }, 50);
    };

    if (!popUpState?.isOpen) return null;

    const balance = popUpState.balance || 0;
    const percent = popUpState.percent || 0;
    const operationsCount = operationsData?.transactionOperationsContent?.totalElements || 0;

    return (
        <div className={styles.popup}>
            <div className={styles.popupBlock}>
                <div className={styles.popupHeader}>
                    <p>{popUpState.type}</p>
                    <button onClick={closePopUp}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.8366 9.17188L9.16992 20.8386M9.16995 9.17188L20.8366 20.8386" stroke="#00B4D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className={styles.popupContent}>
                    <div className={styles.popupContentList}>
                        <div className={styles.popupContentListInfo}>
                            <p>Баланс: <span>${balance}</span></p>
                            <p>Доля от общего баланса: <span>{percent}%</span></p>
                            <p>Кол-во операций за месяц: <span>{operationsCount}</span></p>
                        </div>
                        <Operations
                            count={3}
                            showOperationsList={showOperationsList}
                            setShowOperationsList={setShowOperationsList}
                        />
                    </div>
                    <div className={styles.chartSelect}>
                        <Select value={selectValue} onChange={setSelectValue} className={`${styles.selected} ${styles.customClassName}`}/>
                        <LineChartComponent selectValue={selectValue} className={styles.chart}/>
                    </div>
                    <div className={styles.popupContentList}>
                        <div className={styles.popupContentButton} onClick={() => handleOpenEvent('openReplenishPopup')}>
                            <button>
                                <p>Пополнить</p>
                            </button>
                        </div>
                        {popUpState.info === "MASTER" && (
                            <div className={styles.popupContentButton} onClick={() => handleOpenEvent('openSendPopup')}>
                                <button>
                                    <p>Отправить</p>
                                </button>
                            </div>
                        )}
                        <div className={styles.popupContentButton} onClick={() => handleOpenEvent('openTransferPopup')}>
                            <button>
                                <p>Перевести</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopUp;