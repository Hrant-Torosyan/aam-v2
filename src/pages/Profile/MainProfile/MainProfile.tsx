import React, { Suspense, useEffect, useState } from "react";
import ProfileSlider from "src/components/ProfileSlider/ProfileSlider";

import { ProfileProduct } from "src/types/types";

import {
    useGetUserInfoQuery,
    useGetProfitQuery,
    useGetProfileCareerQuery,
    useGetProfileProductsQuery
} from "src/store/profile/profileAPI";

import insta from "src/images/svg/insta.svg";
import x from "src/images/svg/х.svg";
import fb from "src/images/svg/fb.svg";
import vk from "src/images/svg/vk.svg";

import styles from "./MainProfile.module.scss";
import NonVerifiedBanner from "src/pages/auth/NonVerifiedBanner/NonVerifiedBanner";

interface MainProfileNewProps {
    setProfilePage: (page: string) => void;
    products?: ProfileProduct[];
}

const MainProfileNew: React.FC<MainProfileNewProps> = ({ setProfilePage, products }) => {
    const [timestamp, setTimestamp] = useState(Date.now());

    useEffect(() => {
        const initialTimer = setTimeout(() => {
            setTimestamp(Date.now());
        }, 300);

        return () => clearTimeout(initialTimer);
    }, []);

    const {
        data: userInfo,
        isLoading: isUserLoading,
        refetch: refetchUserInfo
    } = useGetUserInfoQuery(undefined, {
        refetchOnMountOrArgChange: true,
    });

    useEffect(() => {
        refetchUserInfo();
    }, [refetchUserInfo, timestamp]);

    const { data: profitData, isLoading: isProfitLoading } = useGetProfitQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const { data: careerInfo, isLoading: isCareerLoading } = useGetProfileCareerQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const [filter, setFilter] = useState("all");
    const [formattedDate, setFormattedDate] = useState<string | null>(null);
    const [displayProducts, setDisplayProducts] = useState<ProfileProduct[]>([]);

    const { data: profileProducts, isLoading: isProductsLoading } = useGetProfileProductsQuery(
        { filter, query: "" },
        {
            skip: products !== undefined && products.length > 0,
            refetchOnMountOrArgChange: true
        }
    );

    useEffect(() => {
        if (userInfo?.birthDay !== null && userInfo?.birthDay !== undefined) {
            const userDate = new Date(+userInfo.birthDay);

            setFormattedDate(
                `${userDate.getDate().toString().padStart(2, "0")}-${(userDate.getMonth() + 1)
                    .toString()
                    .padStart(2, "0")}-${userDate.getFullYear()}`
            );
        } else {
            setFormattedDate(null);
        }
    }, [userInfo]);

    useEffect(() => {
        if (products && products.length > 0) {
            setDisplayProducts(products);
        } else if (profileProducts) {
            if (profileProducts.items && profileProducts.items.length > 0) {
                setDisplayProducts(profileProducts.items);
            } else if (profileProducts.content && profileProducts.content.length > 0) {
                setDisplayProducts(profileProducts.content);
            } else {
                setDisplayProducts([]);
            }
        } else {
            setDisplayProducts([]);
        }
    }, [products, profileProducts]);

    const isLoading = isUserLoading || isProfitLoading || isCareerLoading || isProductsLoading;

    const getImageUrl = () => {
        if (userInfo?.image?.url) {
            const hasParams = userInfo.image.url.includes('?');
            const separator = hasParams ? '&' : '?';
            return `${userInfo.image.url}${separator}t=${timestamp}`;
        }
        return "./images/avatar.png";
    };

    const refreshUserData = () => {
        setTimestamp(Date.now());
        refetchUserInfo();
    };

    if (isLoading || !userInfo) {
        return (
            <div className={styles.loading}>
                <img
                    src="https://i.pinimg.com/originals/92/63/9c/92639cac9c1a0451744f9077ddec0bed.gif"
                    alt="loader"
                />
            </div>
        );
    }

    const getNameDisplay = () => {
        if (userInfo.firstName || userInfo.lastName) {
            return `${userInfo.firstName || ''} ${userInfo.lastName || ''}`.trim();
        }

        if (userInfo.fullName) {
            const parts = userInfo.fullName.split(' ');
            return `${parts[0] || ''} ${parts.length > 1 ? parts[1] : ''}`.trim();
        }

        return userInfo.email?.split('@')[0] || "User";
    };

    const userName = getNameDisplay();

    return (
        <Suspense fallback={
            <div className={styles.loading}>
                <img
                    src="https://i.pinimg.com/originals/92/63/9c/92639cac9c1a0451744f9077ddec0bed.gif"
                    alt="loader"
                />
            </div>
        }>
            <>
                <NonVerifiedBanner/>
                <div className={styles.mainProfile}>
                    <div className={styles.mainProfileTitle}>
                        <h1>Мой профиль</h1>
                        <div className={styles.mainProfileButton}>
                            <button>
                                <p>Доход от партнерской программы:</p>
                                <span>${profitData?.amount || profitData?.profit || 0}</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.mainInfo}>
                        <div className={styles.userInfo}>
                            <div className={styles.user}>
                                <div className={styles.userContent}>
                                    <div className={styles.avatar}>
                                        <img
                                            src={getImageUrl()}
                                            alt="user"
                                            key={`avatar-${timestamp}`}
                                            onError={(e) => {
                                                console.log("Image failed to load, trying default");
                                                e.currentTarget.src = './images/avatar.png';
                                            }}
                                        />
                                    </div>
                                    <div className={styles.userName}>
                                        <h1>{userName}</h1>
                                    </div>
                                </div>
                                <div className={styles.socialLinks}>
                                    {userInfo?.instagramUrl && (
                                        <a href={userInfo.instagramUrl} rel="noreferrer" target="_blank">
                                            <img src={insta} alt="Instagram"/>
                                        </a>
                                    )}
                                    {userInfo?.twitterUrl && (
                                        <a href={userInfo.twitterUrl} rel="noreferrer" target="_blank">
                                            <img src={x} alt="Twitter"/>
                                        </a>
                                    )}
                                    {userInfo?.facebookUrl && (
                                        <a href={userInfo.facebookUrl} rel="noreferrer" target="_blank">
                                            <img src={fb} alt="Facebook"/>
                                        </a>
                                    )}
                                    {userInfo?.vkUrl && (
                                        <a href={userInfo.vkUrl} rel="noreferrer" target="_blank">
                                            <img src={vk} alt="VK"/>
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.userOwnInfo}>
                            {formattedDate && (
                                <div className={styles.mainProfileUserInfos}>
                                    <div className={styles.mainProfileUserInfosImg}>
                                        <img src="./images/date.png" alt="date"/>
                                    </div>

                                    <div className={styles.mainProfileUserInfosItem}>
                                        <span>Дата рождения</span>
                                        <p>{formattedDate}</p>
                                    </div>
                                </div>
                            )}

                            {userInfo?.city && (
                                <div className={styles.mainProfileUserInfos}>
                                    <div className={styles.mainProfileUserInfosImg}>
                                        <img src="./images/map.png" alt="map"/>
                                    </div>
                                    <div className={styles.mainProfileUserInfosItem}>
                                        <span>Город проживания</span>
                                        <p>{userInfo?.city}</p>
                                    </div>
                                </div>
                            )}
                            {userInfo?.email && (
                                <div className={styles.mainProfileUserInfos}>
                                    <div className={styles.mainProfileUserInfosImg}>
                                        <img src="./images/email.png" alt="email"/>
                                    </div>
                                    <div className={styles.mainProfileUserInfosItem}>
                                        <span>E-mail</span>
                                        <p>{userInfo?.email}</p>
                                    </div>
                                </div>
                            )}
                            {userInfo?.phone && (
                                <div className={styles.mainProfileUserInfos}>
                                    <div className={styles.mainProfileUserInfosImg}>
                                        <img src="./images/phone.png" alt="phone"/>
                                    </div>
                                    <div className={styles.mainProfileUserInfosItem}>
                                        <span>Телефон</span>
                                        <p>+{userInfo?.phone}</p>
                                    </div>
                                </div>
                            )}

                            {userInfo?.website && (
                                <div className={styles.mainProfileUserInfos}>
                                    <div className={styles.mainProfileUserInfosImg}>
                                        <img src="./images/site.png" alt="site"/>
                                    </div>
                                    <div className={styles.mainProfileUserInfosItem}>
                                        <span>Веб-сайт</span>
                                        <p>
                                            <a
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                href={userInfo?.website}
                                            >
                                                {userInfo?.website}
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            onClick={() => setProfilePage("ProfileEdit")}
                            className={styles.userInfoEdit}
                        >
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M18.9445 9.1875L14.9445 5.1875M18.9445 9.1875L13.946 14.1859C13.2873 14.8446 12.4878 15.3646 11.5699 15.5229C10.6431 15.6828 9.49294 15.736 8.94444 15.1875C8.39595 14.639 8.44915 13.4888 8.609 12.562C8.76731 11.6441 9.28735 10.8446 9.946 10.1859L14.9445 5.1875M18.9445 9.1875C18.9445 9.1875 21.9444 6.1875 19.9444 4.1875C17.9444 2.1875 14.9445 5.1875 14.9445 5.1875M20.5 12C20.5 18.5 18.5 20.5 12 20.5C5.5 20.5 3.5 18.5 3.5 12C3.5 5.5 5.5 3.5 12 3.5"
                                    stroke="#A3AED0"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span>Редактировать профиль</span>
                        </div>
                    </div>
                </div>
            </>


            <ProfileSlider products={displayProducts} info={"Info"}/>
        </Suspense>
    );
};

export default MainProfileNew;