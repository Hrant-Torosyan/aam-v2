import React from 'react';
import styles from './MainInput.module.scss';

interface MainInputProps {
    title: string;
    type?: 'money' | 'text';
    sumValue: string;
    setSumValue: (value: string) => void;
    error?: string;
    setError: (error: string) => void;
    min?: number;
    max?: number;
    sumValueAmount?: string;
    setSumValueAmount?: (value: string) => void;
    onePrice?: number;
}

const MainInput: React.FC<MainInputProps> = ({
     title,
     type = 'text',
     min,
     max,
     sumValue,
     setSumValue,
     error,
     setError,
     sumValueAmount,
     setSumValueAmount,
     onePrice,
 }) => {
    const validateInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setError("");

        if (type === "money") {
            const inputValue = e.target.value.replace(/[^\d.,]/g, "");
            setSumValue(inputValue);

            const numValue = parseFloat(inputValue);
            if (!isNaN(numValue)) {
                if (min !== undefined && numValue < min) {
                    setError(`Минимальная сумма: ${min}`);
                } else if (max !== undefined && numValue > max) {
                    setError(`Максимальная сумма: ${max}`);
                }
            }
        } else if (title === "Количество акций" && setSumValueAmount && onePrice) {
            const stockCount = e.target.value;
            if (!isNaN(Number(stockCount))) {
                setSumValue(stockCount);

                const inputValue = (Number(stockCount) * onePrice).toString().replace(/[^\d.-]/g, "");
                const numericValue = parseFloat(inputValue);

                if (!isNaN(numericValue)) {
                    const formattedNumber = numericValue >= 1000
                        ? numericValue.toLocaleString()
                        : numericValue.toString();
                    setSumValueAmount(formattedNumber);
                } else {
                    setSumValueAmount("");
                }
            }
        } else {
            setSumValue(e.target.value);
        }
    };

    return (
        <div className={styles.mainInput}>
            <p>{title}</p>
            <div
                className={`
                    ${styles.inputStyle} 
                    ${type === "money" ? styles.inputStyleMn : ""} 
                    ${(sumValue === "" && error) || error ? styles.error : ""}
                `}
            >
                {type === "money" && <span className={styles.typeMoney}>$</span>}
                <input
                    onChange={validateInput}
                    value={sumValue}
                    type="text"
                    placeholder={type === 'money' ? 'Введите сумму' : ''}
                />
            </div>
            {error && <p className={styles.errorText}>{error}</p>}
        </div>
    );
};

export default MainInput;