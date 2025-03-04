import React, { useState } from "react";
import { useGetOperationsListQuery } from "src/store/analytics/analyticsAPI";
import OperationPopUp from "src/components/OperationPopUp/OperationPopUp";
import styles from "./Operations.module.scss";

function formatDate(milliseconds: number): string {
    const date = new Date(milliseconds);
    const months = [
        "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month}, ${year}`;
}

interface Operation {
    transactionOperationId: string;
    type: string;
    date: number;
    amount: number;
    status: string;
}

interface OperationsProps {
    accountType?: string;
    pageNumber?: number;
    count: number;
    setShowOperationsList: React.Dispatch<React.SetStateAction<number | null>>;
    showOperationsList: number | null;
}

const Operations: React.FC<OperationsProps> = ({
                                                   accountType,
                                                   pageNumber = 1,
                                                   count,
                                                   setShowOperationsList,
                                                   showOperationsList,
                                               }) => {
    const [isActive, setIsActive] = useState(false);
    const [operationId, setOperationId] = useState<string>("");

    const { data: operationsData, isLoading, error } = useGetOperationsListQuery({
        accountType,
        pageNumber,
    });

    const operationsArr = operationsData?.content || [];

    const getOperationType = (type: string): string => {
        switch (type) {
            case "DIVIDEND_PAYMENT":
                return "Выплата по дивидендам";
            case "PROJECT_INVEST":
                return "Инвестиция";
            case "PROJECT_DELETE":
                return "По закрытии проекта";
            case "TRANSFER_BETWEEN_WALLETS":
                return "Внутренний перевод";
            case "TRANSFER_BETWEEN_USERS_WALLETS":
                return "Перевод пользователю";
            case "WITHDRAWALS":
                return "Вывод средств";
            case "DEPOSITS":
                return "Пополнения";
            default:
                return "Комиссия";
        }
    };

    const operationBlocks = operationsArr.map((item: Operation, key: number) => (
        <div
            onClick={() => {
                setOperationId(item.transactionOperationId);
                setIsActive(true);
            }}
            key={key}
            className={styles.operationBlockItem}
        >
            <div className={styles.operationBlockMain}>{getOperationType(item.type)}</div>
            <div className={styles.operationBlockInfo}>
                <p>{formatDate(item.date)}</p>
                <p>${parseFloat(item.amount.toString().replace(/[^\d.-]/g, "")).toLocaleString()}</p>
                <div
                    className={
                        item.status === "DONE"
                            ? styles.done
                            : item.status === "IN_PROCESS"
                                ? styles.progress
                                : styles.failed
                    }
                >
                    <span>{item.status === "DONE" ? "Выполнено" : item.status === "IN_PROCESS" ? "В процессе" : "Неуспешно"}</span>
                </div>
            </div>
        </div>
    ));

    return (
        <div className={styles.operationBlock}>
            {isActive && <OperationPopUp setIsActive={setIsActive} operationId={operationId} />}

            <div className={`${styles.operationBlockItem} ${styles.title}`}>
                <div className={styles.operationBlockMain}>Операция</div>
                <div className={styles.operationBlockInfo}>
                    <p>Дата</p>
                    <p>Сумма</p>
                    <p>Статус</p>
                </div>
            </div>

            <div className={styles.operationBlockContent}>
                {operationsArr.length ? operationBlocks : <p className={styles.empty}>Пока что пусто</p>}
            </div>

            {operationsData?.totalElements > count && (
                <button
                    onClick={() => setShowOperationsList(showOperationsList ? null : count)}
                    className={styles.toggleButton}
                >
                    {operationsArr.length === count ? "смотреть полностью" : "скрыть"}
                </button>
            )}
        </div>
    );
};

export default Operations;