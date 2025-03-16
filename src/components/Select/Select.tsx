import React, { useState } from 'react';
import styles from './Select.module.scss';

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    className?: string; // Change 'classname' to 'className'
}

const options = [
    { value: 'WEEKLY', label: 'Неделя' },
    { value: 'MONTHLY', label: 'Месяц' },
    { value: 'SEMI_ANNUAL', label: 'Полугод' },
    { value: 'ANNUAL', label: 'Год' }
];

const Select: React.FC<SelectProps> = ({ value, onChange, className }) => {
    const [isActiveSelect, setIsActiveSelect] = useState(false);

    const toggleSelect = () => {
        setIsActiveSelect(prevState => !prevState);
    };

    const handleSelectChange = (selectedValue: string) => {
        onChange(selectedValue);
        setIsActiveSelect(false);
    };

    const currentLabel = options.find(option => option.value === value)?.label;

    return (
        <div
            className={`${styles.select} ${className} ${isActiveSelect ? styles.activeSel : ''}`} // Use className here
            onClick={toggleSelect}
        >
            <p>{currentLabel}</p>
            <img src='./images/angle.png' alt='toggle' />
            {isActiveSelect && (
                <div className={styles.selectItem}>
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
            )}
        </div>
    );
};

export default Select;