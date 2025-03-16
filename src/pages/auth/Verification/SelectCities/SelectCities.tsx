import React, { useState } from 'react';
import styles from './SelectCities.module.scss';

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
    options?: { value: string; label: string }[];
}

const cities = [
    { value: 'Moscow', label: 'Москва' },
    { value: 'SaintPetersburg', label: 'Санкт-Петербург' },
    { value: 'Novosibirsk', label: 'Новосибирск' },
    { value: 'Yekaterinburg', label: 'Екатеринбург' },
    { value: 'NizhnyNovgorod', label: 'Нижний Новгород' },
    { value: 'Kazan', label: 'Казань' },
    { value: 'Chelyabinsk', label: 'Челябинск' },
    { value: 'Omsk', label: 'Омск' },
    { value: 'Samara', label: 'Самара' },
    { value: 'RostovOnDon', label: 'Ростов-на-Дону' },
];

const SelectCities: React.FC<SelectProps> = ({ value, onChange, className, options = cities }) => {
    const [isActiveSelect, setIsActiveSelect] = useState(false);

    const toggleSelect = () => {
        setIsActiveSelect((prev) => !prev);
    };

    const handleSelectChange = (selectedValue: string) => {
        onChange(selectedValue);
        setIsActiveSelect(false);
    };

    const currentLabel = options.find((option) => option.value === value)?.label || "Город проживания";

    return (
        <div className={`${styles.selectWrapper} ${className || ''}`}>
            <div
                className={`${styles.select} ${isActiveSelect ? styles.activeSel : ''}`}
                onClick={toggleSelect}
            >
                <p className={value ? styles.selectedText : styles.placeholderText}>{currentLabel}</p>
                <img src='./images/angle.png' alt='toggle' className={styles.arrow} />
            </div>
            <div className={`${styles.selectItem} ${isActiveSelect ? styles.activeSel : ''}`}>
                {options.map(({ value: optionValue, label }) => (
                    <p
                        key={optionValue}
                        className={value === optionValue ? styles.activeOption : ''}
                        onClick={() => handleSelectChange(optionValue)}
                    >
                        {label}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default SelectCities;