import React, { useState } from "react";
// import { useGetAnalyticListQuery } from "src/store/analytics/analyticsAPI"; // Commenting out the API request
import DoughnutChart from "src/components/DoughnutChart/DoughnutChart";
import ProdItems from "src/components/ProdItems/ProdItem";
import styles from './PopUpPortfolio.module.scss';

// Mock data for testing purposes
const mockAnalyticListData = {
    content: [
        {
            logo: { url: "https://via.placeholder.com/40", name: "Company 1" },
            title: "Investment 1",
            investedAmount: 1000,
            percentage: 25,
        },
        {
            logo: { url: "https://via.placeholder.com/40", name: "Company 2" },
            title: "Investment 2",
            investedAmount: 2000,
            percentage: 30,
        },
        {
            logo: { url: "https://via.placeholder.com/40", name: "Company 3" },
            title: "Investment 3",
            investedAmount: 1500,
            percentage: 20,
        },
        {
            logo: { url: "https://via.placeholder.com/40", name: "Company 4" },
            title: "Investment 4",
            investedAmount: 500,
            percentage: 25,
        },
    ],
};

interface PopUpPortfolioProps {
    setPortfolioPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    colorsArr: string[];
}

interface AnalyticItem {
    logo: { url: string; name: string };
    title: string;
    investedAmount: number;
    percentage: number;
}

const PopUpPortfolio: React.FC<PopUpPortfolioProps> = ({ setPortfolioPopUp, colorsArr }) => {
    const [showAll, setShowAll] = useState(false);

    // Commenting out the API request for now
    // const { data: analyticListData } = useGetAnalyticListQuery({
    //     queryData: { pageSize: '10' },
    // });

    const analyticListData = mockAnalyticListData;

    const handleShowAllToggle = () => {
        setShowAll((prevState) => !prevState);
    };

    const itemsToDisplay = showAll ? analyticListData?.content : analyticListData?.content?.slice(0, 3);

    const getBackgroundColor = (key: number): string => {
        return colorsArr[key % colorsArr.length];
    };

    return (
        <div className={styles.popUpPortfolio}>
            <div className={styles.popUpPortfolioBlock}>
                <div className={styles.popUpPortfolioHeader}>
                    <p>Структура портфеля</p>
                    <button onClick={() => setPortfolioPopUp(false)}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                <div className={styles.popUpPortfolioContent}>
                    <div className={styles.popUpPortfolioContentCart}>
                        <DoughnutChart colorsArr={colorsArr} count={null} refresh={0} />
                        <p>
                            Реферальная программа — это способ продвижения товара или услуги через
                            рекомендации. Компания предлагает клиентам посоветовать свой продукт знакомым и
                            получить за это вознаграждение: скидку, деньги или баллы на бонусный счёт.
                            Проще говоря, это способ стимулировать сарафанное радио.
                        </p>
                    </div>

                    <div className={styles.popUpPortfolioContentProds}>
                        <ProdItems colorsArr={colorsArr} count={3} setPortfolioPopUp={setPortfolioPopUp} />
                    </div>

                    <div className={styles.popUpPortfolioContentAnalyticList}>
                        {itemsToDisplay?.map((item: AnalyticItem, index: number) => (
                            <div key={index} className={styles.doughnutChartItem}>
                                <div className={styles.doughnutChartItemInfoBlock}>
                                    <img src={item.logo.url} alt={item.logo.name} />
                                    <div className={styles.doughnutChartItemInfo}>
                                        <h2>{item.title}</h2>
                                        <p>
                                            {parseFloat(item.investedAmount.toString().replace(/[^\d.-]/g, ""))
                                                .toLocaleString()}{" "}
                                            $ ({item.percentage}%)
                                        </p>
                                    </div>
                                </div>
                                <div
                                    style={{ background: getBackgroundColor(index) }}
                                    className={styles.dote}
                                ></div>
                            </div>
                        ))}
                    </div>

                    {analyticListData?.content?.length > 3 && !showAll && (
                        <button onClick={handleShowAllToggle} className={styles.viewButton}>
                            Смотреть полностью
                        </button>
                    )}

                    {showAll && analyticListData?.content?.length > 3 && (
                        <button onClick={handleShowAllToggle} className={styles.viewButton}>
                            Скрыть
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopUpPortfolio;