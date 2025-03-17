import React, { useState } from "react";
import CopyOnClick from "src/utils/copyOnClick";
import UserLvl from "src/components/UserLvl/UserLvl";
import user from 'src/images/svg/career/user.svg';
import { useGetProfileCareerQuery, useGetProfitQuery } from "src/store/career/career";
import styles from "./Career.module.scss";

const Career: React.FC = () => {
    const [copied, setCopied] = useState(false);
    const { data: careerInfo } = useGetProfileCareerQuery();
    const { data: profitData } = useGetProfitQuery();

    const handleCopy = () => {
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <div className={styles.career}>
            <div className={styles.careerTitle}>
                <h1>Карьера</h1>
                <div className={styles.careerButton}>
                    <button>
                        <p>Доход от партнерской программы:</p> <span>${profitData?.amount}</span>
                    </button>
                </div>
            </div>

            <div className={styles.careerContent}>
                <div className={styles.careerContentItem}>
                    <div className={styles.careerContentImg}>
                        <img src="/images/careerImg.jpg" alt="career" />
                    </div>
                    <div className={styles.careerContentTop}>
                        <div className={styles.careerContentTopItem}>
                            <h1>Приглашайте инвесторов и получайте бонусы</h1>
                            <p>Поделись своей реферальной ссылкой и начни зарабатывать!</p>
                            <div className={copied ? `${styles.careerLink} ${styles.linkActive}` : styles.careerLink}>
                                <div className={styles.careerLinkItem}>
                                    <p>http://aams.life/login?q={careerInfo?.referral}</p>
                                    <CopyOnClick text={`http://aams.life/login?q=${careerInfo?.referral}`}>
                                        <button onClick={handleCopy}>
                                            {copied ? (
                                                <svg
                                                    className={styles.coped}
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={24}
                                                    height={24}
                                                >
                                                    <path
                                                        d="M9 16.17 5.53 12.7a.996.996 0 1 0-1.41 1.41l4.18 4.18c.39.39 1.02.39 1.41 0L20.29 7.71a.996.996 0 1 0-1.41-1.41L9 16.17z"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width={24}
                                                    height={24}
                                                    fill="none"
                                                >
                                                    <defs>
                                                        <clipPath id="a">
                                                            <path fill="#fff" fillOpacity={0} d="M0 0h24v24H0z"/>
                                                        </clipPath>
                                                    </defs>
                                                    <g clipPath="url(#a)">
                                                        <path
                                                            stroke="#96C5F9"
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1.5}
                                                            d="M10.07 7c.31-3.03 1.77-4 5.43-4C19.7 3 21 4.29 21 8.5c0 3.65-.99 5.11-4 5.43M8.5 10c4.2 0 5.5 1.29 5.5 5.5 0 4.2-1.3 5.5-5.5 5.5C4.29 21 3 19.7 3 15.5 3 11.29 4.29 10 8.5 10Z"
                                                        />
                                                    </g>
                                                </svg>
                                            )}
                                        </button>
                                    </CopyOnClick>
                                </div>
                            </div>
                        </div>
                        <div className={styles.fon}>
                            <img src="/images/fon.png" alt="fon"/>
                        </div>
                    </div>
                </div>

                <div className={styles.careerContentBottomContainer}>
                    <UserLvl
                        levelValue={careerInfo?.levelValue ?? 0}
                        nextLevelUserCount={careerInfo?.nextLevelUserCount ?? 0}
                        nextLevelInvestAmount={careerInfo?.nextLevelInvestAmount ?? 0}
                    />
                    <div className={styles.careerContentBottom}>
                        <h4 className={styles.careerContentBottomTitle}>Стандартное вознаграждение</h4>

                        <div className={styles.careerContentLvlList}>
                            <div className={styles.careerContentLvlListItem}>
                                <div className={styles.LvlBlock}>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                </div>
                                <p>Сам партнер</p>
                            </div>
                        </div>
                        <div className={styles.careerContentLvlList}>
                            <div className={styles.careerContentLvlListItem}>
                                <div className={styles.LvlBlock}>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                </div>
                                <p>Уровень 1</p>
                            </div>
                            <h4 className={styles.careerContentLvlListInfo}>5%</h4>
                        </div>
                        <div className={styles.careerContentLvlList}>
                            <div className={styles.careerContentLvlListItem}>
                                <div className={styles.LvlBlock}>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                </div>
                                <p>Уровень 2</p>
                            </div>
                            <h4 className={styles.careerContentLvlListInfo}>3%</h4>
                        </div>
                        <div className={styles.careerContentLvlList}>
                            <div className={styles.careerContentLvlListItem}>
                                <div className={styles.LvlBlock}>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                    <div className={styles.LvlBlockImg}>
                                        <img src={user} alt="user"/>
                                    </div>
                                </div>
                                <p>Уровень 3</p>
                            </div>
                            <h4 className={styles.careerContentLvlListInfo}>1%</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Career;
