import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectValue } from 'src/store/analytics/analyticsSlice';
import { RootState } from 'src/store/store';
import {
    useGetWalletsQuery,
    useGetOperationsListQuery,
    useGetBalanceChartQuery
} from 'src/store/analytics/analyticsAPI';
import Loader from 'src/ui/Loader/Loader';
import Select from 'src/components/Select/Select';
import LineChart from 'src/components/LineChart/LineChart';

import styles from './Analytics.module.scss';

const Analytics: React.FC = () => {
    const dispatch = useDispatch();
    const selectValue = useSelector((state: RootState) => state.analytics.selectValue);
    const [refresh, setRefresh] = useState(0);

    const colorsArr = useMemo(() => ['#348EF1', '#E54D64', '#FFB100'], []);

    useEffect(() => {
        if (!selectValue) {
            dispatch(setSelectValue('WEEKLY'));
        }
    }, [dispatch, selectValue]);

    const { data: walletsData, isLoading: isLoadingWallets, refetch: refetchWallets } = useGetWalletsQuery();
    const { data: operationsListData, isLoading: isLoadingOperationsList, refetch: refetchOperationsList } = useGetOperationsListQuery({
        accountType: 'all',
        pageNumber: 1,
    });
    const { data: balanceChartData, isLoading: isLoadingBalanceChart, refetch: refetchBalanceChart } = useGetBalanceChartQuery({
        period: selectValue,
        refresh,
    });

    const dateNow = useMemo(() => {
        return new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }, [refresh]);

    const handleRefresh = useCallback(() => {
        setRefresh((prev) => prev + 1);
    }, []);

    const totalBalance = useMemo(() => {
        return [
            walletsData?.masterAccount ?? 0,
            walletsData?.investmentAccount ?? 0,
            walletsData?.agentAccount ?? 0,
        ].reduce((sum, account) => sum + account, 0);
    }, [walletsData]);

    useEffect(() => {
        if (refresh > 0) {
            refetchWallets();
            refetchOperationsList();
            refetchBalanceChart();
        }
    }, [refresh, refetchWallets, refetchOperationsList, refetchBalanceChart]);

    if (isLoadingWallets || isLoadingOperationsList || isLoadingBalanceChart) return <Loader />;

    return (
        <div className={styles.analytics}>
            <div className={styles.analyticsTitle}>
                <h1>Аналитика</h1>
                <div className={styles.analyticsTitleItem}>
                    <p>Доходность:</p>
                    <div className={styles.percent}>+{balanceChartData?.profitability ?? 0}%</div>
                    <Select value={selectValue} onChange={(value) => dispatch(setSelectValue(value))} />
                </div>
            </div>

            <div className={styles.analyticsContent}>
                <div className={styles.balance}>
                    <div className={styles.balanceList}>
                        <div className={styles.balanceIcon}>
                            <svg width="20" height="20" viewBox="0 0 16 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M8 11.3333H8.83333C9.38889 11.3333 10.5 11 10.5 9.66667C10.5 8.33333 9.38889 8 8.83333 8H7.16667C6.61111 8 5.5 7.66667 5.5 6.33333C5.5 5 6.61111 4.66667 7.16667 4.66667H8M8 11.3333H5.5M8 11.3333V13M10.5 4.66667H8M8 4.66667V3M15.5 8C15.5 12.1421 12.1421 15.5 8 15.5C3.85786 15.5 0.5 12.1421 0.5 8C0.5 3.85786 3.85786 0.5 8 0.5C12.1421 0.5 15.5 3.85786 15.5 8Z"
                                    stroke="#348EF1"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <p>
                            {dateNow}
                            <span onClick={handleRefresh} className={styles.refresh}>
                                <svg
                                    width="14"
                                    height="15"
                                    viewBox="0 0 14 15"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M1.34012 9.99638C1.77241 11.2233 2.59176 12.2765 3.67472 12.9973C4.75768 13.7181 6.04557 14.0674 7.34435 13.9927C8.64313 13.9179 9.88244 13.4232 10.8755 12.5829C11.8686 11.7426 12.5618 10.6024 12.8504 9.33395C13.1391 8.06554 13.0077 6.73769 12.476 5.55045C11.9443 4.36321 11.0412 3.38091 9.90261 2.75156C8.76407 2.12221 7.45182 1.87989 6.16358 2.06113C3.98861 2.36711 2.55164 3.94355 1 5.33594M1 5.33594V1.33594M1 5.33594H5"
                                        stroke="#131F37"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                            </span>
                        </p>
                    </div>
                    <p>Баланс на платформе:</p>
                    <p>${totalBalance.toLocaleString()}</p>
                </div>
                <LineChart
                    accountType="all"
                    colorsArr={colorsArr}
                />
            </div>
        </div>
    );
};

export default Analytics;