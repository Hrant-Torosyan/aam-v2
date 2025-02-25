import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { logout } from "src/store/auth/authAPI";
import { api } from "src/store/profile/profileAPI";
import Notification from "./Notification/Notification";
import IsSuccessful from "src/ui/IsSuccessful/IsSuccessful";
import analytics from "src/images/svg/analitycs.svg";
import wallet from "src/images/svg/wallet.svg";
import market from "src/images/svg/market.svg";
import career from "src/images/svg/career.svg";
import bag from "src/images/svg/bag.svg";

import SelectHeader from "./SelectHeader/SelectHeader";

import styles from "./Header.module.scss";
import {AppDispatch} from "@/store/store";
import {useDispatch} from "react-redux";


const Header = () => {
    const [notification, setNotification] = useState(false);
    const [isActiveSelectHeader, setIsActiveSelectHeader] = useState(false);
    const [userData, setUserData] = useState(null);
    const [isOpenSc, setIsOpenSc] = useState(false);
    const [successInfo, setSuccessInfo] = useState(true);


    useEffect(() => {
        api.getUserInfo()
            .then((res) => {
                if (!res.status) {
                    setUserData(res);
                } else {
                    logout();
                }
            })
            .catch((error) => {
                console.error("Error fetching user data", error);
            });
    }, []);

    const dispatch: AppDispatch = useDispatch();

    const handleLogout = () => {
        dispatch(logout());
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if the click is outside of both notification and select header areas
            const isOutsideAll = !target.closest(`.${styles.notification}`) &&
                !target.closest(`.${styles.profileBlock}`);

            if (isOutsideAll) {
                if (notification) setNotification(false);
                if (isActiveSelectHeader) setIsActiveSelectHeader(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [notification, isActiveSelectHeader]);

    return (
        <header>
            {isOpenSc && (
                <IsSuccessful
                    info={successInfo}
                    delay={5000}
                    setIsOpen={setIsOpenSc}
                />
            )}
            <div className={styles.headerLeft}>
                <div className={styles.headerLeftLogo}>
                    <img src="./images/Logo.png" alt="Logo"/>
                </div>
                <nav>
                    <ul>
                        <li>
                            <NavLink to="/">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M16.9688 0H7.03125C3.14813 0 0 3.14813 0 7.03125V16.9688C0 20.8519 3.14813 24 7.03125 24H16.9688C20.8519 24 24 20.8519 24 16.9688V7.03125C24 3.14813 20.8519 0 16.9688 0ZM8.40844 18.8189C8.40844 19.9716 7.47375 20.9062 6.32109 20.9062C5.16844 20.9062 4.23375 19.9716 4.23375 18.8189V11.1187C4.23375 9.96609 5.16844 9.03141 6.32109 9.03141C7.47375 9.03141 8.40844 9.96609 8.40844 11.1187V18.8189ZM14.0873 18.8189C14.0873 19.9716 13.1527 20.9062 12 20.9062C10.8473 20.9062 9.91266 19.9716 9.91266 18.8189V5.18109C9.91266 4.02844 10.8473 3.09375 12 3.09375C13.1527 3.09375 14.0873 4.02844 14.0873 5.18109V18.8189ZM19.7663 18.8189C19.7663 19.9716 18.8316 20.9062 17.6789 20.9062C16.5262 20.9062 15.5916 19.9716 15.5916 18.8189V17.0564C15.5916 15.9037 16.5262 14.9691 17.6789 14.9691C18.8316 14.9691 19.7663 15.9037 19.7663 17.0564V18.8189Z"
                                        fill="white"
                                    />
                                </svg>

                                <span>Аналитика</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/briefcase">
                                <svg
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M19 4H17.9C17.6679 2.87141 17.0538 1.85735 16.1613 1.12872C15.2687 0.40009 14.1522 0.00145452 13 0L11 0C9.8478 0.00145452 8.73132 0.40009 7.83875 1.12872C6.94618 1.85735 6.3321 2.87141 6.1 4H5C3.67441 4.00159 2.40356 4.52888 1.46622 5.46622C0.528882 6.40356 0.00158786 7.67441 0 9L0 12H24V9C23.9984 7.67441 23.4711 6.40356 22.5338 5.46622C21.5964 4.52888 20.3256 4.00159 19 4ZM8.184 4C8.39008 3.41709 8.77123 2.91209 9.2753 2.55409C9.77937 2.19608 10.3817 2.00256 11 2H13C13.6183 2.00256 14.2206 2.19608 14.7247 2.55409C15.2288 2.91209 15.6099 3.41709 15.816 4H8.184Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M13 15C13 15.2652 12.8946 15.5196 12.7071 15.7071C12.5196 15.8946 12.2652 16 12 16C11.7348 16 11.4804 15.8946 11.2929 15.7071C11.1054 15.5196 11 15.2652 11 15V14H0V19C0.00158786 20.3256 0.528882 21.5964 1.46622 22.5338C2.40356 23.4711 3.67441 23.9984 5 24H19C20.3256 23.9984 21.5964 23.4711 22.5338 22.5338C23.4711 21.5964 23.9984 20.3256 24 19V14H13V15Z"
                                        fill="white"
                                    />
                                </svg>

                                <span>Портфель</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/market">
                                <svg
                                    width="29"
                                    height="29"
                                    viewBox="0 0 29 29"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M9.36935 22.5047C7.81779 22.5047 6.5578 23.7647 6.5578 25.3162C6.5578 26.8687 7.81779 28.1278 9.36935 28.1278C10.9218 28.1278 12.1809 26.8687 12.1809 25.3162C12.1809 23.7647 10.9218 22.5047 9.36935 22.5047ZM22.4943 22.5047C20.9428 22.5047 19.6828 23.7647 19.6828 25.3162C19.6828 26.8687 20.9428 28.1278 22.4943 28.1278C24.0468 28.1278 25.3059 26.8687 25.3059 25.3162C25.3059 23.7647 24.0468 22.5047 22.4943 22.5047ZM7.93873 16.3565C7.93873 16.3565 19.0687 16.0256 22.2262 15.9656C23.3419 15.944 24.3403 15.2644 24.7687 14.2341C25.4971 12.4847 26.9156 9.07688 27.9056 6.69845C28.2665 5.83032 28.17 4.83936 27.6478 4.05655C27.1265 3.27468 26.2481 2.805 25.3078 2.805L5.91281 2.8125L5.85093 2.39905C5.64561 1.0228 4.46435 0.0046788 3.07311 0.0028038C2.0578 0.0018663 0.938443 0 0.938443 0C0.420944 0 0.000937499 0.419055 0 0.936555C0 1.45405 0.419055 1.875 0.936555 1.875C0.936555 1.875 2.05593 1.87686 3.0703 1.8778C3.53436 1.87874 3.92812 2.21813 3.99656 2.67657L6.08341 16.6341C6.42748 18.93 8.39904 20.6278 10.7194 20.6278H24.374C24.8915 20.6278 25.3115 20.2078 25.3115 19.6903C25.3115 19.1737 24.8915 18.7528 24.374 18.7528H10.7203C9.32717 18.7528 8.14404 17.7337 7.93873 16.3565Z"
                                        fill="#F4F7FE"
                                    />
                                </svg>

                                <span>Маркет</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/wallet">
                                <svg
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6.28528 24.127H17.7147C18.1132 24.127 18.5117 24.0907 18.8921 24.0092V15.7677H16.9449C15.1064 15.7677 13.6121 14.2734 13.6121 12.4349C13.6121 10.5964 15.1064 9.10205 16.9449 9.10205H18.8921V0.244689C18.5117 0.16318 18.1132 0.126953 17.7147 0.126953H6.28528C2.8166 0.126953 0 2.94356 0 6.41224V17.8417C0 21.3103 2.8166 24.127 6.28528 24.127Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M23.5469 9.10106C23.7009 9.10106 23.8548 9.11917 23.9997 9.16445V6.41125C23.9997 4.02936 22.6684 1.94634 20.7031 0.886719V9.10106H23.5469Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M23.9997 15.7051C23.8548 15.7504 23.7009 15.7685 23.5469 15.7685H20.7031V23.367C22.6684 22.3073 23.9997 20.2243 23.9997 17.8424V15.7051Z"
                                        fill="white"
                                    />
                                    <path
                                        d="M23.4933 10.8594H23.3846L22.814 10.8684L16.9453 10.9137C16.1031 10.9137 15.4238 11.593 15.4238 12.4352C15.4238 13.2775 16.1031 13.9567 16.9453 13.9567H23.4933V10.8594ZM17.0993 13.2865C16.6284 13.2865 16.248 12.9062 16.248 12.4352C16.248 11.9643 16.6284 11.5839 17.0993 11.5839C17.5702 11.5839 17.9597 11.9643 17.9597 12.4352C17.9597 12.9062 17.5702 13.2865 17.0993 13.2865Z"
                                        fill="white"
                                    />
                                </svg>

                                <span>Кошелёк</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/career">
                                <svg
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M24 7.12695C24 3.26096 20.866 0.126953 17 0.126953H7C3.13401 0.126953 0 3.26096 0 7.12695V17.127C0 20.9929 3.13401 24.127 7 24.127H17C20.866 24.127 24 20.9929 24 17.127V7.12695ZM3.68283 13.6225C3.80131 13.6236 3.91782 13.5921 4.01962 13.5314L16.993 6.23391C17.2485 6.09019 17.5642 6.27483 17.5642 6.56799C17.5642 6.74905 17.6362 6.92269 17.7642 7.05072C17.8922 7.17875 18.0659 7.25068 18.2469 7.25068C18.428 7.25068 18.6016 7.17875 18.7297 7.05072C18.8577 6.92269 18.9296 6.74905 18.9296 6.56799V5.31183C18.9288 5.01188 18.8428 4.71832 18.6817 4.46533C18.5205 4.21233 18.2908 4.0103 18.0194 3.88273L16.6995 3.22735C16.6185 3.1778 16.5281 3.14568 16.4341 3.13304C16.34 3.12039 16.2443 3.1275 16.1532 3.15391C16.062 3.18032 15.9773 3.22545 15.9046 3.28642C15.8319 3.34739 15.7726 3.42285 15.7307 3.508C15.6888 3.59314 15.665 3.6861 15.661 3.78093C15.657 3.87576 15.6729 3.97038 15.7075 4.05875C15.7421 4.14712 15.7948 4.22729 15.8622 4.29416C15.9295 4.36103 16.0101 4.41311 16.0987 4.44709C16.3831 4.57059 16.4039 4.96604 16.134 5.11864L3.34603 12.3481C3.216 12.423 3.11424 12.5386 3.05649 12.677C2.99875 12.8155 2.98823 12.9692 3.02657 13.1142C3.0649 13.2593 3.14996 13.3877 3.26858 13.4795C3.38721 13.5714 3.53279 13.6216 3.68283 13.6225ZM18.5 9.03076C18.1022 9.03076 17.7206 9.2883 17.4393 9.74672C17.158 10.2051 17 10.8269 17 11.4752V18.5863C17 19.2346 17.158 19.8564 17.4393 20.3148C17.7206 20.7732 18.1022 21.0308 18.5 21.0308C18.8978 21.0308 19.2794 20.7732 19.5607 20.3148C19.842 19.8564 20 19.2346 20 18.5863V11.4752C20 10.8269 19.842 10.2051 19.5607 9.74672C19.2794 9.2883 18.8978 9.03076 18.5 9.03076ZM11.5 12.0308C11.1022 12.0308 10.7206 12.3052 10.4393 12.7938C10.158 13.2824 10 13.9451 10 14.636V18.4255C10 19.1165 10.158 19.7791 10.4393 20.2677C10.7206 20.7563 11.1022 21.0308 11.5 21.0308C11.8978 21.0308 12.2794 20.7563 12.5607 20.2677C12.842 19.7791 13 19.1165 13 18.4255V14.636C13 13.9451 12.842 13.2824 12.5607 12.7938C12.2794 12.3052 11.8978 12.0308 11.5 12.0308ZM7 19.0308C7 20.1353 6.10457 21.0308 5 21.0308C3.89543 21.0308 3 20.1353 3 19.0308C3 17.9262 3.89543 17.0308 5 17.0308C6.10457 17.0308 7 17.9262 7 19.0308Z"
                                        fill="white"
                                    />
                                </svg>

                                <span>Карьера</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/profile">
                                <svg
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M7 0.126953C3.13401 0.126953 0 3.26096 0 7.12695V17.127C0 20.9929 3.13401 24.127 7 24.127H17C20.866 24.127 24 20.9929 24 17.127V7.12695C24 3.26096 20.866 0.126953 17 0.126953H7ZM8.75 7.0595C8.75 5.45975 10.1555 4.07617 12 4.07617C13.8445 4.07617 15.25 5.45975 15.25 7.0595C15.25 8.65926 13.8445 10.0428 12 10.0428C10.1555 10.0428 8.75 8.65926 8.75 7.0595ZM12 2.57617C9.42623 2.57617 7.25 4.53553 7.25 7.0595C7.25 9.58348 9.42623 11.5428 12 11.5428C14.5738 11.5428 16.75 9.58348 16.75 7.0595C16.75 4.53553 14.5738 2.57617 12 2.57617ZM12 13.3096L11.872 13.3095H11.872C10.845 13.3086 8.84267 13.3067 7.06041 13.7724C6.12872 14.0158 5.18827 14.4033 4.47008 15.0426C3.72662 15.7044 3.25 16.6135 3.25 17.7929C3.25 19.5437 4.75466 20.8763 6.5 20.8763H17.5C19.2454 20.8763 20.75 19.5437 20.75 17.7929C20.75 16.6135 20.2734 15.7044 19.5299 15.0426C18.8117 14.4033 17.8713 14.0158 16.9396 13.7724C15.1573 13.3067 13.155 13.3086 12.128 13.3095H12.128L12 13.3096ZM4.75 17.7929C4.75 17.0681 5.02339 16.5583 5.46743 16.163C5.93674 15.7453 6.62129 15.4375 7.4396 15.2237C9.02911 14.8083 10.8631 14.8091 11.9026 14.8096H11.9026L12 14.8096L12.0974 14.8096C13.1369 14.8091 14.9709 14.8083 16.5604 15.2237C17.3787 15.4375 18.0633 15.7453 18.5326 16.163C18.9766 16.5583 19.25 17.0681 19.25 17.7929C19.25 18.6195 18.5161 19.3763 17.5 19.3763H6.5C5.48393 19.3763 4.75 18.6195 4.75 17.7929Z"
                                        fill="white"
                                    />
                                </svg>

                                <span>Мой профиль</span>
                            </NavLink>
                        </li>
                    </ul>
                    <div
                        onClick={handleLogout}
                        className={styles.logout}
                    >
                        <svg
                            width="28"
                            height="28"
                            viewBox="0 0 28 28"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M16.3333 4.6665L20.4167 4.6665C23.984 4.6665 23.9167 9.33317 23.9167 13.9998C23.9167 18.6665 23.984 23.3332 20.4167 23.3332H16.3333M3.5 13.9998L17.5 13.9998M3.5 13.9998L8.16667 9.33317M3.5 13.9998L8.16667 18.6665"
                                stroke="white"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>

                        <span>Выйти</span>
                    </div>
                </nav>
                <div className={styles.mobileMenu}>
                    <ul>
                        <li>
                            <NavLink to="/">
                                <img src={analytics} alt="analytics"/>
                            </NavLink>
                            <NavLink to="/briefcase">
                                <img src={bag} alt="briefcase"/>
                            </NavLink>
                        </li>
                        <li className={styles.activeItem}>
                            <NavLink to="/market">
                                <img src={market} alt="market"/>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/wallet">
                                <img src={wallet} alt="wallet"/>
                            </NavLink>
                            <NavLink to="/career">
                                <img src={career} alt="career"/>
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.headerTop}>
                <div className={styles.headerTopLogo}>
                    <img src="./images/LogoLogin.png" alt="Logo"/>
                </div>
                <div className={styles.headerTopUser}>
                    <Notification
                        setNotification={setNotification}
                        notification={notification}
                        setIsActiveSelectHeader={setIsActiveSelectHeader}
                        setIsOpenSc={setIsOpenSc}
                        setSuccessInfo={setSuccessInfo}
                    />
                    <SelectHeader
                        setIsActiveSelectHeader={setIsActiveSelectHeader}
                        setNotification={setNotification}
                        isActiveSelectHeader={isActiveSelectHeader}
                        userData={userData}
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;