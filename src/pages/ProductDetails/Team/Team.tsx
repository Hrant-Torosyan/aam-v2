import React, { useState } from "react";
import { useGetProductTeamQuery } from "src/store/product/product";
import styles from "./Team.module.scss";
import arrowDown from "src/images/svg/arrowDown.svg";
import BorderCard from "src/ui/BorderCard/BorderCard";

interface TeamMember {
    id?: string | number;
    fullName?: string;
    position?: string;
    image?: {
        url?: string;
    };
}

interface TeamProps {
    prodId: string;
    ceoPosition?: string;
    ceoLastname?: string;
    ceoFirstname?: string;
    ceoImage?: string;
    employeesContent?: string;
}

interface TeamDataResponse {
    content: TeamMember[];
    pageable?: any;
    totalElements?: number;
    totalPages?: number;
    last?: boolean;
}

const Team: React.FC<TeamProps> = ({
   prodId,
   ceoPosition,
   ceoLastname,
   ceoFirstname,
   ceoImage
}) => {
    const [visibleCount, setVisibleCount] = useState(5);
    const { data: teamData, isLoading } = useGetProductTeamQuery(prodId);

    const teamMembers: TeamMember[] = teamData && 'content' in teamData
        ? (teamData as TeamDataResponse).content
        : [];

    const handleShowMore = () => {
        setVisibleCount(teamMembers.length);
    };

    if (isLoading) return <div className={styles.loading}>Загрузка команды...</div>;

    return (
        <BorderCard className={styles.team}>
            <h2>Команда проекта:</h2>
            <div className={styles.teamItems}>
                {(ceoPosition || ceoFirstname || ceoLastname) && (
                    <div className={styles.teamItem}>
                        <img
                            src={ceoImage || "/images/avatar.png"}
                            alt="CEO"
                            className={styles.teamItemImage}
                            onError={(e) => { e.currentTarget.src = "/images/avatar.png" }}
                        />
                        <div className={styles.teamItemInfo}>
                            <p>{ceoPosition}</p>
                            <h3>
                                <span>{ceoFirstname}</span> <span>{ceoLastname}</span>
                            </h3>
                        </div>
                    </div>
                )}

                {/* Team Members */}
                {teamMembers.slice(0, visibleCount).map((item, key) => (
                    <div key={item.id || key} className={styles.teamItem}>
                        <img
                            src={item.image?.url || "/images/avatar.png"}
                            alt="Team Member"
                            className={styles.teamItemImage}
                            onError={(e) => { e.currentTarget.src = "/images/avatar.png" }}
                        />
                        <div className={styles.teamItemInfo}>
                            <p>{item.position}</p>
                            <h3>{item.fullName}</h3>
                        </div>
                    </div>
                ))}
            </div>

            {teamMembers.length > visibleCount && (
                <div className={styles.seeMore} onClick={handleShowMore}>
                    <span>Посмотреть ещё</span>
                    <img src={arrowDown} alt="arrow down" />
                </div>
            )}

            {teamMembers.length === 0 && (
                <div className={styles.noTeam}>Нет информации о команде</div>
            )}
        </BorderCard>
    );
};

export default Team;