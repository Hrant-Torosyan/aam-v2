import React, { useState } from "react";
import MainInput from "src/ui/MainInput/MainInput";
import { useGetWalletsQuery } from "src/store/analytics/analyticsAPI";
import { formatNumber } from "src/utils/formatNumber";
import { useAddBriefcaseProductMutation } from "src/store/briefcase/briefcaseApi";

import bannerLogo from "src/images/svg/bannerLogo.svg";
import pdfImg from "src/images/svg/pdf.svg";
import arrowDown from "src/images/svg/arrowDown.svg";

import styles from "./PopUpProd.module.scss";
import {InvestRequestData, ProjectWithInvestmentData} from "@/types/types";

interface PopUpProdProps {
    popUpProdNew: string | false;
    setPopUpProdNew: React.Dispatch<React.SetStateAction<string | false>>;
    mainData: ProjectWithInvestmentData;
    setSuccessInfo: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenSc: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ErrorState {
    checkboxError?: string;
    rangeError?: string;
    balanceError?: string;
}

interface DocumentItem {
    name?: string;
    url?: {
        url?: string;
        name?: string;
    };
}

const PopUpProd: React.FC<PopUpProdProps> = ({
     popUpProdNew,
     setPopUpProdNew,
     mainData,
     setSuccessInfo,
     setIsOpenSc
 }) => {
    const [sumValue, setSumValue] = useState<string>("");
    const [errors, setErrors] = useState<ErrorState>({});
    const [visibleCount, setVisibleCount] = useState<number>(2);
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [showMore, setShowMore] = useState<boolean>(false);

    const { data: walletsData } = useGetWalletsQuery();
    const [addBriefcaseProduct] = useAddBriefcaseProductMutation();

    const handleShowMore = () => {
        setShowMore(!showMore);
        setVisibleCount(showMore ? 2 : (mainData.conditionDocuments?.length || 0));
    };

    const investmentAmount = walletsData?.investmentAccount || 0;

    const validateForm = () => {
        const newErrors: ErrorState = {};
        const formattedSum = sumValue ? +sumValue.replace(/\s/g, "") : 0;

        if (!isChecked) {
            newErrors.checkboxError = "Необходимо согласиться с условиями.";
        }

        if (
            mainData.type !== "ASSET" &&
            (formattedSum < mainData.minPrice || formattedSum > mainData.maxPrice)
        ) {
            newErrors.rangeError =
                "Введенная сумма превышает максимально допустимую. Пожалуйста, введите сумму, которая не больше " +
                mainData.maxPrice;
        }

        const parsedInvestmentAmount = parseFloat(String(mainData.investmentAmount));
        if (formattedSum > parsedInvestmentAmount) {
            newErrors.balanceError = "Недостаточно средств для инвестиции.";
        }
        if (mainData.type === "ASSET" && mainData.maxPrice > investmentAmount) {
            newErrors.balanceError = "Недостаточно средств для инвестиции.";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleConfirmClick = async () => {
        if (investmentAmount <= 0) {
            setErrors({ balanceError: "Баланс недоступен для инвестиций." });
            return;
        }

        if (validateForm()) {
            const periodArr = mainData?.paymentPeriods
                ?.map((item: string) => {
                    switch (item) {
                        case "MONTHLY":
                            return "MONTHLY";
                        case "QUARTERLY":
                            return "QUARTERLY";
                        case "SEMI_ANNUAL":
                            return "SEMI_ANNUAL";
                        default:
                            return null;
                    }
                })
                .filter(Boolean);

            const period = periodArr && periodArr.length > 0 ? periodArr[0] : null;

            const requestData: InvestRequestData = {
                amount: +sumValue.replace(/\s/g, ""),
                purchaseCommission: mainData.purchaseCommission,
                profitCommission: mainData.profitCommission,
                withdrawalCommission: mainData.withdrawalCommission,
                managementCommission: mainData.managementCommission,
                period: period,
                term: mainData.term
            };

            if (mainData.type !== "ASSET") {
                requestData.amount = +sumValue.replace(/\s/g, "");
            } else {
                requestData.amount = mainData.maxPrice;
            }

            try {
                const res = await addBriefcaseProduct({
                    prodId: mainData.projectId,
                    requestData
                }).unwrap();

                setSuccessInfo(res.success);
                setIsOpenSc(true);
                setPopUpProdNew(false);
            } catch (error) {
                console.error("Failed to invest:", error);
                setSuccessInfo(false);
                setIsOpenSc(true);
                setPopUpProdNew(false);
            }
        }
    };

    const handleSetError = (error: string) => {
        setErrors(prev => ({ ...prev, rangeError: error }));
    };

    return (
        <div className={styles.popUpProd}>
            <div className={styles.popUpProdBlock}>
                <div className={styles.popUpProdHeader}>
                    <p>Согласие и ввод суммы</p>
                    <button onClick={() => setPopUpProdNew(false)}>
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M20.8366 9.17188L9.16992 20.8386M9.16995 9.17188L20.8366 20.8386"
                                stroke="#00B4D2"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </button>
                </div>

                <div className={styles.popUpProdContent}>
                    {popUpProdNew === "start" && (
                        <>
                            <div className={styles.banner}>
                                <div className={styles.bannerLogo}>
                                    <p>Доступный баланс</p>
                                    <h2 style={{ color: errors.balanceError ? "#FF0000" : "#00B4D2" }}>
                                        ${formatNumber(investmentAmount)}
                                    </h2>
                                    {errors.balanceError && (
                                        <span className={styles.error}>{errors.balanceError}</span>
                                    )}
                                </div>
                                <img src={bannerLogo} alt="bannerLogo" />
                            </div>

                            {mainData.type !== "ASSET" ? (
                                <h3 className={styles.sumExample}>
                                    от {mainData.minPrice.toLocaleString()}&nbsp;
                                    <span className={`${styles.removeWhenError} ${errors.rangeError ? styles.error : ""}`}>
                                        - до {mainData.maxPrice.toLocaleString()}
                                    </span>
                                </h3>
                            ) : (
                                <h3 className={styles.sumExample}>
                                    <p className={styles.typeSum}>Сумма:</p>
                                    <span>{mainData.maxPrice.toLocaleString()} $</span>
                                </h3>
                            )}

                            {mainData.type !== "ASSET" && (
                                <MainInput
                                    error={errors.rangeError}
                                    setError={handleSetError}
                                    title="Сумма которую хотите инвестировать:"
                                    sumValue={sumValue}
                                    setSumValue={setSumValue}
                                    type="money"
                                    min={mainData.minPrice}
                                    max={mainData.maxPrice}
                                />
                            )}

                            {errors.rangeError && <span className={styles.error}>{errors.rangeError}</span>}

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

                            <div className={styles.files}>
                                <p>Условия</p>
                                <span>Ознакомьтесь и подтвердите условия</span>

                                <div className={styles.documentsDownload}>
                                    {mainData?.conditionDocuments && mainData.conditionDocuments.length > 0 && (
                                        <>
                                            {mainData.conditionDocuments
                                                .slice(0, visibleCount)
                                                .map((doc: DocumentItem, index: number) => (
                                                    <div key={index} className={styles.documentsCardDownload}>
                                                        <div className={styles.download}>
                                                            <img src={pdfImg} alt="pdfImg" />
                                                            <p>{doc?.name}</p>
                                                            <button
                                                                className={styles.documentsDownload}
                                                                onClick={() => {
                                                                    if (doc?.url?.url) {
                                                                        const dummyLink = document.createElement("a");
                                                                        dummyLink.href = doc.url.url;
                                                                        dummyLink.setAttribute("target", "_blank");
                                                                        dummyLink.download =
                                                                            doc.url.name || "download";
                                                                        document.body.appendChild(dummyLink);
                                                                        dummyLink.click();
                                                                        document.body.removeChild(dummyLink);
                                                                    } else {
                                                                        console.error("Документ поврежден");
                                                                    }
                                                                }}
                                                            >
                                                                <span>Скачать</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            {mainData.conditionDocuments && mainData.conditionDocuments.length > 2 && (
                                                <div className={styles.seeMore} onClick={handleShowMore}>
                                                    <span>{showMore ? "Скрыть" : "Посмотреть еще"}</span>
                                                    <img
                                                        src={arrowDown}
                                                        alt="toggle"
                                                        className={showMore ? styles.rotated : ""}
                                                    />
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className={styles.confirm}>
                                <label className={styles.confirmLabel}>
                                    <span
                                        className={`${styles.confirmText} ${errors.checkboxError ? styles.error : ""}`}
                                        style={{
                                            color: isChecked
                                                ? "#000"
                                                : errors.checkboxError
                                                    ? "#FF0000"
                                                    : "#212529",
                                        }}
                                    >
                                        Я подтверждаю, что ознакомлен(а) с условиями и соглашением о
                                        предоставлении услуг, а также с рисками, связанными с инвестициями в
                                        активы, и согласен(согласна) с ними.
                                    </span>
                                    <input
                                        type="checkbox"
                                        name="confirm"
                                        id="confirm"
                                        className={styles.confirmRadio}
                                        onChange={() => setIsChecked(!isChecked)}
                                    />
                                </label>
                            </div>

                            <div className={styles.buttonStyleTooNew}>
                                <button onClick={handleConfirmClick}>
                                    <span>{mainData.type === "ASSET" ? "Оплатить" : "Инвестировать"}</span>
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PopUpProd;