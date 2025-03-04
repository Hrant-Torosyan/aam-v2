import React, { useEffect, useState } from "react";
import { formatNumber } from "src/utils/formatNumber";
import { useGetOperationsListItemQuery } from "src/store/analytics/analyticsAPI";
import styles from './OperationPopUp.module.scss';

const infoes = {
    USTD: [
        { min_amount: 8, max_amount: 2886, currency: "usdcmatic", name: "Matic Network" },
        { min_amount: 9, max_amount: 579, currency: "usddbsc", name: "Arbitrum Network" },
        { min_amount: 10, max_amount: 76798, currency: "usdttrc20", name: "TRON Network" },
        { min_amount: 11, max_amount: 76798, currency: "usdterc20", name: "Ethereum Network" },
        { min_amount: 9, max_amount: 23089, currency: "usdtbsc", name: "Binance Smart Chain Network" },
        { min_amount: 69, max_amount: 16072, currency: "usdtsol", name: "Solana Network" },
        { min_amount: 8, max_amount: 2889, currency: "usdtalgo", name: "Algorand Network" },
    ],
    BTC: [{ min_amount: 0.0001783, max_amount: 1.26359284, currency: "btc", name: "Bitcoin" }],
    ETH: [
        { min_amount: 1, max_amount: 26, currency: "eth", name: "ETH" },
        { min_amount: 0.0031139, max_amount: 5, currency: "ethbsc", name: "ETHBSC" },
        { min_amount: 0.0029608, max_amount: 0.85378951, currency: "etharb", name: "ETHArb" },
    ],
};

interface OperationPopUpProps {
    setIsActive: (active: boolean) => void;
    operationId: string;
}

const OperationPopUp: React.FC<OperationPopUpProps> = ({ setIsActive, operationId }) => {
    const { data: operationData } = useGetOperationsListItemQuery({ id: operationId });
    const [operationWallet, setOperationWallet] = useState<string | null>(null);

    useEffect(() => {
        if (operationData) {
            const { type, depositCurrencyFrom, withdrawalCurrencyFrom } = operationData;
            const getWalletType = (currency: string) => {
                if (infoes.ETH.some((item) => item.currency === currency)) return "ETH";
                if (infoes.BTC.some((item) => item.currency === currency)) return "BTC";
                return "USTD";
            };

            setOperationWallet(
                type === "DEPOSITS"
                    ? getWalletType(depositCurrencyFrom)
                    : type === "WITHDRAWALS"
                        ? getWalletType(withdrawalCurrencyFrom)
                        : null
            );
        }
    }, [operationData]);

    return (
        operationData && (
            <div className={styles.operationPopUp}>
                <div className={styles.operationHeader}>
                    <h3>{operationData.status}</h3>
                    <button onClick={() => setIsActive(false)}>Close</button>
                </div>
                <div className={styles.operationDetails}>
                    <p>Amount: {formatNumber(operationData.amount)} {operationWallet}</p>
                    <p>Status: {operationData.status}</p>
                    {operationData.type === "DEPOSITS" && (
                        <>
                            <p>Deposit Currency: {operationData.depositCurrencyFrom}</p>
                            <p>Deposit Address: {operationData.depositAddress}</p>
                        </>
                    )}
                    {operationData.type === "WITHDRAWALS" && (
                        <>
                            <p>Withdrawal Currency: {operationData.withdrawalCurrencyFrom}</p>
                            <p>Withdrawal Address: {operationData.withdrawalAddress}</p>
                        </>
                    )}
                    {operationData.projectTitle && (
                        <>
                            <p>Project Title: {operationData.projectTitle}</p>
                            <p>Project Term: {operationData.projectTerm}</p>
                            <p>Project Period: {operationData.projectPeriod}</p>
                        </>
                    )}
                </div>
            </div>
        )
    );
};

export default OperationPopUp;