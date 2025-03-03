import React, { useState } from "react";

import { useGetAnalyticListQuery } from "src/store/analytics/analyticsAPI";

import styles from './ProdItems.module.scss';

interface ProdItemsProps {
    setPortfolioPopUp: React.Dispatch<React.SetStateAction<boolean>>;
    count: number | null;
    colorsArr: string[];
}

interface AnalyticItem {
    logo: { url: string; name: string };
    title: string;
    investedAmount: number;
    percentage: number;
}

interface AnalyticList {
    content: AnalyticItem[];
}

const ProdItems: React.FC<ProdItemsProps> = ({ setPortfolioPopUp, count, colorsArr }) => {
    const [showAll, setShowAll] = useState(false);

    // const mockData: AnalyticList = {
    //     content: [
    //         { logo: { url: "https://via.placeholder.com/50", name: "Logo 1" }, title: "Product 1", investedAmount: 1500, percentage: 25 },
    //         { logo: { url: "https://via.placeholder.com/50", name: "Logo 2" }, title: "Product 2", investedAmount: 2000, percentage: 30 },
    //         { logo: { url: "https://via.placeholder.com/50", name: "Logo 3" }, title: "Product 3", investedAmount: 2500, percentage: 20 },
    //         { logo: { url: "https://via.placeholder.com/50", name: "Logo 4" }, title: "Product 4", investedAmount: 3000, percentage: 25 },
    //     ],
    // };

    // Use Redux to fetch data when you're ready
    const { data } = useGetAnalyticListQuery({
        queryData: { pageSize: count?.toString() || "10" },
    });

    const analyticList = data as AnalyticList | undefined;

    const itemsToDisplay = showAll
        ? analyticList?.content
        : analyticList?.content?.slice(0, 3);

    const handleShowAllToggle = () => {
        setShowAll((prevState) => !prevState);
    };

    const getBackgroundColor = (key: number): string => {
        return colorsArr[key % colorsArr.length];
    };

    if (!analyticList?.content?.length) return null;

    return (
        <div className={styles.doughnutChartItems}>
            {itemsToDisplay?.map((item, index) => (
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

            {analyticList.content.length > 3 && !showAll && (
                <button onClick={handleShowAllToggle} className={styles.viewButton}>
                    Смотреть полностью
                </button>
            )}

            {showAll && analyticList.content.length > 3 && (
                <button onClick={handleShowAllToggle} className={styles.viewButton}>
                    Скрыть
                </button>
            )}
        </div>
    );
};

export default ProdItems;