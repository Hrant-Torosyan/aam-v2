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
    const [isOpenReplenish, setIsOpenReplenish] = useState<boolean>(false);
    const [isOpenSend, setIsOpenSend] = useState<boolean>(false);
    const [isOpenTransfer, setIsOpenTransfer] = useState<boolean>(false);

    const { data: walletsData, isLoading: isLoadingWallets } = useGetWalletsQuery();

    const isLoading = isLoadingWallets;

    useEffect(() => {
        const handleOpenReplenish = () => {
            setIsOpenReplenish(true);
            setActivePopup("Replenish");
        };

        const handleOpenTransfer = () => {
            setIsOpenTransfer(true);
            setActivePopup("Transfer");
        };

        const handleOpenSend = () => {
            setIsOpenSend(true);
            setActivePopup("Send");
        };

        // Listen for both the general popup event and specific popup events
        const handleOpenPopup = (event: Event) => {
            const customEvent = event as CustomEvent;
            setActivePopup(customEvent.detail);
        };

        window.addEventListener("openPopup", handleOpenPopup);
        window.addEventListener("openReplenishPopup", handleOpenReplenish);
        window.addEventListener("openTransferPopup", handleOpenTransfer);
        window.addEventListener("openSendPopup", handleOpenSend);

        return () => {
            window.removeEventListener("openPopup", handleOpenPopup);
            window.removeEventListener("openReplenishPopup", handleOpenReplenish);
            window.removeEventListener("openTransferPopup", handleOpenTransfer);
            window.removeEventListener("openSendPopup", handleOpenSend);
        };
    }, []);

    useEffect(() => {
        setIsOpen(!!activePopup || isOpenSc || isOpenReplenish || isOpenSend || isOpenTransfer);
    }, [activePopup, isOpenSc, isOpenReplenish, isOpenSend, isOpenTransfer]);

    useEffect(() => {
        if (activePopup === "Replenish") {
            setIsOpenReplenish(true);
            setIsOpenSend(false);
            setIsOpenTransfer(false);
        } else if (activePopup === "Send") {
            setIsOpenSend(true);
            setIsOpenReplenish(false);
            setIsOpenTransfer(false);
        } else if (activePopup === "Transfer") {
            setIsOpenTransfer(true);
            setIsOpenReplenish(false);
            setIsOpenSend(false);
        } else if (activePopup === null) {
            setIsOpenReplenish(false);
            setIsOpenSend(false);
            setIsOpenTransfer(false);
        }
    }, [activePopup]);

    const totalBalance = useMemo(() => {
        return (
            (walletsData?.masterAccount ?? 0) +
            (walletsData?.investmentAccount ?? 0) +
            (walletsData?.agentAccount ?? 0)
        );
    }, [walletsData]);

    const dispatchOpenReplenish = () => {
        window.dispatchEvent(new CustomEvent("openReplenishPopup"));
    };

    const dispatchOpenTransfer = () => {
        window.dispatchEvent(new CustomEvent("openTransferPopup"));
    };

    const dispatchOpenSend = () => {
        window.dispatchEvent(new CustomEvent("openSendPopup"));
    };

    if (isLoading) {
        return <div className={styles.loader}><Loader /></div>;
    }

    return (
        <div className={styles.wallet}>
            {isOpenSc && (
                <IsSuccessful
                    setIsOpenTransfer={() => {
                        setActivePopup(null);
                        setIsOpenTransfer(false);
                    }}
                    info={successInfo}
                    delay={1000}
                    setIsOpen={setIsOpenSc}
                />
            )}

            {isOpen && <PopUp />}

            {isOpenReplenish && (
                <Replenish
                    setIsOpenSc={setIsOpenSc}
                    setIsOpenReplenish={(value) => {
                        if (!value) setActivePopup(null);
                        setIsOpenReplenish(value);
                    }}
                    setSuccessInfo={setSuccessInfo}
                />
            )}

            {isOpenSend && (
                <Send
                    setIsOpenSc={setIsOpenSc}
                    setIsOpenSend={(value) => {
                        if (!value) setActivePopup(null);
                        setIsOpenSend(value);
                    }}
                    setSuccessInfo={setSuccessInfo}
                />
            )}

            {isOpenTransfer && walletsData && totalBalance > 0 && (
                <Transfer
                    setIsOpenSc={setIsOpenSc}
                    setIsOpenTransfer={(value) => {
                        if (!value) setActivePopup(null);
                        setIsOpenTransfer(value);
                    }}
                />
            )}

            <div className={styles.walletTitle}>
                <h1>Кошелек</h1>
                <div className={styles.walletButtons}>
                    <div className={styles.walletBalance}>
                        ${totalBalance.toLocaleString()}
                    </div>
                    <div className={styles.walletButton}>
                        <button onClick={dispatchOpenReplenish}>
                            Пополнить
                        </button>
                    </div>
                    <div className={styles.walletButton}>
                        <button onClick={dispatchOpenTransfer}>
                            Перевести
                        </button>
                    </div>
                    <div className={styles.walletButton}>
                        <button onClick={dispatchOpenSend}>
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
                className={styles.walletList}
            />
        </div>
    );
};

export default Wallet;