import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Popup from "src/ui/Popup/Popup";
import Input from "src/ui/Input/Input";
import styles from "src/components/PopUp/PopUp.module.scss";
import SelectCities from "src/pages/auth/Verification/SelectCities/SelectCities";
import Button from "src/ui/Button/Button";
import { format } from "date-fns";

interface VerificationPageProps {
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setStep: React.Dispatch<React.SetStateAction<number>>;
}

const VerificationPage: React.FC<VerificationPageProps> = ({ setPage, setStep }) => {
    const [formData, setFormData] = useState({
        dob: null as Date | null,
        selectValue: "",
        name: "",
        surname: "",
    });

    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (date: Date | null) => {
        setFormData((prev) => ({ ...prev, dob: date }));
        setIsCalendarOpen(false);
    };

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({ ...prev, selectValue: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const dataToSubmit = {
            dob: formData.dob ? format(formData.dob, "dd/MM/yyyy") : "",
            selectValue: formData.selectValue,
            name: formData.name,
            surname: formData.surname,
        };

        console.log("Form Data:", dataToSubmit);

        setStep(4);
        setPage("documents");
    };

    const isFormValid = formData.name && formData.surname && formData.dob && formData.selectValue;

    return (
        <Popup title="Информация о вас" onSubmit={handleSubmit} submitButtonText="Подтвердить">
            <div className={styles.verification}>
                <Input
                    type="text"
                    name="name"
                    value={formData.name}
                    placeholder="Имя"
                    onChange={handleInputChange}
                    error={false}
                />

                <Input
                    type="text"
                    name="surname"
                    value={formData.surname}
                    placeholder="Фамилия"
                    onChange={handleInputChange}
                    error={false}
                />

                <div style={{ position: "relative", width: "100%", marginBottom: "20px" }}>
                    <Input
                        type="text"
                        name="dob"
                        value={formData.dob ? format(formData.dob, "dd/MM/yyyy") : ""}
                        placeholder="Дата рождения"
                        onClick={() => setIsCalendarOpen(true)}
                        readOnly
                        error={false}
                    />

                    {isCalendarOpen && (
                        <div style={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            zIndex: 999,
                            width: "100%",
                            marginTop: "-20px",
                        }}>
                            <DatePicker selected={formData.dob} onChange={handleDateChange} inline />
                        </div>
                    )}
                </div>

                <SelectCities value={formData.selectValue} onChange={handleSelectChange} className={styles.cites} />

                <Button type="submit" variant="primary" disabled={!isFormValid}>
                    Далее
                </Button>
            </div>
        </Popup>
    );
};

export default VerificationPage;