import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useGetBalanceChartQuery, useGetWalletsQuery } from 'src/store/analytics/analyticsAPI';
import Loader from 'src/ui/Loader/Loader';
import Select from 'src/components/Select/Select';
import LineChartComponent from 'src/components/LineChart/LineChart';
import DoughnutChart from 'src/components/DoughnutChart/DoughnutChart';
import ProdItems from 'src/components/ProdItems/ProdItem';
import PopUpPortfolio from 'src/components/PopUpPortfolio/PopUpPortfolio';
import Check from 'src/components/Check/Check';
import Operations from 'src/components/Operations/Operations';
import PopUp from 'src/components/PopUp/PopUp';
import Transfer from 'src/components/Transfer/Transfer';
import Replenish from 'src/components/Replenish/Replenish';
import IsSuccessful from 'src/components/IsSuccessful/IsSuccessful';

import balance from 'src/images/svg/balance.svg';
import refresh from 'src/images/svg/refresh.svg';

import styles from './Analytics.module.scss';
import { colorsArr } from 'src/pages/Analytics/colorArr';

const Analytics: React.FC = () => {
    const [selectValue, setSelectValue] = useState<string>('WEEKLY');
    const [refreshState, setRefresh] = useState<number>(0);
    const [portfolioPopUp, setPortfolioPopUp] = useState<boolean>(false);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isOpenTransfer, setIsOpenTransfer] = useState<boolean>(false);
    const [isOpenSc, setIsOpenSc] = useState<boolean>(false);
    const [isOpenReplenish, setIsOpenReplenish] = useState<boolean>(false);
    const [showOperationsList, setShowOperationsList] = useState<number | null>(null);
    const [successInfo, setSuccessInfo] = useState<boolean>(true);

    const { data: walletsData, isLoading: isLoadingWallets } = useGetWalletsQuery();
    const { data: balanceChartData, isLoading: isLoadingBalanceChart } = useGetBalanceChartQuery({
        period: selectValue,
        refresh: refreshState,
    });

    const isLoading = isLoadingWallets || isLoadingBalanceChart;

    // Add event listener for opening Replenish popup
    useEffect(() => {
        const handleOpenReplenish = () => {
            setIsOpenReplenish(true);
        };

        window.addEventListener('openReplenishPopup', handleOpenReplenish);

        // Clean up the event listener when component unmounts
        return () => {
            window.removeEventListener('openReplenishPopup', handleOpenReplenish);
        };
    }, []);

    const handleRefresh = useCallback(() => setRefresh(prev => prev + 1), []);

    const totalBalance = useMemo(() => {
        return (
            (walletsData?.masterAccount ?? 0) +
            (walletsData?.investmentAccount ?? 0) +
            (walletsData?.agentAccount ?? 0)
        );
    }, [walletsData]);

    const dateNowFormatted = useMemo(() => {
        const specificDate = new Date();
        const day = specificDate.getDate().toString().padStart(2, '0');
        const month = (specificDate.getMonth() + 1).toString().padStart(2, '0');
        const year = specificDate.getFullYear();
        const hour = specificDate.getHours().toString().padStart(2, '0');
        const minute = specificDate.getMinutes().toString().padStart(2, '0');

        return `${day}.${month}.${year}, ${hour}:${minute}`;
    }, [refreshState]);

    if (isLoading) return <Loader />;

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
        <>
            {isOpenSc && (
                <IsSuccessful
                    setIsOpenTransfer={setIsOpenTransfer}
                    info={successInfo}
                    delay={1000}
                    setIsOpen={setIsOpenSc}
                />
            )}
            {isOpen && <PopUp />}
            {isOpenTransfer && walletsData && (
                walletsData.masterAccount + walletsData.investmentAccount + walletsData.agentAccount > 0 && (
                    <Transfer setIsOpenSc={setIsOpenSc} setIsOpenTransfer={setIsOpenTransfer} />
                )
            )}

            {isOpenReplenish && (
                <Replenish
                    setIsOpenSc={setIsOpenSc}
                    walletsData={walletsData}
                    setIsOpenReplenish={setIsOpenReplenish}
                    setSuccessInfo={setSuccessInfo}
                />
            )}

            <div className={styles.analytics}>
                <div className={styles.analyticsTitle}>
                    <h1>Аналитика</h1>
                    <div className={styles.analyticsTitleItem}>
                        <p>Доходность:</p>
                        <div className={styles.percent}>+{safeBalanceChartData.profitability}%</div>
                        <Select value={selectValue} onChange={setSelectValue} />
                    </div>
                </div>

                <div className={styles.analyticsContent}>
                    <div className={styles.balance}>
                        <div className={styles.balanceList}>
                            <div className={styles.balanceIcon}><img src={balance} alt="balance" /></div>
                            <p>
                                {dateNowFormatted}
                                <span onClick={handleRefresh} className={styles.refresh}>
                                    <img src={refresh} alt="refresh" />
                                </span>
                            </p>
                        </div>
                        <p>Баланс на платформе:</p>
                        <p>${totalBalance.toLocaleString()}</p>
                    </div>

                    <LineChartComponent balanceChartData={safeBalanceChartData} selectValue={selectValue} />

                    <div className={styles.doughnutChart}>
                        <div className={styles.doughnutChartTitle}>Структура портфеля:</div>
                        <DoughnutChart refresh={refreshState} colorsArr={colorsArr} count={null} />
                        <ProdItems colorsArr={colorsArr} count={3} setPortfolioPopUp={setPortfolioPopUp} />
                    </div>

                    {portfolioPopUp && <PopUpPortfolio colorsArr={colorsArr} setPortfolioPopUp={setPortfolioPopUp} />}

                    <div className={styles.analyticsContentMain}>
                        <Check isOpen={isOpen} setIsOpen={setIsOpen} />
                        <Operations count={6} showOperationsList={showOperationsList} setShowOperationsList={setShowOperationsList} />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Analytics;