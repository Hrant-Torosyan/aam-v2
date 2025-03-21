import React, { useState } from "react";
import styles from "./Operations.module.scss";
import { useGetOperationsListQuery } from "src/store/analytics/analyticsAPI";
import OperationPopUp from "src/components/OperationPopUp/OperationPopUp";

const months = [
    "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
    "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"
];

const formatDate = (milliseconds: number | string): string => {
    const date = new Date(Number(milliseconds));
    return `${date.getDate()} ${months[date.getMonth()]}, ${date.getFullYear()}`;
};

interface OperationsProps {
    count: number;
    showOperationsList: number | null;
    setShowOperationsList: React.Dispatch<React.SetStateAction<number | null>>;
    accountType?: string;
    className?: string;
}

interface OperationItem {
    transactionOperationId: string;
    type: string;
    date: string | number;
    amount: string | number;
    status: "DONE" | "IN_PROCESS" | "FAILED";
}

const operationTypes: Record<string, string> = {
    DIVIDEND_PAYMENT: "Выплата по дивидендам",
    PROJECT_INVEST: "Инвестиция",
    PROJECT_DELETE: "По закрытии проекта",
    TRANSFER_BETWEEN_WALLETS: "Внутренний перевод",
    TRANSFER_BETWEEN_USERS_WALLETS: "Перевод пользователю",
    WITHDRAWALS: "Вывод средств",
    DEPOSITS: "Пополнения",
    DEFAULT: "Комиссия"
};

const statusClasses: Record<string, string> = {
    DONE: styles.done,
    IN_PROCESS: styles.progress,
    FAILED: styles.failed
};

const statusTexts: Record<string, string> = {
    DONE: "Выполнено",
    IN_PROCESS: "В процессе",
    FAILED: "Неуспешно"
};

const Operations: React.FC<OperationsProps> = ({
   count,
   showOperationsList,
   setShowOperationsList,
   accountType,
   className
}) => {
    const [isActive, setIsActive] = useState(false);
    const [operationId, setOperationId] = useState<string>("");

    const pageSize = showOperationsList !== null ? showOperationsList : count;
    const { data: operationsArr, isLoading } = useGetOperationsListQuery({ accountType, pageNumber: pageSize });
    const operations = operationsArr?.transactionOperationsContent?.content || [];
    const isShowingAll = showOperationsList !== null;
    const displayedOperations = isShowingAll ? operations : operations.slice(0, count);
    const totalOperations = operationsArr?.transactionOperationsContent?.totalElements || 0;
    const showToggleButton = totalOperations > count;

    return (
        <div className={`${styles.operationBlock} ${className || ""}`}>
            {isActive && <OperationPopUp setIsactive={setIsActive} operationId={operationId} />}

            <div className={`${styles.operationBlockItem} ${styles.title}`}>
                <div className={styles.operationBlockMain}>Операция</div>
                <div className={styles.operationBlockInfo}>
                    <p>Дата</p>
                    <p>Сумма</p>
                    <p>Статус</p>
                </div>
            </div>

            <div className={styles.operationBlockContent}>
                {isLoading ? (
                    <p className={styles.loading}>Загрузка...</p>
                ) : operations.length ? (
                    displayedOperations.map((item: OperationItem) => (
                        <div
                            key={item.transactionOperationId}
                            className={styles.operationBlockItem}
                            onClick={() => {
                                setOperationId(item.transactionOperationId);
                                setIsActive(true);
                            }}
                        >
                            <div className={styles.operationBlockMain}>{operationTypes[item.type] || operationTypes.DEFAULT}</div>
                            <div className={styles.operationBlockInfo}>
                                <p>{formatDate(item.date)}</p>
                                <p>${parseFloat(item.amount.toString().replace(/[^\d.-]/g, "")).toLocaleString()}</p>
                                <div className={statusClasses[item.status] || styles.failed}>
                                    <span>{statusTexts[item.status]}</span>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className={styles.empty}>Пока что пусто</p>
                )}
            </div>

            {showToggleButton && (
                <button onClick={() => setShowOperationsList(isShowingAll ? null : totalOperations)}>
                    {!isShowingAll ? "смотреть полностью" : "скрыть"}
                </button>
            )}
        </div>
    );
};

export default Operations;
