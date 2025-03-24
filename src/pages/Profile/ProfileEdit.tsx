import React, { Suspense, useEffect, useState } from "react";
import ImageUploader from "./ImageUpload";
import DatePickerInput from "./InputDate";
import styles from "./Profile.module.scss";
import {
    useGetUserInfoQuery,
    useUpdateUserInfoMutation,
    useUploadUserImageMutation,
    useResetUserPasswordMutation
} from "src/store/profile/profileAPI";
import { UserImage } from "src/types/types";

interface ProfileEditProps {
    setProfilePage: (page: string) => void;
}

const ProfileEdit: React.FC<ProfileEditProps> = ({ setProfilePage }) => {
    const {
        data: userInfo,
        isLoading: isUserLoading,
        refetch: refetchUserInfo
    } = useGetUserInfoQuery(undefined, {
        refetchOnMountOrArgChange: true
    });

    const [updateUserInfo, { isLoading: isUpdating }] = useUpdateUserInfoMutation();
    const [uploadUserImage, { isLoading: isUploading }] = useUploadUserImageMutation();
    const [resetUserPassword] = useResetUserPasswordMutation();

    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<FileList | null>(null);
    const [imageUrl, setImageUrl] = useState<UserImage | null>(null);
    const [name, setName] = useState("");
    const [birthDate, setBirthDate] = useState<Date | null>(null);
    const [email, setEmail] = useState("");
    const [surname, setSurname] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [website, setWebsite] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [errorDate, setErrorDate] = useState(false);
    const [instagramUrl, setInstagramUrl] = useState("");
    const [twitterUrl, setTwitterUrl] = useState("");
    const [facebookUrl, setFacebookUrl] = useState("");
    const [vkUrl, setVkUrl] = useState("");
    const [error, setError] = useState("");
    const [submitAttempted, setSubmitAttempted] = useState(false);

    useEffect(() => {
        if (userInfo) {
            let userDate = userInfo.birthDay ? new Date(+userInfo.birthDay) : null;

            const firstName = userInfo.firstName || '';
            const lastName = userInfo.lastName || '';

            setImageUrl(userInfo.image || null);
            setName(firstName);
            setBirthDate(userDate);
            setEmail(userInfo.email || "");
            setSurname(lastName);
            setPhone(userInfo.phone || "");
            setCity(userInfo.city || "");
            setWebsite(userInfo.website || "");
            setInstagramUrl(userInfo.instagramUrl || "");
            setTwitterUrl(userInfo.twitterUrl || "");
            setFacebookUrl(userInfo.facebookUrl || "");
            setVkUrl(userInfo.vkUrl || "");
            setLoading(true);
        }
    }, [userInfo]);

    const handleBirthDateChange = (date: Date | null) => {
        setBirthDate(date);
        setErrorDate(false);
    };

    const preloadImage = (url: string) => {
        const timestamp = Date.now();
        const hasParams = url.includes('?');
        const separator = hasParams ? '&' : '?';
        const cacheBustedUrl = `${url}${separator}t=${timestamp}`;

        const img = new Image();
        img.src = cacheBustedUrl;
        console.log("Preloading image:", cacheBustedUrl);
    };

    const handleSubmitEditForm = async () => {
        setSubmitAttempted(true);

        let dateForm = null;
        const currentDate = new Date();
        const currentMs = currentDate.getTime();

        if (birthDate) {
            dateForm = birthDate.getTime();
            if (dateForm > currentMs) {
                setErrorDate(true);
                return;
            }
        }

        let imageName = null;

        if (image !== null && image.length > 0) {
            try {
                const fileArray = Array.from(image);
                const uploadResult = await uploadUserImage(fileArray).unwrap();
                if (uploadResult) {
                    imageName = uploadResult;
                }
            } catch (err) {
                console.error("Failed to upload image:", err);
            }
        } else if (imageUrl) {
            imageName = imageUrl.name;
        }

        const userData = {
            email: email,
            firstName: name,
            lastName: surname,
            companyName: "string",
            investmentAmount: "string",
            investmentExperience: "string",
            image: imageName,
            birthDay: dateForm,
            city: city,
            phone: phone,
            website: website,
            instagramUrl: instagramUrl,
            twitterUrl: twitterUrl,
            facebookUrl: facebookUrl,
            vkUrl: vkUrl,
        };

        try {
            if (oldPassword.trim() && newPassword.trim()) {
                if (newPassword.trim().length < 8) {
                    setError("Пароль должен быть не менее 7 символов");
                    return;
                }

                try {
                    const passwordResult = await resetUserPassword({
                        oldPassword: oldPassword,
                        newPassword: newPassword,
                    }).unwrap();

                    if (passwordResult.success !== true) {
                        setError("Неверный пароль");
                        return;
                    }
                } catch (err) {
                    setError("Ошибка при смене пароля");
                    return;
                }
            }

            const result = await updateUserInfo(userData).unwrap();
            await refetchUserInfo();

            if (result?.image?.url) {
                preloadImage(result.image.url);
            }

            setTimeout(() => {
                setProfilePage("MainProfileNew");
            }, 1000);
        } catch (err) {
            console.error("Failed to update user info:", err);
        }
    };

    const loadingComponent = (
        <div className={styles.loader}>
            <img
                src="https://i.pinimg.com/originals/92/63/9c/92639cac9c1a0451744f9077ddec0bed.gif"
                alt="loader"
            />
        </div>
    );

    if (isUserLoading || !loading) {
        return loadingComponent;
    }

    return (
        <Suspense fallback={loadingComponent}>
            <div className={styles.profileEdit}>
                <div className={styles.mainProfileTitle}>
                    <h1>Редактирование профиля</h1>
                </div>

                <div className={styles.profileEditContent}>
                    <div className={styles.profileImage}>
                        <ImageUploader
                            imageUrl={imageUrl === null ? "./images/avatar.png" : imageUrl?.url}
                            image={image}
                            setImage={setImage}
                        />
                        <div
                            onClick={handleSubmitEditForm}
                            className={styles.button}
                        >
                            <button disabled={isUpdating || isUploading}>
                                <p>{isUpdating || isUploading ? 'Сохранение...' : 'Сохранить и выйти'}</p>
                            </button>
                        </div>
                    </div>

                    <div className={styles.profileEditInputs}>
                        <div className={styles.profileEditInputsList}>
                            <div className={styles.profileEditInput}>
                                <p>Имя</p>
                                <div className={styles.inputStyle}>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className={styles.profileEditInput}>
                                <p>Дата рождения</p>
                                <div className={styles.dateProfile}>
                                    <div className={`${styles.inputStyle} ${errorDate ? styles.error : ''}`}>
                                        <DatePickerInput
                                            value={birthDate}
                                            onChange={handleBirthDateChange}
                                            errorDate={errorDate}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className={styles.profileEditInput}>
                                <p>E-mail</p>
                                <div className={styles.inputStyle}>
                                    <input
                                        disabled
                                        type="text"
                                        value={email}
                                        onChange={(e) => setEmail(email)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.profileEditInputsList}>
                            <div className={styles.profileEditInput}>
                                <p>Фамилия</p>
                                <div className={styles.inputStyle}>
                                    <input
                                        type="text"
                                        value={surname}
                                        onChange={(e) => setSurname(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.profileEditInput}>
                                <p>Сотовый</p>
                                <div className={styles.profileEditInputPhone}>
                                    <div className={styles.inputStyle}>
                                        <div className={styles.plus}>+</div>
                                        <input
                                            type="number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className={styles.profileEditInput}>
                                <p>Город</p>
                                <div className={styles.inputStyle}>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.profileEditInput}>
                            <p>Сайт</p>
                            <div className={styles.inputStyle}>
                                <input
                                    type="text"
                                    value={website}
                                    onChange={(e) => setWebsite(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className={styles.profileEditInputsList}>
                            <div className={styles.profileEditInput}>
                                <p>Instagram</p>
                                <div className={styles.inputStyle}>
                                    <input
                                        type="text"
                                        value={instagramUrl}
                                        onChange={(e) => setInstagramUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.profileEditInput}>
                                <p>X</p>
                                <div className={styles.inputStyle}>
                                    <input
                                        type="text"
                                        value={twitterUrl}
                                        onChange={(e) => setTwitterUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.profileEditInputsList}>
                            <div className={styles.profileEditInput}>
                                <p>Facebook</p>
                                <div className={styles.inputStyle}>
                                    <input
                                        type="text"
                                        value={facebookUrl}
                                        onChange={(e) => setFacebookUrl(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className={styles.profileEditInput}>
                                <p>VK</p>
                                <div className={styles.inputStyle}>
                                    <input
                                        type="text"
                                        value={vkUrl}
                                        onChange={(e) => setVkUrl(e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className={styles.line}></div>

                        <div className={styles.profileEditInputsList}>
                            <div className={styles.profileEditInput}>
                                <p>Старый пароль</p>
                                <div
                                    className={
                                        error === "Неверный пароль"
                                            ? `${styles.inputStyle} ${styles.error}`
                                            : styles.inputStyle
                                    }
                                >
                                    <input
                                        autoComplete="off"
                                        type="password"
                                        value={oldPassword}
                                        onChange={(e) => {
                                            setError("");
                                            setOldPassword(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={styles.profileEditInputsList}>
                            <div className={styles.profileEditInput}>
                                <p>Новый пароль</p>
                                <div
                                    className={
                                        error === "Пароль должен быть не менее 7 символов"
                                            ? `${styles.inputStyle} ${styles.error}`
                                            : styles.inputStyle
                                    }
                                >
                                    <input
                                        autoComplete="off"
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => {
                                            if (e.target.value.length >= 7) {
                                                setError("");
                                            }
                                            setNewPassword(e.target.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        {error && <p className={styles.errorText}>{error}</p>}
                        <div
                            onClick={handleSubmitEditForm}
                            className={`${styles.button} ${styles.mobileButton}`}
                        >
                            <button disabled={isUpdating || isUploading}>
                                <p>{isUpdating || isUploading ? 'Сохранение...' : 'Сохранить и выйти'}</p>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Suspense>
    );
};

export default ProfileEdit;