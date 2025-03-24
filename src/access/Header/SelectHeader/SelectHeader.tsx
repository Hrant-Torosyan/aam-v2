import React, { useRef, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useLogoutMutation } from "src/store/auth/authAPI";
import styles from "./SelectHeader.module.scss";

interface SelectHeaderProps {
    setIsActiveSelectHeader: (isActive: boolean) => void;
    setNotification: (isActive: boolean) => void;
    isActiveSelectHeader: boolean;
    userData: {
        fullName: string;
        image?: {
            url: string;
        };
    } | null;
}

const SelectHeader: React.FC<SelectHeaderProps> = ({
   setIsActiveSelectHeader,
   setNotification,
   isActiveSelectHeader,
   userData,
}) => {
    const [logout] = useLogoutMutation();
    const selectHeaderRef = useRef<HTMLDivElement | null>(null);

    const handleLogout = async (e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await logout().unwrap();
            localStorage.removeItem("userAuth");
            window.location.reload();
        } catch (error) {
            console.error("Ошибка при выходе:", error);
        }
    };

    const handleSelectHeaderClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNotification(false);
        setIsActiveSelectHeader(!isActiveSelectHeader);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                selectHeaderRef.current &&
                !selectHeaderRef.current.contains(event.target as Node) &&
                isActiveSelectHeader
            ) {
                setIsActiveSelectHeader(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isActiveSelectHeader, setIsActiveSelectHeader]);

    return (
        <div
            ref={selectHeaderRef}
            onClick={handleSelectHeaderClick}
            className={
                isActiveSelectHeader
                    ? `${styles.profileBlock} ${styles.activeHeader}`
                    : `${styles.profileBlock} ${styles.unActiveHeader}`
            }
        >
            <img src={userData?.image?.url || "./images/avatar.png"} alt="user" />
            <div className={styles.selectHeader}>
                <img src="./images/angle.png" alt="dropdown icon" />
                <div className={styles.selectItem}>
                    <NavLink to="/profile" onClick={(e) => e.stopPropagation()}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path
                                d="M20.416 24.5001H7.58268C5.97185 24.5001 4.66602 23.1943 4.66602 21.5835C4.66602 16.8226 11.666 16.9168 13.9993 16.9168C16.3327 16.9168 23.3327 16.8226 23.3327 21.5835C23.3327 23.1943 22.0268 24.5001 20.416 24.5001Z"
                                stroke="#0E1A32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M13.9993 12.8333C16.5767 12.8333 18.666 10.744 18.666 8.16667C18.666 5.58934 16.5767 3.5 13.9993 3.5C11.422 3.5 9.33268 5.58934 9.33268 8.16667C9.33268 10.744 11.422 12.8333 13.9993 12.8333Z"
                                stroke="#0E1A32"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>Мой профиль</span>
                    </NavLink>
                    <button onClick={handleLogout}>
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                            <path
                                d="M16.3333 4.66797L20.4167 4.66797C23.984 4.66797 23.9167 9.33464 23.9167 14.0013C23.9167 18.668 23.984 23.3346 20.4167 23.3346H16.3333M3.5 14.0013L17.5 14.0013M3.5 14.0013L8.16667 9.33464M3.5 14.0013L8.16667 18.668"
                                stroke="#E55C5C"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span>Выйти</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SelectHeader;