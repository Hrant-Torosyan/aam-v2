import React from "react";
import styles from "./UserInfo.module.scss";
import { formatNumber } from "src/utils/formatNumber";

interface UserInfoProps {
    mainData: any;
    setPopUpProdNew?: (value: string) => void;
}

const UserInfo: React.FC<UserInfoProps> = ({ mainData, setPopUpProdNew }) => {
    return (
        <div className={styles.userInfo}>
            <div className={styles.prodInfoCard}>
                <div className={styles.userInfoImage}>
                    <img src={mainData.companyLogo?.url} alt="" />
                    <h3>{mainData.companyName}</h3>
                </div>

                <div className={`${styles.mobileWrapper} ${styles.infoCreate}`}>
                    <div className={styles.userInfoCreate}>
                        <h4>Создан: 21.03.2024</h4>
                        <div className={styles.userInfoCreateList}>
                            <p>Типы проекта:</p>
                            <p>{mainData?.productType}</p>
                        </div>
                        <div className={styles.userInfoCreateList}>
                            <p>Страна:</p>
                            <p>{mainData.country}</p>
                        </div>
                        <div className={styles.userInfoCreateList}>
                            <p>Город:</p>
                            <p>{mainData.city}</p>
                        </div>
                        <div className={styles.userInfoCreateList}>
                            <p>Отрасль:</p>
                            <p>{mainData.categories?.join(", ")}</p>
                        </div>
                        <div className={styles.userInfoCreateList}>
                            <p>Веб-сайт:</p>

                            <a target="_blank" rel="noopener noreferrer" href={mainData.webSite}>
                                {mainData.webSite}
                            </a>
                        </div>
                    </div>

                    <div className={styles.mobileWrapperInside}>
                        <div className={styles.userInfoPrice}>
                            {mainData?.type !== "ASSET" ? (
                                <>
                                    <div className={styles.userInfoPriceItem}>
                                        <span>Цена</span>
                                        <p>от ${formatNumber(mainData.minPrice)}</p>
                                    </div>
                                    <div className={styles.userInfoPriceItem}>
                                        <span>Мин. сумма</span>
                                        <p>до ${formatNumber(mainData.maxPrice)}</p>
                                    </div>
                                </>
                            ) : (
                                <div className={styles.userInfoPriceItem}>
                                    <span>Цена</span>
                                    <p>${formatNumber(mainData.maxPrice)}</p>
                                </div>
                            )}
                        </div>
                        {mainData?.type !== "ASSET" && (
                            <div className={styles.payments}>
                                <div className={styles.userInfoCreateList}>
                                    <p>Выплаты:</p>
                                    <button>
                                        {mainData.paymentPeriods && mainData.paymentPeriods.length > 0
                                            ? (() => {
                                                const period = mainData.paymentPeriods[0];
                                                switch (period) {
                                                    case "MONTHLY":
                                                        return "Ежемесячные";
                                                    case "QUARTERLY":
                                                        return "Поквартальные";
                                                    case "SEMI_ANNUAL":
                                                        return "Полугодовые";
                                                    default:
                                                        return null;
                                                }
                                            })()
                                            : null}
                                    </button>
                                </div>
                                <div className={styles.userInfoCreateList}>
                                    <p>Проценты годовые:</p>
                                    <button>{mainData.profitCommission}%</button>
                                </div>
                                <div className={styles.userInfoCreateList}>
                                    <p>Срок инвестирования:</p>
                                    <button>{mainData.term}</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.mobileWrapper}>
                    <div className={styles.hastagsWrapper}>
                        <p>Теги</p>
                        <div className={styles.hashtags}>
                            {mainData.tags?.map((item: string, key: number) => (
                                <div key={key} className={styles.hashtag}>
                                    #{item}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.prodInfoCardWrapper}>
                        <h2>Условия сделки:</h2>
                        <p>
                            Комиссия при покупке: <span>{mainData.purchaseCommission}%</span>
                        </p>
                        <p>
                            Комиссия при продаже актива: <span>{mainData.profitCommission}%</span>
                        </p>
                        <p>
                            Комиссия за управление: <span>{mainData.managementCommission}%</span>
                        </p>
                    </div>
                </div>
                {mainData?.type !== "ASSET" ? (
                    <div className={styles.buttonStyle}>
                        <button
                            onClick={() => {
                                setPopUpProdNew && setPopUpProdNew("start");
                            }}
                        >
                            <span>Инвестировать</span>
                        </button>
                    </div>
                ) : (
                    <div className={styles.buttonStyle}>
                        <button
                            onClick={() => {
                                setPopUpProdNew && setPopUpProdNew("start");
                            }}
                        >
                            <span>Купить</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserInfo;