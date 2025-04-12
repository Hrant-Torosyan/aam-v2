import React, { useState, useEffect } from "react";
import styles from "./UserLvl.module.scss";
import Diagram from "../Diagram/Diagram";
import { useGetProfileCareerQuery } from "src/store/career/careerApi";

import linked from 'src/images/svg/career/linked.svg';
import user from 'src/images/svg/career/user.svg';
import group from 'src/images/svg/career/group.svg';
import pipe from 'src/images/svg/career/pipe.svg';
import colum from 'src/images/svg/career/colum.svg';

type UserLvlProps = {
    levelValue: number;
    nextLevelUserCount: number;
    nextLevelInvestAmount: number;
};

const UserLvl: React.FC<UserLvlProps> = ({
     levelValue,
     nextLevelUserCount,
     nextLevelInvestAmount,
 }) => {
    const [careerData, setCareerData] = useState({
        referralLinkedUserCount: 0,
        registeredUserCount: 0,
        investedCount: 0,
        referralEarnedAmount: 0,
        referralProfitAmount: 0,
    });

    const { data, error, isLoading } = useGetProfileCareerQuery();

    useEffect(() => {
        if (data) {
            setCareerData({
                referralLinkedUserCount: data.referralLinkedUserCount ?? 0,
                registeredUserCount: data.registeredUserCount ?? 0,
                investedCount: data.investedCount ?? 0,
                referralEarnedAmount: data.referralEarnedAmount ?? 0,
                referralProfitAmount: data.referralProfitAmount ?? 0,
            });
        }
    }, [data]);

    if (isLoading) {
        return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.error}>Error fetching career data</div>;
    }

    const getPercentage = (level: number) => {
        switch (level) {
            case 1:
                return 35;
            case 2:
                return 70;
            case 3:
                return 100;
            default:
                return 0;
        }
    };

    const renderCareerDataItem = (
        title: string,
        value: number | undefined,
        icon: string
    ) => (
        <div className={styles.userLvlInfo}>
            <div className={styles.userLvlInfoName}>
                <img src={icon} alt={title}/>
                <p>{title}</p>
            </div>
            <h4>{value ?? 0}</h4>
        </div>
    );

    return (
        <div className={styles.userLvl}>
            <div className={styles.userLvlTitle}>
                <Diagram percentage={getPercentage(levelValue)} />
                <h1>Твой уровень: {levelValue}</h1>
            </div>

            <div className={styles.userLvlInfoContainer}>
                {renderCareerDataItem(
                    "Перешли по ссылке",
                    careerData.referralLinkedUserCount,
                    linked
                )}
                {renderCareerDataItem(
                    "Зарегистрировано партнеров",
                    careerData.registeredUserCount,
                    user
                )}
                {renderCareerDataItem(
                    "Количество партнеров",
                    careerData.investedCount,
                    group
                )}
                {renderCareerDataItem(
                    "Объем продаж партнеров",
                    careerData.referralEarnedAmount,
                    pipe
                )}
                {renderCareerDataItem(
                    "Получено в качестве прибыли",
                    careerData.referralProfitAmount,
                    colum
                )}
            </div>
        </div>
    );
};

export default UserLvl;