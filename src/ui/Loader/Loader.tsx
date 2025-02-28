import React from "react";
import styles from "./Loader.module.scss";

const Loader: React.FC = () => {
    return (
        <div className={styles.loader}>
            <img
                src="https://i.pinimg.com/originals/92/63/9c/92639cac9c1a0451744f9077ddec0bed.gif"
                alt="Loading..."
            />
        </div>
    );
};

export default Loader;