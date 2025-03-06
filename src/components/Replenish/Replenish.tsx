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
    walletsData: any;
    setSuccessInfo: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenSc: React.Dispatch<React.SetStateAction<boolean>>;
}

const Replenish: React.FC<Props> = ({
    setIsOpenReplenish,
    walletsData,
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
                    <button onClick={() => setIsOpenReplenish(false)}>X</button>
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
                                selectValue={transaction || { name: "" }}
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
                            />

                            <button onClick={handleReplenish}>Пополнить</button>
                        </>
                    ) : (
                        <div className={styles.popUpProdContentQr}>
                            <QRCode value={replenishData?.payAddress || ""} />
                            <p>Для оплаты переведите эту сумму: {replenishData?.payAmount} {replenishData?.payCurrency}</p>
                            <p>{replenishData?.payAddress}</p>

                            <CopyOnClick text={replenishData?.payAddress || ""}>
                                <button onClick={handleCopy}>{copied ? "✔" : "📋"}</button>
                            </CopyOnClick>

                            <p>Оставшееся время: {formatTime(remainingTime)}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Replenish;