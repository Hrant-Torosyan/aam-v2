import React from "react";
import styles from "./DetailsOfFund.module.scss";

interface DetailsOfFundProps {
    mainData: {
        fundDetails?: Record<string, string>;
    };
}

const DetailsOfFund: React.FC<DetailsOfFundProps> = ({ mainData }) => {
    const fundDetails = mainData?.fundDetails ? Object.entries(mainData.fundDetails) : [];

    if (fundDetails.length === 0) {
        return null;
    }

    return (
        <div className={styles.detailsOfFundWrapper}>
            <h2>Детали фонда</h2>
            <div className={styles.detailsOfFund}>
                {fundDetails.map(([key, value]) => (
                    <div className={styles.details} key={key}>
                        <p>{key}</p>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DetailsOfFund;