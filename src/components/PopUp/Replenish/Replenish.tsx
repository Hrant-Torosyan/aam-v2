import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import MainSelect from "src/ui/MainSelect/MainSelect";
import MainInput from "src/ui/MainInput/MainInput";
import CopyOnClick from "src/utils/copyOnClick";
import styles from "./Replenish.module.scss";
import { useSetReplenishMutation, useGetReplenishMinMaxQuery } from "src/store/analytics/analyticsAPI";
import {Infoes} from "./Infoes";

type CurrencyKey = "USDT" | "BTC" | "ETH";


interface AccountDetails {
    name: string;
    currency?: string;
    min_amount?: number;
    max_amount?: number;
}

interface Props {
    setIsOpenReplenish: React.Dispatch<React.SetStateAction<boolean>>;
    setSuccessInfo: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenSc: React.Dispatch<React.SetStateAction<boolean>>;
}

const Replenish: React.FC<Props> = ({
    setIsOpenReplenish,
    setSuccessInfo,
    setIsOpenSc,
}) => {
    const [currency, setCurrency] = useState<CurrencyKey>("USDT");
    const [transaction, setTransaction] = useState<AccountDetails | null>(null);
    const [sumValue, setSumValue] = useState<string>("");
    const [minMax, setMinMax] = useState<{ min: number; max: number } | null>(null);
    const [next, setNext] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const [remainingTime, setRemainingTime] = useState<number>(1200);
    const [isActive, setIsActive] = useState<boolean>(false);
    const [replenishData, setReplenishData] = useState<any>(null);
    const [copied, setCopied] = useState<boolean>(false);

    const [setReplenish] = useSetReplenishMutation();
    const { data: minMaxData } = useGetReplenishMinMaxQuery(
        { currencyFrom: "usd", currencyTo: transaction?.currency || "" },
        { skip: !transaction?.currency }
    );

    useEffect(() => {
        if (Infoes[currency] && Infoes[currency].length > 0) {
            setTransaction(Infoes[currency][0]);
        }
    }, []);

    useEffect(() => {
        if (Infoes[currency] && Infoes[currency].length > 0) {
            setTransaction(Infoes[currency][0]);
        }
    }, [currency]);

    useEffect(() => {
        if (transaction?.currency && minMaxData) {
            setMinMax({
                min: minMaxData.minAmountFrom,
                max: minMaxData.maxAmountFrom,
            });
        } else if (transaction?.min_amount !== undefined && transaction?.max_amount !== undefined) {
            setMinMax({
                min: transaction.min_amount,
                max: transaction.max_amount,
            });
        }
    }, [transaction, minMaxData]);

    useEffect(() => {
        let interval: NodeJS.Timeout | undefined;
        if (isActive) {
            interval = setInterval(() => {
                setRemainingTime((prev) => {
                    if (prev === 0) {
                        setIsActive(false);
                        if (interval) clearInterval(interval);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isActive]);

    const handleCurrencyChange = (val: string | AccountDetails) => {
        const selectedCurrency = typeof val === "string" ? val : val.name;
        if (isValidCurrencyKey(selectedCurrency)) {
            setCurrency(selectedCurrency);
        }
    };

    function isValidCurrencyKey(key: string): key is CurrencyKey {
        return key === "USDT" || key === "BTC" || key === "ETH";
    }

    const handleTransactionChange = (val: string | AccountDetails) => {
        if (typeof val === "object") {
            setTransaction(val);
        }
    };

    const getCurrencyOptions = (): Array<string> => {
        return Object.keys(Infoes) as CurrencyKey[];
    };

    const getTransactionOptions = (): Array<AccountDetails> => {
        return Infoes[currency] || [];
    };

    const handleReplenish = async () => {
        if (!transaction || !transaction.currency) {
            setError("Ошибка: нет выбранной транзакции.");
            return;
        }

        const sumAmount = parseFloat(sumValue.replace(/\s/g, ""));
        if (!sumValue.trim()) {
            setError("Заполните поле");
            return;
        } else if (
            !sumAmount ||
            (minMax && (sumAmount < minMax.min || sumAmount > minMax.max))
        ) {
            setError("Сумма вне допустимого диапазона");
            return;
        }

        try {
            const res = await setReplenish({
                bodyData: {
                    amount: sumAmount,
                    currencyFrom: "usd",
                    currencyTo: transaction.currency
                },
            });

            if ('data' in res && res.data?.paymentStatus) {
                setIsActive(true);
                setNext(false);
                setReplenishData(res.data);
            } else {
                setIsOpenReplenish(false);
                setSuccessInfo(false);
                setIsOpenSc(true);
            }
        } catch (err) {
            setError("Произошла ошибка. Попробуйте снова.");
        }
    };

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div className={styles.replenish}>
            <div className={styles.popUpProdBlock}>
                <div className={styles.popUpProdHeader}>
                    <p>Пополнить</p>
                    <button onClick={() => setIsOpenReplenish(false)}>
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
                    {next ? (
                        <>
                            <MainSelect
                                selectTitle="Валюта:"
                                selectValue={currency}
                                setSelectValue={handleCurrencyChange}
                                dataSelect={getCurrencyOptions()}
                            />

                            <MainSelect
                                selectTitle="Сеть транзакции:"
                                selectValue={transaction || {name: ""}}
                                setSelectValue={handleTransactionChange}
                                dataSelect={getTransactionOptions()}
                            />

                            <MainInput
                                max={minMax ? Math.floor(minMax.max) : undefined}
                                min={minMax ? Math.ceil(minMax.min) : undefined}
                                setError={setError}
                                error={error}
                                title={"Сумма пополнения:"}
                                sumValue={sumValue}
                                setSumValue={setSumValue}
                                type={"money"}
                                hideErrorMessage={true}
                            />

                            <div className={styles.popupContentButton} onClick={handleReplenish}>
                                <button>
                                    <p>Пополнить</p>
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className={styles.popUpProdContentQr}>
                            <div className={styles.popUpProdContentQrBlock}>
                                <QRCode value={replenishData?.payAddress} />
                            </div>

                            <div className={styles.popUpProdContentQrInfo}>
                                <div className={styles.popUpProdContentQrInfoItem}>
                                    <p>Для оплаты переведите эту сумму:</p>
                                    <div className={styles.popUpProdContentQrInfoItemBlock}>
                                        <p>
                                            {replenishData?.payAmount} {replenishData?.payCurrency}{" "}
                                            <span>
                        ≈ {replenishData?.amountReceived}{" "}
                                                {replenishData?.priceCurrency.toUpperCase()}{" "}
                    </span>
                                        </p>
                                    </div>
                                </div>

                                <div className={styles.popUpProdContentQrInfoItem}>
                                    <p>Для оплаты переведите эту сумму:</p>
                                    <div className={styles.popUpProdContentQrInfoItemBlock}>
                                        <p>{replenishData?.payAddress}</p>
                                        <CopyOnClick text={replenishData?.payAddress}>
                                            <button onClick={handleCopy}>
                                                {copied ? (
                                                    <svg className="coped" xmlns="http://www.w3.org/2000/svg" width={24} height={24}>
                                                        <path d="M9 16.17 5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} fill="none">
                                                        <defs>
                                                            <clipPath id="a">
                                                                <path fill="#fff" fillOpacity={0} d="M0 0h24v24H0z" />
                                                            </clipPath>
                                                        </defs>
                                                        <g clipPath="url(#a)">
                                                            <path
                                                                stroke="#96C5F9"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={1.5}
                                                                d="M10.07 7c.31-3.03 1.77-4 5.43-4C19.7 3 21 4.29 21 8.5c0 3.65-.99 5.11-4 5.43M8.5 10c4.2 0 5.5 1.29 5.5 5.5 0 4.2-1.3 5.5-5.5 5.5C4.29 21 3 19.7 3 15.5 3 11.29 4.29 10 8.5 10Z"
                                                            />
                                                        </g>
                                                    </svg>
                                                )}
                                            </button>
                                        </CopyOnClick>
                                    </div>
                                </div>
                                <div className={styles.timeLine}>
                                    <div className={styles.timeLineItem}>
                                        <div
                                            style={{
                                                width: Math.ceil((remainingTime * 100) / 1200) + "%",
                                            }}
                                            className={styles.timeLineItemInfo}
                                        ></div>
                                    </div>
                                    <div className={styles.timeInfo}>{formatTime(remainingTime)}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Replenish;