import React, { useState, useEffect } from "react";
import MainSelect from "src/ui/MainSelect/MainSelect";
import MainInput from "src/ui/MainInput/MainInput";
import { useDispatch, useSelector } from "react-redux";
import { setOperationsList } from "src/store/analytics/analyticsSlice";
import { analyticsApi } from "src/store/analytics/analyticsAPI";
import styles from "./Send.module.scss";
import { Infoes, CurrencyKey, AccountDetails } from "./Infoes";

interface ErrorType {
    message: string;
    code?: string;
}

interface SendProps {
    setIsOpenSend: (value: boolean) => void;
    setSuccessInfo: (value: boolean) => void;
    setIsOpenSc: (value: boolean) => void;
}

interface NetworkInfo {
    min_amount: number;
    max_amount: number;
    currency: string;
    name: string;
}

const Send: React.FC<SendProps> = ({ setIsOpenSend, setSuccessInfo, setIsOpenSc }) => {
    const dispatch = useDispatch();
    const operationsArr = useSelector((state: any) => state.analytics.operationsArr);
    const { masterAccount } = useSelector((state: any) => state.analytics.analyticsData || {});

    const [sendInfo, setSendInfo] = useState<string>("");
    const [error, setError] = useState<ErrorType | undefined>(undefined);
    const [errorUser, setErrorUser] = useState<string>("");
    const [sumValue, setSumValue] = useState<string | number>("");
    const [user, setUser] = useState<boolean>(true);
    const [currency, setCurrency] = useState<CurrencyKey>("USDT");
    const [transaction, setTransaction] = useState<NetworkInfo | null>(null);
    const [isUserSel, setIsUserSel] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [sendUserRequest] = analyticsApi.useSetSendUserMutation();
    const [sendWalletRequest] = analyticsApi.useSetSendWalletMutation();

    const formattedAccountValue = masterAccount
        ? parseFloat(masterAccount.toString().replace(/[^\d.-]/g, "")).toLocaleString()
        : "0";

    const accountOption = `Основной счет: $ ${formattedAccountValue}`;

    useEffect(() => {
        const transactions = Infoes[currency] as NetworkInfo[];
        if (transactions.length > 0) {
            setTransaction(transactions[0]);
        }
    }, [currency]);

    const handleSendClick = async () => {
        if (isSubmitting) return;

        let isValid = true;

        if (!sendInfo.trim()) {
            setErrorUser("Заполните поле");
            isValid = false;
        }

        let sumAmount = 0;
        if (!sumValue.toString().trim()) {
            setError({ message: "Сумма не может быть пустой" });
            isValid = false;
        } else {
            sumAmount = typeof sumValue === "number"
                ? sumValue
                : parseFloat(sumValue.toString().replace(/\s/g, ""));

            if (isNaN(sumAmount) || sumAmount <= 0) {
                setError({ message: "Некорректная сумма" });
                isValid = false;
            } else if (sumAmount > (masterAccount || 0)) {
                setError({ message: `Недостаточно средств. Максимальная сумма: ${masterAccount}` });
                isValid = false;
            }
        }

        if (!isValid) return;

        setIsSubmitting(true);

        try {
            let response;
            if (user) {
                response = await sendUserRequest({
                    bodyData: {
                        outerUserId: sendInfo,
                        amount: sumAmount
                    }
                }).unwrap();
            } else {
                response = await sendWalletRequest({
                    bodyData: {
                        currencyFrom: "usd",
                        currencyTo: transaction?.currency || currency,
                        amount: sumAmount,
                        address: sendInfo
                    }
                }).unwrap();
            }

            if (response.success) {
                dispatch(
                    setOperationsList([
                        ...operationsArr,
                        {
                            id: `${Date.now()}`,
                            description: `Sent ${sumAmount} ${currency}`,
                            amount: sumAmount,
                            date: new Date().toISOString(),
                            transactionOperationId: `${Date.now()}`,
                            type: "SEND",
                            status: "DONE",
                        },
                    ])
                );

                setIsOpenSend(false);
                setSuccessInfo(true);
                setIsOpenSc(true);
            } else {
                throw new Error(response.message || "Ошибка при отправке запроса.");
            }
        } catch (error) {
            setError({ message: "Ошибка при отправке запроса. Попробуйте еще раз." });
            setSuccessInfo(false);
            setIsOpenSc(true);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <div className={styles.send}>
            <div className={styles.popUpProdBlock}>
                <div className={styles.popUpProdHeader}>
                    <p>Отправить</p>
                    <button onClick={() => setIsOpenSend(false)}>
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
                    <MainSelect
                        selectTitle="Счет:"
                        selectValue={accountOption}
                        setSelectValue={() => {
                        }}
                        dataSelect={[accountOption]}
                    />

                    <p className={styles.selectTitle}>{user ? "Пользователь" : "Кошелек"}:</p>
                    <div
                        className={`${styles.mainSelect} ${isUserSel ? styles.activeSelect : ""} ${errorUser ? styles.errorSelect : ""}`}>
                        <div className={styles.mainSelectSendInfo}>
                            <p className={styles.selectTitle}>{user ? "ID" : "AD"}</p>
                            <input
                                value={sendInfo}
                                onChange={(e) => {
                                    setErrorUser("");
                                    setSendInfo(e.target.value);
                                }}
                                type="text"
                                className={errorUser ? styles.errorInput : ""}
                                placeholder={""}
                            />
                        </div>
                        <img
                            onClick={() => setIsUserSel(!isUserSel)}
                            src="./images/angle.png"
                            alt=""
                            className={styles.selectArrow}
                        />
                        {isUserSel && (
                            <div className={styles.mainSelectItems}>
                                <div
                                    className={`${styles.selectItem} ${!user ? styles.active : ""}`}
                                    onClick={() => {
                                        setIsUserSel(false);
                                        setUser(false);
                                        setSendInfo("");
                                        setErrorUser("");
                                    }}
                                >
                                    <p>Кошелек</p>
                                </div>
                                <div
                                    className={`${styles.selectItem} ${user ? styles.active : ""}`}
                                    onClick={() => {
                                        setIsUserSel(false);
                                        setUser(true);
                                        setSendInfo("");
                                        setErrorUser("");
                                    }}
                                >
                                    <p>Пользователь</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {!user && (
                        <>
                            <MainSelect
                                selectTitle="Валюта:"
                                selectValue={currency}
                                setSelectValue={(value: string | AccountDetails) => {
                                    if (typeof value === "string") setCurrency(value as CurrencyKey);
                                }}
                                dataSelect={Object.keys(Infoes) as CurrencyKey[]}
                            />
                            <MainSelect
                                selectTitle="Сеть транзакции:"
                                selectValue={transaction?.name || ""}
                                setSelectValue={(value: string | AccountDetails) => setTransaction(value as NetworkInfo)}
                                dataSelect={Infoes[currency] as NetworkInfo[]}
                            />
                        </>
                    )}

                    <MainInput
                        setError={() => {}}
                        error={errorUser || error?.message}
                        title="Сумма перевода:"
                        sumValue={sumValue.toString()}
                        setSumValue={setSumValue}
                        type="money"
                        hideErrorMessage={true}
                    />

                    <div className={styles.popupContentButton} onClick={handleSendClick}>
                        <button>
                            <p>Отправить</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Send;