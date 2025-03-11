import React, { useState, useEffect } from "react";
import styles from "./Operations.module.scss";
import { useGetOperationsListQuery } from "src/store/analytics/analyticsAPI";
import OperationPopUp from 'src/components/OperationPopUp/OperationPopUp';

function formatDate(milliseconds: number | string): string {
    const date = new Date(Number(milliseconds));

    const months = [
        "Января", "Февраля", "Марта", "Апреля", "Мая", "Июня",
        "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря",
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day} ${month}, ${year}`;
}

interface OperationsProps {
    count: number;
    showOperationsList: number | null;
    setShowOperationsList: React.Dispatch<React.SetStateAction<number | null>>;
    accountType?: string;
}

interface OperationItem {
    transactionOperationId: string;
    type: string;
    date: string | number;
    amount: string | number;
    status: "DONE" | "IN_PROCESS" | "FAILED";
}

const Operations: React.FC<OperationsProps> = ({
   count,
   setShowOperationsList,
   showOperationsList,
   accountType,
}) => {
    const [isActive, setIsactive] = useState(false);
    const [operationId, setOperationId] = useState<string>("");

    const { data: operationsArr, isLoading } = useGetOperationsListQuery({
        accountType,
        pageNumber: count,
    });

    useEffect(() => {
        if (showOperationsList === null) {
            setShowOperationsList(null);
        }
    }, [showOperationsList, setShowOperationsList]); // Ensure resetting only if necessary

    const displayedOperations = operationsArr?.transactionOperationsContent?.content
        ? showOperationsList === null
            ? operationsArr.transactionOperationsContent.content.slice(0, 3)
            : operationsArr.transactionOperationsContent.content
        : [];

    const getOperationTypeText = (type: string): string => {
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

    const getStatusText = (status: string): string => {
        switch (status) {
            case "DONE":
                return "Выполнено";
            case "IN_PROCESS":
                return "В процессе";
            default:
                return "Неуспешно";
        }
    };

    const getStatusClass = (status: string): string => {
        switch (status) {
            case "DONE":
                return styles.done;
            case "IN_PROCESS":
                return styles.progress;
            default:
                return styles.failed;
        }
    };

    const handleOperationClick = (id: string) => {
        setOperationId(id);
        setIsactive(true);
    };

    const operationBlocks = displayedOperations.map(
        (item: OperationItem, key: number) => (
            <div
                onClick={() => handleOperationClick(item.transactionOperationId)}
                key={key}
                className={styles.operationBlockItem}
            >
                <div className={styles.operationBlockMain}>
                    {getOperationTypeText(item.type)}
                </div>
                <div className={styles.operationBlockInfo}>
                    <p>{formatDate(item.date)}</p>
                    <p>${parseFloat(item.amount.toString().replace(/[^\d.-]/g, "")).toLocaleString()}</p>
                    <div className={getStatusClass(item.status)}>
                        <span>{getStatusText(item.status)}</span>
                    </div>
                </div>
            </div>
        )
    );

    const toggleOperationsList = () => {
        if (showOperationsList === null) {
            setShowOperationsList(operationsArr?.transactionOperationsContent?.totalElements || 1);
        } else {
            setShowOperationsList(null);
        }
    };

    return (
        <div className={styles.operationBlock}>
            {isActive && <OperationPopUp setIsactive={setIsactive} operationId={operationId} />}

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
                ) : operationsArr?.transactionOperationsContent?.content?.length ? (
                    operationBlocks
                ) : (
                    <p className={styles.empty}>Пока что пусто</p>
                )}
            </div>

            {operationsArr?.transactionOperationsContent?.content?.length > 3 && (
                <button onClick={toggleOperationsList}>
                    {showOperationsList === null ? "смотреть полностью" : "скрыть"}
                </button>
            )}
        </div>
    );
};

export default Operations;