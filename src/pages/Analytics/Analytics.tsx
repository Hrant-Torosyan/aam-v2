import React, { useState, useMemo, useCallback } from 'react';
import { useGetBalanceChartQuery, useGetWalletsQuery } from 'src/store/analytics/analyticsAPI';
import Loader from 'src/ui/Loader/Loader';
import Select from 'src/components/Select/Select';
import LineChartComponent from 'src/components/LineChart/LineChart';
import DoughnutChart from 'src/components/DoughnutChart/DoughnutChart';
import ProdItems from 'src/components/ProdItems/ProdItem';
import PopUpPortfolio from 'src/components/PopUpPortfolio/PopUpPortfolio';
import Check from 'src/components/Check/Check';
import Operations from 'src/components/Operations/Operations';

import balance from 'src/images/svg/balance.svg';
import refresh from 'src/images/svg/refresh.svg';

import styles from './Analytics.module.scss';
import { colorsArr } from 'src/pages/Analytics/colorArr';

const Analytics: React.FC = () => {
    const [selectValue, setSelectValue] = useState<string>('WEEKLY');
    const [refreshState, setRefresh] = useState(0);
    const [portfolioPopUp, setPortfolioPopUp] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showOperationsList, setShowOperationsList] = useState<number | null>(null);

    const { data: walletsData, isLoading: isLoadingWallets } = useGetWalletsQuery();
    const { data: balanceChartData, isLoading: isLoadingBalanceChart } = useGetBalanceChartQuery({
        period: selectValue,
        refresh: refreshState,
    });

    const isLoading = isLoadingWallets || isLoadingBalanceChart;

    const handleRefresh = useCallback(() => {
        setRefresh(prev => prev + 1);
    }, []);

    const totalBalance = useMemo(() => {
        return [
            walletsData?.masterAccount ?? 0,
            walletsData?.investmentAccount ?? 0,
            walletsData?.agentAccount ?? 0,
        ].reduce((sum, account) => sum + account, 0);
    }, [walletsData]);

    const dateNowFormatted = useMemo(() => new Date().toLocaleString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }), [refreshState]);

    if (isLoading) {
        return <Loader />;
    }

    const safeBalanceChartData = {
        profitability: balanceChartData?.profitability ?? 0,
        mainData: balanceChartData?.mainData ?? [],
        lab: balanceChartData?.lab ?? [],
        data: balanceChartData?.data ?? [],
        masterAccount: walletsData?.masterAccount ?? 0,
        investmentAccount: walletsData?.investmentAccount ?? 0,
        agentAccount: walletsData?.agentAccount ?? 0,
    };

    return (
        <div className={styles.analytics}>
            <div className={styles.analyticsTitle}>
                <h1>Аналитика</h1>
                <div className={styles.analyticsTitleItem}>
                    <p>Доходность:</p>
                    <div className={styles.percent}>+{safeBalanceChartData.profitability}%</div>
                    <Select
                        value={selectValue}
                        onChange={setSelectValue}
                    />
                </div>
            </div>

            <div className={styles.analyticsContent}>
                <div className={styles.balance}>
                    <div className={styles.balanceList}>
                        <div className={styles.balanceIcon}>
                            <img src={balance} alt="balance"/>
                        </div>
                        <p>
                            {dateNowFormatted}
                            <span onClick={handleRefresh} className={styles.refresh}>
                                <img src={refresh} alt="refresh"/>
                            </span>
                        </p>
                    </div>
                    <p>Баланс на платформе:</p>
                    <p>${totalBalance.toLocaleString()}</p>
                </div>

                <LineChartComponent
                    balanceChartData={safeBalanceChartData}
                    selectValue={selectValue}
                />

                <div className={styles.doughnutChart}>
                    <div className={styles.doughnutChartTitle}>Структура портфеля:</div>
                    <DoughnutChart refresh={refreshState} colorsArr={colorsArr} count={null}/>
                    <ProdItems
                        colorsArr={colorsArr}
                        count={3}
                        setPortfolioPopUp={setPortfolioPopUp}
                    />
                </div>

                {portfolioPopUp && (
                    <PopUpPortfolio
                        colorsArr={colorsArr}
                        setPortfolioPopUp={setPortfolioPopUp}
                    />
                )}

                <div className={styles.analyticsContentMain}>
                    <Check isOpen={isOpen} setIsOpen={setIsOpen}/>
                    <Operations
                        count={6}
                        showOperationsList={showOperationsList}
                        setShowOperationsList={setShowOperationsList}
                    />
                </div>
            </div>
        </div>
    );
};

export default Analytics;