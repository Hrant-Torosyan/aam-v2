import React, { lazy, useState, useEffect } from "react";
import arrowDown from "src/images/svg/arrowDown.svg";

import styles from "./Presentation.module.scss";

const ProductInfoItems = lazy(() => import("../ProductInfoItems/ProductInfoItems"));

interface PresentationProps {
    mainData: {
        presentations: Array<{
            url?: {
                url?: string;
                name?: string;
            };
            [key: string]: any;
        }>;
    };
}

const Presentation: React.FC<PresentationProps> = ({ mainData }) => {
    const [visibleCount, setVisibleCount] = useState(3);
    const [isMobile, setIsMobile] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const allowButtons = mainData.presentations.length > 3;

    const toggleShowMore = () => {
        setIsExpanded(!isExpanded);

        if (isExpanded) {
            setVisibleCount(1);
        } else {
            setVisibleCount(mainData.presentations.length);
        }
    };

    const visiblePresentations = isExpanded
        ? mainData.presentations
        : mainData.presentations.slice(0, visibleCount);

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

    return (
        <div className={styles.Presentation}>
            <h1>Презентаци:</h1>
            <div className={`${styles.PresentationWrapper} ${isMobile ? styles.scrollable : ""}`}>
                {(isMobile ? mainData.presentations : visiblePresentations).map(
                    (presentation, index) => (
                        <ProductInfoItems key={index} mainData={presentation} />
                    )
                )}
            </div>
            <div className={styles.presentationButtons}>
                {allowButtons && !isMobile && (
                    <div className={styles.seeMore} onClick={toggleShowMore}>
                        {!isExpanded ? (
                            <>
                                <span>Посмотреть ещё</span>
                                <img src={arrowDown} alt="See more presentations" />
                            </>
                        ) : (
                            <>
                                <span>Скрыть все</span>
                                <img className={styles.hideArrow} src={arrowDown} alt="Hide presentations" />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Presentation;