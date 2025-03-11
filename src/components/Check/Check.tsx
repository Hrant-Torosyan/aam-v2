import React, { useState } from "react";
import { useGetWalletsQuery, useSetPopUpStateMutation } from "src/store/analytics/analyticsAPI";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import styles from "./Check.module.scss";

interface CheckProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Check: React.FC<CheckProps> = ({ isOpen, setIsOpen }) => {
    const [selectedAccountType, setSelectedAccountType] = useState<string | null>(null);

    const {
        data: walletsData,
        isLoading: isLoadingWallets,
        error: walletsError
    } = useGetWalletsQuery();

    const [setPopUpState, { isLoading: isSettingPopUp }] = useSetPopUpStateMutation();

    if (isLoadingWallets) {
        return <div>Loading...</div>;
    }

    if (walletsError) {
        return <div>Error loading wallets data</div>;
    }

    const accounts = [
        { type: "MASTER", label: "Основной счет", balance: walletsData?.masterAccount || 0 },
        { type: "INVESTMENT", label: "Инвестиционный счет", balance: walletsData?.investmentAccount || 0 },
        { type: "AGENT", label: "Агентский счет", balance: walletsData?.agentAccount || 0 },
    ];

    const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);

    const handleSelect = async (account: { type: string; label: string; balance: number }) => {
        const percent = totalBalance > 0 ? Math.round((account.balance / totalBalance) * 100) : 0;

        await setPopUpState({
            isOpen: true,
            info: account.type,
            type: account.label,
            balance: account.balance,
            percent: percent
        });

        setSelectedAccountType(account.type);
        setIsOpen(true);
    };

    return (
        <div className={styles.checkBlock}>
            {accounts.map((account) => (
                <div className={styles.checkBlockItem} key={account.type}>
                    <p>{account.label}:</p>
                    <p>${account.balance.toLocaleString() || 0}</p>
                    <button
                        onClick={() => handleSelect(account)}
                        disabled={isSettingPopUp}
                    >
                        Подробнее
                    </button>
                </div>
            ))}

            <Swiper
                slidesPerView={2}
                spaceBetween={10}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className={styles.mySwiper}
            >
                {accounts.map((account) => (
                    <SwiperSlide key={account.type}>
                        <div className={styles.checkBlockItem}>
                            <p>{account.label}:</p>
                            <p>${account.balance.toLocaleString() || 0}</p>
                            <button
                                onClick={() => handleSelect(account)}
                                disabled={isSettingPopUp}
                            >
                                Подробнее
                            </button>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Check;