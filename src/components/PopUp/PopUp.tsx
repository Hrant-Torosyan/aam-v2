import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {
    setPopUpState,
    BalanceChartData as SliceBalanceChartData,
    ProcessedBalanceChart as SliceProcessedBalanceChart
} from 'src/store/analytics/analyticsSlice';
import { useGetOperationsListQuery, useGetBalanceChartQuery } from 'src/store/analytics/analyticsAPI';
import Operations from '../Operations/Operations';
import LineChartComponent from 'src/components/LineChart/LineChart';
import styles from './PopUp.module.scss';

interface ProcessedBalanceChart extends SliceProcessedBalanceChart {
    data: number[] | [];
    lab: string[] | [];
    masterAccount: number;
    investmentAccount: number;
    agentAccount: number;
    mainData?: { month: string; average: number }[] | [];
    date?: string;
    balance?: number;
}

interface BalanceChartData extends Omit<SliceBalanceChartData, 'mainData' | 'data' | 'lab'> {
    mainData: any[];
    data: any[];
    lab: any[];
}

const PopUp: React.FC = () => {
    const dispatch = useDispatch();
    const popUpState = useSelector((state: RootState) => state.analytics.popUp);

    const processedRef = useRef<boolean>(false);

    const [selectValue, setSelectValue] = useState<string>('WEEKLY');
    const [showOperationsList, setShowOperationsList] = useState<number | null>(3);

    const { data: operationsData } = useGetOperationsListQuery({
        accountType: popUpState.info ?? undefined,
        pageNumber: showOperationsList ?? 3,
    });

    const { data: balanceChartDataResponse } = useGetBalanceChartQuery({
        period: selectValue,
        accountType: popUpState.info ?? undefined,
    });

    useEffect(() => {
        if (!operationsData || !balanceChartDataResponse || processedRef.current) {
            return;
        }

        processedRef.current = true;

        try {
            const processedBalanceChartData = (Array.isArray(balanceChartDataResponse)
                ? balanceChartDataResponse
                : [balanceChartDataResponse]) as unknown as ProcessedBalanceChart[];

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
            })) as unknown as SliceBalanceChartData[];

            dispatch(setPopUpState({
                ...popUpState,
                operations: operationsData,
                balanceChartData,
                balance,
                percent,
            }));
        } catch (error) {
            console.error("Error processing data:", error);
        }
    }, [balanceChartDataResponse, operationsData, dispatch]);

    useEffect(() => {
        processedRef.current = false;
    }, [balanceChartDataResponse, operationsData]);

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
        dispatch(setPopUpState({
            isOpen: false,
            info: null,
            type: '',
            balance: 0,
            percent: 0,
            operations: [],
            balanceChartData: [],
        }));

        const event = new CustomEvent('openReplenishPopup');
        window.dispatchEvent(event);
    };

    if (!popUpState.isOpen) return null;

    const safeBalanceChartData: BalanceChartData = {
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

    return (
        <div className={styles.popup} onClick={handleClose}>
            <div className={styles.popupBlock} onClick={(e) => e.stopPropagation()}>
                <div className={styles.popupHeader}>
                    <p>{popUpState.type || 'Информация'}</p>
                    <button onClick={handleClose}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.8366 9.17188L9.16992 20.8386M9.16995 9.17188L20.8366 20.8386" stroke="#00B4D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className={styles.popupContent}>
                    <div className={styles.popupContentList}>
                        <p>Баланс: <span>${popUpState.balance}</span></p>
                        <p>Доля от общего баланса: <span>{popUpState.percent}%</span></p>
                        <p>Операции за месяц: <span>{popUpState.operations.length || 0}</span></p>
                        <Operations count={3} showOperationsList={showOperationsList ?? 3} setShowOperationsList={setShowOperationsList} />
                    </div>

                    <LineChartComponent balanceChartData={safeBalanceChartData} selectValue={selectValue} />

                    <div className={styles.popupContentList}>
                        <div
                            onClick={handleOpenReplenish}
                            className={styles.popupContentButton}
                        >
                            <button>
                                <p>Пополнить</p>
                            </button>
                        </div>

                        <div
                            onClick={() => {
                                dispatch(setPopUpState({ isOpen: false, info: null, type: '', balance: 0, percent: 0, operations: [], balanceChartData: [] }));
                            }}
                            className={styles.popupContentButton}
                        >
                            <button>
                                <p>Отправить</p>
                            </button>
                        </div>

                        <div
                            onClick={() => {
                                dispatch(setPopUpState({ isOpen: false, info: null, type: '', balance: 0, percent: 0, operations: [], balanceChartData: [] }));
                            }}
                            className={styles.popupContentButton}
                        >
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