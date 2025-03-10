import React, { useEffect, useState } from "react";
import { useGetOperationsListItemQuery } from "src/store/analytics/analyticsAPI";
import { formatNumber } from "src/utils/formatNumber";
import styles from './OperationPopUp.module.scss';

interface WalletInfo {
    min_amount: number;
    max_amount: number;
    currency: string;
    name: string;
}

interface WalletsInfo {
    USTD: WalletInfo[];
    BTC: WalletInfo[];
    ETH: WalletInfo[];
}

interface OperationPopUpProps {
    setIsactive: (active: boolean) => void;
    operationId: string;
}

const OperationPopUp: React.FC<OperationPopUpProps> = ({ setIsactive, operationId }) => {
    const { data: operationData } = useGetOperationsListItemQuery(operationId);
    const [operationWallet, setOperationWallet] = useState<string | null>(null);

    const infoes: WalletsInfo = {
        USTD: [
            {
                min_amount: 8,
                max_amount: 2886,
                currency: "usdcmatic",
                name: "Matic Network",
            },
            {
                min_amount: 9,
                max_amount: 579,
                currency: "usddbsc",
                name: "Arbitrum Network",
            },
            {
                min_amount: 10,
                max_amount: 76798,
                currency: "usdttrc20",
                name: "TRON Network",
            },
            {
                min_amount: 11,
                max_amount: 76798,
                currency: "usdterc20",
                name: "Ethereum Network",
            },
            {
                min_amount: 9,
                max_amount: 23089,
                currency: "usdtbsc",
                name: "Binance Smart Chain Network",
            },
            {
                min_amount: 69,
                max_amount: 16072,
                currency: "usdtsol",
                name: "Solana Network",
            },
            {
                min_amount: 8,
                max_amount: 2889,
                currency: "usdtalgo",
                name: "Algorand Network",
            },
        ],
        BTC: [
            {
                min_amount: 0.0001783,
                max_amount: 1.26359284,
                currency: "btc",
                name: "Bitcoin",
            },
        ],
        ETH: [
            {
                min_amount: 1,
                max_amount: 26,
                currency: "eth",
                name: "ETH",
            },
            {
                min_amount: 0.0031139,
                max_amount: 5,
                currency: "ethbsc",
                name: "ETHBSC",
            },
            {
                min_amount: 0.0029608,
                max_amount: 0.85378951,
                currency: "etharb",
                name: "ETHArb",
            },
        ],
    };

    function formatDate(milliseconds: number): string {
        const date = new Date(milliseconds);
        const options: Intl.DateTimeFormatOptions = {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            day: "numeric",
            month: "long",
            year: "numeric",
        };
        const formattedDate = new Intl.DateTimeFormat("ru-RU", options).format(date);
        return formattedDate;
    }

    useEffect(() => {
        if (operationData) {
            if (operationData.type === "DEPOSITS") {
                setOperationWallet(
                    infoes.ETH.findIndex((item) => item.currency === operationData.depositCurrencyFrom) >= 0
                        ? "ETH"
                        : infoes.BTC.findIndex((item) => item.currency === operationData.depositCurrencyFrom) >= 0
                            ? "BTC"
                            : "USTD"
                );
            } else if (operationData.type === "WITHDRAWALS") {
                setOperationWallet(
                    infoes.ETH.findIndex((item) => item.currency === operationData.withdrawalCurrencyFrom) >= 0
                        ? "ETH"
                        : infoes.BTC.findIndex((item) => item.currency === operationData.withdrawalCurrencyFrom) >= 0
                            ? "BTC"
                            : "USTD"
                );
            }
        }
    }, [operationData]);

    return (
        <>
            {operationData && (
                <div className={styles.operationPopUp}>
                    <div className={styles.popUpProdBlock}>
                        <div className={styles.popUpProdHeader}>
                            <p>Детали операции</p>
                            <button onClick={() => setIsactive(false)}>
                                <svg
                                    width="30"
                                    height="30"
                                    viewBox="0 0 30 30"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M20.8366 9.17188L9.16992 20.8386M9.16995 9.17188L20.8366 20.8386"
                                        stroke="#00B4D2"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className={styles.popUpProdContent}>
                            <div className={styles.operationPopUpTitle}>
                                <div className={styles.operationPopUpTitleItem}>
                                    <div
                                        className={
                                            operationData.status === "DONE"
                                                ? styles.done
                                                : operationData.status === "IN_PROCESS"
                                                    ? styles.progress
                                                    : styles.failed
                                        }
                                    >
                    <span>
                      {operationData.status === "DONE"
                          ? "Выполнено"
                          : operationData.status === "IN_PROCESS"
                              ? "В процессе"
                              : "Неуспешно"}
                    </span>
                                    </div>
                                    <img src="./images/bannerLogo.svg" alt="bannerLogo" />
                                </div>
                                <p className={styles.amount}>${formatNumber(operationData.amount)}</p>
                                <p>Сумма транзакции</p>
                            </div>

                            <p className={styles.operationInfo}>
                                {operationData.type === "DIVIDEND_PAYMENT"
                                    ? `Выплата по дивидендам проекта "${operationData.projectTitle}" за ${
                                        operationData.projectTerm
                                    } ${
                                        operationData.projectPeriod === "MONTHLY"
                                            ? "месяц"
                                            : operationData.projectPeriod === "QUARTERLY"
                                                ? "квартал"
                                                : "полугодоа"
                                    }`
                                    : operationData.type === "PROJECT_INVEST"
                                        ? `Инвестиция "${operationData.projectTitle}"`
                                        : operationData.type === "PROJECT_DELETE"
                                            ? `${operationData.projectTitle} проект отменен`
                                            : operationData.type === "TRANSFER_BETWEEN_WALLETS"
                                                ? "Внутренний перевод по счетами"
                                                : operationData.type === "TRANSFER_BETWEEN_USERS_WALLETS"
                                                    ? "Выплата средств на внешний кошелек из инвестиционного счета"
                                                    : operationData.type === "WITHDRAWALS"
                                                        ? "Вывод средств из основного счета"
                                                        : operationData.type === "DEPOSITS"
                                                            ? "Пополнения основного  счета"
                                                            : `${
                                                                operationData.type === "PROJECT_PURCHASE_COMMISSION"
                                                                    ? "Комиссия при покупке"
                                                                    : operationData.type === "PROJECT_MANAGEMENT_COMMISSION"
                                                                        ? "Комиссия за управление"
                                                                        : operationData.type === "PROJECT_PROFIT_COMMISSION"
                                                                            ? "Комиссия с прибыли"
                                                                            : operationData.type === "PROJECT_WITHDRAWAL_COMMISSION"
                                                                                ? "Комиссия за вывод"
                                                                                : ""
                                                            }`}
                            </p>

                            {operationData.type === "WITHDRAWALS" && (
                                <>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет списания: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {" "}
                                            {operationData.operationFrom === "MASTER_ACCOUNT"
                                                ? "Основной счет"
                                                : operationData.operationFrom === "INVESTMENT_ACCOUNT"
                                                    ? "Инвестиционный счет"
                                                    : "Агентский счет"}
                                        </div>
                                    </div>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Источник пополнения: </p>
                                        <div className={`${styles.operationPopUpInfoItem} ${styles.type}`}>
                                            <div className={styles.mainSelectItemTypeItem}>
                                                <div className={styles.typeInfo}>
                                                    <img src={`./images/${operationWallet}.png`} alt="" />
                                                    <div className={styles.typeInfoItem}>
                                                        <h3>
                                                            {operationWallet === "BTC"
                                                                ? "Bitcoin"
                                                                : operationWallet === "USTD"
                                                                    ? "Tether"
                                                                    : "Ethereum"}
                                                        </h3>
                                                        <p>#{operationWallet}</p>
                                                    </div>
                                                </div>
                                                <p>{operationData.withdrawalAddress}</p>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}

                            {operationData.type === "DEPOSITS" && (
                                <>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет списания: </p>
                                        <div className={`${styles.operationPopUpInfoItem} ${styles.type}`}>
                                            <div className={styles.mainSelectItemTypeItem}>
                                                <div className={styles.typeInfo}>
                                                    <img src={`./images/${operationWallet}.png`} alt="" />
                                                    <div className={styles.typeInfoItem}>
                                                        <h3>
                                                            {operationWallet === "BTC"
                                                                ? "Bitcoin"
                                                                : operationWallet === "USTD"
                                                                    ? "Tether"
                                                                    : "Ethereum"}
                                                        </h3>
                                                        <p>#{operationWallet}</p>
                                                    </div>
                                                </div>
                                                <p>{operationData.depositAddress}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет пополнения:</p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {" "}
                                            {operationData.operationTo === "MASTER_ACCOUNT"
                                                ? "Основной счет"
                                                : operationData.operationTo === "INVESTMENT_ACCOUNT"
                                                    ? "Инвестиционный счет"
                                                    : "Агентский счет"}
                                        </div>
                                    </div>
                                </>
                            )}

                            {operationData.type === "TRANSFER_BETWEEN_WALLETS" && (
                                <>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет списания: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.operationFrom === "MASTER_ACCOUNT"
                                                ? "Основной счет"
                                                : operationData.operationFrom === "INVESTMENT_ACCOUNT"
                                                    ? "Инвестиционный счет"
                                                    : "Агентский счет"}
                                        </div>
                                    </div>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет пополнения: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.operationTo === "MASTER_ACCOUNT"
                                                ? "Основной счет"
                                                : operationData.operationTo === "INVESTMENT_ACCOUNT"
                                                    ? "Инвестиционный счет"
                                                    : "Агентский счет"}
                                        </div>
                                    </div>
                                </>
                            )}

                            {operationData.type === "PROJECT_INVEST" && (
                                <>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет списания: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.operationFrom === "MASTER_ACCOUNT"
                                                ? "Основной счет"
                                                : operationData.operationFrom === "INVESTMENT_ACCOUNT"
                                                    ? "Инвестиционный счет"
                                                    : "Агентский счет"}
                                        </div>
                                    </div>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Проект: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.projectTitle}
                                        </div>
                                    </div>
                                </>
                            )}

                            {operationData.type === "PROJECT_DELETE" && (
                                <>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Проект: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.projectTitle}
                                        </div>
                                    </div>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет пополнения: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.operationTo === "MASTER_ACCOUNT"
                                                ? "Основной счет"
                                                : operationData.operationTo === "INVESTMENT_ACCOUNT"
                                                    ? "Инвестиционный счет"
                                                    : "Агентский счет"}
                                        </div>
                                    </div>
                                </>
                            )}

                            {operationData.type === "DIVIDEND_PAYMENT" && (
                                <>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Проект: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.projectTitle}
                                        </div>
                                    </div>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет пополнения: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.operationTo === "MASTER_ACCOUNT"
                                                ? "Основной счет"
                                                : operationData.operationTo === "INVESTMENT_ACCOUNT"
                                                    ? "Инвестиционный счет"
                                                    : "Агентский счет"}
                                        </div>
                                    </div>
                                </>
                            )}

                            {operationData.type === "TRANSFER_BETWEEN_USERS_WALLETS" && (
                                <>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>
                                            {operationData.toUserId === null
                                                ? "Счет пополнения:"
                                                : "Счет списания:"}
                                        </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.toUserId === null
                                                ? operationData.operationTo === "MASTER_ACCOUNT"
                                                    ? "Основной счет"
                                                    : operationData.operationTo === "INVESTMENT_ACCOUNT"
                                                        ? "Инвестиционный счет"
                                                        : "Агентский счет"
                                                : operationData.operationFrom === "MASTER_ACCOUNT"
                                                    ? "Основной счет"
                                                    : operationData.operationFrom === "INVESTMENT_ACCOUNT"
                                                        ? "Инвестиционный счет"
                                                        : "Агентский счет"}
                                        </div>
                                    </div>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>
                                            {operationData.toUserId === null ? "Отправитель:" : "Получатель:"}
                                        </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            ID:{" "}
                                            {operationData.toUserId === null
                                                ? operationData.fromUserId
                                                : operationData.toUserId}
                                        </div>
                                    </div>
                                </>
                            )}

                            {operationData.type === "PROJECT_PURCHASE_COMMISSION" ||
                            operationData.type === "PROJECT_MANAGEMENT_COMMISSION" ||
                            operationData.type === "PROJECT_PROFIT_COMMISSION" ||
                            operationData.type === "PROJECT_WITHDRAWAL_COMMISSION" ? (
                                <>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Счет списания: </p>
                                        <div className={styles.operationPopUpInfoItem}>Инвестиционный счет</div>
                                    </div>
                                    <div className={styles.operationPopUpInfo}>
                                        <p>Проект: </p>
                                        <div className={styles.operationPopUpInfoItem}>
                                            {operationData.projectTitle}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                ""
                            )}
                            <p className={styles.dateInfo}>
                                Время транзакции: <span> {formatDate(+operationData.date)}</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OperationPopUp;