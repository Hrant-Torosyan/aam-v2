import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Swiper, SwiperSlide } from "swiper/react";
import { RootState } from "src/store/store";
import { setSelectValue } from "src/store/analytics/analyticsSlice";
import "swiper/css";
import styles from "./Check.module.scss";
import { useGetWalletsQuery } from "src/store/analytics/analyticsAPI";

interface CheckProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Check: React.FC<CheckProps> = ({ isOpen, setIsOpen }) => {
    const dispatch = useDispatch();
    const { data: walletsData, isLoading: isLoadingWallets, error: walletsError } = useGetWalletsQuery();
    const { loading, analyticsData } = useSelector((state: RootState) => state.analytics);

    if (isLoadingWallets) return <p>Loading wallets data...</p>;
    if (walletsError) return <p>Error: {(walletsError as any).message || "Unknown error"}</p>;
    if (!walletsData || !analyticsData || loading) return null;

    const accounts = [
        { type: "MASTER", label: "Основной счет:", balance: walletsData.masterAccount || 0 },
        { type: "INVESTMENT", label: "Инвестиционный счет:", balance: walletsData.investmentAccount || 0 },
        { type: "AGENT", label: "Агентский счет:", balance: walletsData.agentAccount || 0 },
    ];

    const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

    const calculatePercentage = (balance: number) =>
        totalBalance > 0 ? Math.round((balance / totalBalance) * 100) : 0;

    const handleSelect = (accountType: string, label: string, balance: number) => {
        dispatch(
            setSelectValue({
                info: accountType,
                type: label,
                balance,
                percent: calculatePercentage(balance),
                color: "rgb(0, 180, 210)",
                bg: "rgba(0, 180, 210, 0.2)",
            })
        );
    };

    return (
        <div className={styles.checkBlock}>

            <Swiper slidesPerView="3" spaceBetween={10} className={styles.swiperContainer}>
                {accounts.map(({ type, label, balance }) => (
                    <SwiperSlide key={type} className={styles.swiperSlide}>
                        <div className={styles.checkBlockItem}>
                            <p>{label}</p>
                            <p>${balance.toLocaleString()}</p>
                            <button onClick={() => handleSelect(type, label, balance)}>Подробнее</button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Check;