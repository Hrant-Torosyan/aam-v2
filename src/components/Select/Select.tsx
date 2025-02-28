import React from 'react';
import styles from './Select.module.scss';

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ value, onChange }) => {
    const [isActiveSelect, setIsActiveSelect] = React.useState(false);

    const handleSelectChange = (selectedValue: string) => {
        onChange(selectedValue);
        setIsActiveSelect(false);
    };

    return (
        <div
            onClick={() => setIsActiveSelect(!isActiveSelect)}
            className={isActiveSelect ? `${styles.select} ${styles.activeSel}` : styles.select}
        >
            <p>
                {value === 'WEEKLY'
                    ? 'Неделя'
                    : value === 'MONTHLY'
                        ? 'Месяц'
                        : value === 'SEMI_ANNUAL'
                            ? 'Полугод'
                            : 'Год'}
            </p>
            <img src='./images/angle.png' alt='toggle' />
            {isActiveSelect && (
                <div className={styles.selectItem}> {/* Apply the styles for selectItem */}
                    <p
                        className={value === 'WEEKLY' ? `${styles.activeOption}` : ''}
                        onClick={() => handleSelectChange('WEEKLY')}
                    >
                        Неделя
                    </p>
                    <p
                        className={value === 'MONTHLY' ? `${styles.activeOption}` : ''}
                        onClick={() => handleSelectChange('MONTHLY')}
                    >
                        Месяц
                    </p>
                    <p
                        className={value === 'SEMI_ANNUAL' ? `${styles.activeOption}` : ''}
                        onClick={() => handleSelectChange('SEMI_ANNUAL')}
                    >
                        Полугод
                    </p>
                    <p
                        className={value === 'ANNUAL' ? `${styles.activeOption}` : ''}
                        onClick={() => handleSelectChange('ANNUAL')}
                    >
                        Год
                    </p>
                </div>
            )}
        </div>
    );
};

export default Select;