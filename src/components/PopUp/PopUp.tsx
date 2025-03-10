import React, { useState, useEffect } from "react";
import styles from "./PopUp.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setPopUpState } from "src/store/analytics/analyticsSlice";
import { useGetOperationsListQuery, useGetBalanceChartQuery } from "src/store/analytics/analyticsAPI";
import Operations from "../Operations/Operations";
import LineChartComponent from "src/components/LineChart/LineChart";
import Select from "src/components/Select/Select";

const PopUp: React.FC = () => {
    const dispatch = useDispatch();
    const popUpState = useSelector((state: RootState) => state.analytics.popUp);

    const [selectValue, setSelectValue] = useState<string>('WEEKLY');
    const [showOperationsList, setShowOperationsList] = useState<number | null>(3);

    const { data: operationsData, isLoading: operationsLoading } = useGetOperationsListQuery({
        accountType: popUpState.info ?? undefined,
        pageNumber: showOperationsList || undefined,
    });

    const { data: balanceChartDataResponse, isLoading: chartLoading } = useGetBalanceChartQuery({
        period: selectValue,
        accountType: popUpState.info ?? undefined,
    });

    useEffect(() => {
        if (!operationsData || !balanceChartDataResponse) return;

        const processedBalanceChartData = Array.isArray(balanceChartDataResponse)
            ? balanceChartDataResponse
            : [balanceChartDataResponse];

        const balance = processedBalanceChartData[0]?.masterAccount || 0;
        const totalBalance = popUpState.balance;
        const percent = totalBalance > 0 ? Math.round((balance / totalBalance) * 100) : 0;

        const balanceChartData = processedBalanceChartData.map(item => ({
            mainData: item.mainData ?? [],
            profitability: item.profitability,
            data: item.data ?? [],
            lab: item.lab ?? [],
            masterAccount: item.masterAccount,
            investmentAccount: item.investmentAccount,
            agentAccount: item.agentAccount,
            date: item.date ?? '',
            balance: item.balance ?? 0,
        }));

        const operations = operationsData.transactionOperationsContent.content.map((operation: any) => ({
            transactionOperationId: operation.transactionOperationId,
            type: operation.type,
            date: operation.date,
            amount: operation.amount,
            status: operation.status,
            id: operation.id || '',
            description: operation.description || '',
        }));

        dispatch(setPopUpState({
            ...popUpState,
            operations,
            balanceChartData,
            balance,
            percent,
        }));
    }, [balanceChartDataResponse, operationsData, dispatch]);

    const handleClose = () => {
        dispatch(setPopUpState({
            isOpen: false,
            info: null,
            type: '',
            balance: 0,
            percent: 0,
            operations: [],
            balanceChartData: [],
        }));
    };

    const handleOpenReplenish = () => {
        handleClose();

        setTimeout(() => {
            const event = new CustomEvent('openReplenishPopup');
            window.dispatchEvent(event);
        }, 50);
    };

    const handleOpenTransfer = () => {
        handleClose();

        setTimeout(() => {
            const event = new CustomEvent('openTransferPopup');
            window.dispatchEvent(event);
        }, 50);
    };

    const handleOpenSend = () => {
        handleClose();

        setTimeout(() => {
            const event = new CustomEvent('openSendPopup');
            window.dispatchEvent(event);
        }, 50);
    };

    if (!popUpState.isOpen) return null;

    const safeBalanceChartData = {
        mainData: popUpState.balanceChartData?.[0]?.mainData ?? [],
        profitability: popUpState.balanceChartData?.[0]?.profitability ?? 0,
        data: popUpState.balanceChartData?.[0]?.data ?? [],
        lab: popUpState.balanceChartData?.[0]?.lab ?? [],
        masterAccount: popUpState.balanceChartData?.[0]?.masterAccount ?? 0,
        investmentAccount: popUpState.balanceChartData?.[0]?.investmentAccount ?? 0,
        agentAccount: popUpState.balanceChartData?.[0]?.agentAccount ?? 0,
        date: popUpState.balanceChartData?.[0]?.date ?? '',
        balance: popUpState.balance,
    };

    const operationsCount = operationsData?.transactionOperationsContent?.totalElements || 0;

    return (
        <div className={styles.popup}>
            <div className={styles.popupBlock}>
                <div className={styles.popupHeader}>
                    <p>{popUpState.type}</p>
                    <button onClick={handleClose}>
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
                <div className={styles.popupContent}>
                    <div className={styles.popupContentList}>
                        <div className={styles.popupContentListInfo}>
                            <p>
                                Баланс: <span>${popUpState.balance}</span>
                            </p>
                            <p>
                                Доля от общего баланса: <span>{popUpState.percent}%</span>
                            </p>
                            <p>
                                Кол-во операций за месяц: <span>{operationsCount}</span>
                            </p>
                        </div>
                        <Operations
                            count={6}
                            showOperationsList={showOperationsList}
                            setShowOperationsList={setShowOperationsList}
                        />
                    </div>
                   <div className={styles.chartSelect}>
                       <Select value={selectValue} onChange={setSelectValue} className={`${styles.selected} ${styles.customClassName}`} />
                       <LineChartComponent
                           balanceChartData={safeBalanceChartData}
                           selectValue={selectValue}
                           className={styles.chart}
                       />
                   </div>
                    <div className={styles.popupContentList}>
                        <div className={styles.popupContentButton} onClick={handleOpenReplenish}>
                            <button>
                                <p>Пополнить</p>
                            </button>
                        </div>
                        {popUpState.info === "MASTER" && (
                            <div className={styles.popupContentButton} onClick={handleOpenSend}>
                                <button>
                                    <p>Отправить</p>
                                </button>
                            </div>
                        )}
                        <div className={styles.popupContentButton} onClick={handleOpenTransfer}>
                            <button>
                                <p>Перевести</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PopUp;