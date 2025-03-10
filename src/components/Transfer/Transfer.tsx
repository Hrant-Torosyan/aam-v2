import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetWalletsQuery, useSetTransferMutation } from "src/store/analytics/analyticsAPI";
import { setTransferSuccess } from "src/store/analytics/analyticsSlice";

import MainSelect from 'src/ui/MainSelect/MainSelect';
import MainInput from "src/ui/MainInput/MainInput";
import styles from './Transfer.module.scss';
import { AppDispatch } from "@/store/store";

interface AccountDetails {
    name: string;
    type?: string;
    info?: string;
    currency?: string;
}

interface TransferProps {
    setIsOpenTransfer: React.Dispatch<React.SetStateAction<boolean>>;
    setIsOpenSc: React.Dispatch<React.SetStateAction<boolean>>;
}

const Transfer: React.FC<TransferProps> = ({ setIsOpenTransfer, setIsOpenSc }) => {
    const [from, setFrom] = useState<string>("");
    const [to, setTo] = useState<string>("");
    const [sumValue, setSumValue] = useState<string>("");
    const [error, setError] = useState<string>("");

    const [setTransfer] = useSetTransferMutation();
    const { data: walletsData } = useGetWalletsQuery();

    const dispatch = useDispatch<AppDispatch>();

    const getOnePrice = (accountType: string) => {
        switch (accountType) {
            case "masterAccount":
                return walletsData?.masterAccount || 0;
            case "investmentAccount":
                return walletsData?.investmentAccount || 0;
            case "agentAccount":
                return walletsData?.agentAccount || 0;
            default:
                return 0;
        }
    };

    const handleTransfer = async () => {
        const sumAmount = +sumValue.replace(/\s/g, "");
        const fromAccountInfo = from.includes("Основной счет") ? "masterAccount" : from.includes("Инвестиционный счет") ? "investmentAccount" : "agentAccount";

        if (!sumValue.trim() || sumAmount > (walletsData ? walletsData[fromAccountInfo] : 0)) {
            setError("Заполните поле или сумма больше доступного баланса.");
            return;
        }

        const fromAccount = from.includes("Основной счет")
            ? "MASTER"
            : from.includes("Инвестиционный счет")
                ? "INVESTMENT"
                : "AGENT";

        const toAccount = to.includes("Основной счет")
            ? "MASTER"
            : to.includes("Инвестиционный счет")
                ? "INVESTMENT"
                : "AGENT";

        try {
            const res = await setTransfer({ bodyData: { fromAccount, toAccount, amount: sumAmount } }).unwrap();
            if (res.success) {
                dispatch(setTransferSuccess(true));  // Dispatch success action here
            } else {
                dispatch(setTransferSuccess(false));
            }
            setIsOpenTransfer(false);
            setIsOpenSc(true);
        } catch (error) {
            setError("Произошла ошибка");
        }
    };

    useEffect(() => {
        if (walletsData) {
            setFrom(`Основной счет: <span>$ ${walletsData.masterAccount.toLocaleString()}</span>`);
            setTo(`Инвестиционный счет: <span>$ ${walletsData.investmentAccount.toLocaleString()}</span>`);
        }
    }, [walletsData]);

    useEffect(() => {
        if (from === to) {
            setTo(
                [
                    `Основной счет: <span>$ ${walletsData?.masterAccount.toLocaleString()}</span>`,
                    `Инвестиционный счет: <span>$ ${walletsData?.investmentAccount.toLocaleString()}</span>`,
                    `Агентский счет: <span>$ ${walletsData?.agentAccount.toLocaleString()}</span>`,
                ].filter((item) => item !== from)[0]
            );
        }
    }, [from, to, walletsData]);

    const defaultFromTitle = from ? from : "Выберите счет для перевода из";
    const defaultToTitle = to ? to : "Выберите счет для перевода на";

    const handleSelectChange = (value: string | AccountDetails, setSelectValue: React.Dispatch<React.SetStateAction<string>>) => {
        setSelectValue(typeof value === 'string' ? value : value.name);
    };

    return (
        <div className={styles.transferContainer}>
            <div className="popUpProdBlock">
                <div className="popUpProdHeader">
                    <p>Перевести</p>
                    <button onClick={() => setIsOpenTransfer(false)}>
                        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20.8366 9.17188L9.16992 20.8386M9.16995 9.17188L20.8366 20.8386" stroke="#00B4D2" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
                <div className="popUpProdContent">
                    <MainSelect
                        selectTitle={defaultFromTitle}  // Use the default title
                        selectValue={from}
                        setSelectValue={(value) => handleSelectChange(value, setFrom)}
                        dataSelect={[
                            { name: `Основной счет: <span>$ ${walletsData?.masterAccount.toLocaleString()}</span>`, type: 'masterAccount' },
                            { name: `Инвестиционный счет: <span>$ ${walletsData?.investmentAccount.toLocaleString()}</span>`, type: 'investmentAccount' },
                            { name: `Агентский счет: <span>$ ${walletsData?.agentAccount.toLocaleString()}</span>`, type: 'agentAccount' }
                        ]}
                    />
                    <MainSelect
                        selectTitle={defaultToTitle}  // Use the default title
                        selectValue={to}
                        setSelectValue={(value) => handleSelectChange(value, setTo)}
                        dataSelect={[
                            { name: `Основной счет: <span>$ ${walletsData?.masterAccount.toLocaleString()}</span>`, type: 'masterAccount' },
                            { name: `Инвестиционный счет: <span>$ ${walletsData?.investmentAccount.toLocaleString()}</span>`, type: 'investmentAccount' },
                            { name: `Агентский счет: <span>$ ${walletsData?.agentAccount.toLocaleString()}</span>`, type: 'agentAccount' }
                        ].filter((item) => item.name !== from)}  // Exclude `from` from `to` options
                    />
                    <MainInput
                        setError={setError}
                        error={error}
                        title={"Сумма:"}
                        sumValue={sumValue}
                        setSumValue={setSumValue}
                        type={"money"}
                        onePrice={getOnePrice(from.includes("Основной счет") ? "masterAccount" : from.includes("Инвестиционный счет") ? "investmentAccount" : "agentAccount")}
                    />
                    <div onClick={handleTransfer} className="buttonStyleToo">
                        <button>
                            <span>Перевести</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Transfer;