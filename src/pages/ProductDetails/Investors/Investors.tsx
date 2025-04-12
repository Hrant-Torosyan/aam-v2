import React, { useState, useEffect } from "react";
import styles from "./Investors.module.scss";
import arrowDown from "src/images/svg/arrowDown.svg";
import { useGetProductInvestorsQuery } from "src/store/product/productApi";
import { Project, Investor } from "src/types/types";
import BorderCard from "src/ui/BorderCard/BorderCard";

interface InvestorsProps {
    prodId?: string;
    mainData?: Project;
}

const Investors: React.FC<InvestorsProps> = ({ prodId, mainData }) => {
    const [visibleCount, setVisibleCount] = useState<number>(3);
    const [showInvestorsData, setShowInvestorsData] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    const { data: investorsData, isLoading } = useGetProductInvestorsQuery(
        {
            id: prodId || "",
            queryData: showInvestorsData ? undefined : { pageSize: visibleCount.toString() }
        },
        {
            skip: !prodId
        }
    );

    const handleShowMore = () => {
        setVisibleCount((prevCount) => prevCount + 3);
    };

    const safeInvestorsData = Array.isArray(investorsData) ? investorsData : [];
    const visibleInvestors = safeInvestorsData.slice(0, visibleCount);
    const totalElements = safeInvestorsData.length || 0;

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 576.99);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    if (isLoading) {
        return null;
    }

    if (!visibleInvestors.length) {
        return null;
    }

    const investors = visibleInvestors.map((investor: Investor, key) => {
        const fullName = investor.firstName && investor.lastName
            ? `${investor.firstName} ${investor.lastName}`
            : investor.name || "Investor";

        return (
            <div key={key} className={styles.investorsItem}>
                <img
                    src={"./images/avatar.png"}
                    alt=""
                />
                <h3>{fullName}</h3>
            </div>
        );
    });

    return (
        <BorderCard className={styles.investors}>
            <div className={styles.cardTitle}>
                <h2>Инвесторы</h2>
                <p>{totalElements}</p>
            </div>
            <div className={styles.investorsItems}>
                {investors}
                {totalElements > visibleCount && !isMobile && (
                    <div className={styles.seeMore} onClick={handleShowMore}>
                        <span>Посмотреть еще</span>
                        <img src={arrowDown} alt="arrowDown" />
                    </div>
                )}
            </div>
            {totalElements > visibleCount && isMobile && (
                <div className={styles.seeMore} onClick={() => setShowInvestorsData(!showInvestorsData)}>
                    <span>
                        {!showInvestorsData
                            ? "и еще " + (totalElements - visibleCount) + " инвесторов"
                            : "скрыть"}
                    </span>
                </div>
            )}
        </BorderCard>
    );
};

export default Investors;