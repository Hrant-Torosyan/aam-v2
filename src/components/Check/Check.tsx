import React, { useState } from "react";
import { useDispatch, } from "react-redux";
import { setPopUpState } from "src/store/analytics/analyticsSlice";
import { useGetWalletsQuery } from "src/store/analytics/analyticsAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import styles from "./Check.module.scss";

interface CheckProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface Account {
    type: string;
    label: string;
    balance: number;
}

interface Operation {
    id: string;
    description: string;
    amount: number;
    date: string;
}

interface BalanceChartData {
    mainData: never[];
    data: never[];
    lab: never[];
    date: string;
    balance: number;
    profitability: number;
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
}

const Check: React.FC<CheckProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useDispatch();
    const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);

    const { data: walletsData, isLoading: isLoadingWallets, error: walletsError } = useGetWalletsQuery();

    const accounts: Account[] = [
        { type: "MASTER", label: "Основной счет", balance: walletsData?.masterAccount || 0 },
        { type: "INVESTMENT", label: "Инвестиционный счет", balance: walletsData?.investmentAccount || 0 },
        { type: "AGENT", label: "Агентский счет", balance: walletsData?.agentAccount || 0 },
    ];

    const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

    const handleSelect = (account: Account) => {
        setSelectedAccountType(account.type);

        const operationsData: Operation[] = [];
        const balanceChartData: BalanceChartData[] = [
            {
                mainData: [],
                profitability: 0,
                data: [],
                lab: [],
                balance: account.balance,
                date: new Date().toISOString(),
                masterAccount: walletsData?.masterAccount || 0,
                investmentAccount: walletsData?.investmentAccount || 0,
                agentAccount: walletsData?.agentAccount || 0,
            },
        ];

        const balance = account.balance;
        const percent = totalBalance > 0 ? Math.round((balance / totalBalance) * 100) : 0;

        dispatch(
            setPopUpState({
                isOpen: true,
                info: account.type,
                type: account.label,
                balance: balance,
                percent: percent,
                operations: operationsData,
                balanceChartData: balanceChartData,
            })
        );
        setIsOpen(true);
    };

    return (
        <div className={styles.checkBlock}>
            <Swiper slidesPerView={3} spaceBetween={10} className={styles.swiperContainer}>
                {accounts.map((account) => (
                    <SwiperSlide key={account.type} className={styles.swiperSlide}>
                        <div className={styles.checkBlockItem}>
                            <p>{account.label}</p>
                            <p>${account.balance.toLocaleString()}</p>
                            <button onClick={() => handleSelect(account)}>Подробнее</button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Check;