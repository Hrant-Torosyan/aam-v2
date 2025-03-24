import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./Profile.module.scss";

interface DatePickerInputProps {
    value: Date | null;
    onChange: (date: Date | null) => void;
    errorDate?: boolean;
    placeholder?: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({
     value,
     onChange,
     errorDate = false,
     placeholder = "Дата рождения"
 }) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleDateChange = (date: Date | null) => {
        onChange(date);
        setIsCalendarOpen(false);
    };

    const handleInputClick = () => {
        setIsCalendarOpen(!isCalendarOpen);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
    };

    return (
        <div className={styles.datePickerContainer}>
            <input
                type="text"
                placeholder={placeholder}
                value={formatDate(value)}
                onClick={handleInputClick}
                readOnly
            />
            <div className={styles.calendarIcon} onClick={() => setIsCalendarOpen(!isCalendarOpen)}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.3333 2.66667H12V1.33333H10.6667V2.66667H5.33333V1.33333H4V2.66667H2.66667C1.93333 2.66667 1.33333 3.26667 1.33333 4V13.3333C1.33333 14.0667 1.93333 14.6667 2.66667 14.6667H13.3333C14.0667 14.6667 14.6667 14.0667 14.6667 13.3333V4C14.6667 3.26667 14.0667 2.66667 13.3333 2.66667ZM13.3333 13.3333H2.66667V6.66667H13.3333V13.3333ZM13.3333 5.33333H2.66667V4H13.3333V5.33333ZM4 8H5.33333V9.33333H4V8ZM7.33333 8H8.66667V9.33333H7.33333V8ZM10.6667 8H12V9.33333H10.6667V8ZM4 10.6667H5.33333V12H4V10.6667ZM7.33333 10.6667H8.66667V12H7.33333V10.6667ZM10.6667 10.6667H12V12H10.6667V10.6667Z" fill="#444444"/>
                </svg>
            </div>

            {isCalendarOpen && (
                <div className={styles.calendarWrapper}>
                    <DatePicker
                        selected={value}
                        onChange={handleDateChange}
                        inline
                        maxDate={new Date()}
                        showYearDropdown
                        scrollableYearDropdown
                        yearDropdownItemNumber={100}
                    />
                </div>
            )}
        </div>
    );
};

export default DatePickerInput;