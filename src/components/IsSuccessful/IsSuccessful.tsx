import React, {Dispatch, SetStateAction, useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useTogglePopUpMutation } from "src/store/analytics/analyticsAPI";
import { setPopUpState } from "src/store/analytics/analyticsSlice";
import styles from './IsSuccessful.module.scss';

interface IsSuccessfulProps {
    info: boolean;
    delay: number;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
    setIsOpenTransfer: Dispatch<SetStateAction<boolean>>;
}

const IsSuccessful: React.FC<IsSuccessfulProps> = ({ info, delay }) => {
    const dispatch = useDispatch();
    const popUpState = useSelector((state: RootState) => state.analytics.popUp);
    const [togglePopUp] = useTogglePopUpMutation();

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setPopUpState({ ...popUpState, isOpen: false }));
            togglePopUp();
        }, delay);

        return () => clearTimeout(timer);
    }, [dispatch, delay, popUpState, togglePopUp]);

    const handleClose = () => {
        dispatch(setPopUpState({ ...popUpState, isOpen: false }));
        togglePopUp();
    };

    return (
        <div className={styles.isSuccessful}>
            <div className={`${styles.isSuccessfulContent} ${info ? '' : styles.failed}`}>
                <img
                    src={info ? "./images/successful.svg" : "./images/failed.svg"}
                    alt={info ? "Success" : "Failure"}
                />
                <h3>{info ? "Операция успешна!" : "Ошибка!"}</h3>
                {info ? (
                    <p>Окно закроется автоматически.</p>
                ) : (
                    <div onClick={handleClose} className={styles.buttonStyleToo}>
                        <button>
                            <span>OK</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IsSuccessful;