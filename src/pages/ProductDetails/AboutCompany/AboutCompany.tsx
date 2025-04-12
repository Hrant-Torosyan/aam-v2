import React from "react";
import styles from "./AboutCompany.module.scss";

interface AboutCompanyProps {
    mainData?: {
        financialIndicatorContent?: string;
        mediaImages?: Array<{
            url?: {
                url?: string;
            };
        }>;
    };
}

const AboutCompany: React.FC<AboutCompanyProps> = ({ mainData }) => {
    const processedContent = (mainData?.financialIndicatorContent || "")
        .replace(/\/n/g, "<br>")
        .replace(/<br>+/g, "<br>")
        .replace(/^<br>/, "")
        .trim();


    return (
        <div className={styles.aboutCompany}>
            <h1>Описание:</h1>
            <div className={styles.aboutCompanyData}>
                {mainData?.mediaImages?.[0]?.url?.url && (
                    <img alt="about" src={mainData.mediaImages[0].url.url} />
                )}
                <p dangerouslySetInnerHTML={{ __html: processedContent }}></p>
            </div>
        </div>
    );
};

export default AboutCompany;