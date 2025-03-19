import React, { useState, useEffect, useMemo } from "react";
import Check from "src/components/Check/Check";
import PopUp from "src/components/PopUp/PopUp";
import Operations from "src/components/Operations/Operations";
import IsSuccessful from "src/components/IsSuccessful/IsSuccessful";
import Transfer from "src/components/PopUp/Transfer/Transfer";
import Replenish from "src/components/PopUp/Replenish/Replenish";
import Send from "src/components/PopUp/Send/Send";
import { useGetWalletsQuery } from "src/store/analytics/analyticsAPI";
import Loader from "src/ui/Loader/Loader";
import styles from "./Wallet.module.scss";

const Wallet: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activePopup, setActivePopup] = useState<string | null>(null);
    const [showOperationsList, setShowOperationsList] = useState<number | null>(null);
    const [isOpenSc, setIsOpenSc] = useState(false);
    const [successInfo, setSuccessInfo] = useState(true);

    const { data: walletsData, isLoading: isLoadingWallets } = useGetWalletsQuery();

    const isLoading = isLoadingWallets;

    useEffect(() => {
        const handleOpenPopup = (event: Event) => {
            const customEvent = event as CustomEvent;
            setActivePopup(customEvent.detail);
        };

        window.addEventListener("openPopup", handleOpenPopup);
        return () => {
            window.removeEventListener("openPopup", handleOpenPopup);
        };
    }, []);

    useEffect(() => {
        setIsOpen(!!activePopup || isOpenSc);
    }, [activePopup, isOpenSc]);

    const totalBalance = useMemo(() => {
        return (
            (walletsData?.masterAccount ?? 0) +
            (walletsData?.investmentAccount ?? 0) +
            (walletsData?.agentAccount ?? 0)
        );
    }, [walletsData]);

    if (isLoading) {
        return <div className={styles.loader}><Loader /></div>;
    }

    return (
        <div className={styles.wallet}>
            {isOpenSc && (
                <IsSuccessful
                    setIsOpenTransfer={() => setActivePopup(null)}
                    info={successInfo}
                    delay={1000}
                    setIsOpen={setIsOpenSc}
                />
            )}

            {isOpen && <PopUp />}

            {activePopup === "Replenish" && (
                <Replenish
                    setIsOpenSc={setIsOpenSc}
                    walletsData={walletsData}
                    setIsOpenReplenish={() => setActivePopup(null)}
                    setSuccessInfo={setSuccessInfo}
                />
            )}

            {activePopup === "Send" && (
                <Send
                    setIsOpenSc={setIsOpenSc}
                    setIsOpenSend={() => setActivePopup(null)}
                    setSuccessInfo={setSuccessInfo}
                />
            )}

            {activePopup === "Transfer" && walletsData && totalBalance > 0 && (
                <Transfer
                    setIsOpenSc={setIsOpenSc}
                    setIsOpenTransfer={() => setActivePopup(null)}
                />
            )}

            <div className={styles.walletTitle}>
                <h1>Кошелек</h1>
                <div className={styles.walletButtons}>
                    <div className={styles.walletBalance}>
                        ${totalBalance.toLocaleString()}
                    </div>
                    <div className={styles.walletButton}>
                        <button onClick={() => setActivePopup("Replenish")}>
                            Пополнить
                        </button>
                    </div>
                    <div className={styles.walletButton}>
                        <button onClick={() => setActivePopup("Transfer")}>
                            Перевести
                        </button>
                    </div>
                    <div className={styles.walletButton}>
                        <button onClick={() => setActivePopup("Send")}>
                            Отправить
                        </button>
                    </div>
                </div>
            </div>

            <Check isOpen={isOpen} setIsOpen={setIsOpen} />

            <Operations
                count={6}
                showOperationsList={showOperationsList}
                setShowOperationsList={setShowOperationsList}
            />
        </div>
    );
};

export default Wallet;